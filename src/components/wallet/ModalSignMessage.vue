<template>
  <div class="modal fade modal-transfer" id="modalSignMessage">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Crypto Signature Message with Schnorr</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div v-if="currentAddress" class="modal-body">
          <div class="w-100">

            <div class="row">
              <div class="col-md-8">
                <input v-model="message" type="text" class="form-control" id="signMessage"
                       placeholder="enter message">
              </div>
              <div class="col-md-4">
                <button @click="getSig" class="btn btn-outline-success form-control w-100">Get signature</button>
              </div>

            </div>

            <div v-if="signature" class="form-group mt-3">
              <label class="form-label" for="newSignature"
              >Signature</label>
              <textarea
                id="newSignature"
                readonly
                v-model="signature.signature"
                class="form-control"
                rows="3"
              ></textarea>
            </div>
          </div>
        </div>

        <hr/>
        <div class="modal-header">
          <h5 class="modal-title">Validate Signature Message</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div v-if="currentAddress" class="modal-body">
          <div class="w-100">
            <input v-model="message" type="text" class="form-control" id="signMessage"
                   placeholder="enter message">

            <div class="form-group mt-3">
              <label class="form-label" for="currentSig"
              >Signature</label
              >
              <textarea
                id="currentSig"
                v-model="signatureForValidate"
                class="form-control"
                rows="3"
              ></textarea>
              <button @click="validateSig" class="btn btn-outline-success form-control w-100 mt-2">Validate signature</button>
              <p>{{isValid}}</p>
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
  name: "ModalSignMessage",
  props: {
    address: String,
  },
  data() {
    return {
      message: '',
      signature: '',
      signatureForValidate: '',
      isValid: null,
    }
  },
  mounted() {

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
    async getSig() {
      this.signature = await storeWallet.signMessageSchnorr({
        address: this.address,
        message: this.message,
      });
    },
    async validateSig() {
      this.isValid = await storeWallet.validateSigSchnorr({
        address: this.address,
        message: this.message,
        signature: this.signatureForValidate,
      })
    }
  },

};
</script>

<style scoped>

</style>
