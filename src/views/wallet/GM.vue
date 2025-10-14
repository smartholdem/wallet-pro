<template>
  <div class="row">

    <div  class="col-lg-7">
    <card class="h-100">
      <div class="card-header">
        <h4 class="mb-0 font-lighter"><span data-bs-toggle="modal" data-bs-target="#gmInfoModal"><i class="text-white-50 fas fa-lg fa-fw me-2 fa-info-circle"></i></span> Smart Notes {{address}}</h4>
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
        <button type="button" @click="$router.push('/address/' + address)" class="btn btn-outline-warning btn-lg">
          <i class="fas fa-lg fa-fw me-2 fa-angle-double-left"></i>
        </button>
        <button type="button" class="btn btn-outline-warning btn-lg">
          <i class="far fa-lg fa-fw me-2 fa-check-square"></i>Создать
        </button>
        <button type="button" class="btn btn-outline-warning btn-lg">
          <i class="far fa-lg fa-fw me-2 fa-check-square"></i>Активировать
        </button>
        <button type="button" class="btn btn-outline-warning btn-lg">
          <i class="far fa-lg fa-fw me-2 fa-check-square"></i>Мои SmartNotes
        </button>

      </div>



      <img class="w-100 mt-4" src="/images/smartnote.png" alt="smartnotes sth">
          </div>
        </div>
      </div>
    </card>
    </div>


    <!-- GM Account-->
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

  </div>
  <GmInfoModal />
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
    }
  },
  async mounted() {
    const address = this.$route.params.address;
    if (!address) {
      console.error("No address provided in route.");
      return;
    }

    try {
      await gmStore.checkLinkAccount(address);
    } catch (error) {
      console.error("Ошибка при привязке аккаунта:", error);
      // TODO: Обработать эту ошибку в UI
    }
  }
}
</script>



<style scoped>

</style>