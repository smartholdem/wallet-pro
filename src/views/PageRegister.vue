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
        <p class="text-inverse text-opacity-50 text-center">Set Wallet Password</p>
        <div class="mb-3">
          <label class="form-label" for="regPassword1">Password <span class="text-danger">*</span></label>
          <input style="-webkit-text-security:disc;text-security:disc;" type="text" id="regPassword1" autocomplete="off" v-model="pinOne" @input="pinIsInValid = pinOne !== pinTwo || (pinOne.length < 4 || pinTwo.length < 4)" class="form-control form-control-lg bg-white bg-opacity-5" />
        </div>
        <div class="mb-3">
          <label class="form-label" for="regPassword2">Confirm Password <span class="text-danger">*</span></label>
          <input style="-webkit-text-security:disc;text-security:disc;" type="text" id="regPassword2" autocomplete="off" v-model="pinTwo" @input="pinIsInValid = pinOne !== pinTwo || (pinOne.length < 4 || pinTwo.length < 4)" class="form-control form-control-lg bg-white bg-opacity-5" />
        </div>

        <div class="mb-3">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="customCheck1" />
            <label class="form-check-label" for="customCheck1">I have read and agree to the <a href="#">Terms of Use</a>
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
  </div>
  <!-- END register -->
</template>
