<template>
  <!-- modal vote -->
  <div class="modal fade modal-transfer" id="modalVote">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delegate Vote</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="w-100">
            <div v-if="txSendStep === 0">
              <div class="row">
                <div class="col-md-10">
                  <div class="form-group mb-3">
                    <label class="form-label" for="sendDelegateName">Delegate Name <i class="fa fa-address-book hover-info"></i></label>
                    <input v-model="forSend.username" @input="validateDelegate" type="text" class="form-control form-control-sm" :class="forSend.nameIsValid ? 'is-valid' : 'is-invalid'" id="sendDelegateName"
                           placeholder="enter delegate name">
                  </div>
                </div>
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
const storeWallet = useStoreWallet();

export default {
  name: "ModalVote",
  props: {
    address: String,
  },
  data() {
    return {
      txSendStep: 0,
      foundDelegate: null,
      nameIsValid: false,
      forSend: {
        userName: '',
      }
    }
  },
  methods: {
    async validateDelegate() {
      this.foundDelegate = await storeWallet.getDelegate(this.forSend.userName);
    },
  }
};
</script>

<style scoped>

</style>
