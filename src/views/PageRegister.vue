<script>
import { useAppOptionStore } from "@/stores/app-option";
import { useRouter, RouterLink } from "vue-router";
const appOption = useAppOptionStore();

import { storeToRefs } from 'pinia';
import { useStoreSettings } from '@/stores/app-settings.ts';
const storeSettings = useStoreSettings();
const { settings } = storeToRefs(storeSettings);


export default {
  data() {
    return {
      pinOne: "",
      PinTwo: "",
      pinIsInValid: true,
    }
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
    submitForm: function() {
      storeSettings.savePinCode(this.pinOne);
      storeSettings.tmpPin = this.password;
      this.$router.push("/");
    },

  }
};
</script>
<template>
  <!-- BEGIN register -->
  <div class="register">
    <!-- BEGIN register-content -->
    <div class="register-content">
      <form v-on:submit.prevent="submitForm()" method="POST" name="register_form">
        <div class="w-100 text-center mb-2">
          <img class="text-center" src="/logo-green120.png" alt="smartholdem logo green"/>
        </div>
        <h1 class="text-center">Sign Up</h1>
        <p class="text-inverse text-opacity-50 text-center">Set Wallet Pin Code</p>
        <div class="mb-3">
          <label class="form-label" for="regPassword1">Pin code <span class="text-danger">*</span></label>
          <input style="-webkit-text-security:disc;text-security:disc;" type="text" id="regPassword1" autocomplete="off" v-model="pinOne" @input="pinIsInValid = pinOne !== pinTwo || (pinOne.length < 4 || pinTwo.length < 4)" class="form-control form-control-lg bg-white bg-opacity-5" />
        </div>
        <div class="mb-3">
          <label class="form-label" for="regPassword2">Confirm pin code <span class="text-danger">*</span></label>
          <input style="-webkit-text-security:disc;text-security:disc;" type="text" id="regPassword2" autocomplete="off" v-model="pinTwo" @input="pinIsInValid = pinOne !== pinTwo || (pinOne.length < 4 || pinTwo.length < 4)" class="form-control form-control-lg bg-white bg-opacity-5" />
        </div>

        <div class="mb-3">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="customCheck1" />
            <label class="form-check-label" for="customCheck1">I have read and agree to the <a href="#" data-bs-toggle="modal" data-bs-target="#modalTerms">Terms of Use</a>
              and <a href="#">Privacy Policy</a>.</label>
          </div>
        </div>
        <div class="mb-3">
          <button :disabled="pinIsInValid" type="submit" class="btn btn-outline-theme btn-lg d-block w-100">Sign Up</button>
        </div>
        <!--
        <div class="text-inverse text-opacity-50 text-center">
          Already have password?
          <RouterLink to="/page/login">Sign In</RouterLink>
        </div>
        -->
      </form>
    </div>
    <!-- END register-content -->

    <div class="modal modal-cover fade" id="modalTerms">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="card">
            <div class="card-header">
              <h1 class="text-center">Terms and Conditions</h1>
            </div>
            <div>
              <div class="card-body p-3">
                <p class="ml-3 small color-brown">20 November 2017</p>
                <p>
                  Technologies related to blockchain are subject to supervision and control by various regulatory bodies
                  around the world.
                </p>
                <p>SmartHoldem tokens may fall under one or more requests or actions on their part, including but not limited
                  to imposing restrictions on the use or possession of digital tokens such as SmartHoldem that can slow or
                  limit the functionality of SmartHoldem tokens in the future.</p>
                <p>
                  SmartHoldem tokens are not an investment.
                </p>
                <p>
                  SmartHoldem tokens are not a “surrogate currency”.
                </p>
                <p>
                  SmartHoldem tokens are not official or legally binding investment. Due to unforeseen circumstances, the
                  objectives described in this document may be amended. Despite the fact that we intend to reach all the
                  points described in this document, all persons and parties involved in the purchase of SmartHoldem tokens
                  do this at their own risk.
                </p>
                <p>
                  <span class="font-weight-bold">The risk of using new technologies.</span><br>
                  Cryptographic tokens, such as SmartHoldem, are a new and experimental technology. In addition to the
                  risks mentioned in this document, there are additional risks that the SmartHoldem team can not foresee.
                  These risks can materialize in other forms of risk than those specified here.
                </p>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h1>Disclaimer of Warranties</h1>
            </div>
            <div>
              <div class="card-body">
                <p class="ml-3 small color-brown">20 November 2017</p>
                <p>You agree that your use or inability to use SmartHoldem cryptocoins is carried out solely at your own risk
                  and</p>
                <p>you don't put any responsibility on SmartHoldem Team.</p>
                <p>You agree that your use or inability to use SmartHoldem tokens is carried out solely at your own risk
                  and</p>
                <p>you don't put any responsibility on SmartHoldem Team.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
  <!-- END register -->
</template>
