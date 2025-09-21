<template>
  <div class="h-100">
    <card class="h-100 overflow-hidden">
      <card-header class="card-header fw-bold small">
        {{ $t("operations") }}
      </card-header
      >
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
          <button
              data-bs-toggle="modal"
              data-bs-target="#modalExchange"
              type="button"
              class="btn btn-outline-theme text-uppercase"
              :disabled="!isExchangeAvailable"
          >
            {{ $t("exchange") }}
          </button>
        </div>

        <div v-if="currentAddress" class="btn-group mb-3 me-2">
          <button
              :disabled="balanceDecimal < 1"
              @click="sendTabPrepare"
              data-bs-toggle="modal"
              data-bs-target="#modalTransfer"
              type="button"
              class="btn btn-outline-theme text-uppercase"
          >
            <i class="fas fa-lg fa-fw me-2 fa-rocket"></i>{{ $t("send") }}
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
              class="btn btn-outline-theme text-uppercase"
          >
            <i class="far fa-lg fa-fw me-2 fa-list-alt"></i>{{ $t("mpays") }}
          </button>

          <button
              data-bs-toggle="modal"
              data-bs-target="#modalExchange"
              type="button"
              class="btn btn-outline-theme text-uppercase"
              :disabled="!isExchangeAvailable"
          >
            <i class="fas fa-lg fa-fw me-2 fa-exchange-alt"></i>{{ $t("exchange") }}
          </button>
          <button
              data-bs-toggle="modal"
              data-bs-target="#modalSignMessage"
              type="button"
              class="btn btn-outline-theme text-uppercase"
          >
            <i class="fas fa-lg fa-fw me-2 fa-pen-square"></i>{{ $t("sig") }}
          </button>
          <button :disabled="true" type="button" class="btn btn-outline-theme">
            <i class="far fa-lg fa-fw me-2 fa-clock"></i>{{ $t("htlc") }}
          </button>
        </div>

        <div v-if="currentAddress" class="btn-group mb-3">
          <button disabled="true" type="button" class="btn btn-outline-theme">
            <i class="fas fa-lg fa-fw me-2 fa-user-secret"></i>{{ $t("2nd_pwd") }}
          </button>

          <button
              v-if="!currentAddress.attributes.delegate"
              data-bs-toggle="modal"
              data-bs-target="#modalDelegateReg"
              type="button"
              class="btn btn-outline-theme"
          >
            <i class="fas fa-lg fa-fw me-2 fa-user-plus"></i>{{ $t("delegate_reg") }}
          </button>

          <button
              data-bs-toggle="modal"
              data-bs-target="#modalVote"
              type="button"
              class="btn btn-outline-theme text-uppercase"
          >
            <i class="far fa-lg fa-fw me-2 fa-thumbs-up"></i>{{ $t("vote") }}
          </button>
          <button
              disabled
              type="button"
              class="btn btn-outline-theme text-uppercase"
          >
            <i class="fas fa-lg fa-fw me-2 fa-users"></i>{{ $t("msig") }}
          </button>
        </div>
      </card-body>
    </card>

    <!-- modal мультиплатежи transfer до 150 платежей в 1 транзакции-->
    <div class="modal fade modal-transfer" id="modalMPayTransfer">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ $t("multi_payments") }}</h5>
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
                    <label class="form-label">{{
                        $t("upload_csv_file")
                      }}</label>
                    <input
                        ref="csvFileInput"
                        @change="handleCsvUpload"
                        type="file"
                        accept=".csv"
                        class="form-control form-control-sm"
                    />
                    <small class="text-muted">{{
                        $t("format_address_amount")
                      }}</small>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">{{ $t("operations_csv") }}</label>
                    <div class="d-flex gap-2">
                      <button
                          @click="clearMultiPayList"
                          type="button"
                          class="btn btn-sm btn-outline-secondary"
                      >
                        {{ $t("clear") }}
                      </button>
                      <button
                          @click="downloadTemplate"
                          type="button"
                          class="btn btn-sm btn-outline-info"
                      >
                        {{ $t("download_template") }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Manual Add Section -->
                <div class="row mb-3">
                  <div class="col-md-8">
                    <label class="form-label">{{ $t("add_recipient") }}</label>
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
                        :placeholder="$t('enter_address')"
                    />
                  </div>
                  <div class="col-md-3">
                    <label class="form-label">{{ $t("amount") }}</label>
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
                  >{{ $t("list_recipients") }} ({{
                      multiPayRecipients.length
                    }})</label
                  >
                  <div
                      class="table-responsive"
                      style="max-height: 300px; overflow-y: auto"
                  >
                    <table class="table table-sm">
                      <thead>
                      <tr>
                        <th>#</th>
                        <th>{{ $t("address_table") }}</th>
                        <th>{{ $t("amount_table") }}</th>
                        <th>{{ $t("operation_table") }}</th>
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
                        <td colspan="2">
                          <strong>{{ $t("total") }}:</strong>
                        </td>
                        <td>
                          <strong>{{ totalAmount.toFixed(8) }} STH</strong>
                        </td>
                        <td></td>
                      </tr>
                      <tr class="table-warning">
                        <td colspan="2">
                          <strong>{{ $t("fees") }}:</strong>
                        </td>
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
                        <td colspan="2">
                          <strong>{{ $t("total_amount") }}:</strong>
                        </td>
                        <td>
                          <strong
                          >{{
                              (totalAmount + totalMultiPayFees).toFixed(8)
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
                    >{{ $t("network") }}</label
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
                      {{
                        $t("send_transactions", {
                          count: multiPayRecipients.length,
                        })
                      }}
                    </button>
                  </div>
                </div>

                <!-- Error Messages -->
                <div v-if="csvErrors.length > 0" class="alert alert-warning">
                  <strong>{{ $t("errors_in_csv") }}</strong>
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
                    {{ $t("transaction_results") }} ({{
                      multiPayResults.length
                    }}):
                  </h6>
                  <div
                      class="table-responsive"
                      style="max-height: 400px; overflow-y: auto"
                  >
                    <table class="table table-sm">
                      <thead>
                      <tr>
                        <th>#</th>
                        <th>{{ $t("tx_id") }}</th>
                        <th>{{ $t("payments_in_tx") }}</th>
                        <th>{{ $t("status") }}</th>
                        <th>{{ $t("error") }}</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr
                          v-for="(r, idx) in multiPayResults"
                          :key="r.txId || idx"
                      >
                        <td>{{ idx + 1 }}</td>
                        <td class="text-truncate" style="max-width: 220px">
                            <span v-if="r.txId" class="text-primary">
                              {{ r.txId.substring(0, 12) }}...{{
                                r.txId.substr(-12)
                              }}
                            </span>
                          <span v-else class="text-muted">{{
                              $t("no_id")
                            }}</span>
                        </td>
                        <td>{{ r.paymentsCount ?? "-" }}</td>
                        <td>
                            <span
                                class="badge"
                                :class="r.success ? 'bg-success' : 'bg-danger'"
                            >
                              {{
                                r.success
                                    ? $t("success_badge")
                                    : $t("error_badge")
                              }}
                            </span>
                        </td>
                        <td>
                            <span class="text-danger" v-if="r.error">{{
                                r.error
                              }}</span>
                          <span class="text-muted" v-else>-</span>
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
                    {{ $t("close") }}
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
            <h5 class="modal-title">{{ $t("transfer") }}</h5>
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
                      >{{ $t("recipient") }}
                        <i class="fa fa-address-book hover-info"></i
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
                          :placeholder="$t('enter_address')"
                      />
                    </div>
                  </div>
                  <div class="col-md-2" v-show="!isMobile">
                    <div class="form-group mb-3">
                      <label class="form-label" for="sendFee">{{
                          $t("fee")
                        }}</label>
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
                        {{ $t("amount") }}
                        <span class="badge text-info">{{
                            $t("max")
                          }}</span></label
                      >
                      <input
                          :placeholder="
                          $t('min') +
                          ' ' +
                          networksTransfer[selectedNetwork].minAmount
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
                      <label class="form-label" for="sendMemo">{{
                          $t("memo")
                        }}</label>
                      <input
                          :readonly="selectedNetwork !== 'mainnet'"
                          v-model="forSend.memo"
                          type="text"
                          class="form-control form-control-sm"
                          :class="selectedNetwork === 'ton' ? 'hide' : ''"
                          id="sendMemo"
                          :placeholder="$t('public_description_max_250')"
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
                          :placeholder="$t('memo_max_100')"
                      />
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="form-group mb-3">
                      <label
                          class="form-label px-4"
                          :class="'ico-' + selectedNetwork"
                          for="sendNetwork">
                        {{ $t("network") }}
                      </label>
                      <select
                          v-model="selectedNetwork"
                          @change="validateAddress"
                          class="form-select form-select-sm"
                          id="sendNetwork"
                      >
                        <option selected value="mainnet">
                          {{ $t("mainnet") }}
                        </option>
                        <option value="bsc">{{ $t("bsc") }}</option>
                        <option value="ton">{{ $t("ton") }}</option>
                        <!--<option disabled value="eth">{{ $t('ethereum') }}</option>-->
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
                    {{ $t("send_sth") }}
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
                      <td v-if="txErr === 0">{{ $t("success_tx_id") }}</td>
                      <td v-if="txErr > 0" class="text-danger">
                        {{ $t("error_tx_id") }}
                      </td>
                      <td>
                        <!-- безопасный вывод txId одиночной транзакции -->
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
                        <!-- защита от null -->
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
                      <td>{{ txResult.tx.vendorField }}</td>
                    </tr>
                    <tr>
                      <td>
                        {{ $t("network") }}&nbsp;<i
                          class="px-3 py-1"
                          :class="
                              'ico-' + (txResult?.network || selectedNetwork)
                            "
                      ></i>
                      </td>
                      <td>
                          <span class="text-uppercase text-info">{{
                              txResult?.network || selectedNetwork
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
                    {{ $t("continue") }}
                  </button
                  >&nbsp;<span
                    v-show="
                      waitConfirmTx &&
                      timerConfirmation > 0 &&
                      timerConfirmation < 8
                    "
                >{{ $t("please_wait_confirmation") }}
                    {{ timerConfirmation }}</span
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
          <i class="far fa-bell me-2"/>
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

    <ModalVote :address="address"/>

    <ModalDelegateReg :address="address"/>

    <ModalSignMessage :address="address"/>

    <ExchangeModal :balance="balanceDecimal" :address="address"/>

    <!-- modal decrypt -->
    <div class="modal fade" id="modalDecryptAddress">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ $t("secret_key") }}</h5>
            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <p>{{ $t("for_address") }} {{ address }}</p>
            <textarea
                v-model="decryptedSecret"
                class="form-control text-info"
                rows="3"
            ></textarea>
            <p class="small text-danger mt-2">
              {{ $t("please_keep_in_secret") }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- modal qr -->
    <div class="modal modal-cover fade" id="modalQr">
      <div class="modal-dialog">
        <div class="modal-content text-info text-center">
          <h3>{{ $t("receiving_address") }}</h3>
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
import {storeToRefs} from "pinia";
import {useAppOptionStore} from "@/stores/app-option.ts";
import {useExchangeStore} from "@/stores/exchange.ts";

const appOption = useAppOptionStore();
import {useStoreWallet} from "@/stores/wallet.ts";
import {Identities} from "@smartholdem/crypto";

const storeWallet = useStoreWallet();
const exchangeStore = useExchangeStore();
import ModalVote from "@/components/wallet/ModalVote.vue";
import ModalDelegateReg from "@/components/wallet/ModalDelegateReg.vue";
import ModalSignMessage from "@/components/wallet/ModalSignMessage.vue";
import ExchangeModal from "@/components/wallet/ExchangeModal.vue";
import {Toast} from "bootstrap";

export default {
  name: "OperationsComponent",
  components: {
    QrcodeVue,
    ModalVote,
    ModalDelegateReg,
    ModalSignMessage,
    ExchangeModal,
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
    isExchangeAvailable() {
      return exchangeStore.isExchangeAvailable;
    },
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
    // Текущий адр��с кошелька
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
    // Отслеживание ��зменений результата транзакции
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
      // Сброс результата предыдущей транзакции
      this.txResult = {
        response: null,
        tx: null,
      };
      this.txErr = 0;
      this.waitConfirmTx = true;
      this.txSendStep = 0;
      this.selectedNetwork = "mainnet";
      // Ини��иализация данных для отправки
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

        // Обновлен��е данных аккаунта после подтверждения
        setTimeout(async () => {
          this.waitConfirmTx = false;
          await this.accountUpdate();
          await this.sendTabPrepare();
        }, 9200);

        this.showToast("toast-transfer", "Tx Transfer success!", "success");
      }
    },
    // Расшифров��а приватного ключа
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
      const txQue = Math.trunc(
          recipients.length / this.networksTransfer.mainnet.multiPayMaxAddresses
      ); // число транзакция с мультиплатежами, каждая транзакция может содержать txMax пл��тежей на разные адреса
      const txPlus =
          recipients.length % this.networksTransfer.mainnet.multiPayMaxAddresses >
          0
              ? 1
              : 0; // остаток платежей, которые не войдут в полную транзакцию, может быть < txMax (последняя транзакция с платежами в очер��ди)
      this.totalMultiPayFees = txQue + txPlus;
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
              this.$t("invalid_format_expected", {line: i + 1})
          );
          continue;
        }

        const isValidAddress = await this.validateAddressAsync(address);
        const numAmount = parseFloat(amount);

        if (!isValidAddress) {
          this.csvErrors.push(
              this.$t("invalid_address", {line: i + 1, address: address})
          );
          continue;
        }

        if (isNaN(numAmount) || numAmount <= 0) {
          this.csvErrors.push(
              this.$t("invalid_amount", {line: i + 1, amount: amount})
          );
          continue;
        }

        if (address === this.address) {
          this.csvErrors.push(
              this.$t("cannot_send_to_your_address", {line: i + 1})
          );
          continue;
        }

        // Проверяем дубликаты
        const exists = this.multiPayRecipients.find(
            (r) => r.address === address
        );
        if (exists) {
          this.csvErrors.push(
              this.$t("address_already_added", {line: i + 1, address: address})
          );
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
            "Адрес уже добавлен �� список",
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
      // пересчитать комиссии multipay после удаления
      this.calculateMultiPayFees(this.multiPayRecipients);
    },

    clearMultiPayList() {
      this.multiPayRecipients = [];
      this.csvErrors = [];
    },

    downloadTemplate() {
      const csvContent =
          "address,amount\nSTQnKW8JQ6cMKwLrcfdfMwhChyHUysccts,1.00000000\nSTBuvjHvKjKa2BkpKLxJvhztGAfvpbzeDr,2.50000000";
      const blob = new Blob([csvContent], {type: "text/csv"});
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

      // Подгото��ка пакета получателей
      const recipients = [];
      for (let i = 0; i < this.multiPayRecipients.length; i++) {
        recipients.push(this.multiPayRecipients[i]);
      }

      const transferPayload = {
        sender: this.address,
        txMax: 150, // максимум платежей в одной multipayment-транзакции
        fee: this.networksTransfer[this.selectedNetwork].multiPayFee,
        network: this.selectedNetwork,
        recipients,
        memo: "", // можно поставить пометку, например "airdrop"
      };

      // Выполняем мультиплатежи
      const result = await storeWallet.txTransferMulti(transferPayload);

      // Разбор резу��ьтата и подготовка данных для UI
      // result.tx — массив сформированных multipayment-транзакций
      // result.response — ответ API с данными accept/broadcast/invalid/errors
      const txList = Array.isArray(result?.tx)
          ? result.tx
          : result?.tx
              ? [result.tx]
              : [];
      const resp = result?.response || {};
      const accepted = Array.isArray(resp.accept) ? resp.accept : [];
      const invalidArr = Array.isArray(resp.invalid) ? resp.invalid : [];
      const errorsMap = resp.errors || {}; // объект ошибок по txId, если есть

      // Строим список результатов по каждой транзакции
      this.multiPayResults = txList.map((tx) => {
        // безопасно получаем id транзакции
        const txId = tx?.id || tx?.data?.id || null;
        // количество платежей в данной транзакции
        const paymentsCount = tx?.asset?.payments?.length ?? null;
        const success = !!(txId && accepted.includes(txId));
        // Получаем текст ошибки, если есть
        let errorText = "";
        if (!success && txId && errorsMap[txId]) {
          // errorsMap[txId] может быть строкой/объектом/массивом
          const err = errorsMap[txId];
          if (typeof err === "string") errorText = err;
          else if (err?.message) errorText = err.message;
          else errorText = JSON.stringify(err);
        } else if (!success && txId && invalidArr.includes(txId)) {
          errorText = "Rejected by node";
        } else if (!success && !txId) {
          errorText = "Unknown error";
        }
        return {txId, paymentsCount, success, error: errorText || null};
      });

      // Подсчёт успешных транзакций и суммарно обработанных платежей
      const totalTx = this.multiPayResults.length;
      const successTxs = this.multiPayResults.filter((r) => r.success);
      const successCount = successTxs.length;
      const processedPayments = successTxs.reduce(
          (sum, r) => sum + (r.paymentsCount || 0),
          0
      );

      // Показать тост с дета��ями успеха:
      // - если одна успешна�� транзакция — выводим её txId и число платежей
      // - если несколько — суммарная статистика
      if (successCount > 0) {
        if (successCount === 1 && successTxs[0].txId) {
          const id = successTxs[0].txId;
          this.showToast(
              "toast-transfer",
              // комментарий: показываем коротки�� txId и число платежей
              `Multipay success: txId ${id.substring(0, 10)}..${id.substr(
                  -10
              )}, payments ${successTxs[0].paymentsCount}`,
              "success"
          );
        } else {
          this.showToast(
              "toast-transfer",
              `Multipay success: ${successCount}/${totalTx} tx, payments ${processedPayments}`,
              "success"
          );
        }
      } else {
        // Неуспех — показываем ошибочный тост
        this.showToast(
            "toast-transfer",
            "Multipay failed: 0 accepted",
            "danger"
        );
      }

      // Обновляем данные аккаунта спустя небольшую паузу
      setTimeout(async () => {
        await this.accountUpdate();
      }, 5000);
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
