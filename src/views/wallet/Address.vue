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
            <h5 class="card-title">BALANCE <span class="text-success">{{ (currentAddress.balance / 10 ** 8).toFixed(8)
              }}</span> STH</h5>
            <div v-if="currentAddress.attributes">
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
          </div>
        </card-body>
      </card>
      <card class="h-100" v-if="!currentAddress">
        <card-header class="card-header fw-bold">
          {{ $route.params.address }}
        </card-header>
        <card-body>
          <h3>Cold Address</h3>
        </card-body>
      </card>
    </div>

    <!-- operations -->
    <div class="col-xl-6 mb-3">
      <card class="h-100">
        <card-header class="card-header fw-bold">
          OPERATIONS
        </card-header>
        <card-body>
          <div class="btn-group mb-3">
            <button @click="operation = 1" type="button" class="btn btn-outline-theme">
              SEND STH <i class="fa fa-rocket" aria-hidden="true"></i>
            </button>
            <button disabled="true" type="button" class="btn btn-outline-theme">
              <i class="fas fa-lg fa-fw fa-qrcode" aria-hidden="true"></i>
            </button>
            <button @click="decryptSecret()" data-bs-toggle="modal" data-bs-target="#modalDecryptAddress" type="button"
                    class="btn btn-outline-theme">
              <i class="fa fa-key" aria-hidden="true"></i>
            </button>
            <button disabled="true" @click="operation = 2" type="button" class="btn btn-outline-theme">
              2nd PWD
            </button>
            <button disabled="true" @click="operation = 2" type="button" class="btn btn-outline-theme">
              DELEGATE REG
            </button>


          </div>

          <!-- send sth -->
          <div v-if="operation === 1" class="w-100">
            <div class="row">
              <div class="col-10">
                <div class="form-group mb-3">
                  <label class="form-label" for="sendRecipient">Recipient</label>
                  <input type="text" class="form-control form-control-sm" id="sendRecipient"
                         placeholder="Enter STH address">
                </div>
              </div>
              <div class="col-2 pt-4">
                Fee 1 STH
              </div>
            </div>

            <div class="row">
              <div class="col-4">
                <div class="form-group mb-3">
                  <label class="form-label" for="sendAmount">Amount</label>
                  <input type="text" class="form-control form-control-sm" id="sendAmount" placeholder="Amount STH">
                </div>
              </div>
              <div class="col-4">
                <div class="form-group mb-3">
                  <label class="form-label" for="sendAmount">Network</label>
                  <select v-model="selectedNetwork" class="form-select form-select-sm" id="sendNetwork">
                    <option selected value="mainnet">Main Net</option>
                    <option disabled value="bsc">BSC</option>
                    <option disabled value="heco">HECO</option>
                    <option disabled value="eth">Ethereum</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </card-body>
      </card>
    </div>

    <!-- transactions -->
    <div class="col-xl-12 mb-3">
      <card v-if="transactions">
        <card-header class="card-header fw-bold small text-uppercase">Transactions [<span
          class="text-success">{{ transactions.meta.totalCount }}</span>]
        </card-header>
        <card-body>
          <table class="table table-hover">
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
            <tr v-for="item in transactions.data" :key="item.id">
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
                :class="item.recipient === this.$route.params.address ? 'text-success' : ''">{{ (item.recipient).slice(0, 5) }} .. {{ (item.recipient).slice(-5) }}</span>
              </td>
              <td><span
                :class="item.recipient === this.$route.params.address ? 'text-success' : ''">{{ (item.fee / 1e8).toFixed(3) }}</span>
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

    <div class="modal modal-cover fade" id="modalDecryptAddress">
      <div class="modal-dialog">
        <div class="modal-content text-danger">
          <textarea v-model="decryptedSecret" class="form-control" rows="3">

          </textarea>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useStoreWallet } from "@/stores/wallet";
import { useAppOptionStore } from "@/stores/app-option";

const appOption = useAppOptionStore();

const storeWallet = useStoreWallet();
const { accounts } = storeToRefs(storeWallet);
import moment from "moment";

export default {
  name: "AddressPage",
  data() {
    return {
      decryptedSecret: "",
      selectedNetwork: "mainnet",
      operation: 0,
      showPubKey: false,
      account: {}
    };
  },
  methods: {
    async decryptSecret() {
      this.decryptedSecret = await storeWallet.addressDecrypt(accounts.value[this.$route.params.address].secret);
    },
    tmFormat(tm, format = "MM/DD/YYYY") {
      return moment.unix(tm).format(format);
    },
    format_time(s) {
      const dtFormat = new Intl.DateTimeFormat("ru-RU", {
        timeStyle: "medium",
        timeZone: "UTC"
      });
      return dtFormat.format(new Date(s * 1e3));
    }
  },
  async beforeCreate() {
    if (this.currentAddress) {
      await storeWallet.getAttributes(this.$route.params.address);
      await storeWallet.getTransactions(this.$route.params.address);
    }
  },
  async mounted() {
    if (this.currentAddress) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      var self = this;
      this.$root.timerTx = setTimeout(async function tick() {
        if (self.page === "/address/" + self.$route.params.address) {
          await storeWallet.getTransactions(self.$route.params.address);
          await storeWallet.getAttributes(self.$route.params.address);
          self.$root.timerTx = setTimeout(tick, 20000); // (*)
        } else {
          clearTimeout(self.$root.timerTx);
          console.log("stop timer");
        }
      }, 20000);
    }

  },
  async created() {
    //await storeWallet.getTransactions(this.$route.params.address);
    //window.addEventListener('beforeunload', clearTimeout(this.$root.timerTx))
  },
  computed: {
    page() {
      return appOption.currentPage;
    },
    currentAddress() {
      return storeWallet.attributes[this.$route.params.address];
    },
    transactions() {
      return storeWallet.transactions[this.$route.params.address];
    }
  }
};
</script>

<style scoped></style>
