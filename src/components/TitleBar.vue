<template>
  <div class="title-bar">
    <div class="title">Wallet Pro <span v-if="sthUsdtPrice > 0" class="price-info"> | STH/USDT: ${{ sthUsdtPrice.toFixed(6) }}</span></div>
    <div class="controls">
      <button class="control-btn" @click="minimize" aria-label="Minimize">
        <svg width="12" height="12" viewBox="0 0 12 12"><rect fill="currentColor" width="10" height="1" x="1" y="6"></rect></svg>
      </button>
      <button class="control-btn" @click="maximize" aria-label="Maximize">
        <svg width="12" height="12" viewBox="0 0 12 12"><rect width="9" height="9" x="1.5" y="1.5" fill="none" stroke="currentColor"></rect></svg>
      </button>
      <button class="control-btn close-btn" @click="close" aria-label="Close">
        <svg width="12" height="12" viewBox="0 0 12 12"><polygon fill="currentColor" points="11 1.576 6.583 6 11 10.424 10.424 11 6 6.583 1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417 10.424 1"></polygon></svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useExchangeStore } from '@/stores/exchange';

const exchangeStore = useExchangeStore();
const sthUsdtPrice = computed(() => exchangeStore.sth_usdt_price);

const minimize = () => {
  window.electronAPI?.minimize();
};

const maximize = () => {
  window.electronAPI?.maximize();
};

const close = () => {
  window.electronAPI?.close();
};
</script>

<style scoped>
.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  background-color: #2f3241;
  color: #fff;
  -webkit-app-region: drag; /* Делаем всю шапку перетаскиваемой */
  user-select: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
}

.title {
  padding-left: 12px;
  font-size: 14px;
}

.price-info {
  font-size: 12px;
  color: #74b1be; /* a color that fits the theme */
  margin-left: 10px;
}

.controls {
  display: flex;
  height: 100%;
}

.control-btn {
  -webkit-app-region: no-drag; /* Кнопки не должны быть перетаскиваемыми */
  width: 46px;
  height: 100%;
  border: none;
  background-color: transparent;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.control-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.close-btn:hover {
  background-color: #e81123;
}
</style>