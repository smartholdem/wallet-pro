<script>
import { useAppOptionStore } from "@/stores/app-option";
import { useRouter, RouterLink } from "vue-router";

const appOption = useAppOptionStore();

export default {
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
      this.$router.push("/");
    }
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
        <p class="text-inverse text-opacity-50 text-center">Set Password.</p>
        <div class="mb-3">
          <label class="form-label">Password <span class="text-danger">*</span></label>
          <input type="password" class="form-control form-control-lg bg-white bg-opacity-5" value="" />
        </div>
        <div class="mb-3">
          <label class="form-label">Confirm Password <span class="text-danger">*</span></label>
          <input type="password" class="form-control form-control-lg bg-white bg-opacity-5" value="" />
        </div>

        <div class="mb-3">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="customCheck1" />
            <label class="form-check-label" for="customCheck1">I have read and agree to the <a href="#">Terms of Use</a>
              and <a href="#">Privacy Policy</a>.</label>
          </div>
        </div>
        <div class="mb-3">
          <button type="submit" class="btn btn-outline-theme btn-lg d-block w-100">Sign Up</button>
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
