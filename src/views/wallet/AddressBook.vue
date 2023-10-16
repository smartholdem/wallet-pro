<template>
<div>
    <div class="col-xl-12">
      <ul class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">WALLET</router-link></li>
        <li class="breadcrumb-item active">ADDRESS BOOK</li>
      </ul>

      <card>
        <card-header class="card-header fw-bold small text-uppercase">
          <button data-bs-toggle="modal" data-bs-target="#modalAddressBook"
                  type="button"
                  class="btn btn-sm btn-light">ADD NEW ADDRESS
          </button>
        </card-header>
        <card-body>

          {{book}}
        </card-body>

      </card>

    </div>

  <div class="modal fade" id="modalAddressBook">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">ADD NEW ADDRESS</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">

          <div class="form-group mb-3">
            <label class="form-label" for="bookAddress">Address</label>
            <input v-model="toSave.address" @input="validateAddress" type="text" class="form-control form-control-sm" :class="isValid ? 'is-valid' : 'is-invalid'" id="bookAddress"
                   placeholder="enter address">
          </div>

          <div class="form-group mb-3">
            <label class="form-label" for="bookLabel"><i class="fas fa-tag"></i> Label</label>
            <input v-model="toSave.label" type="text" class="form-control form-control-sm" :class="toSave.label.length > 0 ? 'is-valid' : 'is-invalid'" id="bookLabel"
                   placeholder="enter label">
          </div>

          <div class="col-md-3">
            <div class="form-group mb-3" >
              <label class="form-label px-4" :class="'ico-' + selectedNetwork" for="sendNetwork" >Network</label>
              <select v-model="selectedNetwork" @change="validateAddress" class="form-select form-select-sm" id="sendNetwork">
                <option selected value="mainnet">MainNet</option>
                <option value="bsc">BSC</option>
                <option value="heco">HECO</option>
                <option value="eth">Ethereum</option>
              </select>
            </div>
          </div>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-bs-dismiss="modal">Close</button>
          <button @click="saveAddress" type="button" class="btn btn-outline-theme" data-bs-dismiss="modal">Save changes</button>
        </div>
      </div>
    </div>
  </div>

</div>

</template>

<script>
import { storeToRefs } from "pinia";
import { useStoreWallet } from "@/stores/wallet";
const storeWallet = useStoreWallet();
const { addressBook } = storeToRefs(storeWallet);

export default {
  name: "AddressBook",
  data() {
    return {
      toSave: {
        network: 'mainnet',
        label: '',
        address: '',
      },
      selectedNetwork: 'mainnet',
      isValid: false,
    }
  },
  computed: {
    book() {
      return storeWallet.addressBook;
    }
  },
  methods: {
    async saveAddress() {
      await storeWallet.addInAddressBook(this.toSave)
    },
    async validateAddress() {
      if (this.selectedNetwork === 'mainnet') {
        this.isValid = await storeWallet.validateAddress(this.toSave.address);
      } else {
        this.isValid = await storeWallet.validateAddressCrossChain(this.toSave.address);
      }
    },
  }
};
</script>

<style scoped>

</style>
