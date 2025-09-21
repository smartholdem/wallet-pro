import { defineStore } from "pinia";
import axios from "axios";

// Константы для подключения
const isElectron = navigator.userAgent.toLowerCase().includes("electron");
const EXCHANGE_API_URL = isElectron ? "http://194.67.116.168:3302" : "https://exchange.smartholdem.io";


export const useExchangeStore = defineStore("exchange", {
  state: () => ({
    depositAddress: null,
    gate_address_sth: null, // { address: String, timestamp: Number }
    sth_usdt_price: 0,
    error: null,
    realPrice: 0, // Храним динамическую цену
    calculatedBuyAmount: 0, // Рассчитанное количество STH при покупке
    calculatedReceiveUsdtAmount: 0, // Рассчитанное количество USDT при продаже
    calculatedUsdtAmountForBuy: 0, // Рассчитанное количество USDT для покупки определенного количества STH
    isExchangeAvailable: false,
    exchangeSthBalance: 0,
    exchangeUsdtBalance: 0,
  }),
  getters: {
    apiUrl: () => EXCHANGE_API_URL,
    sellGateAddress: (state) => state.gate_address_sth ? state.gate_address_sth.address : null,
  },
  actions: {
    async checkEchangeBalance() {
      try {
        const response = await axios.get(`${EXCHANGE_API_URL}/xbts/smartholdem-balances`);
        if (response.data && response.data.STH !== undefined && response.data.USDT !== undefined) {
          this.exchangeSthBalance = response.data.STH;
          this.exchangeUsdtBalance = response.data.USDT;
        }
      } catch (error) {
        console.error("Failed to fetch exchange balances:", error);
        this.exchangeSthBalance = 0;
        this.exchangeUsdtBalance = 0;
      }
    },
    async checkExchangeAvailability() {
      try {
        const response = await axios.get(`${EXCHANGE_API_URL}/`);
        this.isExchangeAvailable = response.data === true;
      } catch (error) {
        console.error("Exchange server is not available:", error);
        this.isExchangeAvailable = false;
      }
    },
    /**
     * Получает актуальный курс STH/USDT из пула ликвидности.
     */
    async fetchSthUsdtPrice() {
      try {
        const response = await axios.get(`${EXCHANGE_API_URL}/xbts/pool/sth-usdt`);
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
        console.log('getDepositAddress', userId)
      try {
        const response = await axios.get(
          `${EXCHANGE_API_URL}/exchange-address/${network}/${userId}`
        );
        console.log(response.data);
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
      const now = Date.now();
      const tenDaysInMs = 10 * 24 * 60 * 60 * 1000;

      if (this.gate_address_sth && (now - this.gate_address_sth.timestamp < tenDaysInMs)) {
        // Адрес есть в кэше и он не старше 10 дней, ничего не делаем
        return;
      }

      // Если адреса нет или он протух, запрашиваем новый
      try {
        const response = await axios.get(
          `${EXCHANGE_API_URL}/sell-sth-address-gate`
        );
        if (response.data && response.data.address) {
          this.gate_address_sth = {
            address: response.data.address,
            timestamp: now
          };
          this.error = null;
        } else {
          this.error = "exchange_error_invalid_response";
          this.gate_address_sth = null;
        }
      } catch (e) {
        console.error("Ошибка при получении адреса шлюза для продажи:", e);
        this.error = "exchange_error_failed_to_get_sell_address";
        this.gate_address_sth = null;
      }
    },

    /**
     * Получает актуальную цену из пула ликвидности с учетом проскальзывания для покупки STH.
     * @param sthAmount - Количество STH, которое хочет купить пользователь
     */
    async fetchRealPriceForBuy(sthAmount: number) {
      try {
        // Оцениваем, сколько USDT нужно, чтобы купить sthAmount STH, используя текущую цену
        const estimatedUsdtAmount = sthAmount * this.sth_usdt_price;
        const url = `${EXCHANGE_API_URL}/xbts/pool/sth-usdt-real?usdt_amount=${estimatedUsdtAmount}`;

        const response = await axios.get(url);
        const data = response.data;

        // Проверяем на актуальный формат ответа: {usdtAmount, estimatedSthToReceive, minSthToReceive, effectivePrice}
        // Ранее был формат: {usdtAmount, sthToReceive, effectivePrice}
        if (data && data.effectivePrice !== undefined && data.usdtAmount !== undefined && 
            (data.estimatedSthToReceive !== undefined || data.sthToReceive !== undefined)) {
          // effectivePrice - это уже готовый курс с учетом проскальзывания
          // usdtToPay = sthAmount * effectivePrice
          const usdtToPay = sthAmount * data.effectivePrice;
          
          this.calculatedUsdtAmountForBuy = usdtToPay;
          // Обновим realPrice для отладки или других целей, если нужно
          this.realPrice = data.effectivePrice;
          // Также обновим calculatedBuyAmount для обратной совместимости или других целей
          // calculatedBuyAmount - это количество STH, которое мы получим за data.usdtAmount
          // Берем estimatedSthToReceive если есть, иначе sthToReceive
          this.calculatedBuyAmount = data.estimatedSthToReceive !== undefined ? data.estimatedSthToReceive : data.sthToReceive;
        } else {
          console.error("Ошибка получения данных о реальной цене для покупки (неверный формат):", data);
          this.calculatedUsdtAmountForBuy = 0;
        }
      } catch (error) {
        console.error("Ошибка при вызове fetchRealPriceForBuy:", error);
        this.calculatedUsdtAmountForBuy = 0;
      }
    },

    /**
     * Получает актуальную цену из пула ликвидности с учетом проскальзывания.
     * @param amount - Количество STH или USDT
     * @param isBuyingSth - true, если покупаем STH (amount это USDT), false, если продаем STH (amount это STH)
     */
    async fetchRealPrice(amount: number, isBuyingSth: boolean = true) {
      try {
        let url;
        if (isBuyingSth) {
          // amount это количество USDT
          url = `${EXCHANGE_API_URL}/xbts/pool/sth-usdt-real?usdt_amount=${amount}`;
        } else {
          // amount это количество STH, но эндпоинт требует usdt_amount для расчета.
          // Нужно сначала примерно оценить эквивалент в USDT, чтобы вызвать эндпоинт.
          // Используем старую цену для оценки.
          const estimatedUsdtAmount = amount * this.sth_usdt_price;
          url = `${EXCHANGE_API_URL}/xbts/pool/sth-usdt-real?usdt_amount=${estimatedUsdtAmount}`;
        }

        const response = await axios.get(url);
        const data = response.data;

        if (data && data.minSthToReceive !== undefined && data.estimatedSthToReceive !== undefined) {
          if (isBuyingSth) {
            // При покупке STH мы получаем calculatedBuyAmount
            this.calculatedBuyAmount = parseFloat(data.minSthToReceive);
            // Обновим realPrice для отладки или других целей, если нужно
            this.realPrice = data.usdt_amount / data.estimatedSthToReceive;
          } else {
            // При продаже STH мы получаем calculatedReceiveUsdtAmount
            // data.estimatedSthToReceive это количество STH, которое мы бы получили за data.usdt_amount.
            // Нам нужно пересчитать, сколько USDT мы получим за наш sellAmount.
            // Проще всего: использовать estimatedSthToReceive для расчета идеальной цены,
            // а затем применить проскальзывание.
            const idealRate = data.usdt_amount / data.estimatedSthToReceive;
            this.calculatedReceiveUsdtAmount = amount * idealRate; // amount это sellAmount
            // Обновим realPrice для отладки или других целей, если нужно
            this.realPrice = idealRate;
          }
        } else {
          console.error("Ошибка получения данных о реальной цене:", data);
          // В случае ошибки можно использовать старую цену или показать сообщение
        }
      } catch (error) {
        console.error("Ошибка при вызове fetchRealPrice:", error);
        // В случае ошибки можно использовать старую цену или показать сообщение
      }
    },
  },
});
