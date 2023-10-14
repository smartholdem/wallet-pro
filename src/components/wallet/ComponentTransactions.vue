<!-- Не забудь вынести транзакции в отдельный модуль -->
<template>
  <div class="col-xl-12 mb-3" >
    <card v-if="transactions && !isMobile" style="overflow: hidden;">
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
            <th scope="col">Memo</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in transactions.data" :key="item.id" :class="item.confirmations < 8 ? 'table-dark' : ''">
            <td :title="item.id">
                  <span v-if="item.vendorField">
                     <span v-if="networksTransfer[item.vendorField.split(':')[0]]" :class="'ico-'+item.vendorField.split(':')[0]" style="padding:3px; padding-right:16px">&nbsp;</span>
                  </span>
              <span v-if="item.sender === 'Sau5rthYK9fCmzrAAzLDLNbmsWMYosSAsb'">
                     <span :class="'ico-xbts'" style="padding:3px; padding-right:16px">&nbsp;</span>
                  </span>

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
              <i v-show="item.recipient === this.$route.params.address" class="text-warning fas fa-sm fa-fw me-2 fa-angle-double-down"></i>
              <i v-show="item.recipient !== this.$route.params.address" class="text-info fas fa-sm fa-fw me-2 fa-angle-double-up"></i>
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
            <td><span>{{item.vendorField}}</span>
            </td>
          </tr>
          </tbody>
        </table>
        <div>
          <!--{{ transactions.data }}-->

        </div>
      </card-body>
    </card>
    <!-- tx mobile -->
    <div v-if="transactions && isMobile" style="overflow: hidden;">
      <div class="card-header fw-bold small text-uppercase">Transactions</div>
      <card v-for="item in transactions.data" :key="item.id">
        <card-body class="overflow-hidden">
          <table class="table table-striped">
            <tbody>
            <tr>
              <td>id</td>
              <td>
                  <span v-if="item.sender === 'Sau5rthYK9fCmzrAAzLDLNbmsWMYosSAsb'">
                     <span :class="'ico-xbts'" style="padding:3px; padding-right:16px">&nbsp;</span>
                  </span>
                <span v-if="item.vendorField">
                     <span v-if="networksTransfer[item.vendorField.split(':')[0]]" :class="'ico-'+item.vendorField.split(':')[0]" style="padding:3px; padding-right:16px">&nbsp;</span>
                  </span>
                <span :class="item.recipient === this.$route.params.address ? 'text-success' : ''">
                        {{ (item.id).slice(0, 11) }}..{{ (item.id).slice(-11) }}
                      </span>
              </td>
            </tr>
            <tr>
              <td>Time</td>
              <td>
                    <span :class="item.recipient === this.$route.params.address ? 'text-success' : ''">
                {{ tmFormat(item.timestamp.unix, "DD/MM/YY") }}
                <span class="small">{{ format_time(item.timestamp.unix * 1000) }}</span>
                </span>
              </td>
            </tr>
            <tr>
              <td>Amount</td>
              <td>
                <span :class="item.recipient === this.$route.params.address ? 'text-success' : ''">
                {{ (item.amount / 1e8).toFixed(8) }}
                </span>
              </td>
            </tr>
            <tr>
              <td>Sender</td>
              <td>
                    <span :class="item.recipient === this.$route.params.address ? 'text-success' : ''">
                      {{ (item.sender.slice(0, 11))}}..{{(item.sender.slice(-11)) }}
                    </span>
              </td>
            </tr>
            <tr>
              <td>Recipient</td>
              <td>
                    <span :class="item.recipient === this.$route.params.address ? 'text-success' : ''">
                    {{ (item.recipient.slice(0, 11))}}..{{(item.recipient.slice(-11)) }}
                    </span>
              </td>
            </tr>
            <tr>
              <td>Fee</td>
              <td>
                    <span
                      :class="item.recipient === this.$route.params.address ? 'text-success' : ''">{{ (item.fee / 1e8).toFixed(3)
                      }}</span>
              </td>
            </tr>
            <tr v-if="item.vendorField">
              <td>Memo</td>
              <td><span>{{item.vendorField.length < 40 ? item.vendorField : item.vendorField.slice(0, 25) + '..'}}</span></td>
            </tr>
            </tbody>
          </table>
        </card-body>
      </card>
    </div>

    <div v-if="!transactions">No transactions</div>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useAppOptionStore } from "@/stores/app-option";
const appOption = useAppOptionStore();

import { useStoreWallet } from "@/stores/wallet";
import moment from "moment";
const storeWallet = useStoreWallet();

export default {
  name: "ComponentTransactions",
  props: {
    address: String,
  },
  data() {
    return {
      isMobile: appOption.isMobile,
      timerTx: null,
      networksTransfer: {
        mainnet: {
          fee: 1,
          minAmount: 0.00001,
        },
        bsc: {
          fee: 30,
          minAmount: 100,
        },
        heco: {
          fee: 10,
          minAmount: 100,
        },
        eth: {
          fee: 200,
          minAmount: 100,
        },
      },
    }
  },
  async beforeCreate() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    var self = this;
    setTimeout(async () => {
      await this.accountUpdate();
    }, 120);
  },
  async mounted() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    var self = this;
    document.body.onfocus = async function(e){
      //console.info(e.type);
      await self.accountUpdate();
      await self.startUpdateByTimer();
    }
    await this.startUpdateByTimer();

  },
  computed: {
    page() {
      return appOption.currentPage;
    },
    transactions() {
      return storeWallet.transactions[this.address];
    }
  },
  methods: {
    async accountUpdate() {
      if (this.$route.params.address) {
        await storeWallet.getAttributes(this.$route.params.address);
        await storeWallet.getTransactions(this.$route.params.address);
      } else {
        console.log('accountUpdate err', this.$route.params.address);
      }

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
    },
    async startUpdateByTimer() {
      if (this.currentAddress) {
        clearTimeout(this.timerTx);
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        var self = this;
        //console.log('timer restart')
        this.timerTx = setTimeout(async function tick() {
          if (self.page === "/address/" + self.$route.params.address) {
            await self.accountUpdate();
            self.timerTx = setTimeout(tick, 20000); // (*)
          } else {
            clearTimeout(self.timerTx);
            //console.log("stop timer");
          }
        }, 28000);
      }
    },
  },
};
</script>

<style scoped>
.ico-heco {
  background-image:url('/images/heco.svg');
  background-position: 0px 2px;
  background-repeat: no-repeat;
  background-size: 16px;
}

.ico-mainnet {
  background-image:url('/images/logo-green32.png');
  background-position: 0px 2px;
  background-repeat: no-repeat;
  background-size: 16px;
}

.ico-bsc {
  background-image:url('/images/bsc.svg');
  background-position: 0px 2px;
  background-repeat: no-repeat;
  background-size: 16px;
}
.ico-eth {
  background-image:url('/images/eth.svg');
  background-position: 0px 2px;
  background-repeat: no-repeat;
  background-size: 18px;
}
.ico-xbts {
  background-image:url('/images/xbts32.png');
  background-position: 0px 2px;
  background-repeat: no-repeat;
  background-size: 18px;
}

</style>
