<template>
  <div class="row justify-content-center">
    <div class="col-xl-12">
      <ul class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">WALLET</router-link></li>
        <li class="breadcrumb-item active">ADDRESS</li>
      </ul>
    </div>

    <div class="col-xl-6 mb-3">
      <card class="h-100" v-if="currentAddress">
        <card-header class="card-header fw-bold">
          <i v-if="currentAddress.publicKey" @click="showPubKey = !showPubKey" class="m-lg-2 fa fa-globe"
             aria-hidden="true"> </i>
          <span v-if="!showPubKey" class="text-info" :class="isMobile ? 'small' : ''">
            &nbsp;{{ $route.params.address }}
          </span>
          <span v-if="showPubKey && currentAddress.publicKey" class="text-info">
            {{ currentAddress.publicKey }}
          </span>
        </card-header>
        <card-body>

          <h5 v-if="currentAddress.balance" class="card-title">
            <img src="/images/logo-green32.png"/> <span class="text-success">{{ (balanceDecimal).toFixed(8)}}</span> STH
          </h5>
          <div v-if="currentAddress.publicKey">

            <div v-if="currentAddress.attributes">
              <card v-if="currentAddress.attributes.delegate">
                <card-header class="card-header fw-bold">
                  <i class="fas fa-lg fa-fw me-1 fa-university"></i>DELEGATE <span class="text-info">{{ currentAddress.attributes.delegate.username }}</span>
                </card-header>
                <card-body>
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item">Rank <span class="text-info">{{ currentAddress.attributes.delegate.rank }}</span></li>
                    <li class="list-group-item">
                      Votes <span class="text-info">{{ (currentAddress.attributes.delegate.voteBalance / 10 ** 8).toFixed(8) }}</span> STH
                    </li>
                    <li class="list-group-item">Forged fees
                      <span class="text-info">{{ (currentAddress.attributes.delegate.forgedFees / 10 ** 8).toFixed(8) }}</span> STH
                    </li>
                    <li class="list-group-item">Produced blocks <span class="text-info">{{ currentAddress.attributes.delegate.producedBlocks }}</span>
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
      <Ops @txResultData="handleData($event)" :address="$route.params.address"/>
    </div>

    <!-- transactions -->
    <Txs :address="$route.params.address" :newTx="txResult.tx"/>

  </div>
</template>

<script>
import { useAppOptionStore } from "@/stores/app-option";
const appOption = useAppOptionStore();
import { storeToRefs } from "pinia";
import { useStoreWallet } from "@/stores/wallet";
const storeWallet = useStoreWallet();
const { accounts } = storeToRefs(storeWallet);
import Txs from "./Transactions.vue";
import Ops from "./Operations.vue";

export default {
  name: "AddressPage",
  components: {
    Txs,
    Ops,
  },
  data() {
    return {
      txResult: {
        response: null,
        tx: null,
      },
      isMobile: appOption.isMobile,
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
      showPubKey: false,
      timerTx: null,
    };
  },
  methods: {
    handleData: function(e) {
      this.txResult = e;
    },
    async accountUpdate() {
      if (this.$route.params.address) {
        await storeWallet.getAttributes(this.$route.params.address);
        await storeWallet.getTransactions(this.$route.params.address);
      } else {
        console.log('accountUpdate err', this.$route.params.address);
      }

    },
    async startUpdateByTimer() {
      if (this.currentAddress) {
        clearTimeout(this.timerTx);
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        var self = this;
        this.timerTx = setTimeout(async function tick() {
          if (self.page === "/address/" + self.$route.params.address) {
            await self.accountUpdate();
            self.timerTx = setTimeout(tick, 20000); // (*)
          } else {
            clearTimeout(self.timerTx);
          }
        }, 28000);
      }
    },
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
    balanceDecimal() {
      return this.currentAddress.balance / 10 ** 8;
    },
    page() {
      return appOption.currentPage;
    },
    currentAddress() {
      return storeWallet.attributes[this.$route.params.address];
    },
  }
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
