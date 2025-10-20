<template>
  <div class="row">
    <div class="col-lg-10">
      <card class="h-100">
        <div class="card-header">
          <h4 class="mb-0 font-lighter"><span data-bs-toggle="modal" data-bs-target="#gmInfoModal"><i
              class="text-white-50 fas fa-lg fa-fw me-2 fa-info-circle"></i></span> Smart Notes {{ address }}</h4>
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
              <div v-if="$route.params.address" class="btn-group mb-3 w-100">
                <button type="button" @click="$router.push('/address/' + address)"
                        class="btn btn-outline-warning btn-lg" :class="currentTab===0 ? 'active': ''">
                  <i class="fas fa-lg fa-fw me-2 fa-angle-double-left"></i>
                </button>
                <button :disabled="!currentAddress.balance || currentAddress.balance / 10 ** 8 < 15" @click="currentTab = 1" type="button" class="btn btn-outline-warning btn-lg"
                        :class="currentTab===1 ? 'active': ''">
                  <i class="far fa-lg fa-fw me-2 fa-check-square"></i>{{ $t('gm_create') }}
                </button>
                <button @click="currentTab=2" type="button" class="btn btn-outline-warning btn-lg"
                        :class="currentTab===2 ? 'active': ''">
                  <i class="far fa-lg fa-fw me-2 fa-check-square"></i>{{ $t('gm_activate') }}
                </button>
                <button :disabled="!currentAddress.balance || currentAddress.balance / 10 ** 8 < 15" @click="getMyCodes(address)" type="button" class="btn btn-outline-warning btn-lg"
                        :class="currentTab===3 ? 'active': ''">
                  <i class="far fa-lg fa-fw me-2 fa-check-square"></i>{{ $t('gm_my_smartnotes') }}
                </button>

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
                          Address for deposit: <strong class="text-success">{{ gmAccount && gmAccount.dep ? gmAccount.dep.address : 'Loading...' }}</strong>
                          <br/>Available balance {{currentAddressBalance}} STH
                          <div class="mb-3 mt-2">
                            <label for="codeAmount" class="form-label">{{ $t('gm_form_amount') }}</label>
                            <select v-model="newCode.amount" class="form-select form-select-lg" id="codeAmount">
                              <option value="10">10 STH</option>
                              <option :disabled="currentAddressBalance < 100 + 0.25" value="100">100 STH</option>
                              <option :disabled="currentAddressBalance < 500 + 0.25" value="500">500 STH</option>
                              <option :disabled="currentAddressBalance < 1000 + 0.25" value="1000">1 000 STH</option>
                              <option :disabled="currentAddressBalance < 5000 + 0.25" value="5000">5 000 STH</option>
                              <option :disabled="currentAddressBalance < 10000 + 0.25" value="10000">10 000 STH</option>
                              <option :disabled="currentAddressBalance < 25000 + 0.25" value="25000">25 000 STH</option>
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
                            <br/><span class="small">Fee {{newCode.fee}} STH</span>
                          </div>
                          <div class="d-grid">
                            <button :disabled="!gmAccount || currentAddressBalance < 10.25" @click="submitNewCode" type="button" class="btn btn-warning btn-lg">
                              {{ $t('gm_form_create_button') }}
                            </button>
                          </div>
                        </div>
                      </card>
                    </div>

                    <!-- Step 2: Confirmation -->
                    <div v-show="newCode.step === 2" class="h-100">
                      <card class="bg-dark border-secondary mt-4">
                        <div class="card-header"><h5>Подтверждение транзакции</h5></div>
                        <div class="card-body">
                          <p><strong>Сумма:</strong> {{ txParams.amount }} STH (включая комиссию)</p>
                          <p><strong>Получатель:</strong> {{ txParams.recipientId }}</p>
                          <p><strong>Memo:</strong> {{ txParams.memo || '-' }}</p>
                          <div class="d-grid gap-2">
                            <button @click="confirmAndSend" type="button" class="btn btn-success btn-lg">Подтвердить</button>
                            <button @click="resetNewCode" type="button" class="btn btn-secondary btn-lg">Отмена</button>
                          </div>
                        </div>
                      </card>
                    </div>

                    <!-- Step 3: Result -->
                    <div v-show="newCode.step === 3" class="h-100">
                      <div class="card bg-dark border-secondary mt-4">
                        <div class="card-header"><h5>Транзакция отправлена</h5></div>
                        <div class="card-body text-center">
                          <p>ID Транзакции:</p>
                          <strong class="text-success text-break">{{ newCode.txId }}</strong>
                          <p class="mt-3">Код в процессе создания...</p>
                          <div class="d-grid mt-4">
                            <button @click="resetNewCode" type="button" class="btn btn-primary btn-lg">Закрыть</button>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                  <div class="col-md-4 col-lg-6">
                    <img class="w-100 mt-2" src="/images/smartnote.png" alt="smartnotes sth">
                  </div>
                </div>
              </div>

              <!-- activateCode currentTab === 2 form -->
              <div v-show="currentTab===2">
                <label class="form-label">{{ $t('gm_enter_activation_code') }}</label>
                <input
                    v-model="smartCode"
                    @input=""
                    type="text"
                    class="form-control form-control-lg bg-dark text-white"
                    placeholder="GM-XXXX-XXXXXXXX or STH-XXXX-XXXX"
                />
                <button :disabled="!smartCode" @click="codeActivate" type="button" class="mt-3 btn btn-warning btn-lg">
                  {{ $t('gm_activate_code') }} <i class="fas fa-lg fa-fw me-2 fa-angle-double-right"></i>
                </button>
              </div>

              <!-- myCodes -->
              <div v-show="currentTab===3">
                <div v-if="myCodes.length === 0" class="alert alert-dark text-center">
                  {{ $t('gm_no_active_notes') }}
                </div>
                <div v-else>
                  <table class="table table-striped table-bordered">
                    <thead>
                    <tr>
                      <th>{{ $t('gm_table_smart_code') }}</th>
                      <th>{{ $t('gm_table_amount') }}</th>
                      <th class="text-center">{{ $t('gm_table_status') }}</th>
                      <th>{{ $t('gm_table_created_at') }}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="code in myCodes" :key="code.pub">
                      <td v-if="!code.code">
                        <i class="far fa-copy me-2 pointer" @click="copyText('GM-' + code.pub + '-' + code.priv)"></i>
                        GM-{{ code.pub }}-{{ code.priv }}
                      </td>
                      <td v-else>
                        <i class="far fa-copy me-2 pointer" @click="copyText(code.code)"></i>
                        {{ code.code }}
                      </td>
                      <td>{{ code.amount }}</td>
                      <td class="text-center"><i class="fas fa-lg fa-fw me-2 fa-circle"
                                                 :class="code.status === true ? 'text-success' : 'text-white-50'"></i>
                      </td>
                      <td>{{ new Date(code.time * 1000).toLocaleString() }}</td>
                    </tr>
                    </tbody>
                  </table>
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

    <GmInfoModal />

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
import { Toast } from "bootstrap";

