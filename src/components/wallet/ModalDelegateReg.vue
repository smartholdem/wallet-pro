<template>
  <div class="modal fade modal-transfer" id="modalDelegateReg">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">New Delegate Registration</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div v-if="currentAddress" class="modal-body">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStoreWallet } from "@/stores/wallet.ts";
const storeWallet = useStoreWallet();

export default {
  name: "ModalDelegateReg",
  props: {
    address: String,
  },
  data() {
    return {
      txSendStep: 0,
      timerDelegateSearch: null,
      foundDelegate: null,
      nameIsValid: false,
      forSend: {
        userName: '',
      },
      txResult: null,
    }
  },
  mounted() {
    this.searchClear();
  },
  computed: {
    balanceDecimal() {
      return this.currentAddress.balance / 10 ** 8;
    },
    currentAddress() {
      return storeWallet.attributes[this.address];
    },
  },
  methods: {
    searchClear() {
      this.foundDelegate = null;
      this.forSend.userName = '';
      this.txResult = null;
    },
    async validateDelegate() {
      clearTimeout(this.timerDelegateSearch);
      this.timerDelegateSearch = setTimeout(async () => {
        this.voteResult = null;
        this.foundDelegate = await storeWallet.getDelegate(this.forSend.userName.toLowerCase());
      }, 800);
    },
  },

};
</script>

<style scoped>

</style>
