<template>
  <div class="col-xl-10">
    <card>
      <card-header class="card-header fw-bold small"
        >List of your accounts
      </card-header>
      <ul class="nav nav-tabs pt-3 ps-4 pe-4">
        <li class="nav-item me-1">
          <a href="#addressList" class="nav-link active" data-bs-toggle="tab"
            >Accounts</a
          >
        </li>
        <li class="nav-item me-1">
          <a href="#addressNew" class="nav-link" data-bs-toggle="tab">New</a>
        </li>
        <li class="nav-item me-1">
          <a href="#addressImport" class="nav-link" data-bs-toggle="tab"
            >Import</a
          >
        </li>
      </ul>
      <div class="tab-content p-4">
        <!-- list -->
        <div
          class="tab-pane fade"
          :class="tabActive === 0 ? 'show active' : ''"
          id="addressList"
        >

          <table class="table table-borderless">
            <thead>
            <tr v-for="item in listAddresses"
                :key="item.address">
              <td>
                <button
                  @click="openAddress(item.address)"
                  class="btn btn-outline-theme mb-2"
                  :style="!isMobile ? 'width: 336px' : 'width: 125px'"
                >
                  <AddressComponent :address="item.address"/>
                </button>&nbsp;
                <div class="btn-group mb-2">
                  <!--
                  <button type="button" class="btn btn-outline-secondary">
                    <i class="fa fa-clipboard" aria-hidden="true"></i>
                  </button>
                  -->
                  <button
                    @click="deleteAddress(item.address)"
                    type="button"
                    class="btn btn-outline-default"
                  >
                    <i class="fa fa-trash-o" aria-hidden="true"></i>
                  </button>
                  <button
                    @click="decryptSecret(item.address)"
                    type="button"
                    class="btn btn-outline-default"
                    data-bs-toggle="modal" data-bs-target="#modalDecrypt"
                  >
                    <i class="fa fa-key" aria-hidden="true"></i>
                  </button>
                  <!--
                  <button type="button" class="btn btn-outline-secondary">
                    <i class="fa fa-clipboard" aria-hidden="true"></i>
                  </button>
                  -->
                </div>

              </td>
            </tr>
            </thead>
          </table>

          <div class="alert alert-light">
            Please select, import or get new address
          </div>

          <div v-if="!Object.keys(listAddresses)" class="alert alert-info">
            No addresses. Import or create new address.
          </div>

        </div>
        <!-- new -->
        <div
          class="tab-pane fade"
          :class="tabActive === 1 ? 'show active' : ''"
          id="addressNew"
        >
          <button
            @click="getNewAccount"
            type="button"
            class="btn btn-outline-theme"
          >
            Generate new address <i class="fas fa-dice"></i>
          </button>

          <div class="mt-3">
            <div class="form-group mb-3">
              <label class="form-label" for="newPublicAddress">Public Address</label>
              <input
                type="text"
                readonly
                :value="account.address"
                class="form-control"
                id="newPublicAddress"
                placeholder=""
              />
            </div>
            <div class="form-group mb-3">
              <label class="form-label" for="newPrivateKey">Private Key</label>
              <textarea id="newPrivateKey" readonly v-model="account.secret" class="form-control" rows="3"></textarea>
            </div>
            <div class="form-group mb-3">
              <div class="row">
                <div class="col-md-4">
                  <label class="form-label" for="encrypted">Encrypted methods</label>
                  <select v-model="encryptedAlgo" class="form-select form-select-sm" id="encrypted">
                    <option selected="selected" value="aes">AES256</option>
                    <option value="rabbit">Rabbit</option>
                  </select>
                </div>
              </div>
            </div>
            <button
              @click="saveAccount(account)"
              :disabled="!this.account.address"
              type="submit"
              class="btn btn-outline-theme btn-lg d-block"
            >
              Save address
            </button>

          </div>
        </div>
        <!-- import -->
        <div
          class="tab-pane fade"
          :class="tabActive === 2 ? 'show active' : ''"
          id="addressImport"
        >
          <div class="form-group mb-3">
            <label class="form-label" for="importPrivateKey">Enter Private Key</label>
            <input
              type="text"
              v-model="accountImport.secret"
              @input="accountImportFromPassword()"
              class="form-control"
              id="importPrivateKey"
              placeholder="bip39 12 words"
            />
          </div>
          <div class="form-group mb-3">
            <label class="form-label" for="importPublicAddress"
            >Public Address</label
            >
            <input
              type="text"
              readonly
              :value="accountImport.address"
              class="form-control"
              id="importPublicAddress"
              placeholder=""
            />
          </div>
          <div class="form-group mb-3">
            <div class="row">
              <div class="col-md-4">
                <label class="form-label" for="encryptedImport">Encrypted methods</label>
                <select v-model="encryptedAlgo" class="form-select form-select-sm" id="encryptedImport">
                  <option selected="selected" value="aes">AES256</option>
                  <option value="rabbit">Rabbit</option>
                </select>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <button
              @click="saveAccount(accountImport)"
              :disabled="!accountImport.address"
              type="submit"
              class="btn btn-outline-theme btn-lg d-block"
            >
              Save address
            </button>
          </div>
        </div>
      </div>
    </card>
    <div class="modal modal-cover fade" id="modalDecrypt">
      <div class="modal-dialog">
        <div class="modal-content text-danger">
          {{decryptedSecret}}
        </div>
      </div>
    </div>
    <!-- toasts-container -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div class="toast fade hide mb-3" data-autohide="false" id="toast-1" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <i class="far fa-bell text-muted me-2"></i>
          <strong class="me-auto">Address</strong>
          <small>Success</small>
          <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
          {{notifyMsg}}
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useStoreWallet } from "@/stores/wallet";
const store = useStoreWallet();
const { wallet } = storeToRefs(store);

