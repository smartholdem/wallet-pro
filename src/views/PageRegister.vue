<script>
import { useAppOptionStore } from "@/stores/app-option";
//import { useRouter, RouterLink } from "vue-router";
const appOption = useAppOptionStore();

import { storeToRefs } from 'pinia';
import { useStoreSettings } from '@/stores/app-settings.ts';
const store = useStoreSettings();
const { settings } = storeToRefs(store);


export default {
  data() {
    return {
      pinOne: "",
      PinTwo: "",
      pinIsInValid: true,
    }
  },
  mounted() {
    appOption.appSidebarHide = true;
    appOption.appHeaderHide = true;
    appOption.appContentClass = "p-0";
  },
  beforeUnmount() {
    appOption.appSidebarHide = false;
    appOption.appHeaderHide = false;
    appOption.appContentClass = "";
  },
  methods: {
    submitForm: function() {
      store.savePinCode(this.pinOne);
      this.$router.push("/login");
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
        <h1 class="text-center">Sign Up</h1>
        <p class="text-inverse text-opacity-50 text-center">Set Wallet Password</p>
        <div class="mb-3">
          <label class="form-label">Password <span class="text-danger">*</span></label>
          <input type="password" v-model="pinOne" @input="pinIsInValid = pinOne !== pinTwo || (pinOne.length < 4 || pinTwo.length < 4)" class="form-control form-control-lg bg-white bg-opacity-5" />
        </div>
        <div class="mb-3">
          <label class="form-label">Confirm Password <span class="text-danger">*</span></label>
          <input type="password" v-model="pinTwo" @input="pinIsInValid = pinOne !== pinTwo || (pinOne.length < 4 || pinTwo.length < 4)" class="form-control form-control-lg bg-white bg-opacity-5" />
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
