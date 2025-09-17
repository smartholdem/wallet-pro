<template>
  <div class="modal fade" id="modalExchange">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Exchange STH/USDT</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <a href="#buy-sth" class="nav-link active" data-bs-toggle="tab">Купить STH</a>
            </li>
            <li class="nav-item">
              <a href="#sell-sth" class="nav-link" data-bs-toggle="tab">Продать STH</a>
            </li>
          </ul>
          <div class="tab-content pt-3">
            <div class="tab-pane fade show active" id="buy-sth">
              <div class="form-group mb-3">
                <label class="form-label">Количество STH для покупки:</label>
                <input type="number" class="form-control" v-model.number="buyAmount" @input="calculateUsdtAmount" />
              </div>
              <div v-if="buyAmount > 0">
                <p>К оплате: {{ usdtAmount.toFixed(2) }} USDT</p>
                <p v-if="depositAddress">Отправьте USDT на адрес: <span class="text-success">{{ depositAddress }}</span></p>
                <p v-if="exchangeError" class="text-danger">{{ exchangeError }}</p>
              </div>
              <button class="btn btn-success" :disabled="buyAmount <= 0">Купить</button>
            </div>
            <div class="tab-pane fade" id="sell-sth">
              <div class="form-group mb-3">
                <label class="form-label">Количество STH для продажи:</label>
                <input type="number" class="form-control" v-model.number="sellAmount" @input="calculateReceiveUsdt" />
                <small class="form-text text-muted">Ваш баланс: {{ balance }} STH</small>
              </div>
              <div class="form-group mb-3">
                <label class="form-label">Ваш USDT адрес:</label>
                <input type="text" class="form-control" v-model="usdtAddress" @input="validateUsdtAddress" :class="{ 'is-valid': usdtAddressIsValid, 'is-invalid': !usdtAddressIsValid && usdtAddress.length > 0 }" />
              </div>
              <div v-if="sellAmount > 0">
                <p>Вы получите: {{ receiveUsdtAmount.toFixed(2) }} USDT</p>
              </div>
              <button class="btn btn-danger" :disabled="sellAmount <= 0 || sellAmount > balance || !usdtAddressIsValid">Продать</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStoreWallet } from "@/stores/wallet.ts";
import { useExchangeStore } from "@/stores/exchange.ts";

const storeWallet = useStoreWallet();

export default {
  name: 'ExchangeModal',
  props: {
    balance: {
      type: Number,
      default: 0
    },
    address: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      buyAmount: 0,
      usdtAmount: 0,
      sellAmount: 0,
      receiveUsdtAmount: 0,
      usdtAddress: '',
      usdtAddressIsValid: false,
      price: 0.01 // 1 STH = 0.01 USDT
    };
  },
  computed: {
    exchangeStore() {
      return useExchangeStore();
    },
    depositAddress() {
      return this.exchangeStore.depositAddress;
    },
    exchangeError() {
      return this.exchangeStore.error;
    }
  },
  async created() {
    const exchangeStore = useExchangeStore();
    await exchangeStore.getDepositAddress('bsc', this.address);
  },
  methods: {
    calculateUsdtAmount() {
      this.usdtAmount = this.buyAmount * this.price;
    },
    calculateReceiveUsdt() {
      this.receiveUsdtAmount = this.sellAmount * this.price;
    },
    async validateUsdtAddress() {
      this.usdtAddressIsValid = await storeWallet.validateAddressCrossChain(this.usdtAddress);
    }
  }
};
</script>
