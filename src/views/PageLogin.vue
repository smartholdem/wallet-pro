<script>
import { useRouter, RouterLink } from "vue-router";
import { useAppOptionStore } from "@/stores/app-option";
const appOption = useAppOptionStore();

import { storeToRefs, getActivePinia } from "pinia";
import { useStoreSettings } from "@/stores/app-settings";

const storeSettings = useStoreSettings();
const { settings } = storeToRefs(storeSettings);

export default {
  data() {
    return {
      pinIsValid: false,
      password: "",
      timerPin: null,
    };
  },
  async created() {
    await storeSettings.updateNodes();
  },
   mounted() {
    appOption.appSidebarCollapsed = true;
    appOption.appSidebarHide = true;
    appOption.appHeaderHide = true;
    appOption.appContentClass = "p-0";

  },
  beforeUnmount() {
    appOption.appSidebarCollapsed = false;
    appOption.appSidebarHide = false;
    appOption.appHeaderHide = false;
    appOption.appContentClass = "";
  },
  methods: {
    async resetAll() {
      getActivePinia()._s.forEach((store) => store.$reset());
      this.$router.push("/register");
    },
    pinValidator() {
      if (this.password.length > 3) {
        clearTimeout(this.timerPin);
        this.timerPin = setTimeout(async () => {
          const pinIsValid = storeSettings.validatePinCode(this.password);
          if (pinIsValid === true) {
            this.pinIsValid = pinIsValid;
            storeSettings.tmpPin = this.password;
            this.$router.push("/");
          }
        }, 120);
      }



    },
    submitForm: function() {
      const pinIsValid = storeSettings.validatePinCode(this.password);
      if (pinIsValid) {
        //this.$root.pin = this.password;
        storeSettings.tmpPin = this.password;
        this.$router.push("/");
      }
    }
  }
};
</script>
<template>
  <!-- BEGIN login -->
  <div class="login">
    <!-- BEGIN login-content -->
    <div class="login-content">

      <form v-on:submit.prevent="submitForm()" method="POST" name="login_form">
        <div class="w-100 text-center mb-2">
          <img class="text-center" src="/logo-green120.png" />
        </div>

        <h1 class="text-center">Unlock Wallet</h1>
        <div class="text-inverse text-opacity-50 text-center mb-4">
          For your protection, please enter your Pin code.
        </div>
        <div class="mb-3">
          <div class="d-flex">
            <label class="form-label" for="loginPassword">{{ $t('pin_code') }} <span class="text-danger">*</span></label>
            <a href="#" data-bs-toggle="modal" data-bs-target="#modalResetAll" class="ms-auto text-inverse text-decoration-none text-opacity-50">Reset all data?</a>
          </div>
          <input id="loginPassword" style="-webkit-text-security:disc;text-security:disc;"
                 autofocus
                 type="text"
                 autocomplete="off"
                 v-model="password"
                 @input="pinValidator"
                 inputmode="numeric"
                 pattern="[0-9]*"
                 enterkeyhint="login"
                 maxlength="16"
                 class="form-control form-control-lg bg-white bg-opacity-5" :class="pinIsValid ? 'is-valid' : ''" placeholder="" />
        </div>
        <!--
				<div class="mb-3">
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="" id="customCheck1" />
						<label class="form-check-label" for="customCheck1">Remember me</label>
					</div>
				</div>
				-->
        <button :disabled="!pinIsValid" type="submit" class="btn btn-outline-theme btn-lg d-block w-100 fw-500 mb-3">Sign
          In
        </button>

        <span v-show="pinIsValid">Loading...</span>
        <!--
				<div class="text-center text-inverse text-opacity-50">
					Don't have an account yet? <RouterLink to="/page/register">Sign up</RouterLink>.
				</div>
				-->
      </form>

      <div class="modal fade" id="modalResetAll">
        <div class="modal-dialog modal-sm">
          <div class="modal-content">
            <card>
              <card-header class="card-header">
                Reset All Data?
              </card-header>
              <card-body>
                <p>Reset all data, keys, address.</p>
                <button @click="resetAll" data-bs-dismiss="modal" type="button" class="btn btn-danger text-uppercase">Confirm reset all data</button>
              </card-body>
            </card>
          </div>
        </div>
      </div>
      <!-- END login-content -->
    </div>
    <!-- END login -->

  </div>
</template>
emplate>
