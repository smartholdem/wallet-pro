import { defineStore } from "pinia";
import axios from "axios";

// Константы для подключения
const EXCHANGE_API_URL = "http://localhost:3302";

export const useExchangeStore = defineStore("exchange", {
  state: () => ({
    depositAddress: null,
    sellGateAddress: null,
    error: null,
  }),
  actions: {
    /**
     * Получает адрес для депозита с обменного сервера.
     * @param network - Сеть (например, 'bsc')
     * @param userId - Адрес пользователя в сети SmartHoldem
     */
    async getDepositAddress(network: string, userId: string) {
      try {
        const response = await axios.get(
          `${EXCHANGE_API_URL}/exchange-address/${network}/${userId}`
        );
        if (response.data && response.data.address) {
          this.depositAddress = response.data.address;
          this.error = null;
        } else {
          this.error = "Неверный ответ от сервера";
          this.depositAddress = null;
        }
      } catch (e) {
        console.error("Ошибка при получении адреса депозита:", e);
        this.error = "Не удалось получить адрес для депозита.";
        this.depositAddress = null;
      }
    },
    async getSellGateAddress() {
      try {
        const response = await axios.get(
          `${EXCHANGE_API_URL}/sell-sth-address-gate`
        );
        if (response.data && response.data.address) {
          this.sellGateAddress = response.data.address;
          this.error = null;
        } else {
          this.error = "Неверный ответ от сервера";
          this.sellGateAddress = null;
        }
      } catch (e) {
        console.error("Ошибка при получении адреса шлюза для продажи:", e);
        this.error = "Не удалось получить адрес для продажи.";
        this.sellGateAddress = null;
      }
    },
  },
});
