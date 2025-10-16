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
                <button :disabled="!currentAddress.balance || currentAddress.balance / 10 ** 8 < 15" @click="createNewCode(address)" type="button" class="btn btn-outline-warning btn-lg"
                        :class="currentTab===1 ? 'active': ''">
                  <i class="far fa-lg fa-fw me-2 fa-check-square"></i>Создать
                </button>
                <button @click="currentTab=2" type="button" class="btn btn-outline-warning btn-lg"
                        :class="currentTab===2 ? 'active': ''">
                  <i class="far fa-lg fa-fw me-2 fa-check-square"></i>Активировать
                </button>
                <button @click="getMyCodes(address)" type="button" class="btn btn-outline-warning btn-lg"
                        :class="currentTab===3 ? 'active': ''">
                  <i class="far fa-lg fa-fw me-2 fa-check-square"></i>Мои SmartNotes
                </button>

              </div>


              <div v-show="currentTab===0">
                <img class="w-100 mt-4" src="/images/smartnote.png" alt="smartnotes sth">
              </div>

              <!-- createNewCode currentTab === 1 form -->
              <div v-show="currentTab===1">

              </div>

              <!-- activateCode currentTab === 2 form -->
              <div v-show="currentTab===2">
                <label class="form-label">Укажите код активации</label>
                <input
                    v-model="smartCode"
                    @input=""
                    type="text"
                    class="form-control form-control-lg bg-dark text-white"
                    placeholder="GM-XXXX-XXXXXXXX or STH-XXXX-XXXX"
                />

                <button :disabled="!smartCode" @click="codeActivate" type="button" class="mt-2 btn btn-warning btn-lg">
                  Активировать код <i class="fas fa-lg fa-fw me-2 fa-angle-double-right"></i>
                </button>


              </div>

              <!-- myCodes -->
              <div v-show="currentTab===3">
                <div v-if="myCodes.length === 0" class="alert alert-dark text-center">
                  У вас нет активных SmartNotes
                </div>
                <div v-else>
                  <table class="table table-striped table-bordered">
                    <thead>
                    <tr>
                      <th>Smart Code</th>
                      <th>Amount [STH]</th>
                      <th class="text-center">Status</th>
                      <th>Created At</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="code in myCodes" :key="code.pub">
                      <td>GM-{{ code.pub }}-{{ code.priv }}</td>
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
  <GmInfoModal/>
</template>

<script>
import {useStoreWallet} from "@/stores/wallet";
import {useGMStore} from "@/stores/gm";
import Card from "@/components/bootstrap/Card.vue";
import GmInfoModal from "@/components/wallet/GmInfoModal.vue";

const storeWallet = useStoreWallet();
const gmStore = useGMStore();

export default {
  components: {Card, GmInfoModal},
  data() {
    return {
      address: this.$route.params.address || '',
      currentTab: 0,
      smartCode: '',
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
    async codeActivate() {

    },
    async createNewCode(address) {
      this.currentTab = 1; // Switch to the "Create" tab
      try {
        //await gmStore.createNewCode(address);
      } catch (error) {
        console.error("Ошибка при создании кода:", error);
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

    }
  }
}
</script>


<style scoped>

</style>