const storeWallet = useStoreWallet();
const gmStore = useGMStore();

export default {
  components: {Card, GmInfoModal},
  data() {
    return {
      address: this.$route.params.address || '',
      currentTab: 1,
      smartCode: '',
      toastStyle: 'success',
      notifyMsg: '',
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
      }
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
    }
  },
  async mounted() {
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
  },
  methods: {
    async accountUpdate() {
      if (this.address) {
        await storeWallet.getAttributes(this.address);
        await storeWallet.getTransactions(this.address, 10);
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
        const message = `Код успешно активирован на сумму ${result.result.amount} STH`;
        this.showToast('toast-gm', message, 'success');

        setTimeout(async () => {
          await this.accountUpdate();
        }, 8600);

      } else {
        const message = 'Код не найден или активирован ранее.';
        this.showToast('toast-gm', message, 'danger');
      }
    },
    async createNewCode() {
      this.resetNewCode();
      this.currentTab = 1;
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
        this.showToast('toast-gm', 'Не удалось получить адрес для депозита.', 'danger');
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
          amount: this.txParams.amount,
          fee: this.txParams.fee,
          //memo: this.txParams.memo,
          network: 'mainnet'
        });

        if (txResult && txResult.response && txResult.response.accept && txResult.response.accept.length > 0) {
          this.newCode.txId = txResult.tx.id;

          await gmStore.createSthCode(
              this.address,
              this.newCode.amount,
              this.newCode.txId,
              this.newCode.memo,
              this.txParams.recipientId,
          );

          this.showToast('toast-gm', 'Транзакция отправлена! Код в процессе создания...', 'info');
          setTimeout(async () => {
            await this.accountUpdate();
          }, 8600);
          this.newCode.step = 3;
        } else {
          throw new Error('Transaction was not accepted by the network.');
        }
      } catch (error) {
        console.error("Failed to send transaction:", error);
        this.showToast('toast-gm', 'Ошибка при отправке транзакции.', 'danger');
        this.resetNewCode();
      }
    },
    resetNewCode() {
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
        this.showToast('toast-gm', 'Failed to copy', 'danger');
      }
    },
  }
}
</script>