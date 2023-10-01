<template>
  <div class="row justify-content-center">
    <div class="col-xl-6 mb-3">

      <card class="h-100" v-if="currentAddress">
        <card-header class="card-header fw-bold">
          <i v-if="currentAddress.publicKey" @click="showPubKey = !showPubKey" class="m-lg-2 fa fa-globe"
             aria-hidden="true"> </i>
          <span v-if="!showPubKey" class="text-info">
            {{ $route.params.address }}
          </span>
          <span v-if="showPubKey && currentAddress.publicKey" class="text-info">
            {{ currentAddress.publicKey }}
          </span>
        </card-header>
        <card-body>
          <div v-if="currentAddress.publicKey">
            <h5 class="card-title">Balance <span class="text-success">{{ (currentAddress.balance / 10 ** 8).toFixed(8)
              }}</span> STH</h5>

            <p v-if="currentAddress.attributes" class="card-text mb-3">

            </p>


            <card v-if="currentAddress.attributes.delegate">
              <card-header class="card-header fw-bold">
                Delegate <span class="text-info">{{ currentAddress.attributes.delegate.username }}</span>
              </card-header>
              <card-body>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">Rank {{ currentAddress.attributes.delegate.rank }}</li>
                  <li class="list-group-item">
                    Vote balance {{ (currentAddress.attributes.delegate.voteBalance / 10 ** 8).toFixed(8) }} STH
                  </li>
                  <li class="list-group-item">Forged fees
                    {{ (currentAddress.attributes.delegate.forgedFees / 10 ** 8).toFixed(8) }} STH
                  </li>
                  <li class="list-group-item">Produced blocks {{ currentAddress.attributes.delegate.producedBlocks }}
                  </li>
                </ul>
              </card-body>
            </card>

          </div>
          <div else>
            <h5 class="card-title">Balance <span class="text-success">0</span> STH</h5>
          </div>
        </card-body>
      </card>


    </div>

    <div class="col-xl-6 mb-3">
      <card class="h-100">
        <card-header class="card-header fw-bold">
          OPERATIONS
        </card-header>
        <card-body>
          <div class="btn-group mb-3">
            <button @click="operation = 1" type="button" class="btn btn-outline-theme">SEND STH <i class="fa fa-rocket" aria-hidden="true"></i>
            </button>
          </div>

          <div v-if="operation === 1" class="w-100">
            здесь заполню форму
          </div>


        </card-body>
      </card>
    </div>

  </div>
  <div class="row justify-content-center">
    <div class="col-xl-12 mb-3">
      <card>
        <card-header class="card-header fw-bold small">Transactions</card-header>
        <card-body v-if="transactions.meta">
          {{transactions}}
        </card-body>
        <card-body else class="text-center">
          No transaction
        </card-body>
      </card>
    </div>

  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useStoreWallet } from "@/stores/wallet";

const storeWallet = useStoreWallet();
const { attributes } = storeToRefs(storeWallet);

export default {
  name: "AddressPage",
  data() {
    return {
      operation: 0,
      showPubKey: false,
      account: { }
    };
  },
  async created() {
    await storeWallet.getAttributes(this.$route.params.address);
    await storeWallet.getTransactions(this.$route.params.address);
  },
  watch: {
    storeWallet: function (val) {
      this.account = val.attributes[this.$route.params.address]
    },
  },
  computed: {
    currentAddress() {
      return storeWallet.attributes[this.$route.params.address];
      //return attributes.value[this.$route.params.address];
    },
    transactions() {
      return storeWallet.transactions[this.$route.params.address];
    },
  },

};
</script>

<style scoped></style>
