<template>
  <div class="col-xl-10">
    <ul class="breadcrumb">
      <li class="breadcrumb-item"><a href="/">WALLET</a></li>
      <li class="breadcrumb-item active">ADDRESSES</li>
    </ul>
    <card>
      <card-header class="card-header fw-bold small"
        >Your Addresses <small> please select, import or get new</small>
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
        <div class="tab-pane fade show active" id="addressList">
          <h6 class="card-subtitle mb-3 text-inverse text-opacity-75">
            Select address
          </h6>
          <addresses>

          </addresses>

          <ul class="list-group list-group-flush">
            <li class="list-group-item" v-for="item in accounts" :key="item.address">
              <div class="btn-group">
                <button @click="openAddress(item.address)" class="btn btn-outline-theme" style="width:350px;">{{item.address}}</button>
                <button type="button" class="btn btn-outline-secondary"><i class="fa fa-clipboard" aria-hidden="true"></i></button>
                <button type="button" class="btn btn-outline-default"><i class="fa fa-trash-o" aria-hidden="true"></i></button>
              </div>
            </li>

          </ul>
        </div>
        <div class="tab-pane fade" id="addressNew">
          <h6 class="card-subtitle mb-3 text-inverse text-opacity-75">
            Get new address
          </h6>
          <button
            @click="getNewAccount"
            type="button"
            class="btn btn-outline-theme"
          >
            Generate new address <i class="fas fa-dice"></i>
          </button>
          <card class="mt-3 p-3">
            <div class="form-group mb-3">
              <label class="form-label" for="newPublicAddress"
                >Public Address</label
              >
              <input
                type="text"
                :value="account.address"
                class="form-control"
                id="newPublicAddress"
                placeholder=""
              />
            </div>
            <div class="form-group mb-3">
              <label class="form-label" for="newPrivateKey">Private Key</label>
              <input
                type="text"
                :value="account.secret"
                class="form-control"
                id="newPrivateKey"
                placeholder=""
              />
            </div>
            <div class="mb-3">
              <button
                @click="saveAccount(account)"
                :disabled="!this.account.address"
                type="submit"
                class="btn btn-outline-theme btn-lg d-block w-25"
              >
                Save address
              </button>
            </div>
          </card>
        </div>
        <div class="tab-pane fade" id="addressImport">
          <h6 class="card-subtitle mb-3 text-inverse text-opacity-75">
            Import address
          </h6>
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
              :value="accountImport.address"
              class="form-control"
              id="importPublicAddress"
              placeholder=""
            />
          </div>
          <div class="mb-3">
            <button
              @click="saveAccount(accountImport)"
              :disabled="!accountImport.address"
              type="submit"
              class="btn btn-outline-theme btn-lg d-block w-25"
            >
              Save address
            </button>
          </div>
        </div>
      </div>
    </card>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useStoreWallet } from "@/stores/wallet";
const store = useStoreWallet();
const { wallet } = storeToRefs(store);

export default {
  name: "WalletPage",
  data() {
    return {
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
  methods: {
    async openAddress(address) {
      await this.$router.push("/address/" + address);
    },
    async getNewAccount() {
      this.account = await store.getNewAddress();
    },
    saveAccount(account) {
      if (account.address.length > 4) {
        let objAddress = {};
        objAddress[account.address] = account;
        store.saveNewAddress(objAddress);
        this.accountImport = {
          address: "",
          secret: ""
        };
        this.account = {
          address: "",
          secret: ""
        }
        this.$router.push("/");
      }
    },
    accountImportFromPassword() {
      if (this.accountImport.secret.length > 4) {
        console.log(this.accountImport.secret)
        this.accountImport.address = store.addressFromPassword(this.accountImport.secret);
      }

    }
  },
};
</script>

<style scoped></style>
