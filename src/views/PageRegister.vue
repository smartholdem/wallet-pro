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
              and <a href="#" data-bs-toggle="modal" data-bs-target="#modalLimitations">Privacy Policy</a>.</label>
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
          <card class="card mb-3">
            <card-header class="card-header">
              Terms and Conditions
            </card-header>

              <card-body class="p-3">
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
              </card-body>

          </card>
          <card class="card">
            <card-header class="card-header">
              Disclaimer of Warranties
            </card-header>

              <card-body>
                <p class="ml-3 small color-brown">20 November 2017</p>
                <p>You agree that your use or inability to use SmartHoldem cryptocoins is carried out solely at your own risk
                  and</p>
                <p>you don't put any responsibility on SmartHoldem Team.</p>
                <p>You agree that your use or inability to use SmartHoldem tokens is carried out solely at your own risk
                  and</p>
                <p>you don't put any responsibility on SmartHoldem Team.</p>
              </card-body>

          </card>
        </div>
      </div>
    </div>

    <div class="modal modal-cover fade" id="modalLimitations">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="card">
            <div class="card-header">
              Disclaimers and Limitation of Liability
            </div>

            <div>
              <div class="card-body">
                <p class="ml-3 small color-brown">20 November 2017</p>
                <p>
                  The Licensed Technology and all other materials and information provided by SmartHoldem (the “SmartHoldem
                  Materials”)
                  are provided on an “as is” and “as available” basis, “with all faults” and without warranty of any kind.
                </p>

                <p>SmartHoldem and its affiliates disclaim all warranties, conditions, common law duties,
                  and representations (express, implied, oral, and written) with respect to the SmartHoldem Materials,
                  including without limitation all express, implied,
                  and statutory warranties and conditions of any kind, such as title, non-interference with your enjoyment,
                  authority,
                  non-infringement, merchantability, fitness or suitability for any purpose
                  (whether or not SmartHoldem knows or has reason to know of any such purpose), system integration,
                  accuracy or completeness, results, reasonable care, workmanlike effort, lack of negligence, and lack of
                  viruses,
                  whether alleged to arise under law, by reason of custom or usage in the trade, or by course of dealing.</p>

                <p class="font-weight-bolder">Without limiting the generality of the foregoing, SmartHoldem and its affiliates make no warranty that</p>

                <ul>
                  <li>(1) any of the SmartHoldem Materials will operate properly, including as integrated in any Product,</li>
                  <li>(2) that the SmartHoldem Materials will meet your requirements,</li>
                  <li>(3) that the operation of the SmartHoldem Materials will be uninterrupted, bug free, or error free in any or all circumstances,</li>
                  <li>(4) that any defects in the SmartHoldem Materials can or will be corrected,</li>
                  <li>(5) that the SmartHoldem Materials are or will be in compliance with a platform manufacturer’s rules or
                    requirements, or</li>
                  <li>(6) that a platform manufacturer will approve any of your Products, or will not revoke approval of any
                    Product for any or no reason.</li>
                </ul>

                <p>
                  Any warranty against infringement that may be provided in the Uniform Code or in any other comparable
                  statute is expressly disclaimed.
                  SmartHoldem and its affiliates do not guarantee continuous, error-free, virus-free,
                  or secure operation of or access to the SmartHoldem Materials.
                  This paragraph will apply to the maximum extent permitted by applicable law.
                </p>

                <p>
                  To the maximum extent permitted by applicable law, neither SmartHoldem, its licensors,
                  nor its or their affiliates, nor any of SmartHoldem’s service providers,
                  shall be liable in any way for loss or damage of any kind resulting from the use
                  or inability to use the SmartHoldem Materials or otherwise in connection with this Agreement,
                  including but not limited to loss of goodwill, work stoppage, computer failure or malfunction,
                  or any and all other commercial damages or losses. In no event will SmartHoldem, its licensors,
                  nor its or their affiliates, nor any of SmartHoldem’s service providers be liable for any loss of profits or
                  any indirect,
                  incidental, consequential, special, punitive, or exemplary damages,
                  or any other damages arising out of or in connection with this Agreement
                  or the SmartHoldem Materials, or the delay or inability to use or lack of functionality of the SmartHoldem
                  Materials,
                  even in the event of SmartHoldem’s or its affiliates’ fault, tort (including negligence), strict liability,
                  indemnity,
                  product liability, breach of contract, breach of warranty,
                  or otherwise and even if SmartHoldem or its affiliates have been advised of the possibility of such damages.
                </p>

                <p>
                  These limitations and exclusions regarding damages apply even if any remedy fails to provide adequate
                  compensation.
                </p>

                <p>
                  Because some states or jurisdictions do not allow the exclusion or the limitation of liability for
                  consequential or incidental damages,
                  in such states or jurisdictions, the liability of SmartHoldem, its licensors, its and their affiliates,
                  and any of SmartHoldem’s service providers shall be limited to the full extent permitted by law.
                </p>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
  <!-- END register -->
</template>
