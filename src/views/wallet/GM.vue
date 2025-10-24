<template>
  <div class="row">
    <div class="col-lg-10">
      <card class="h-100">
        <div class="card-header">
          <h4 v-if="!isMobile" class="mb-0 font-lighter"><span data-bs-toggle="modal" data-bs-target="#gmInfoModal"><i
              class="text-white-50 fas fa-lg fa-fw me-2 fa-info-circle"></i></span> Smart Notes {{ address }}</h4>
          <span v-else>Smart Notes {{ address }}</span>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-lg-12">
              <!--
                          <button type="button" @click="$router.push('/address/' + address)" class="btn btn-outline-warning btn-lg">
                            <i class="fas fa-lg fa-fw me-2 fa-angle-double-left"></i>
                          </button>&nbsp;
                          <button type="button" class="btn btn-warning btn-lg">
                            <i class="far fa-lg fa-fw me-2 fa-check-square"></i>Создать
                          </button>&nbsp;
                          <button type="button" class="btn btn-warning btn-lg">
                            <i class="far fa-lg fa-fw me-2 fa-check-square"></i>Активировать
                          </button>&nbsp;
                          <button type="button" class="btn btn-warning btn-lg">
                            <i class="far fa-lg fa-fw me-2 fa-check-square"></i>Мои SmartNotes
                          </button>
              -->
              <!-- Responsive Actions -->
              <div v-if="$route.params.address">
                <!-- Desktop Button Group -->
                <div v-if="!isMobile" class="btn-group mb-3 w-100">
                  <button type="button" @click="$router.push('/address/' + address)"
                          class="btn btn-outline-warning btn-lg" :class="currentTab===0 ? 'active': ''">
                    <i class="fas fa-lg fa-fw me-2 fa-angle-double-left"></i>
                  </button>
                  <button :disabled="!currentAddress.balance || currentAddress.balance / 10 ** 8 < 15"
                          @click="selectTab(1)" type="button" class="btn btn-outline-warning btn-lg"
                          :class="currentTab===1 ? 'active': ''">
                    <i class="far fa-lg fa-fw me-2 fa-check-square"></i>{{ $t('gm_create') }}
                  </button>
                  <button @click="selectTab(2)" type="button" class="btn btn-outline-warning btn-lg"
                          :class="currentTab===2 ? 'active': ''">
                    <i class="far fa-lg fa-fw me-2 fa-check-square"></i>{{ $t('gm_activate') }}
                  </button>
                  <button :disabled="!currentAddress.balance || currentAddress.balance / 10 ** 8 < 15"
                          @click="selectTab(3)" type="button" class="btn btn-outline-warning btn-lg"
                          :class="currentTab===3 ? 'active': ''">
                    <i class="far fa-lg fa-fw me-2 fa-check-square"></i>{{ $t('gm_my_smartnotes') }}
                  </button>
                </div>

                <!-- Mobile Dropdown -->
                <div v-else class="btn-group mb-3 w-100">
                  <button type="button" @click="$router.push('/address/' + address)" class="btn btn-outline-warning btn-lg">
                    <i class="fas fa-lg fa-fw fa-angle-double-left"></i>
                  </button>
                  <div class="dropdown btn-group w-100">
                    <button class="btn btn-warning btn-lg dropdown-toggle w-100" type="button" id="gmActionsDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                      {{ currentActionName }}
                    </button>
                    <ul class="dropdown-menu dropdown-menu-dark w-100" aria-labelledby="gmActionsDropdown">
                      <li><a class="dropdown-item" :class="{ 'disabled': !currentAddress.balance || currentAddress.balance / 10 ** 8 < 15 }" href="#" @click.prevent="selectTab(1)">{{ $t('gm_create') }}</a></li>
                      <li><a class="dropdown-item" href="#" @click.prevent="selectTab(2)">{{ $t('gm_activate') }}</a></li>
                      <li><a class="dropdown-item" :class="{ 'disabled': !currentAddress.balance || currentAddress.balance / 10 ** 8 < 15 }" href="#" @click.prevent="selectTab(3)">{{ $t('gm_my_smartnotes') }}</a></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div v-show="currentTab===0">
                <img class="w-100 mt-4" src="/images/smartnote.png" alt="smartnotes sth">
              </div>

              <!-- createNewCode currentTab === 1 form -->
              <div v-show="currentTab===1">
                <div class="row justify-content-center">
                  <div class="col-md-8 col-lg-6">
                    <!-- Step 1: Form -->
                    <div v-show="newCode.step === 1" class="h-100">
                      <card class="bg-dark border-secondary mt-2">
                        <div class="card-body">
                          Onetime address: <strong class="text-success">{{gmAccount && gmAccount.dep ? gmAccount.dep.address : 'Loading...'}}</strong><br/>
                          {{$t('your_balance')}} {{ currentAddressBalance }} STH
                          <div class="mb-3 mt-2">
                            <label for="codeAmount" class="form-label">{{ $t('gm_form_amount') }} Smart Note</label>
                            <select v-model="newCode.amount" class="form-select form-select-lg" id="codeAmount">
                              <option value="10">10 STH</option>
                              <option :disabled="currentAddressBalance < 100 + newCode.fee" value="100">100 STH</option>
                              <option :disabled="currentAddressBalance < 500 + newCode.fee" value="500">500 STH</option>
                              <option :disabled="currentAddressBalance < 1000 + newCode.fee" value="1000">1 000 STH</option>
                              <option :disabled="currentAddressBalance < 5000 + newCode.fee" value="5000">5 000 STH</option>
                              <option :disabled="currentAddressBalance < 10000 + newCode.fee" value="10000">10 000 STH</option>
                              <option :disabled="currentAddressBalance < 25000 + newCode.fee" value="25000">25 000 STH</option>
                            </select>
                          </div>
                          <div class="mb-3">
                            <label for="codeMemo" class="form-label">{{ $t('gm_form_memo') }}</label>
                            <input
                                v-model="newCode.memo"
                                type="text"
                                class="form-control form-control-lg"
                                id="codeMemo"
                                :placeholder="$t('optional_message')"
                            />
                            <p class="small text-end mt-1">{{ $t('fee') }} {{ newCode.fee }} STH</p>
                          </div>
                          <div class="d-grid">
                            <button :disabled="!gmAccount || currentAddressBalance < 10.25" @click="submitNewCode"
                                    type="button" class="btn btn-warning btn-lg">
                              {{ $t('gm_form_create_button') }}
                            </button>
                          </div>
                        </div>
                      </card>
                    </div>

                    <!-- Step 2: Confirmation -->
                    <div v-show="newCode.step === 2" class="h-100">
                      <card class="bg-dark border-secondary mt-4">
                        <div class="card-header"><h5>{{ $t('gm_step2_title') }}</h5></div>
                        <div class="card-body">
                          <p><strong>{{ $t('amount') }}:</strong> {{ txParams.amount }} STH {{ $t('gm_including_fee') }}</p>
                          <p><strong>{{ $t('recipient') }}:</strong> {{ txParams.recipientId }}</p>
                          <p><strong>{{ $t('memo') }}:</strong> {{ txParams.memo || '-' }}</p>
                          <div class="d-grid gap-2">
                            <button @click="confirmAndSend" type="button" class="btn btn-success btn-lg">
                              {{ $t('gm_step2_confirm_button') }}
                            </button>
                            <button @click="resetNewCode" type="button" class="btn btn-secondary btn-lg">
                              {{ $t('gm_step2_cancel_button') }}
                            </button>
                          </div>
                        </div>
                      </card>
                    </div>

                    <!-- Step 3: Result -->
                    <div v-show="newCode.step === 3" class="h-100">
                      <card class="bg-dark border-secondary mt-2">
                        <div class="card-header">{{ $t('gm_step3_title') }}</div>
                        <div class="card-body text-center">
                          <p>{{ $t('gm_step3_tx_id') }}</p>
                          <strong class="text-success text-break">{{ newCode.txId }}</strong>
                          <p class="mt-3">{{ $t('gm_step3_code_in_progress') }}</p>
                          <div v-if="resultSubmitNewCode && resultSubmitNewCode.code" @click="copyText(resultSubmitNewCode.code)" class="alert alert-dark mt-2 text-center">
                            {{resultSubmitNewCode.code}}
                          </div>

                          <div class="d-grid mt-4">
                            <button @click="resetNewCode" type="button" class="btn btn-warning btn-lg">
                              {{$t('close')}}
                            </button>
                          </div>
                        </div>
                      </card>
                    </div>

                  </div>
                  <div class="col-md-4 col-lg-6">
                    <img class="w-100 mt-2" src="/images/STH25000.png" alt="smartnotes sth">
                  </div>
                </div>
              </div>

              <!-- activateCode currentTab === 2 form -->
              <div v-show="currentTab===2">
                <div class="content">
                  <div class="row m-1">
                    <card class="bg-dark col-md-6">
                      <div class="card-body">
                        <p v-show="currentAddressBalance > 0" class="text-center">{{$t('your_balance')}} {{ currentAddressBalance }} STH</p>
                        <label class="form-label">{{ $t('gm_enter_activation_code') }}</label>
                        <p v-if="qrResponse.error !== null" class="drop-error">
                          {{ qrResponse.error }}
                        </p>
                        <input
                            v-model="smartCode"
                            @input=""
                            type="text"
                            class="form-control form-control-lg bg-dark text-white"
                            :placeholder="$t('gm_enter_activation_code') + ' GM-XXXX-XXXXXXXX, STH-XXXX-XXXX'"
                        />
                        <button :disabled="!smartCode" @click="codeActivate" type="button" class="mt-3 btn btn-warning btn-lg">
                          {{ $t('gm_activate_code') }} <i class="fas fa-lg fa-fw me-2 fa-angle-double-right"></i>
                        </button>
                      </div>
                    </card>
                    <card class="col-md-6 bg-dark">
                      <div class="card-body m-1">
                        <qrcode-drop-zone @detect="onDetect" @dragover="onDragOver" @init="logErrors" class="w-100 mt-1">
                          <div class="w-100 drop-area" :class="{ 'dragover': qrResponse.dragover }">
                            Drop Smart Code image here
                          </div>
                        </qrcode-drop-zone>
                        <qrcode-capture class="mt-2" @detect="onDetect"  />
                      </div>
                    </card>
                  </div>

                </div>
              </div>

              <!-- myCodes -->
              <div v-show="currentTab===3">
                <div v-if="myCodes.length === 0" class="alert alert-dark text-center">
                  {{ $t('gm_no_active_notes') }}
                </div>
                <div v-else>
                  <!-- Desktop Table View -->
                  <table v-if="!isMobile" class="table table-striped table-bordered">
                    <thead>
                    <tr>
                      <th>{{ $t('gm_table_smart_code') }}</th>
                      <th>{{ $t('gm_table_amount') }}</th>
                      <th class="text-center">{{ $t('gm_table_status') }}</th>
                      <th>{{ $t('gm_table_created_at') }}</th>
                      <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="code in myCodes" :key="code.pub">
                      <td v-if="!code.code" class="text-break">
                        <i class="far fa-copy me-2 pointer text-primary" @click="copyText('GM-' + code.pub + '-' + code.priv)"></i>
                        GM-{{ code.pub }}-{{ code.priv }}
                      </td>
                      <td v-else class="text-break">
                        <i class="far fa-copy me-2 pointer text-theme" @click="copyText(code.code)"></i>
                        {{ code.code }}
                      </td>
                      <td>{{ code.amount }}</td>
                      <td class="text-center"><i class="fas fa-lg fa-fw fa-circle"
                                                 :class="code.status === true ? 'text-success' : 'text-white-50'"></i>
                      </td>
                      <td>{{ new Date(code.time * 1000).toLocaleString() }}</td>
                      <td class="text-center">
                        <div @click="showNoteImage(code.code || 'GM-' + code.pub + '-' + code.priv, code.time, code.amount )" class="fas fa-lg fa-fw me-2 fa-download text-theme pointer d-inline-block"></div>
                        <i @click="showNoteQr(code.code || 'GM-' + code.pub + '-' + code.priv)" class="fas fa-lg fa-qrcode text-theme pointer d-inline-block"></i>
                      </td>
                    </tr>
                    </tbody>
                  </table>

                  <!-- Mobile Card View -->
                  <div v-else>
                    <card v-for="code in myCodes" :key="code.pub" class="bg-dark border-secondary mb-3">
                      <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                          <div class="text-break pe-2">
                            <strong class="text-white-50">{{ $t('gm_table_smart_code') }}</strong><br>
                            <i class="far fa-copy me-2 pointer" @click="copyText(code.code || 'GM-' + code.pub + '-' + code.priv)"></i>
                            <span>{{ code.code || 'GM-' + code.pub + '-' + code.priv }}</span>
                          </div>
                          <div class="text-nowrap ps-2">
                            <i class="fas fa-lg fa-fw fa-circle" :class="code.status === true ? 'text-success' : 'text-white-50'"></i>
                          </div>
                        </div>
                        <hr class="my-2">
                        <div class="row">
                          <div class="col-6">
                            <strong class="text-white-50">{{ $t('gm_table_amount') }}</strong><br>
                            <span>{{ code.amount }} STH</span>
                          </div>
                          <div class="col-6">
                            <strong class="text-white-50">{{ $t('gm_table_created_at') }}</strong><br>
                            <span>{{ new Date(code.time * 1000).toLocaleDateString() }}</span>
                          </div>
                        </div>
                        <hr class="my-2">
                        <div class="text-center">
                          <div @click="showNoteImage(code.code || 'GM-' + code.pub + '-' + code.priv, code.time, code.amount )" class="btn btn-sm btn-outline-secondary d-inline-block text-theme me-2">
                            <i class="fas fa-download"></i>
                          </div>
                          <div @click="showNoteQr(code.code || 'GM-' + code.pub + '-' + code.priv)" class="btn btn-sm btn-outline-secondary d-inline-block text-theme">
                            <i class="fas fa-qrcode"></i>
                          </div>
                        </div>
                      </div>
                    </card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </card>
    </div>


    <!-- GM Account-->
    <!--
    <div class="col-lg-5">
      <card v-if="gmAccount" class="">
        <div class="card-header">
          <h5 class="mb-0">Данные аккаунта GM</h5>
        </div>
        <div class="card-body">
          <p><strong>UID:</strong> {{ gmAccount.uid }}</p>
          <p><strong>Inviter:</strong> {{ gmAccount.inviter }}</p>
          <p><strong>Balance:</strong> {{ gmAccount.balance }}</p>
          <pre class="bg-dark text-white p-3 rounded"><code>{{ JSON.stringify(gmAccount, null, 2) }}</code></pre>
        </div>
      </card>

      <div v-if="!gmAccount && $route.params.address" class="mt-4">
        <p class="text-center">
          <i class="fas fa-spinner fa-spin fa-2x"></i><br>
          Привязка аккаунта к GM...
        </p>
      </div>
    </div>
    -->

  </div>

  <GmInfoModal/>
  <smart-note-image-modal :code="selectedCode" :creationDate="selectedDate" :amount="selectedAmount"/>
  <SmartNoteImageModalMobile :code="selectedCode" :creationDate="selectedDate" :amount="selectedAmount"/>
  <GmQrModal :code="selectedCode"/>

  <!-- toasts-container -->

  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div
        class="toast fade hide mb-3"
        data-autohide="false"
        id="toast-gm"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
    >

      <div class="toast-header" :class="'text-' + toastStyle">
        <i class="far fa-bell me-2"/>
        <strong class="me-auto">{{ toastStyle }}</strong>
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
</template>

