<template>
  <div class="container mt-4">
    <div class="card">
      <div class="card-header">
        <h4 class="mb-0">{{ $t('vanity_address_page_title') }}</h4>
      </div>
      <div class="card-body">
        <div class="row">
          <!-- Generation Form -->
          <div class="col-lg-6">
            <h5>{{ $t('vanity_address_parameters') }}</h5>
            <form @submit.prevent="startGeneration">
              <div class="mb-3">
                <label for="searchTerm" class="form-label">{{ $t('vanity_address_search_string') }}</label>
                <input type="text" class="form-control" id="searchTerm" v-model="term" :disabled="isGenerating" required>
              </div>

              <div class="mb-3">
                <label class="form-label">{{ $t('vanity_address_search_mode') }}</label>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="prefix" value="prefix" v-model="mode" :disabled="isGenerating">
                  <label class="form-check-label" for="prefix">{{ $t('vanity_address_mode_prefix', { term: term }) }}</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="contains" value="contains" v-model="mode" :disabled="isGenerating">
                  <label class="form-check-label" for="contains">{{ $t('vanity_address_mode_contains', { term: term }) }}</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="suffix" value="suffix" v-model="mode" :disabled="isGenerating">
                  <label class="form-check-label" for="suffix">{{ $t('vanity_address_mode_suffix', { term: term }) }}</label>
                </div>
              </div>

              <div class="mb-3">
                <label for="threads" class="form-label">{{ $t('vanity_address_threads') }}</label>
                <input type="number" class="form-control" id="threads" v-model.number="threads" :max="maxThreads" min="1" :disabled="isGenerating">
                <div class="form-text">{{ $t('vanity_address_threads_help', { maxThreads: maxThreads }) }}</div>
              </div>

              <button type="submit" class="btn btn-primary" :disabled="isGenerating">
                <span v-if="isGenerating"><i class="fas fa-spinner fa-spin"></i> {{ $t('vanity_address_generating') }}</span>
                <span v-else>{{ $t('vanity_address_start_generation') }}</span>
              </button>
              <button type="button" class="btn btn-danger ms-2" v-if="isGenerating" @click="stopGeneration">
                {{ $t('vanity_address_stop_generation') }}
              </button>
            </form>
          </div>

          <!-- Results and Progress -->
          <div class="col-lg-6">
            <h5>{{ $t('vanity_address_result') }}</h5>
            <div v-if="!isGenerating && !foundWallet.address" class="alert alert-info">
              {{ $t('vanity_address_info') }}
            </div>
            <div v-if="isGenerating" class="p-3 border rounded bg-dark">
              <p><strong>{{ $t('vanity_address_status') }}</strong> {{ $t('vanity_address_status_searching') }}</p>
              <p class="mb-0"><strong>{{ $t('vanity_address_total_attempts') }}</strong> {{ totalAttempts.toLocaleString() }}</p>
              <p class="mb-0"><strong>{{ $t('vanity_address_speed') }}</strong> {{ speed.toLocaleString() }} {{ $t('vanity_address_speed_unit') }}</p>
            </div>
            <div v-if="foundWallet.address" class="alert alert-success">
              <h5>{{ $t('vanity_address_found_title') }}</h5>
              <p><strong>{{ $t('vanity_address_address') }}</strong><br><code>{{ foundWallet.address }}</code></p>
              <p class="mb-0"><strong>{{ $t('vanity_address_secret_phrase') }}</strong><br><code class="text-danger">{{ foundWallet.secret }}</code></p>
              <hr>
              <p class="fw-bold mb-0">{{ $t('vanity_address_important_save_phrase') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
// Импортируем наш новый, локальный воркер. Vite сам все соберет.
import VanityWorker from '@/workers/vanity.worker.ts?worker';

export default {
  name: "VanityAddress",
  setup() {
    const { t } = useI18n();
    const term = ref('777');
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

    const startGeneration = () => {
      if (!term.value) {
        alert(t('vanity_address_empty_term_alert'));
        return;
      }
      
      isGenerating.value = true;
      foundWallet.value = { address: '', secret: '' };
      totalAttempts.value = 0;
      speed.value = 0;
      startTime = Date.now();

      for (let i = 0; i < threads.value; i++) {
        const worker = new VanityWorker();
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