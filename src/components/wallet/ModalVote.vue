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
                <div class="col-md-12">
                  <div class="form-group mb-3">
                    <label class="form-label" for="sendDelegateName">Delegate Name <i class="fa fa-address-book hover-info"></i></label>
                    <input v-model="forSend.userName" @input="validateDelegate" type="text" class="form-control form-control-sm" :class="foundDelegate ? 'is-valid' : 'is-invalid'" id="sendDelegateName"
                           placeholder="enter delegate name">
                  </div>
                  {{foundDelegate}}
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
import { storeToRefs } from "pinia";
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
      timerDelegateSearch: null,
      foundDelegate: null,
      nameIsValid: false,
      forSend: {
        userName: '',
      }
    }
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
    async validateDelegate() {
      this.foundDelegate = null;
      clearTimeout(this.timerDelegateSearch);
      console.log('this.forSend.userName', this.forSend.userName)
      this.timerDelegateSearch = setTimeout(async () => {
        this.foundDelegate = await storeWallet.getDelegate(this.forSend.userName);
      }, 1000);
    },
  }
};
</script>

<style scoped>

</style>
