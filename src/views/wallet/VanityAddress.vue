<template>
  <div class="container mt-4">
    <div class="card">
      <div class="card-header">
        <h4 class="mb-0">Vanity Address Generator</h4>
      </div>
      <div class="card-body">
        <div class="row">
          <!-- Generation Form -->
          <div class="col-lg-6">
            <h5>Parameters</h5>
            <form @submit.prevent="startGeneration">
              <div class="mb-3">
                <label for="searchTerm" class="form-label">Search String</label>
                <input type="text" class="form-control" id="searchTerm" v-model="term" :disabled="isGenerating" required>
              </div>

              <div class="mb-3">
                <label class="form-label">Search Mode</label>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="prefix" value="prefix" v-model="mode" :disabled="isGenerating">
                  <label class="form-check-label" for="prefix">Prefix (e.g., S{{ term }}...)</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="contains" value="contains" v-model="mode" :disabled="isGenerating">
                  <label class="form-check-label" for="contains">Contains (e.g., S...{{ term }}...)</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="suffix" value="suffix" v-model="mode" :disabled="isGenerating">
                  <label class="form-check-label" for="suffix">Suffix (e.g., ...{{ term }})</label>
                </div>
              </div>

              <div class="mb-3">
                <label for="threads" class="form-label">Threads (CPU Cores)</label>
                <input type="number" class="form-control" id="threads" v-model.number="threads" :max="maxThreads" min="1" :disabled="isGenerating">
                <div class="form-text">Using more threads increases generation speed. Max: {{ maxThreads }}</div>
              </div>

              <button type="submit" class="btn btn-primary" :disabled="isGenerating">
                <span v-if="isGenerating"><i class="fas fa-spinner fa-spin"></i> Generating...</span>
                <span v-else>Start Generation</span>
              </button>
              <button type="button" class="btn btn-danger ms-2" v-if="isGenerating" @click="stopGeneration">
                Stop
              </button>
            </form>
          </div>

          <!-- Results and Progress -->
          <div class="col-lg-6">
            <h5>Result</h5>
            <div v-if="!isGenerating && !foundWallet.address" class="alert alert-info">
              Enter your desired parameters and start the generation.
            </div>
            <div v-if="isGenerating" class="p-3 border rounded bg-dark">
              <p><strong>Status:</strong> Searching...</p>
              <p class="mb-0"><strong>Total Attempts:</strong> {{ totalAttempts.toLocaleString() }}</p>
              <p class="mb-0"><strong>Speed:</strong> {{ speed.toLocaleString() }} addr/sec</p>
            </div>
            <div v-if="foundWallet.address" class="alert alert-success">
              <h5>Address Found!</h5>
              <p><strong>Address:</strong><br><code>{{ foundWallet.address }}</code></p>
              <p class="mb-0"><strong>Secret Phrase:</strong><br><code class="text-danger">{{ foundWallet.secret }}</code></p>
              <hr>
              <p class="fw-bold mb-0">IMPORTANT: Save your secret phrase in a safe place!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onBeforeUnmount } from 'vue';
import { Identities } from "@smartholdem/crypto";
import { generateMnemonic } from "bip39";

export default {
  name: "VanityAddress",
  setup() {
    const term = ref('MyWallet');
    const mode = ref('prefix');
    const maxThreads = navigator.hardwareConcurrency || 4;
    const threads = ref(maxThreads);
    const isGenerating = ref(false);
    const totalAttempts = ref(0);
    const speed = ref(0);
    const foundWallet = ref({ address: '', secret: '' });

    let workers = [];
    let startTime = 0;
    let progressInterval;

    // Since we can't use modules in workers directly without bundling,
    // we create a dynamic worker that imports the scripts.
    const createWorker = () => {
        const workerCode = `
            importScripts("https://unpkg.com/@smartholdem/crypto@3.8.3/dist/index.umd.js");
            importScripts("https://unpkg.com/bip39@3.1.0/dist/bip39.min.js");

            function generateWallet() {
                const mnemonic = bip39.generateMnemonic();
                const address = smartholdemCrypto.Identities.Address.fromPassphrase(mnemonic, 63);
                return { address, secret: mnemonic };
            }

            self.onmessage = (event) => {
                const { term, mode } = event.data;
                const upperCaseTerm = term.toUpperCase();
                let attempts = 0;

                while (true) {
                    attempts++;
                    const wallet = generateWallet();
                    const address = wallet.address;
                    let isMatch = false;

                    switch (mode) {
                        case 'suffix':
                            isMatch = address.toUpperCase().endsWith(upperCaseTerm);
                            break;
                        case 'contains':
                            isMatch = address.toUpperCase().includes(upperCaseTerm);
                            break;
                        case 'prefix':
                        default:
                            isMatch = address.substring(1).toUpperCase().startsWith(upperCaseTerm);
                            break;
                    }

                    if (isMatch) {
                        self.postMessage({ status: 'found', wallet, attempts });
                        self.close();
                        break;
                    }

                    if (attempts % 5000 === 0) {
                        self.postMessage({ status: 'progress', attempts });
                        attempts = 0; // Reset attempts for this worker's progress report
                    }
                }
            };
        `;
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        return new Worker(URL.createObjectURL(blob));
    };

    const startGeneration = () => {
      if (!term.value) {
        alert('Search string cannot be empty.');
        return;
      }
      
      isGenerating.value = true;
      foundWallet.value = { address: '', secret: '' };
      totalAttempts.value = 0;
      speed.value = 0;
      startTime = Date.now();

      for (let i = 0; i < threads.value; i++) {
        const worker = createWorker();
        worker.onmessage = (event) => {
          const { status, wallet, attempts } = event.data;
          if (status === 'found') {
            foundWallet.value = wallet;
            totalAttempts.value += attempts;
            stopGeneration();
          }
          if (status === 'progress') {
            totalAttempts.value += attempts;
          }
        };
        worker.postMessage({ term: term.value, mode: mode.value });
        workers.push(worker);
      }

      progressInterval = setInterval(() => {
        const duration = (Date.now() - startTime) / 1000;
        speed.value = duration > 0 ? Math.round(totalAttempts.value / duration) : 0;
      }, 1000);
    };

    const stopGeneration = () => {
      workers.forEach(worker => worker.terminate());
      workers = [];
      isGenerating.value = false;
      clearInterval(progressInterval);
      speed.value = 0;
    };

    onBeforeUnmount(() => {
      stopGeneration();
    });

    return {
      term,
      mode,
      threads,
      maxThreads,
      isGenerating,
      totalAttempts,
      speed,
      foundWallet,
      startGeneration,
      stopGeneration,
    };
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
code {
  word-break: break-all;
}
</style>