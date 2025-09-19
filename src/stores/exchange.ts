import { defineStore } from "pinia";
import axios from "axios";

// Константы для подключения
const EXCHANGE_API_URL = "http://localhost:3302";

export const useExchangeStore = defineStore("exchange", {
  state: () => ({
    depositAddress: null,
    sellGateAddress: null,
    sth_usdt_price: 0,
    error: null,
  }),
  actions: {
    /**
     * Получает актуальный курс STH/USDT из пула ликвидности.
     */
    async fetchSthUsdtPrice() {
      try {
        const response = await axios.get(`${EXCHANGE_API_URL}/pool/sth-usdt`);
        if (response.data && response.data.price) {
          this.sth_usdt_price = parseFloat(response.data.price);
          this.error = null;
        } else {
          this.error = "exchange_error_invalid_response";
        }
      } catch (e) {
        console.error("Ошибка при получении курса STH/USDT:", e);
        this.error = "Failed to fetch STH/USDT price"; // Лучше добавить ключ перевода
      }
    },

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
          this.error = "exchange_error_invalid_response";
          this.depositAddress = null;
        }
      } catch (e) {
        console.error("Ошибка при получении адреса депозита:", e);
        this.error = "exchange_error_failed_to_get_deposit_address";
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
          this.error = "exchange_error_invalid_response";
          this.sellGateAddress = null;
        }
      } catch (e) {
        console.error("Ошибка при получении адреса шлюза для продажи:", e);
        this.error = "exchange_error_failed_to_get_sell_address";
        this.sellGateAddress = null;
      }
    },
  },
});
