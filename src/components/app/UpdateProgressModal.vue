<template>
  <div v-if="show" class="modal fade show" style="display: block;" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Downloading Update</h5>
        </div>
        <div class="modal-body">
          <p v-if="version">Downloading version {{ version }}...</p>
          <div class="progress">
            <div class="progress-bar" role="progressbar" :style="{ width: progress + '%' }" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">
              {{ progress }}%
            </div>
          </div>
          <p v-if="error" class="text-danger mt-2">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
  <div v-if="show" class="modal-backdrop fade show"></div>
</template>

<script setup lang="ts">

defineProps({
  show: Boolean,
  progress: Number,
  version: String,
  error: String,
});

</script>
