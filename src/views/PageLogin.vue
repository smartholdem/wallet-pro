<script>
import { useRouter, RouterLink } from 'vue-router';
import { useAppOptionStore } from '@/stores/app-option';
const appOption = useAppOptionStore();

import { storeToRefs } from 'pinia'
import { useStoreSettings } from '@/stores/app-settings.ts';
const storeSettings = useStoreSettings()
const { settings } = storeToRefs(storeSettings)

export default {
  data() {
    return {
      pinIsValid: false,
      password: "",
    }
  },
	mounted() {
    appOption.appSidebarCollapsed = true;
		appOption.appSidebarHide = true;
		appOption.appHeaderHide = true;
		appOption.appContentClass = 'p-0';
	},
	beforeUnmount() {
    appOption.appSidebarCollapsed = false;
		appOption.appSidebarHide = false;
		appOption.appHeaderHide = false;
		appOption.appContentClass = '';
	},
	methods: {
    pinValidator() {
      const pinIsValid = storeSettings.validatePinCode(this.password);
      if (pinIsValid === true) {
        this.$root.pin = this.password;
        storeSettings.tmpPin = this.password;
        this.$router.push('/');
      }
    },
		submitForm: function() {
      const pinIsValid = storeSettings.validatePinCode(this.password);
      if (pinIsValid) {
        this.$root.pin = this.password;
        storeSettings.tmpPin = this.password;
        this.$router.push('/');
      }
		}
	}
}
</script>
<template>
	<!-- BEGIN login -->
	<div class="login">
		<!-- BEGIN login-content -->
		<div class="login-content">
			<form v-on:submit.prevent="submitForm()" method="POST" name="login_form">
				<h1 class="text-center">Unlock Wallet</h1>
				<div class="text-inverse text-opacity-50 text-center mb-4">
					For your protection, please enter your password.
				</div>
				<div class="mb-3">
					<div class="d-flex">
						<label class="form-label">Password <span class="text-danger">*</span></label>
						<a href="#" class="ms-auto text-inverse text-decoration-none text-opacity-50">Forgot password?</a>
					</div>
					<input autofocus type="password" autocomplete="off" v-model="password" @input="pinValidator" class="form-control form-control-lg bg-white bg-opacity-5" placeholder="" />
				</div>
        <!--
				<div class="mb-3">
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="" id="customCheck1" />
						<label class="form-check-label" for="customCheck1">Remember me</label>
					</div>
				</div>
				-->
				<button :disabled="pinIsValid" type="submit" class="btn btn-outline-theme btn-lg d-block w-100 fw-500 mb-3">Sign In</button>
        <!--
				<div class="text-center text-inverse text-opacity-50">
					Don't have an account yet? <RouterLink to="/page/register">Sign up</RouterLink>.
				</div>
				-->
			</form>
		</div>
		<!-- END login-content -->
	</div>
	<!-- END login -->
</template>