<script>
import {useStoreWallet} from "@/stores/wallet";
import {useGMStore} from "@/stores/gm";
import Card from "@/components/bootstrap/Card.vue";
import GmInfoModal from "@/components/wallet/GmInfoModal.vue";
import {Toast, Modal} from "bootstrap";
import { QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader';
import SmartNoteImageModal from "@/components/wallet/SmartNoteImageModal.vue";
import GmQrModal from "@/components/wallet/gmQrModal.vue";
import SmartNoteImageModalMobile from "@/components/wallet/SmartNoteImageModalMobile.vue";

const storeWallet = useStoreWallet();
const gmStore = useGMStore();

export default {
  components: {Card, GmInfoModal, QrcodeDropZone, QrcodeCapture, SmartNoteImageModal, GmQrModal, SmartNoteImageModalMobile},
  data() {
    return {
      qrResponse: {
        result: null,
        error: null,
        dragover: false
      },
      address: this.$route.params.address || '',
      currentTab: 1,
      smartCode: '',
      smartCodeDetect: '',
      toastStyle: 'success',
      notifyMsg: '',
      selectedCode: '',
      selectedDate: null,
      selectedAmount: 0,
      noteModal: null,
      qrModal: null,
      noteModalMobile: null,
      newCode: {
        accountId: this.$route.params.address,
        amount: 10,
        memo: '',
        txId: null,
        fee: 5,
        depositAddress: '',
        step: 1,
      },
      txParams: {
        recipientId: '',
        amount: 0,
        fee: 1,
        memo: ''
      },
      resultSubmitNewCode: null,
      isMobile: false,
    }
  },
  computed: {
    currentAddressBalance() {
      return ((this.currentAddress.balance / 10 ** 8).toFixed(8) * 1) || 0;
    },
    currentAddress() {
      const address = this.$route.params.address;
      if (!address) return {};
      return storeWallet.attributes[address] || {};
    },
    gmAccount() {
      const address = this.$route.params.address;
      if (!address) return null;
      return gmStore.accounts[address] || null;
    },
    myCodes() {
      const address = this.$route.params.address;
      if (!address) return [];
      return gmStore.myCodes[address] || [];
    },
    currentActionName() {
      switch (this.currentTab) {
        case 1:
          return this.$t('gm_create');
        case 2:
          return this.$t('gm_activate');
        case 3:
          return this.$t('gm_my_smartnotes');
        default:
          return this.$t('gm_actions_menu_title') || 'Actions';
      }
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkScreenSize);
  },
  async mounted() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize);

    const address = this.$route.params.address;
    if (!address) {
      console.error("No address provided in route.");
      return;
    }

    try {
      await gmStore.accountLink(address);
    } catch (error) {
      console.error("Ошибка при привязке аккаунта:", error);
      // TODO: Обработать эту ошибку в UI
    }

    if (this.currentAddressBalance < 10) {
      this.currentTab = 2; // Switch to info tab if balance is insufficient
    }
    this.noteModal = new Modal(document.getElementById('smartNoteImageModal'));
    this.qrModal = new Modal(document.getElementById('gmQrModal'));
    this.noteModalMobile = new Modal(document.getElementById('smartNoteImageModalMobile'));
  },
  methods: {
    checkScreenSize() {
      this.isMobile = window.innerWidth <= 768;
    },
    selectTab(tab) {
      this.currentTab = tab;
      if (tab === 3) {
        this.getMyCodes(this.address);
      }
    },
    async showNoteQr(code) {
      this.selectedCode = code;
      this.qrModal.show();
    },
    async showNoteImage(code, createDate,amount ) {
      this.selectedCode = code;
      this.selectedDate = createDate;
      this.selectedAmount = amount;
      if (this.isMobile) {
        this.noteModalMobile.show();
      } else {
        this.noteModal.show();
      }
    },
    onDecode (result) {
      console.log('onDecode', result)
      //this.smartCode = result;
    },
    onDetect(detectedCodes) {
      if (detectedCodes.length) {
        this.smartCode = detectedCodes[0].rawValue;
      }
     // this.smartCode = JSON.stringify(detectedCodes.map((code) => code.rawValue))
    },
    logErrors(error) {
      if (error.name === 'DropImageFetchError') {
        this.error = "Sorry, you can't load cross-origin images :/"
      } else if (error.name === 'DropImageDecodeError') {
        this.error = "Ok, that's not an image. That can't be decoded."
      } else {
        this.error = 'Ups, what kind of error is this?! ' + error.message
      }
    },
    onDragOver (isDraggingOver) {
      console.log('isDraggingOver', isDraggingOver)
    },
    async accountUpdate() {
      if (this.address) {
        await storeWallet.getAttributes(this.address);
        await storeWallet.getTransactions(this.address, 10);
        await gmStore.accountLink(this.address);
      } else {
        console.log("accountUpdate err", this.address);
      }
    },
    showToast(target, msg, style = "success") {
      this.notifyMsg = msg;
      this.toastStyle = style;
      const toast = new Toast(document.getElementById(target));
      toast.show();
    },
    async codeActivate() {
      const result = await gmStore.codeActivate(this.address, this.smartCode);
      this.smartCode = '';

      if (result && result.success) {
        this.showToast('toast-gm', this.$t('gm_code_activated_successfully', { amount: result.result.amount }), 'success');

        setTimeout(async () => {
          await this.accountUpdate();
        }, 8600);

      } else {
        this.showToast('toast-gm', this.$t('gm_code_not_found_or_activated'), 'danger');
      }
    },
    async getMyCodes(address) {
      this.currentTab = 3; // Switch to the "My Codes" tab
      try {
        await gmStore.getMyCodes(address);
      } catch (error) {
        console.error("Ошибка при получении кодов:", error);
        // TODO: Обработать эту ошибку в UI
      }
    },
    async submitNewCode() {
      if (!this.gmAccount || !this.gmAccount.dep || !this.gmAccount.dep.address) {
        this.showToast('toast-gm', this.$t('gm_deposit_address_not_found'), 'danger');
        return;
      }
      this.newCode.depositAddress = this.gmAccount.dep.address;
      this.txParams.recipientId = this.newCode.depositAddress;
      this.txParams.amount = parseFloat(this.newCode.amount) + this.newCode.fee;
      this.txParams.memo = this.newCode.memo;
      this.newCode.step = 2;
    },
    async confirmAndSend() {
      try {
        const txResult = await storeWallet.txTransfer({
          sender: this.address,
          recipientId: this.txParams.recipientId,
          amount: this.txParams.amount - 1,
          fee: this.txParams.fee,
          //memo: this.txParams.memo,
          network: 'mainnet'
        });

        if (txResult && txResult.response && txResult.response.accept && txResult.response.accept.length > 0) {
          this.newCode.txId = txResult.tx.id;

          this.resultSubmitNewCode = await gmStore.createSthCode(
              this.address,
              this.newCode.amount,
              this.newCode.txId,
              this.newCode.memo,
              this.txParams.recipientId,
          );

          this.showToast('toast-gm', this.$t('gm_transaction_sent_code_in_progress'), 'info');
          setTimeout(async () => {
            await this.accountUpdate();
          }, 8600);
          this.newCode.step = 3;
        } else {
          throw new Error('Transaction was not accepted by the network.');
        }
      } catch (error) {
        console.error("Failed to send transaction:", error);
        this.showToast('toast-gm', this.$t('gm_transaction_send_error'), 'danger');
        this.resetNewCode();
      }
    },
    resetNewCode() {
      this.resultSubmitNewCode = null;
      this.newCode = {
        accountId: this.address,
        amount: 10,
        memo: '',
        txId: null,
        fee: 5,
        depositAddress: '',
        step: 1,
      };
      this.txParams = {
        recipientId: '',
        amount: 0,
        fee: 0.25,
        memo: ''
      };
      this.currentTab = 1;
    },
    async copyText(text) {
      try {
        await navigator.clipboard.writeText(text);
        this.showToast('toast-gm', this.$t('copied_to_clipboard'), 'success');
      } catch (err) {
        console.error('Failed to copy: ', err);
        this.showToast('toast-gm', this.$t('gm_failed_to_copy'), 'danger');
      }
    },
  }
}
</script>


<style>
.drop-area {
  height: 100px;
  border: solid 1px #fff;
  color: #fff;
  text-align: center;
  font-weight: bold;
  padding: 10px;

}

.dragover {
  background-color: #10b981;
}

.drop-error {
  color: red;
  font-weight: bold;
}
</style>