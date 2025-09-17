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
              <div class="form-group mb-3">
                <label class="form-label">{{
                  $t("exchange_modal_buy_amount_label")
                }}</label>
                <input
                  type="number"
                  class="form-control"
                  v-model.number="buyAmount"
                  @input="calculateUsdtAmount"
                />
              </div>
              <div v-if="buyAmount > 0">
                <p>
                  {{ $t("exchange_modal_to_pay") }}
                  {{ usdtAmount.toFixed(2) }} USDT
                </p>
                <p v-if="depositAddress">
                  {{ $t("exchange_modal_send_usdt_to") }}
                  <span class="text-success">{{ depositAddress }}</span>
                </p>
                <p v-if="exchangeError" class="text-danger">
                  {{ exchangeError }}
                </p>
              </div>
              <button class="btn btn-success" :disabled="buyAmount <= 0">
                {{ $t("exchange_modal_buy_button") }}
              </button>
            </div>
            <div class="tab-pane fade" id="sell-sth">
              <div v-if="sellStep === 0">
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
                  <small class="form-text text-muted"
                    >{{ $t("exchange_modal_your_balance") }}
                    {{ balance }} STH</small
                  >
                </div>
                <div class="form-group mb-3">
                  <label class="form-label">{{
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
                    {{ receiveUsdtAmount.toFixed(2) }} USDT
                  </p>
                </div>
                <button
                  @click="sellSth"
                  class="btn btn-danger"
                  :disabled="
                    sellAmount <= 0 ||
                    sellAmount > balance ||
                    !usdtAddressIsValid ||
                    !sellGateAddress
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
                          {{ $t("exchange_modal_success_tx_id") }}
                        </td>
                        <td v-if="txErr > 0" class="text-danger">
                          {{ $t("exchange_modal_error_tx_id") }}
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
                        <td>{{ $t("exchange_modal_amount") }}</td>
                        <td>
                          <span v-if="txResult && txResult.tx">
                            {{ (txResult.tx.amount / 1e8).toFixed(8) }} STH
                          </span>
                          <span v-else class="text-muted">-</span>
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t("exchange_modal_fee") }}</td>
                        <td>
                          <span v-if="txResult && txResult.tx">
                            {{ (txResult.tx.fee / 1e8).toFixed(8) }} STH
                          </span>
                          <span v-else class="text-muted">-</span>
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t("exchange_modal_recipient") }}</td>
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
                        <td>{{ $t("exchange_modal_memo") }}</td>
                        <td>{{ txResult.tx.vendorField }}</td>
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
  </div>
</template>

<script>
import { useStoreWallet } from "@/stores/wallet.ts";
import { useExchangeStore } from "@/stores/exchange.ts";

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
      price: 0.01, // 1 STH = 0.01 USDT
      txResult: null,
      sellStep: 0,
      txErr: 0,
      waitConfirmTx: true,
      timerConfirmation: 8,
    };
  },
  computed: {
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
  },
  async created() {
    const exchangeStore = useExchangeStore();
    await exchangeStore.getDepositAddress("bsc", this.address);
    await exchangeStore.getSellGateAddress();
  },
  methods: {
    calculateUsdtAmount() {
      this.usdtAmount = this.buyAmount * this.price;
    },
    calculateReceiveUsdt() {
      this.receiveUsdtAmount = this.sellAmount * this.price;
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
          memo: this.usdtAddress,
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
};
</script>
