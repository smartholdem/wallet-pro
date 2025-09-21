<template>
  <div>
    <div class="col-xl-12">
      <ul class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/">{{ $t("wallet") }}</router-link>
        </li>
        <li class="breadcrumb-item active">{{ $t("address_book") }}</li>
      </ul>

      <card class="overflow-hidden">
        <card-header class="card-header fw-bold small text-uppercase">
          <button
            data-bs-toggle="modal"
            data-bs-target="#modalAddressBook"
            type="button"
            class="btn btn-sm btn-light"
          >
            <i class="fas fa-lg fa-fw me-2 fa-address-card"></i> {{ $t("add_new_address") }}
          </button>
        </card-header>
        <card-body>
          <table class="table table-hover table-stripped">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">#</th>
                <th scope="col">{{ $t("label") }}</th>
                <th scope="col">{{ $t("address") }}</th>
                <th scope="col">{{ $t("actions") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in book" :key="item.address">
                <td>
                  <button @click="copyAddress(item.address)" type="button" class="btn btn-sm btn-outline"><i class="fa fa-copy"></i></button>
                </td>
                <td class="text-uppercase">
                  <span :class="'pb-2 px-3 py-0 ico-' + item.network"></span>
                  {{ item.network }}
                </td>
                <td>{{ item.label }}</td>
                <td>{{ item.address }}</td>
                <td>
                  <div class="btn-group">
                    <button @click="deleteAddress(item.address)" type="button" class="btn btn-sm btn-outline text-danger"><i class="fa fa-trash-o"></i></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </card-body>
      </card>
    </div>

    <div class="modal fade" id="modalAddressBook">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ $t("add_new_address") }}</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="form-group mb-3">
              <label class="form-label" for="bookAddress">{{ $t("address") }}</label>
              <input
                v-model="toSave.address"
                @input="validateAddress"
                type="text"
                class="form-control form-control-sm"
                :class="isValid ? 'is-valid' : 'is-invalid'"
                id="bookAddress"
                :placeholder="$t('enter_address')"
              />
            </div>

            <div class="form-group mb-3">
              <label class="form-label" for="bookLabel"
                ><i class="fas fa-tag"></i> {{ $t("label") }}</label
              >
              <input
                v-model="toSave.label"
                type="text"
                class="form-control form-control-sm"
                :class="toSave.label.length > 0 ? 'is-valid' : 'is-invalid'"
                id="bookLabel"
                :placeholder="$t('enter_label')"
              />
            </div>

            <div class="col-md-4">
              <div class="form-group mb-3">
                <label
                  class="form-label px-4"
                  :class="'ico-' + toSave.network"
                  for="sendNetwork"
                  >{{ $t("network") }}</label
                >
                <select
                  v-model="toSave.network"
                  @change="validateAddress"
                  class="form-select form-select-sm"
                  id="sendNetwork"
                >
                  <option selected value="mainnet">{{ $t("mainnet") }}</option>
                  <option value="bsc">{{ $t("bsc") }}</option>
                  <option value="ton">TON Network</option>
                  <option value="eth">{{ $t("ethereum") }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-default"
              data-bs-dismiss="modal"
            >
              {{ $t("close") }}
            </button>
            <button
              @click="saveAddress"
              type="button"
              class="btn btn-outline-theme"
              data-bs-dismiss="modal"
            >
              {{ $t("save_changes") }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div
          class="toast fade hide mb-3"
          id="toast-address-book"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
      >
        <div class="toast-header text-info">
          <i class="far fa-bell me-2 text-info"></i>
          <strong class="me-auto">{{ $t("address_book") }}</strong>
          <button
              type="button"
              class="btn-close"
              data-bs-dismiss="toast"
          ></button>
        </div>
        <div class="toast-body">
          {{ notifyMsg }}
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useStoreWallet } from "@/stores/wallet";
import { Toast } from "bootstrap";

const storeWallet = useStoreWallet();
const { addressBook } = storeToRefs(storeWallet);

export default {
  name: "AddressBook",
  data() {
    return {
      toSave: {
        network: "mainnet",
        label: "",
        address: "",
      },
      isValid: false,
      notifyMsg: "",
    };
  },
  computed: {
    book() {
      return storeWallet.addressBook;
    },
  },
  methods: {
    showToast(msg) {
      this.notifyMsg = msg;
      const toast = new Toast(document.getElementById('toast-address-book'));
      toast.show();
    },
    async deleteAddress(address) {
      await storeWallet.deleteFromAddressBook(address);
      this.showToast(this.$t('deleted'));
    },
    async copyAddress(address) {
      await navigator.clipboard.writeText(address);
      this.showToast(this.$t('copied_to_clipboard'));
    },
    async saveAddress() {
      await storeWallet.addInAddressBook(this.toSave);
      this.toSave = {
        network: "mainnet",
        label: "",
        address: "",
      };
    },
    async validateAddress() {
      if (this.toSave.network === "mainnet") {
        this.isValid = await storeWallet.validateAddress(this.toSave.address);
      } else {
        this.isValid = await storeWallet.validateAddressCrossChain(
          this.toSave.address
        );
      }
    },
  },
};
</script>

<style scoped></style>
