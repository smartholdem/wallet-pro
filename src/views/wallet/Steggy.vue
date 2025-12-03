<template>
  <div class="col-xl-12 mt-3">
    <card>
      <div class="card-header">
        <h4 class="mb-0">{{ $t('steggy.title') }}</h4>
      </div>
      <div class="card-body">
        <p>
          {{ $t('steggy.description') }}
        </p>
        <div
          class="btn-group mb-3 w-100"
        >
          <button
            type="button"
            class="btn btn-lg"
            :class="activeMode === 'embed' ? 'btn-warning' : 'btn-outline-warning'"
            @click="activeMode = 'embed'"
          >
            {{ $t('steggy.embed_button') }}
          </button>
          <button
            type="button"
            class="btn btn-lg"
            :class="activeMode === 'extract' ? 'btn-warning' : 'btn-outline-warning'"
            @click="activeMode = 'extract'"
          >
            {{ $t('steggy.extract_button') }}
          </button>
        </div>

        <EmbedData v-if="activeMode === 'embed'" />
        <ExtractData v-if="activeMode === 'extract'" />

      </div>
    </card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import EmbedData from "@/components/steggy/EmbedData.vue";
import ExtractData from "@/components/steggy/ExtractData.vue";

const activeMode = ref('embed'); // 'embed' or 'extract'
</script>

<style scoped>
.btn-group .btn {
  border-radius: 0;
}
</style>
