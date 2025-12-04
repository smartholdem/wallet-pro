<template>
  <a
    :href="linkUrl"
    :target="linkTarget"
    @click="handleClick"
    v-bind="$attrs"
  >
    <slot></slot>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Проверяем, запущено ли приложение в Tauri
const isTauri = typeof window.__TAURI_INTERNALS__ !== 'undefined';

const props = defineProps({
  url: {
    type: String,
    required: true
  }
});

// Вычисляем URL и target в зависимости от окружения
const linkUrl = computed(() => {
  if (isTauri) {
    return '#'; // Для Tauri используем хеш, чтобы не перенаправляло
  }
  return props.url;
});

const linkTarget = computed(() => {
  if (isTauri) {
    return '_self'; // Для Tauri target не имеет значения, так как ссылка не используется
  }
  return '_blank';
});

// Обработчик клика
const handleClick = async (event: Event) => {
  if (isTauri) {
    event.preventDefault(); // Предотвращаем стандартное поведение для Tauri

    try {
      // Используем window объект для доступа к tauri API
      if (window.__TAURI_INTERNALS__?.invoke) {
        await window.__TAURI_INTERNALS__.invoke('plugin:shell|open', {
          path: props.url
        });
      }
    } catch (error) {
      console.error('Failed to open link in Tauri:', error);
      // Если не удалось использовать Tauri, пробуем открыть в обычном окне
      window.open(props.url, '_blank');
    }
  }
  // Для веба и Android логика остается стандартной
};
</script>