import { useAppOptionStore } from "@/stores/app-option";
const appOption = useAppOptionStore();

import { useStoreSettings } from "@/stores/app-settings.ts";
const storeSettings = useStoreSettings();

import CryptoJS from "crypto-js";
import { Toast } from "bootstrap";
import AddressComponent from "@/components/wallet/ComponentAddress.vue";

export default {
  name: "WalletPage",
  components: {
    AddressComponent: AddressComponent,
  },
  data() {
    return {
      encryptedAlgo: 'aes',
      isMobile: appOption.isMobile,
      timerPassword: null,
      decryptedSecret: "",
      notifyMsg: "",
      tabActive: 0,
      accounts: store.accounts,
      checks: {
        agree: false,
        lose: false,
      },
      isBip39: null,
      account: {
        address: "",
        secret: "",
      },
      accountImport: {
        address: "",
        secret: "",
      },
    };
  },
  computed: {
    listAddresses() {
      return store.accounts;
    },
  },
  methods: {
    async decryptSecret(address) {
      console.log('decrypt', address)
      //this.decryptedSecret = await store.addressDecrypt(this.listAddresses[address].secret);
      this.decryptedSecret = await store.decryptByAddress(address);
    },
    showToast(event, target, msg) {
      event.preventDefault();
      this.notifyMsg = msg;
      const toast = new Toast(document.getElementById(target));
      toast.show();
    },
    async deleteAddress(address) {
      await store.addressDelete(address);
      this.showToast(event, 'toast-1', 'Deleted')
    },
    async openAddress(address) {
      await this.$router.push("/address/" + address);
    },
    async getNewAccount() {
      this.account = await store.addressNew();
    },
    saveAccount(account) {


      if (account.address.length > 4) {
        const objAddress = {};
        const hash = CryptoJS.SHA384(storeSettings.tmpPin).toString();
        let encryptedSecret = '';
        if (this.encryptedAlgo === 'rabbit') {
          encryptedSecret = (CryptoJS.Rabbit.encrypt(account.secret, storeSettings.tmpPin + hash)).toString();
        } else {
          encryptedSecret = (CryptoJS.AES.encrypt(account.secret, storeSettings.tmpPin + hash)).toString();
        }
        objAddress[account.address] = {
          address: account.address,
          secret: encryptedSecret,
          encrypt: this.encryptedAlgo,
        };
        store.addressSave(objAddress);
        if (this.accountImport.address) {
          this.showToast(event, 'toast-1', 'Imported')
        }
        if (this.account.address) {
          this.showToast(event, 'toast-1', 'Created')
        }
        this.accountImport = {
          address: "",
          secret: "",
        };
        this.account = this.accountImport;
        this.tabActive = 0;
      }
    },
    accountImportFromPassword() {
      clearTimeout(this.timerPassword);
      if (this.accountImport.secret.length > 7) {
        this.timerPassword = setTimeout(async () => {
          const account = store.addressFromPassword(this.accountImport.secret);
          this.accountImport.address = account.address;
        }, 200);
      }
    },
  },

};
</script>

<style scoped></style>
