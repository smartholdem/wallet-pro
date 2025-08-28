<template>
  <div class="h-100">
    <card class="h-100 overflow-hidden">
      <card-header class="card-header fw-bold small"> OPERATIONS</card-header>
      <card-body>
        <div v-if="!currentAddress" class="btn-group mb-3 mx-1">
          <button
            data-bs-toggle="modal"
            data-bs-target="#modalQr"
            type="button"
            class="btn btn-outline-theme"
          >
            <i class="fas fa-lg fa-fw fa-qrcode" aria-hidden="true"></i>
          </button>
          <button
            @click="decryptSecret()"
            data-bs-toggle="modal"
            data-bs-target="#modalDecryptAddress"
            type="button"
            class="btn btn-outline-theme"
          >
            <i class="fa fa-key" aria-hidden="true"></i>
          </button>
        </div>

        <div v-if="currentAddress" class="btn-group mb-3 me-2">
          <button
            :disabled="balanceDecimal < 1"
            @click="sendTabPrepare"
            data-bs-toggle="modal"
            data-bs-target="#modalTransfer"
            type="button"
            class="btn btn-outline-theme"
          >
            SEND
          </button>
          <button
            data-bs-toggle="modal"
            data-bs-target="#modalQr"
            type="button"
            class="btn btn-outline-theme"
          >
            <i class="fas fa-lg fa-fw fa-qrcode" aria-hidden="true"></i>
          </button>
          <button
            @click="decryptSecret()"
            data-bs-toggle="modal"
            data-bs-target="#modalDecryptAddress"
            type="button"
            class="btn btn-outline-theme"
          >
            <i class="fa fa-key" aria-hidden="true"></i>
          </button>

          <button
            :disabled="false"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#modalMPayTransfer"
            class="btn btn-outline-theme"
          >
            mPays
          </button>
          <button :disabled="true" type="button" class="btn btn-outline-theme">
            HTLC
          </button>
          <button
            data-bs-toggle="modal"
            data-bs-target="#modalSignMessage"
            type="button"
            class="btn btn-outline-theme"
          >
            SIG
          </button>
        </div>

        <div v-if="currentAddress" class="btn-group mb-3">
          <button disabled="true" type="button" class="btn btn-outline-theme">
            2nd PWD
          </button>

          <button
            v-if="!currentAddress.attributes.delegate"
            data-bs-toggle="modal"
            data-bs-target="#modalDelegateReg"
            type="button"
            class="btn btn-outline-theme"
          >
            DELEGATE REG
          </button>

          <button
            data-bs-toggle="modal"
            data-bs-target="#modalVote"
            type="button"
            class="btn btn-outline-theme"
          >
            VOTE
          </button>
          <button disabled="true" type="button" class="btn btn-outline-theme">
            mSIG
          </button>
        </div>
      </card-body>
    </card>

    <!-- modal мультиплатежи transfer до 150 платежей в 1 транзакции-->
    <div class="modal fade modal-transfer" id="modalMPayTransfer">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Multi Payments</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="w-100">
              <div v-if="txSendStep === 0">
                <!-- CSV Upload Section -->
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">Upload CSV-file</label>
                    <input
                      ref="csvFileInput"
                      @change="handleCsvUpload"
                      type="file"
                      accept=".csv"
                      class="form-control form-control-sm"
                    />
                    <small class="text-muted">Format: address,amount</small>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Operations</label>
                    <div class="d-flex gap-2">
                      <button
                        @click="clearMultiPayList"
                        type="button"
                        class="btn btn-sm btn-outline-secondary"
                      >
                        Clear
                      </button>
                      <button
                        @click="downloadTemplate"
                        type="button"
                        class="btn btn-sm btn-outline-info"
                      >
                        Download template
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Manual Add Section -->
                <div class="row mb-3">
                  <div class="col-md-8">
                    <label class="form-label">Add recipient</label>
                    <input
                      v-model="newRecipient.address"
                      @input="validateNewRecipientAddress"
                      type="text"
                      class="form-control form-control-sm"
                      :class="
                        newRecipient.addressIsValid &&
                        newRecipient.address !== this.address
                          ? 'is-valid'
                          : 'is-invalid'
                      "
                      placeholder="Enter address"
                    />
                  </div>
                  <div class="col-md-3">
                    <label class="form-label">Amount</label>
                    <input
                      v-model="newRecipient.amount"
                      type="number"
                      step="0.00000001"
                      class="form-control form-control-sm"
                      :class="
                        newRecipient.amount > 0 ? 'is-valid' : 'is-invalid'
                      "
                      placeholder="0.00000000"
                    />
                  </div>
                  <div class="col-md-1 d-flex align-items-end">
                    <button
                      @click="addRecipient"
                      :disabled="
                        !newRecipient.addressIsValid ||
                        newRecipient.amount <= 0 ||
                        newRecipient.address === this.address
                      "
                      type="button"
                      class="btn btn-sm btn-success"
                    >
                      +
                    </button>
                  </div>
                </div>

                <!-- Recipients List -->
                <div v-if="multiPayRecipients.length > 0" class="mb-3">
                  <label class="form-label"
                    >List recipients ({{ multiPayRecipients.length }})</label
                  >
                  <div
                    class="table-responsive"
                    style="max-height: 300px; overflow-y: auto"
                  >
                    <table class="table table-sm">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Address</th>
                          <th>Amount</th>
                          <th>Operation</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(recipient, index) in multiPayRecipients"
                          :key="index"
                        >
                          <td>{{ index + 1 }}</td>
                          <td
                            class="text-truncate"
                            style="max-width: 200px"
                            :title="recipient.address"
                          >
                            {{ recipient.address.substring(0, 20) }}...{{
                              recipient.address.substr(-10)
                            }}
                          </td>
                          <td>
                            {{ parseFloat(recipient.amount).toFixed(8) }} STH
                          </td>
                          <td>
                            <button
                              @click="removeRecipient(index)"
                              type="button"
                              class="btn btn-sm btn-outline-danger"
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr class="table-info">
                          <td colspan="2"><strong>Итого:</strong></td>
                          <td>
                            <strong>{{ totalAmount.toFixed(8) }} STH</strong>
                          </td>
                          <td></td>
                        </tr>
                        <tr class="table-warning">
                          <td colspan="2"><strong>Комиссия:</strong></td>
                          <td>
                            <strong
                              >{{
                                networksTransfer[
                                  selectedNetwork
                                ].multiPayFee.toFixed(8)
                              }}
                              STH</strong
                            >
                          </td>
                          <td></td>
                        </tr>
                        <tr class="table-success">
                          <td colspan="2"><strong>Общая сумма:</strong></td>
                          <td>
                            <strong
                              >{{
                                (
                                  totalAmount +
                                  totalMultiPayFees
                                ).toFixed(8)
                              }}
                              STH</strong
                            >
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                <!-- Network Selection -->
                <div class="row mb-3">
                  <div class="col-md-4">
                    <label
                      class="form-label px-4"
                      :class="'ico-' + selectedNetwork"
                      >Network</label
                    >
                    <select
                      v-model="selectedNetwork"
                      class="form-select form-select-sm"
                    >
                      <option value="mainnet">MainNet</option>
                      <!--
                      <option value="bsc">BSC</option>
                      <option value="ton">TON</option>
                      -->
                    </select>
                  </div>
                  <div class="col-md-8 d-flex align-items-end">
                    <button
                      @click="executeMultiPay"
                      :disabled="
                        multiPayRecipients.length === 0 ||
                        totalAmount + totalMultiPayFees > balanceDecimal
                      "
                      type="button"
                      class="btn btn-success"
                    >
                      Send {{ multiPayRecipients.length }} transactions
                    </button>
                  </div>
                </div>

                <!-- Error Messages -->
                <div v-if="csvErrors.length > 0" class="alert alert-warning">
                  <strong>Ошибки в CSV:</strong>
                  <ul class="mb-0">
                    <li v-for="error in csvErrors" :key="error">{{ error }}</li>
                  </ul>
                </div>
              </div>

              <!-- Transaction Results -->
              <div
                v-if="txSendStep === 1"
                class="overflow-hidden overflow-x-auto"
              >
                <div class="mb-3">
                  <h6>
                    Результаты выполнения
                    {{ multiPayResults.length }} транзакций:
                  </h6>
                  <div
                    class="table-responsive"
                    style="max-height: 400px; overflow-y: auto"
                  >
                    <table class="table table-sm">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Recipient</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Transaction ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(result, index) in multiPayResults"
                          :key="index"
                        >
                          <td>{{ index + 1 }}</td>
                          <td class="text-truncate" style="max-width: 150px">
                            {{ result.recipient.substring(0, 15) }}...{{
                              result.recipient.substr(-10)
                            }}
                          </td>
                          <td>
                            {{ parseFloat(result.amount).toFixed(8) }} STH
                          </td>
                          <td>
                            <span
                              class="badge"
                              :class="
                                result.success ? 'bg-success' : 'bg-danger'
                              "
                            >
                              {{ result.success ? "Success" : "Error" }}
                            </span>
                          </td>
                          <td class="text-truncate" style="max-width: 150px">
                            <span v-if="result.txId" class="text-primary">
                              {{ result.txId.substring(0, 10) }}...{{
                                result.txId.substr(-10)
                              }}
                            </span>
                            <span v-else class="text-danger">{{
                              result.error
                            }}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <p>
                  <button
                    data-bs-dismiss="modal"
                    @click="resetMultiPay"
                    type="button"
                    class="btn btn-sm btn-primary"
                  >
                    Закрыть
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- modal transfer -->
    <div class="modal fade modal-transfer" id="modalTransfer">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Transfer</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="w-100">
              <div v-if="txSendStep === 0">
                <div class="row">
                  <div class="col-md-10">
                    <div class="form-group mb-3">
                      <label class="form-label" for="sendRecipient"
                        >Recipient <i class="fa fa-address-book hover-info"></i
                      ></label>
                      <input
                        v-model="forSend.recipientId"
                        @input="validateAddress"
                        type="text"
                        class="form-control form-control-sm"
                        :class="
                          forSend.addressIsValid &&
                          forSend.recipientId !== this.address
                            ? 'is-valid'
                            : 'is-invalid'
                        "
                        id="sendRecipient"
                        placeholder="Enter address"
                      />
                    </div>
                  </div>
                  <div class="col-md-2" v-show="!isMobile">
                    <div class="form-group mb-3">
                      <label class="form-label" for="sendFee">Fee</label>
                      <input
                        readonly
                        :value="networksTransfer[selectedNetwork].fee"
                        type="text"
                        class="form-control form-control-sm"
                        id="sendFee"
                      />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-3">
                    <div class="form-group mb-3">
                      <label
                        @click="
                          forSend.amount =
                            balanceDecimal -
                            networksTransfer[selectedNetwork].fee
                        "
                        class="form-label"
                        for="sendAmount"
                      >
                        Amount <span class="badge text-info">[max]</span></label>
                      <input
                        :placeholder="
                          'min ' + networksTransfer[selectedNetwork].minAmount
                        "
                        v-model="forSend.amount"
                        type="text"
                        class="form-control form-control-sm"
                        :class="
                          forSend.amount > 0.00000001
                            ? 'is-valid'
                            : 'is-invalid'
                        "
                        id="sendAmount"
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group mb-3">
                      <label class="form-label" for="sendMemo">Memo</label>
                      <input
                        :readonly="selectedNetwork !== 'mainnet'"
                        v-model="forSend.memo"
                        type="text"
                        class="form-control form-control-sm"
                        :class="selectedNetwork === 'ton' ? 'hide' : ''"
                        id="sendMemo"
                        placeholder="Public Description max 250"
                      />

                      <input
                        v-if="selectedNetwork === 'ton'"
                        v-model="forSend.memo2"
                        @change="addMemo2"
                        @input="addMemo2"
                        type="text"
                        class="form-control form-control-sm"
                        :class="selectedNetwork !== 'ton' ? 'hide' : ''"
                        id="sendMemo2"
                        placeholder="memo max 100"
                      />
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="form-group mb-3">
                      <label
                        class="form-label px-4"
                        :class="'ico-' + selectedNetwork"
                        for="sendNetwork"
                        >Network</label
                      >
                      <select
                        v-model="selectedNetwork"
                        @change="validateAddress"
                        class="form-select form-select-sm"
                        id="sendNetwork"
                      >
                        <option selected value="mainnet">MainNet</option>
                        <option value="bsc">BSC</option>
                        <option value="ton">TON</option>
                        <!--<option disabled value="eth">Ethereum</option>-->
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    :disabled="
                      forSend.amount * 1 +
                        networksTransfer[selectedNetwork].fee >
                        balanceDecimal ||
                      !forSend.addressIsValid ||
                      forSend.amount < 0.001 ||
                      !forSend.recipientId ||
                      forSend.recipientId === this.address
                    "
                    @click="txSend"
                    type="button"
                    class="btn btn-sm"
                    :class="
                      forSend.amount * 1 +
                        networksTransfer[selectedNetwork].fee >
                        balanceDecimal ||
                      !forSend.addressIsValid ||
                      forSend.amount < 0.001 ||
                      !forSend.recipientId ||
                      forSend.recipientId === this.address
                        ? 'btn-secondary'
                        : 'btn-success'
                    "
                  >
                    SEND STH
                  </button>
                </div>
              </div>
              <div
                v-if="txSendStep === 1"
                class="overflow-hidden overflow-x-auto"
              >
                <div class="mb-3">
                  <table class="table">
                    <tbody>
                      <tr>
                        <td v-if="txErr === 0">Success txId</td>
                        <td v-if="txErr > 0" class="text-danger">Error txId</td>
                        <td>
                          <span class="text-primary"
                            >{{ txResult.tx.id.substring(0, 10) }}..{{
                              txResult.tx.id.substr(-10)
                            }}</span
                          >
                        </td>
                      </tr>
                      <tr>
                        <td>Amount</td>
                        <td>{{ (txResult.tx.amount / 1e8).toFixed(8) }} STH</td>
                      </tr>
                      <tr>
                        <td>Fee</td>
                        <td>{{ (txResult.tx.fee / 1e8).toFixed(8) }} STH</td>
                      </tr>
                      <tr>
                        <td>Recipient</td>
                        <td>
                          {{ txResult.tx.recipientId.substring(0, 10) }}..{{
                            txResult.tx.recipientId.substr(-10)
                          }}
                        </td>
                      </tr>
                      <tr v-if="txResult.tx.vendorField">
                        <td>Memo</td>
                        <td>{{ txResult.tx.vendorField }}</td>
                      </tr>
                      <tr>
                        <td>
                          Network&nbsp;<i
                            class="px-3 py-1"
                            :class="'ico-' + txResult.network"
                          ></i>
                        </td>
                        <td>
                          <span class="text-uppercase text-info">{{
                            txResult.network
                          }}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  <button
                    data-bs-dismiss="modal"
                    @click="sendTabPrepare"
                    type="button"
                    class="btn btn-sm"
                    :class="txErr > 0 ? 'btn-danger' : 'btn-success'"
                  >
                    CONTINUE</button
                  >&nbsp;<span
                    v-show="
                      waitConfirmTx &&
                      timerConfirmation > 0 &&
                      timerConfirmation < 8
                    "
                    >Please wait confirmation.. {{ timerConfirmation }}</span
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- toasts-container -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div
        class="toast fade hide mb-3"
        data-autohide="false"
        id="toast-transfer"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="toast-header" :class="'text-' + toastStyle">
          <i class="far fa-bell me-2" />
          <strong class="me-auto">{{ toastStyle }}</strong>
          <small class="text-success-emphasis">{{ notifyOp }}</small>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="toast"
          ></button>
        </div>
        <div class="toast-body small">
          {{ notifyMsg }}
        </div>
      </div>
    </div>

    <ModalVote :address="address" />

    <ModalDelegateReg :address="address" />

    <ModalSignMessage :address="address" />

    <!-- modal decrypt -->
    <div class="modal fade" id="modalDecryptAddress">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">SECRET KEY</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <p>For address {{ address }}</p>
            <textarea
              v-model="decryptedSecret"
              class="form-control text-info"
              rows="3"
            ></textarea>
            <p class="small text-danger mt-2">Please keep in secret!</p>
          </div>
        </div>
      </div>
    </div>

    <!-- modal qr -->
    <div class="modal modal-cover fade" id="modalQr">
      <div class="modal-dialog">
        <div class="modal-content text-info text-center">
          <h3>Receiving address</h3>
          <p class="text-center">{{ address }}</p>
          <div class="">
            <qrcode-vue
              class="m-auto border border-5 border-secondary"
              :value="address"
              :size="280"
              level="H"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QrcodeVue from "qrcode.vue";
