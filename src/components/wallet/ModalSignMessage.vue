<template>
  <div class="modal fade modal-transfer" id="modalSignMessage">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t("modal_sign_message_title") }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div v-if="currentAddress" class="modal-body">
          <div class="w-100">
            <div class="row">
              <div class="col-md-8">
                <input
                  v-model="message"
                  type="text"
                  class="form-control"
                  id="signMessage"
                  :placeholder="$t('modal_sign_message_placeholder')"
                />
              </div>
              <div class="col-md-4">
                <button
                  @click="getSig"
                  class="btn btn-outline-success form-control w-100"
                >
                  {{ $t("modal_sign_message_get_signature") }}
                </button>
              </div>
            </div>

            <div v-if="signature" class="form-group mt-3">
              <label class="form-label" for="newSignature">{{
                $t("modal_sign_message_signature_label")
              }}</label>
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

        <hr />
        <div class="modal-header">
          <h5 class="modal-title">
            {{ $t("modal_sign_message_validate_title") }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div v-if="currentAddress" class="modal-body">
          <div class="w-100">
            <input
              v-model="message"
              type="text"
              class="form-control"
              id="signMessage"
              :placeholder="$t('modal_sign_message_placeholder')"
            />

            <div class="form-group mt-3">
              <label class="form-label" for="currentSig">{{
                $t("modal_sign_message_signature_label")
              }}</label>
              <textarea
                id="currentSig"
                v-model="signatureForValidate"
                class="form-control"
                rows="3"
              ></textarea>
              <button
                @click="validateSig"
                class="btn btn-outline-success form-control w-100 mt-2"
              >
                {{ $t("modal_sign_message_validate_signature") }}
              </button>
              <p class="text-center mt-2">
                <span v-if="isValid" class="text-uppercase text-success">{{
                  $t("modal_sign_message_valid")
                }}</span>
                <span v-else class="text-uppercase text-danger">{{
                  $t("modal_sign_message_not_valid")
                }}</span>
              </p>
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
      message: "",
      signature: "",
      signatureForValidate: "",
      isValid: null,
    };
  },
  computed: {
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
      });
    },
  },
};
</script>

<style scoped></style>
