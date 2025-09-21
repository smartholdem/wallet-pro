<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <button class="close-button" @click="close">&times;</button>
      <h3>{{ $t('whats_new') }}</h3>
      <div class="changelog-body" v-html="formattedContent"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { marked } from 'marked';

const props = defineProps<{
  show: boolean;
  content: string;
}>();

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};

const formattedContent = computed(() => {
  if (!props.content) return '';
  return marked(props.content);
});

</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #2b2b2b;
  color: #f0f0f0;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  border: 1px solid #444;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #f0f0f0;
  cursor: pointer;
}

h3 {
  margin-top: 0;
  color: #17a2b8;
  text-align: center;
  margin-bottom: 1.5rem;
}

.changelog-body {
  white-space: pre-wrap; 
  font-family: monospace;
  line-height: 1.6;
}

.changelog-body :deep(h4) {
  font-size: 1.2rem;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: #17a2b8;
  border-bottom: 1px solid #444;
  padding-bottom: 0.3rem;
}

.changelog-body :deep(ul) {
  padding-left: 20px;
}

.changelog-body :deep(li) {
  margin-bottom: 0.5rem;
}
</style>