import { storeToRefs } from "pinia";
import { useAppOptionStore } from "@/stores/app-option.ts";
const appOption = useAppOptionStore();
import { useStoreWallet } from "@/stores/wallet.ts";
import { Identities } from "@smartholdem/crypto";

const storeWallet = useStoreWallet();
import ModalVote from "@/components/wallet/ModalVote.vue";
import ModalDelegateReg from "@/components/wallet/ModalDelegateReg.vue";
import ModalSignMessage from "@/components/wallet/ModalSignMessage.vue";
import { Toast } from "bootstrap";

export default {
  name: "OperationsComponent",
  components: {
    QrcodeVue,
    ModalVote,
    ModalDelegateReg,
    ModalSignMessage,
  },
  props: {
    address: String,
  },
  data() {
    return {
      timerConfirmation: 8,
      notifyOp: "operation",
      toastStyle: "success",
      notifyMsg: "",
      decryptedSecret: "",
      waitConfirmTx: true,
      // Конфигурация сетей для переводов
      networksTransfer: {
        mainnet: {
          fee: 0.25,
          multiPayFee: 1,
          multiPayMaxAddresses: 150,
          minAmount: 0.00001,
        },
        bsc: {
          fee: 25,
          minAmount: 100,
        },
        ton: {
          fee: 25,
          minAmount: 100,
        },
        eth: {
          fee: 200,
          minAmount: 100,
        },
      },
      // Данные для инвойса
      invoice: {
        amount: "",
        memo: "",
      },
      isMobile: appOption.isMobile,
      txSendStep: 0,
      // Результат транзакции
      txResult: {
        response: null,
        tx: null,
      },
      // Данные для отправки
      forSend: {
        network: "mainnet",
        addressIsValid: false,
        sender: this.address,
        recipientId: "",
        amount: "",
        fee: 0.25,
        memo: "",
        memo2: "",
      },
      selectedNetwork: "mainnet",
      txErr: 0,
      // Multi-pay данные
      multiPayRecipients: [],
      newRecipient: {
        address: "",
        amount: "",
        addressIsValid: false,
        fee: 1,
      },
      csvErrors: [],
      multiPayResults: [],
      totalMultiPayFees: 1,
    };
  },
  computed: {
    // Адресная книга
    book() {
      return storeWallet.addressBook;
    },
    // Безопасное получение баланса в десятичном формате
    balanceDecimal() {
      // Получаем атрибуты текущего адреса из стора
      const attrs = storeWallet.attributes[this.address];
      // Безопасно извлекаем баланс и конвертируем в десятичный формат
      const balance = Number(attrs?.balance ?? 0);
      return balance / 1e8; // Конвертируем из сатоши в STH
    },
    // Текущий адрес кошелька
    currentAddress() {
      return storeWallet.attributes[this.address];
    },
    totalAmount() {
      return this.multiPayRecipients.reduce(
        (sum, recipient) => sum + parseFloat(recipient.amount || 0),
        0
      );
    },
  },
  watch: {
    // Отслеживание изменений результата транзакции
    txResult: {
      handler: function () {
        this.$emit("txResultData", this.txResult);
      },
      deep: true,
    },
  },
  methods: {
    // Показать всплывающее уведомление
    showToast(target, msg, style = "success") {
      this.notifyMsg = msg;
      this.toastStyle = style;
      const toast = new Toast(document.getElementById(target));
      toast.show();
    },
    // Копировать текст в буфер обмена
    async copyText(text) {
      navigator.clipboard.writeText(text);
    },
    // Подготовка формы отправки
    async sendTabPrepare() {
      // Сбро�� результата предыдущей транзакции
      this.txResult = {
        response: null,
        tx: null,
      };
      this.txErr = 0;
      this.waitConfirmTx = true;
      this.txSendStep = 0;
      this.selectedNetwork = "mainnet";
      // Инициализация данных для отправки
      this.forSend = {
        network: "mainnet",
        addressIsValid: false,
        sender: this.address,
        recipientId: "",
        amount: "",
        fee: 0.25,
        memo: "",
      };
    },
    // Валидация адреса получателя в зависимости от сети
    async validateAddress() {
      if (this.selectedNetwork === "mainnet") {
        this.forSend.memo = "";
        this.forSend.addressIsValid = await storeWallet.validateAddress(
          this.forSend.recipientId
        );
      }
      // Валидация для BSC и Ethereum
      if (this.selectedNetwork === "bsc" || this.selectedNetwork === "eth") {
        this.forSend.addressIsValid =
          await storeWallet.validateAddressCrossChain(this.forSend.recipientId);
        if (this.forSend.addressIsValid) {
          this.forSend.memo =
            this.selectedNetwork + ":" + this.forSend.recipientId;
        }
      }
      // Валидация для TON
      if (this.selectedNetwork === "ton") {
        this.forSend.addressIsValid =
          this.forSend.recipientId[0] === "U" ||
          this.forSend.recipientId[0] === "E";
        if (this.forSend.addressIsValid) {
          this.forSend.memo =
            this.selectedNetwork +
            ":" +
            this.forSend.recipientId +
            ":" +
            (this.forSend.memo2 || "");
        }
      }
    },
    // Добавление дополнительного memo для TON
    async addMemo2() {
      if (this.forSend.memo2) {
        this.forSend.memo =
          this.selectedNetwork +
          ":" +
          this.forSend.recipientId +
          ":" +
          (this.forSend.memo2 || "");
      }
    },
    // Отправка транзакции
    async txSend() {
      // Установка комиссии для выбранной сети
      this.forSend.fee = this.networksTransfer[this.selectedNetwork].fee;
      this.forSend.network = this.selectedNetwork;

      // Выполнение перевода через стор
      this.txResult = await storeWallet.txTransfer(this.forSend);

      if (this.txResult.response) {
        // Проверка на ошибки в ответе
        this.txErr = this.txResult.response.invalid.length;
        this.txSendStep = 1;
        this.selectedNetwork = "mainnet";

        // Сброс формы после отправки
        this.forSend = {
          network: "mainnet",
          addressIsValid: false,
          sender: this.address,
          recipientId: "",
          amount: "",
          fee: 0.25,
          memo: "",
        };

        // Таймер подтверждения транзакции
        if (this.waitConfirmTx) {
          let tmConfirm = null;
          tmConfirm = setInterval(() => {
            this.timerConfirmation--;
            if (this.timerConfirmation < 0) {
              this.timerConfirmation = 8;
              clearInterval(tmConfirm);
            }
          }, 1000);
        }

        // Обновление данных аккаунта после подтверждения
        setTimeout(async () => {
          this.waitConfirmTx = false;
          await this.accountUpdate();
          await this.sendTabPrepare();
        }, 9200);

        this.showToast("toast-transfer", "Tx Transfer success!", "success");
      }
    },
    // Расшифровка приватного ключа
    async decryptSecret() {
      this.decryptedSecret = await storeWallet.decryptByAddress(this.address);
    },
    // Обновление данных аккаунта
    async accountUpdate() {
      if (this.address) {
        await storeWallet.getAttributes(this.address);
        await storeWallet.getTransactions(this.address, 10);
      } else {
        console.log("accountUpdate err", this.address);
      }
    },

    // CSV обработка
    async handleCsvUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        await this.parseCsvData(e.target.result);
      };
      reader.readAsText(file);
    },

    async calculateMultiPayFees(recipients) {
      const txQue = Math.trunc(recipients.length / this.networksTransfer.mainnet.multiPayMaxAddresses); // число транзакция с мультиплатежами, каждая транзакция может содержать txMax платежей на разные адреса
      const txPlus = (recipients.length % this.networksTransfer.mainnet.multiPayMaxAddresses) > 0 ? 1: 0; // остаток платежей, которые не войдут в полную транзакцию, может быть < txMax (последняя транзакция с платежами в очереди)
      console.log(txQue, txPlus)
      this.totalMultiPayFees = (txQue + txPlus);
      return this.totalMultiPayFees;
    },

    async parseCsvData(csvText) {
      this.csvErrors = [];
      const lines = csvText.split("\n").filter((line) => line.trim());

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [address, amount] = line.split(",").map((item) => item.trim());

        if (!address || !amount) {
          this.csvErrors.push(
            `Строка ${i + 1}: Неверный формат (ожидается: address,amount)`
          );
          continue;
        }

        const isValidAddress = await this.validateAddressAsync(address);
        const numAmount = parseFloat(amount);

        if (!isValidAddress) {
          this.csvErrors.push(`Строка ${i + 1}: Неверный адрес ${address}`);
          continue;
        }

        if (isNaN(numAmount) || numAmount <= 0) {
          this.csvErrors.push(`Строка ${i + 1}: Неверная сумма ${amount}`);
          continue;
        }

        if (address === this.address) {
          this.csvErrors.push(
            `Строка ${i + 1}: Нельзя отправить на свой адрес`
          );
          continue;
        }

        // Проверяем дубликаты
        const exists = this.multiPayRecipients.find(
          (r) => r.address === address
        );
        if (exists) {
          this.csvErrors.push(`Строка ${i + 1}: Адрес ${address} уже добавлен`);
          continue;
        }

        this.multiPayRecipients.push({
          address: address,
          amount: numAmount.toString(),
        });
      }

      await this.calculateMultiPayFees(this.multiPayRecipients);

      // Очищаем input
      this.$refs.csvFileInput.value = "";
    },

    async validateAddressAsync(address) {
      // Асинхронная валидация адреса для CSV в зависимости от выбранной сети
      if (this.selectedNetwork === "mainnet") {
        return await storeWallet.validateAddress(address);
      } else {
        return await storeWallet.validateAddressCrossChain(address);
      }
    },

    // Ручное добавление получателя
    async validateNewRecipientAddress() {
      if (this.selectedNetwork === "mainnet") {
        this.newRecipient.addressIsValid = await storeWallet.validateAddress(
          this.newRecipient.address
        );
      } else {
        this.newRecipient.addressIsValid =
          await storeWallet.validateAddressCrossChain(
            this.newRecipient.address
          );
      }
    },

    addRecipient() {
      if (!this.newRecipient.addressIsValid || this.newRecipient.amount <= 0)
        return;

      // Проверяем дубликаты
      const exists = this.multiPayRecipients.find(
        (r) => r.address === this.newRecipient.address
      );
      if (exists) {
        this.showToast(
          "toast-transfer",
          "Адрес уже добавлен в список",
          "warning"
        );
        return;
      }

      this.multiPayRecipients.push({
        address: this.newRecipient.address,
        amount: this.newRecipient.amount,
      });

      this.calculateMultiPayFees(this.multiPayRecipients);

      // Очищаем форму
      this.newRecipient = {
        address: "",
        amount: "",
        addressIsValid: false,
      };
    },

    removeRecipient(index) {
      this.multiPayRecipients.splice(index, 1);
    },

    clearMultiPayList() {
      this.multiPayRecipients = [];
      this.csvErrors = [];
    },

    downloadTemplate() {
      const csvContent = "address,amount\nSTQnKW8JQ6cMKwLrcfdfMwhChyHUysccts,1.00000000\nSTBuvjHvKjKa2BkpKLxJvhztGAfvpbzeDr,2.50000000";
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sth_multi_pay_template.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    },

    // Выполнение мульти-платежей
    async executeMultiPay() {
      if (this.multiPayRecipients.length === 0) return;

      this.multiPayResults = [];
      this.txSendStep = 1;

      const recipients = [];
      for (let i = 0; i < this.multiPayRecipients.length; i++) {
        recipients.push(this.multiPayRecipients[i]);
      }

      const transferPayload = {
        sender: this.address,
        txMax: 150,
        fee: this.networksTransfer[this.selectedNetwork].multiPayFee,
        network: this.selectedNetwork,
        recipients: recipients,
        memo: "",
      };

      const result = await storeWallet.txTransferMulti(transferPayload);

      // Обновляем баланс после выполнения всех транзакций
      setTimeout(async () => {
        await this.accountUpdate();
      }, 5000);

      const successCount = this.multiPayResults.filter((r) => r.success).length;
      this.showToast(
        "toast-transfer",
        `Выполнено ${successCount} из ${this.multiPayResults.length} транзакций`,
        successCount === this.multiPayResults.length ? "success" : "warning"
      );
    },

    resetMultiPay() {
      this.multiPayRecipients = [];
      this.multiPayResults = [];
      this.csvErrors = [];
      this.newRecipient = {
        address: "",
        amount: "",
        addressIsValid: false,
      };
      this.txSendStep = 0;
      this.selectedNetwork = "mainnet";
    },

    // ...existing code...
  },
};
</script>

<style scoped>
.modal-transfer {
  --bs-modal-width: 900px;
}
.ico-ton {
  background-image: url("/images/ton.svg");
  background-position: 0 2px;
  background-repeat: no-repeat;
  background-size: 16px;
}

.hide {
  display: none;
}
</style>
