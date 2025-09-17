<script setup lang="ts">
import { useAppOptionStore } from "@/stores/app-option";
import { useRouter, RouterLink } from "vue-router";
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useStoreSettings } from "@/stores/app-settings.ts";

import Terms_EN from "@/components/terms/Terms_EN.vue";
import Terms_RU from "@/components/terms/Terms_RU.vue";
import Terms_ES from "@/components/terms/Terms_ES.vue";
import Terms_DE from "@/components/terms/Terms_DE.vue";
import Terms_FR from "@/components/terms/Terms_FR.vue";
import Terms_VI from "@/components/terms/Terms_VI.vue";
import Terms_ID from "@/components/terms/Terms_ID.vue";

import Privacy_EN from "@/components/terms/Privacy_EN.vue";
import Privacy_RU from "@/components/terms/Privacy_RU.vue";
import Privacy_ES from "@/components/terms/Privacy_ES.vue";
import Privacy_DE from "@/components/terms/Privacy_DE.vue";
import Privacy_FR from "@/components/terms/Privacy_FR.vue";
import Privacy_VI from "@/components/terms/Privacy_VI.vue";
import Privacy_ID from "@/components/terms/Privacy_ID.vue";

const appOption = useAppOptionStore();
const router = useRouter();
const storeSettings = useStoreSettings();
const { locale } = useI18n();

const pinOne = ref("");
const pinTwo = ref("");

const pinIsInValid = computed(() => {
  return (
    pinOne.value !== pinTwo.value ||
    pinOne.value.length < 4 ||
    pinTwo.value.length < 4
  );
});

const termsComponent = computed(() => {
  switch (locale.value) {
    case "ru":
      return Terms_RU;
    case "es":
      return Terms_ES;
    case "de":
      return Terms_DE;
    case "fr":
      return Terms_FR;
    case "vi":
      return Terms_VI;
    case "id":
      return Terms_ID;
    default:
      return Terms_EN;
  }
});

const privacyComponent = computed(() => {
  switch (locale.value) {
    case "ru":
      return Privacy_RU;
    case "es":
      return Privacy_ES;
    case "de":
      return Privacy_DE;
    case "fr":
      return Privacy_FR;
    case "vi":
      return Privacy_VI;
    case "id":
      return Privacy_ID;
    default:
      return Privacy_EN;
  }
});

onMounted(() => {
  appOption.appSidebarCollapsed = true;
  appOption.appSidebarHide = true;
  appOption.appHeaderHide = true;
  appOption.appContentClass = "p-0";
});

onBeforeUnmount(() => {
  appOption.appSidebarCollapsed = false;
  appOption.appSidebarHide = false;
  appOption.appHeaderHide = false;
  appOption.appContentClass = "";
});

function submitForm() {
  storeSettings.savePinCode(pinOne.value);
  storeSettings.tmpPin = pinOne.value;
  router.push("/");
}

function setLocale(lang: string) {
  locale.value = lang;
  storeSettings.updateSettings({ language: lang });
}
</script>
<template>
  <!-- BEGIN register -->
  <div class="register">
    <!-- BEGIN register-content -->
    <div class="register-content">
      <form
        v-on:submit.prevent="submitForm()"
        method="POST"
        name="register_form"
      >
        <div class="w-100 text-center mb-2">
          <img
            class="text-center"
            src="/logo-green120.png"
            alt="smartholdem logo green"
          />
        </div>
        <h1 class="text-center">Sign Up</h1>
        <p class="text-inverse text-opacity-50 text-center">
          {{ $t("set_wallet_pin") }}
        </p>
        <div class="mb-3">
          <label class="form-label" for="regPassword1"
            >Pin code <span class="text-danger">*</span></label
          >
          <input
            style="-webkit-text-security: disc; text-security: disc"
            type="text"
            autofocus
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="16"
            id="regPassword1"
            autocomplete="off"
            v-model="pinOne"
            @input="
              pinIsInValid =
                pinOne !== pinTwo || pinOne.length < 4 || pinTwo.length < 4
            "
            class="form-control form-control-lg bg-white bg-opacity-5"
          />
        </div>
        <div class="mb-3">
          <label class="form-label" for="regPassword2"
            >{{ $t("confirm_pin_code") }}
            <span class="text-danger">*</span></label
          >
          <input
            style="-webkit-text-security: disc; text-security: disc"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            enterkeyhint="done"
            maxlength="16"
            id="regPassword2"
            autocomplete="off"
            v-model="pinTwo"
            @input="
              pinIsInValid =
                pinOne !== pinTwo || pinOne.length < 4 || pinTwo.length < 4
            "
            class="form-control form-control-lg bg-white bg-opacity-5"
          />
        </div>

        <div class="mb-3">
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              value=""
              id="customCheck1"
            />
            <label class="form-check-label" for="customCheck1"
              >{{ $t("i_have_read_and_agree") }}
              <a href="#" data-bs-toggle="modal" data-bs-target="#modalTerms">{{
                $t("terms_of_use")
              }}</a>
              {{ $t("and") }}
              <a
                href="#"
                data-bs-toggle="modal"
                data-bs-target="#modalLimitations"
                >{{ $t("privacy_policy") }}</a
              >.</label
            >
          </div>
        </div>
        <div class="mb-3 d-flex">
          <button
            :disabled="pinIsInValid"
            type="submit"
            class="btn btn-outline-theme btn-lg d-block w-100"
          >
            {{ $t("sign_up") }}
          </button>
          <div class="ms-2 dropdown">
            <a
              href="#"
              data-bs-toggle="dropdown"
              class="btn btn-outline-theme btn-lg"
            >
              <i class="fa fa-language"></i>
            </a>
            <div class="dropdown-menu dropdown-menu-end">
              <a @click.prevent="setLocale('en')" href="#" class="dropdown-item"
                >English</a
              >
              <a @click.prevent="setLocale('ru')" href="#" class="dropdown-item"
                >Русский</a
              >
              <a @click.prevent="setLocale('es')" href="#" class="dropdown-item"
                >Español</a
              >
              <a @click.prevent="setLocale('de')" href="#" class="dropdown-item"
                >Deutsch</a
              >
              <a @click.prevent="setLocale('fr')" href="#" class="dropdown-item"
                >Français</a
              >
              <a @click.prevent="setLocale('vi')" href="#" class="dropdown-item"
                >Tiếng Việt</a
              >
              <a @click.prevent="setLocale('id')" href="#" class="dropdown-item"
                >Bahasa Indonesia</a
              >
            </div>
          </div>
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
          <button
            type="button"
            class="btn-close position-absolute top-0 end-0 m-2"
            style="z-index: 1060"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
          <component :is="termsComponent" />
        </div>
      </div>
    </div>

    <div class="modal modal-cover fade" id="modalLimitations">
      <div class="modal-dialog">
        <div class="modal-content">
          <button
            type="button"
            class="btn-close position-absolute top-0 end-0 m-2"
            style="z-index: 1060"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
          <component :is="privacyComponent" />
        </div>
      </div>
    </div>
  </div>
  <!-- END register -->
</template>
ate>
