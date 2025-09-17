
import { defineStore } from "pinia";
import axios from "axios";

// Константы для подключения
const EXCHANGE_API_URL = "http://localhost:3302";
const BITSHARES_NODE = "wss://node.xbts.io/ws";

export const useExchangeStore = defineStore("exchange", {
  state: () => ({
    depositAddress: null,
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
        const response = await axios.get(`${EXCHANGE_API_URL}/exchange-address/${network}/${userId}`);
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
  },
});
