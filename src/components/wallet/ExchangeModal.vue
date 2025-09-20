<template>
  <div class="modal fade" id="modalExchange">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t("exchange_modal_title") }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <a href="#buy-sth" class="nav-link active" data-bs-toggle="tab">{{
                $t("exchange_modal_buy_tab")
              }}</a>
            </li>
            <li class="nav-item">
              <a href="#sell-sth" class="nav-link" data-bs-toggle="tab">{{
                $t("exchange_modal_sell_tab")
              }}</a>
            </li>
          </ul>
          <div class="tab-content pt-3">
            <div class="tab-pane fade show active" id="buy-sth">
              <div v-if="!paymentSent">
                <div class="form-group mb-3">
                  <label class="form-label">{{
                    $t("exchange_modal_buy_amount_label")
                  }}</label>
                  <input
                      ref="buyAmountInput"
                      type="number"
                      class="form-control"
                      v-model.number="buyAmount"
                      @input="calculateUsdtAmount"
                  />
                </div>
                <div v-if="buyAmount > 0">
                  <p>
                    {{ $t("exchange_modal_to_pay") }}
                    <span class="text-info">{{ usdtAmount.toFixed(8) }}</span> USDT <img width="20" style="vertical-align: top" src="/images/usdt.png"/>
                  </p>
                  <p v-if="calculatedBuyAmount">
                    {{ $t("exchange_modal_you_will_receive") }} ~<span class="text-success">{{ calculatedBuyAmount.toFixed(8) }}</span> STH <img width="20" style="vertical-align: top" src="/images/sth_defi.png"/>
                  </p>
                  <div v-if="depositAddress">
                    <label class="form-label ico-bsc px-4">{{ $t('exchange_modal_send_usdt_to_network', { network: selectedNetwork }) }}</label>
                    <div class="input-group mb-3">
                      <input type="text" class="form-control" :value="depositAddress" readonly />
                      <button class="btn btn-outline-secondary" type="button" @click="copyAddress">
                        <i class="fa fa-copy"></i>
                      </button>
                    </div>
                  </div>
                  <p v-if="exchangeError" class="text-danger">
                    {{ $t(exchangeError) }}
                  </p>
                </div>
                <div v-if="isBuyAmountTooLow" class="alert alert-warning py-2">
                    {{ $t("exchange_modal_min_payment_warning") }}
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <button class="btn btn-success" :disabled="buyAmount <= 0 || isBuyAmountTooLow" @click="handlePaymentSent">
                    {{ $t("exchange_modal_i_have_paid_button") }}
                  </button>
                  <div class="dropdown">
                    <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      {{ selectedNetwork }} Network
                    </button>
                    <ul class="dropdown-menu">
                      <li v-for="network in networks" :key="network">
                        <a v-show="network !== 'TON'" class="dropdown-item" href="#" @click.prevent="selectedNetwork = network">{{ network }}</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div v-else>
                <div class="alert alert-info">
                  {{ $t("exchange_modal_payment_sent_message") }}
                </div>
              </div>
            </div>
            <div class="tab-pane fade" id="sell-sth">
              <div v-if="sellStep === 0">
                <div class="text-muted mb-2">
                  {{ $t("exchange_modal_your_balance") }}&nbsp;<span class="text-primary">{{ balance.toFixed(8) }}</span> STH
                </div>
                <div class="form-group mb-3">
                  <label class="form-label">{{
                    $t("exchange_modal_sell_amount_label")
                  }}</label>
                  <input
                    type="number"
                    class="form-control"
                    v-model.number="sellAmount"
                    @input="calculateReceiveUsdt"
                  />
                </div>
                <div class="form-group mb-3">
                  <label class="form-label px-4 ico-bsc">{{
                    $t("exchange_modal_your_usdt_address_bsc")
                  }}</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="usdtAddress"
                    @input="validateUsdtAddress"
                    :class="{
                      'is-valid': usdtAddressIsValid,
                      'is-invalid':
                        !usdtAddressIsValid && usdtAddress.length > 0,
                    }"
                  />
                </div>
                <div v-if="sellAmount > 0">
                  <p>
                    {{ $t("exchange_modal_you_will_receive") }}
                    ~<span class="text-success">{{ receiveUsdtAmount.toFixed(8) }}</span> USDT <img width="20" style="vertical-align: top" src="/images/usdt.png"/>
                  </p>
                  <p v-if="calculatedReceiveUsdtAmount" class="text-muted small">
                    {{ $t("exchange_modal_min_guaranteed") }}: {{ calculatedReceiveUsdtAmount.toFixed(8) }} USDT
                  </p>
                </div>
				<div v-if="isSellAmountTooLow" class="alert alert-warning py-2">
					{{ $t("exchange_modal_min_amount_warning") }}
				</div>
                <button
                  @click="sellSth"
                  class="btn btn-danger"
                  :disabled="
                    balance < 1 ||
                    sellAmount <= 0 ||
                    sellAmount > balance ||
                    !usdtAddressIsValid ||
                    !sellGateAddress ||
                    isSellAmountTooLow
                  "
                >
                  {{ $t("exchange_modal_sell_button") }}
                </button>
              </div>
              <div
                v-if="sellStep === 1"
                class="overflow-hidden overflow-x-auto"
              >
                <div class="mb-3">
                  <table class="table">
                    <tbody>
                      <tr>
                        <td v-if="txErr === 0">
                          {{ $t("success_tx_id") }}
                        </td>
                        <td v-if="txErr > 0" class="text-danger">
                          {{ $t("error_tx_id") }}
                        </td>
                        <td>
                          <span
                            class="text-primary"
                            v-if="txResult && txResult.tx && txResult.tx.id"
                          >
                            {{ txResult.tx.id.substring(0, 10) }}..{{
                              txResult.tx.id.substr(-10)
                            }}
                          </span>
                          <span v-else class="text-muted">-</span>
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t("amount") }}</td>
                        <td>
                          <span v-if="txResult && txResult.tx">
                            {{ (txResult.tx.amount / 1e8).toFixed(8) }} STH
                          </span>
                          <span v-else class="text-muted">-</span>
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t("fee") }}</td>
                        <td>
                          <span v-if="txResult && txResult.tx">
                            {{ (txResult.tx.fee / 1e8).toFixed(8) }} STH
                          </span>
                          <span v-else class="text-muted">-</span>
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t("recipient") }}</td>
                        <td>
                          <span
                            v-if="
                              txResult && txResult.tx && txResult.tx.recipientId
                            "
                          >
                            {{ txResult.tx.recipientId.substring(0, 10) }}..{{
                              txResult.tx.recipientId.substr(-10)
                            }}
                          </span>
                          <span v-else class="text-muted">-</span>
                        </td>
                      </tr>
                      <tr
                        v-if="
                          txResult && txResult.tx && txResult.tx.vendorField
                        "
                      >
                        <td>{{ $t("memo") }}</td>
                        <td>{{
                          txResult.tx.vendorField.length > 30
                          ? txResult.tx.vendorField.slice(0, 30) + '...'
                          : txResult.tx.vendorField
                        }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  <button
                    data-bs-dismiss="modal"
                    @click="resetSellForm"
                    type="button"
                    class="btn btn-sm"
                    :class="txErr > 0 ? 'btn-danger' : 'btn-success'"
                  >
                    {{ $t("exchange_modal_continue_button") }}</button
                  >&nbsp;
                  <span
                    v-show="
                      waitConfirmTx &&
                      timerConfirmation > 0 &&
                      timerConfirmation < 8
                    "
                  >
                    {{ $t("please_wait_confirmation") }}..
                    {{ timerConfirmation }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div
          class="toast fade hide mb-3"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          id="toast-exchange"
          data-bs-delay="2000"
      >
        <div class="toast-header" :class="'text-' + toastStyle">
          <strong class="me-auto">{{ toastStyle }}</strong>
          <button
              type="button"
              class="btn-close"
              data-bs-dismiss="toast"
          ></button>
        </div>
        <div class="toast-body small">
          {{ toastMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStoreWallet } from "@/stores/wallet.ts";
import { useExchangeStore } from "@/stores/exchange.ts";
import debounce from "lodash/debounce";
import { Toast } from "bootstrap";

const storeWallet = useStoreWallet();

export default {
  name: "ExchangeModal",
  props: {
    balance: {
      type: Number,
      default: 0,
    },
    address: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      buyAmount: 0,
      usdtAmount: 0,
      sellAmount: 0,
      receiveUsdtAmount: 0,
      usdtAddress: "",
      usdtAddressIsValid: false,
      txResult: null,
      sellStep: 0,
      txErr: 0,
      waitConfirmTx: true,
      timerConfirmation: 8,
      calculatedBuyAmount: null,
      calculatedReceiveUsdtAmount: null,
      toastMessage: "",
      toastStyle: "success",
      paymentSent: false,
      networks: ['BSC', 'TON'],
      selectedNetwork: 'BSC',
    };
  },
  computed: {
    price() {
      return this.exchangeStore.sth_usdt_price;
    },
    exchangeStore() {
      return useExchangeStore();
    },
    depositAddress() {
      return this.exchangeStore.depositAddress;
    },
    sellGateAddress() {
      return this.exchangeStore.sellGateAddress;
    },
    exchangeError() {
      return this.exchangeStore.error;
    },
    isSellAmountTooLow() {
      return this.calculatedReceiveUsdtAmount !== null && this.calculatedReceiveUsdtAmount < 5 && this.sellAmount > 0;
    },
    isBuyAmountTooLow() {
      return this.usdtAmount > 0 && this.usdtAmount < 5;
    }
  },
  watch: {
    selectedNetwork() {
      this.fetchDepositAddress();
    }
  },
  async created() {
    const exchangeStore = useExchangeStore();
    await exchangeStore.fetchSthUsdtPrice();
    await this.fetchDepositAddress();
    await exchangeStore.getSellGateAddress();
    this.debouncedFetchRealPrice = debounce(this.fetchRealPrice, 500);
  },
  methods: {
    focusBuyAmountInput() {
      this.$refs.buyAmountInput.focus();
    },
    async fetchDepositAddress() {
      await this.exchangeStore.getDepositAddress(this.selectedNetwork.toLowerCase(), this.address);
    },
    async fetchRealPrice(amount, type) {
      if (amount <= 0) {
        this.calculatedBuyAmount = null;
        this.calculatedReceiveUsdtAmount = null;
        if (type === 'buy') {
          this.usdtAmount = 0;
        } else {
          this.receiveUsdtAmount = 0;
        }
        return;
      }

      let url;
      const apiUrl = this.exchangeStore.apiUrl;
      if (type === 'buy') {
        this.usdtAmount = this.buyAmount * this.price;
        if (this.usdtAmount <= 0) {
          this.calculatedBuyAmount = null;
          return;
        }
        url = `${apiUrl}/xbts/pool/sth-usdt-real?usdt_amount=${this.usdtAmount}`;
      } else { // sell
        url = `${apiUrl}/xbts/pool/sth-usdt-real?sth_amount=${this.sellAmount}`;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (type === 'buy') {
          this.calculatedBuyAmount = data.estimatedSthToReceive;
        } else { // sell
          this.receiveUsdtAmount = data.estimatedUsdtToReceive;
          this.calculatedReceiveUsdtAmount = data.minUsdtToReceive;
        }
      } catch (error) {
        console.error('Fetch error:', error);
        this.calculatedBuyAmount = null;
        this.calculatedReceiveUsdtAmount = null;
      }
    },
    calculateUsdtAmount() {
      this.debouncedFetchRealPrice(this.buyAmount, 'buy');
    },
    calculateReceiveUsdt() {
      this.debouncedFetchRealPrice(this.sellAmount, 'sell');
    },
    showToast(target, msg, style = "success") {
      this.toastMessage = msg;
      this.toastStyle = style;
      const toast = new Toast(document.getElementById(target));
      toast.show();
    },
    copyAddress() {
      navigator.clipboard.writeText(this.depositAddress).then(() => {
        this.showToast(
            "toast-exchange",
            this.$t("copied_to_clipboard"),
            "success"
        );
      });
    },
    handlePaymentSent() {
      this.paymentSent = true;
    },
    async validateUsdtAddress() {
      this.usdtAddressIsValid = await storeWallet.validateAddressCrossChain(
        this.usdtAddress
      );
    },
    resetSellForm() {
      this.sellStep = 0;
      this.txResult = null;
      this.sellAmount = 0;
      this.usdtAddress = "";
      this.usdtAddressIsValid = false;
      this.waitConfirmTx = true;
      this.timerConfirmation = 8;
    },
    resetBuyTabState() {
      this.paymentSent = false;
      this.buyAmount = 0;
      this.usdtAmount = 0;
      this.calculatedBuyAmount = null;
    },
    async sellSth() {
      if (
        this.sellAmount > 0 &&
        this.usdtAddressIsValid &&
        this.sellGateAddress
      ) {
        const payload = {
          sender: this.address,
          recipientId: this.sellGateAddress,
          amount: this.sellAmount,
          memo: `bsc:${this.usdtAddress}`,
          network: "mainnet",
          fee: 0.25,
        };
        try {
          this.txResult = await storeWallet.txTransfer(payload);
          if (this.txResult && this.txResult.response) {
            this.txErr = this.txResult.response.invalid.length;
            this.sellStep = 1;

            if (this.waitConfirmTx) {
              const tmConfirm = setInterval(() => {
                this.timerConfirmation--;
                if (this.timerConfirmation < 0) {
                  this.timerConfirmation = 8;
                  clearInterval(tmConfirm);
                }
              }, 1000);
            }
            setTimeout(() => {
              this.waitConfirmTx = false;
            }, 8000);
          } else {
            console.error("Transaction failed", this.txResult);
          }
        } catch (error) {
          console.error("Error during txTransfer call:", error);
        }
      } else {
        console.log("Sell condition not met");
      }
    },
  },
  mounted() {
    this.modalEl = document.getElementById('modalExchange');
    this.modalEl.addEventListener('shown.bs.modal', this.focusBuyAmountInput);
    this.modalEl.addEventListener('hide.bs.modal', this.resetBuyTabState);
  },
  beforeUnmount() {
    this.modalEl.removeEventListener('shown.bs.modal', this.focusBuyAmountInput);
    this.modalEl.removeEventListener('hide.bs.modal', this.resetBuyTabState);
  },
};
</script>
