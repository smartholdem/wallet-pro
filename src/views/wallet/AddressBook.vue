<template>
<div>
    <div class="col-xl-12">
      <ul class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">WALLET</router-link></li>
        <li class="breadcrumb-item active">ADDRESS BOOK</li>
      </ul>

      <card>
        <card-header class="card-header fw-bold small text-uppercase">List saved addresses</card-header>
        <card-body>
          {{book}}
        </card-body>

      </card>

    </div>

  <div class="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">MODAL TITLE</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <p>Modal body text goes here.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-outline-theme">Save changes</button>
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
  computed: {
    book() {
      return storeWallet.addressBook;
    }
  }
};
</script>

<style scoped>

</style>
