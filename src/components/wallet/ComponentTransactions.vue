<!-- Не забудь вынести транзакции в отдельный модуль -->
<template>
  <div class="col-xl-12 mb-3" >
    <card v-if="transactions" style="overflow: hidden;">
      <card-header class="card-header fw-bold small text-uppercase">Transactions</card-header>
      <card-body style="overflow-x: auto;">
        <table class="table table-hover" >
          <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col">Time</th>
            <th scope="col">Amount</th>
            <th scope="col">Sender</th>
            <th scope="col">Recipient</th>
            <th scope="col">Fee</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in transactions.data" :key="item.id" :class="item.confirmations < 8 ? 'table-dark' : ''">
            <td :title="item.id">
                <span :class="item.recipient === this.$route.params.address ? 'text-success' : ''">
                {{ (item.id).slice(0, 5) }} .. {{ (item.id).slice(-5) }}
                </span>
            </td>
            <td>
                <span :class="item.recipient === this.$route.params.address ? 'text-success' : ''">
                {{ tmFormat(item.timestamp.unix, "DD/MM/YY") }}
                <span class="small">{{ format_time(item.timestamp.unix * 1000) }}</span>
                </span>
            </td>
            <td>
                <span :class="item.recipient === this.$route.params.address ? 'text-success' : ''">
                {{ (item.amount / 1e8).toFixed(8) }}
                </span>
            </td>
            <td>
                <span :class="item.recipient === this.$route.params.address ? 'text-success' : ''">
                {{ (item.sender).slice(0, 5) }} .. {{ (item.sender).slice(-5) }}
                </span>
            </td>
            <td><span
              :class="item.recipient === this.$route.params.address ? 'text-success' : ''">{{ (item.recipient).slice(0, 5)
              }} .. {{ (item.recipient).slice(-5) }}</span>
            </td>
            <td><span
              :class="item.recipient === this.$route.params.address ? 'text-success' : ''">{{ (item.fee / 1e8).toFixed(3)
              }}</span>
            </td>
          </tr>
          </tbody>
        </table>
        <div>
          <!--{{ transactions.data }}-->

        </div>
      </card-body>
    </card>
    <card v-if="!transactions">
      <card-header class="card-header fw-bold small">Transactions</card-header>
      <card-body>
        <div>No transactions</div>
      </card-body>
    </card>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useAppOptionStore } from "@/stores/app-option";
const appOption = useAppOptionStore();

import { useStoreWallet } from "@/stores/wallet";
const storeWallet = useStoreWallet();

export default {
  name: "ComponentTransactions",
  props: {
    address: String,
  },
  data() {
    return {
      timerTx: null,
    }
  },
  async beforeCreate() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    var self = this;
    setTimeout(async () => {
      await this.accountUpdate();
    }, 220);
  },
  computed: {
    page() {
      return appOption.currentPage;
    },
    transactions() {
      return storeWallet.transactions[this.address];
    }
  },
  async mounted() {
    if (this.currentAddress) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      var self = this;
      this.timerTx = setTimeout(async function tick() {
        if (self.page === "/address/" + self.$route.params.address) {
          await self.accountUpdate();
          self.timerTx = setTimeout(tick, 21000); // (*)
        } else {
          clearTimeout(self.timerTx);
          console.log("stop timer transactions");
        }
      }, 20000);
    }
  },
  methods: {
    async accountUpdate() {
      await storeWallet.getTransactions(this.address);
    },
  },
};
</script>

<style scoped>

</style>
