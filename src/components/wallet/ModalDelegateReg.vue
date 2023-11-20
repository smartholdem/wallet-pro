<template>
  <div class="modal fade modal-transfer" id="modalDelegateReg">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Vote for Delegate</h5>
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
  computed: {
    balanceDecimal() {
      return this.currentAddress.balance / 10 ** 8;
    },
    currentAddress() {
      return storeWallet.attributes[this.address];
    },
  },

};
</script>

<style scoped>

</style>
