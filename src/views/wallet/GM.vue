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
                <button @click="getMyCodes(address)" type="button" class="btn btn-outline-warning btn-lg"
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
                  <div class="col-md-4 col-lg-6">
                    <div v-show="newCode.step === 1" class="h-100">
                      <card class="bg-dark border-secondary h-100">
                        <div class="card-body">
                          Creator address: {{address}}
                          <br/>Creator balance: {{currentAddress.balance / 10**8}} STH
                          <div class="mb-3 mt-2">
                            <!--<label for="codeAmount" class="form-label">{{ $t('gm_form_amount') }}</label>-->
                            <select v-model="newCode.amount" class="form-select form-select-lg" id="codeAmount">
                              <option value="10">10 STH</option>
                              <option value="100">100 STH</option>
                              <option value="500">500 STH</option>
                              <option value="1000">1000 STH</option>
                              <option value="5000">5000 STH</option>
                              <option value="10000">10000 STH</option>
                              <option value="25000">25000 STH</option>
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
                            <br/><span class="small">Fee 5 STH</span>
                          </div>
                          <div class="d-grid">
                            <button @click="submitNewCode(2)" type="button" class="btn btn-warning btn-lg">
                              {{ $t('gm_form_create_button') }}
                            </button>
                          </div>
                        </div>
                      </card>
                    </div>

                  </div>
                  <div class="col-md-8 col-lg-6">
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
                <button :disabled="!smartCode" @click="codeActivate" type="button" class="mt-2 btn btn-warning btn-lg">
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
                      <td>
                        <i class="far fa-copy me-2 pointer" @click="copyText('GM-' + code.pub + '-' + code.priv)"></i>
                        GM-{{ code.pub }}-{{ code.priv }}
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
        amount: 0,
        memo: '',
        txId: '',
        fee: 5,
        depositAddress: '',
        step: 1,
      }
    }
  },
  computed: {
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
  },
  methods: {
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
      } else {
        const message = 'Код не найден или активирован ранее.';
        this.showToast('toast-gm', message, 'danger');
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
    async submitNewCode(step) {
      this.newCode.step = step;
      console.log('Creating new code with:', this.newCode);
      // TODO: Implement logic to call store action
      this.showToast('toast-gm', 'Создание кода в разработке...', 'info');

      this.newCode.depositAddress = this.gmAccount.dep.address;
      await gmStore.createSthCode(this.newCode);

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