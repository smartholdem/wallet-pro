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

          <h5 v-if="currentAddress.balance" class="card-title" @click="forSend.amount = balanceDecimal - networksTransfer[selectedNetwork].fee">
            <img src="/images/logo-green32.png"/> <span class="text-success">{{ (balanceDecimal).toFixed(8)
            }}</span> STH
          </h5>
          <div v-if="currentAddress.publicKey">

            <div v-if="currentAddress.attributes">
              <card v-if="currentAddress.attributes.delegate">
                <card-header class="card-header fw-bold">
                  DELEGATE <span class="text-info">{{ currentAddress.attributes.delegate.username }}</span>
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
      <card class="h-100">
        <card-header class="card-header fw-bold small">
          OPERATIONS
        </card-header>
        <card-body>
          <div class="btn-group mb-3">
            <button @click="operation = 1" type="button" class="btn btn-outline-theme">
              SEND
            </button>
            <button data-bs-toggle="modal" data-bs-target="#modalQr" type="button" class="btn btn-outline-theme">
              <i class="fas fa-lg fa-fw fa-qrcode" aria-hidden="true"></i>
            </button>
            <button @click="decryptSecret()" data-bs-toggle="modal" data-bs-target="#modalDecryptAddress" type="button"
                    class="btn btn-outline-theme">
              <i class="fa fa-key" aria-hidden="true"></i>
            </button>
            <button disabled="true" @click="operation = 2" type="button" class="btn btn-outline-theme">
              2nd PWD
            </button>
            <button disabled="true" @click="operation = 3" type="button" class="btn btn-outline-theme">
              DELEGATE REG
            </button>
          </div>

          <!-- send sth -->
          <div v-if="operation === 1" class="w-100">
            <div v-if="txSendStep === 0">
              <div class="row">
                <div class="col-md-10">
                  <div class="form-group mb-3">
                    <label class="form-label" for="sendRecipient">Recipient</label>
                    <input v-model="forSend.recipientId" @input="validateAddress" type="text" class="form-control form-control-sm" :class="forSend.addressIsValid && forSend.recipientId !== this.$route.params.address ? 'is-valid' : 'is-invalid'" id="sendRecipient"
                           placeholder="Enter address">
                  </div>
                </div>
                <div class="col-md-2" v-show="!isMobile">
                  <div class="form-group mb-3">
                  <label class="form-label" for="sendFee">Fee STH</label>
                  <input readonly :value="networksTransfer[selectedNetwork].fee" type="text" class="form-control form-control-sm" id="sendFee"
                  >
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-3">
                  <div class="form-group mb-3">
                    <label class="form-label" for="sendAmount">Amount</label>
                    <input v-model="forSend.amount" type="text" class="form-control form-control-sm" :class="forSend.amount > 0.00000001 ? 'is-valid' : 'is-invalid'" id="sendAmount" placeholder="Amount">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group mb-3">
                  <label class="form-label" for="sendMemo">Memo</label>
                  <input :readonly="selectedNetwork !== 'mainnet'" v-model="forSend.memo" type="text" class="form-control form-control-sm" id="sendMemo"
                         placeholder="Public Description max 250"
                  >
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group mb-3" >
                    <label class="form-label px-4" :class="'ico-' + selectedNetwork" for="sendAmount" >Network</label>
                    <select v-model="selectedNetwork" @change="validateAddress" class="form-select form-select-sm" id="sendNetwork">
                      <option selected value="mainnet">Main Net</option>
                      <option value="bsc">BSC</option>
                      <option value="heco">HECO</option>
                      <option value="eth">Ethereum</option>
                    </select>
                  </div>
                </div>

              </div>
              <div>
                <button :disabled="((forSend.amount * 1 + networksTransfer[selectedNetwork].fee) > balanceDecimal) || !forSend.addressIsValid || forSend.amount < 0.001 || !forSend.recipientId || forSend.recipientId === this.$route.params.address" @click="txSend" type="button" class="btn btn-success btn-sm">SEND STH</button>
              </div>
            </div>

            <!-- tx result -->
            <div v-if="txSendStep === 1">
              <p class="mb-3">
                Success transaction: <span class="text-primary">{{txResult.accept[0]}}</span>
              </p>
              <p class="mb-3">
                Please wait confirmation.
              </p>

              <p>
                <button @click="txSendStep=0" type="button" class="btn btn-success btn-sm">CONTINUE</button>
              </p>
            </div>
          </div>
        </card-body>
      </card>
    </div>

    <!-- transactions -->
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
      <div v-if="transactions && isMobile" style="overflow: hidden;">
        <div class="card-header fw-bold small text-uppercase">Transactions</div>
        <card v-for="item in transactions.data" :key="item.id">
          <card-body class="overflow-hidden">
            <table class="table table-striped">
              <tbody>
              <tr>
                <td>id</td>
                <td>


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
                <td>
                  Memo
                </td>
                <td>
                  <span>{{item.vendorField.length < 40 ? item.vendorField : item.vendorField.slice(0, 25) + '..'}}</span>
                </td>
              </tr>
              </tbody>
            </table>
          </card-body>
        </card>
      </div>

        <div v-if="!transactions">No transactions</div>
    </div>

    <!-- modal decrypt -->
    <div class="modal modal-cover fade" id="modalDecryptAddress">
      <div class="modal-dialog">
        <div class="modal-content text-danger">
          <textarea v-model="decryptedSecret" class="form-control" rows="3"></textarea>
        </div>
      </div>
    </div>

    <!-- modal qr -->
    <div class="modal modal-cover fade" id="modalQr">
      <div class="modal-dialog">
        <div class="modal-content text-info text-center">
          <h3>Receiving address</h3>
          <p class="text-center">{{$route.params.address}}</p>
          <div class="">
            <qrcode-vue class="m-auto border border-5 border-secondary" :value="$route.params.address" :size="280" level="H" />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue';
import { useAppOptionStore } from "@/stores/app-option";
const appOption = useAppOptionStore();
import { storeToRefs } from "pinia";
import { useStoreWallet } from "@/stores/wallet";
const storeWallet = useStoreWallet();
const { accounts } = storeToRefs(storeWallet);
import moment from "moment";

export default {
  name: "AddressPage",
  components: {
    QrcodeVue,
  },
  data() {
    return {
      networksTransfer: {
        mainnet: {
          fee: 1,
          minAmount: 0.00001,
        },
        bsc: {
          fee: 10,
          minAmount: 500,
        },
        heco: {
          fee: 10,
          minAmount: 500,
        },
        eth: {
          fee: 200,
          minAmount: 500,
        },
      },
      invoice: {
        amount: '',
        memo: '',
      },
      isMobile: appOption.isMobile,
      txSendStep: 0,
      txResult: null,
      forSend: {
        addressIsValid: false,
        sender: this.$route.params.address,
        recipientId: "",
        amount: "",
        fee: 1,
        memo: "",
      },
      decryptedSecret: "",
      selectedNetwork: "mainnet",
      operation: 0,
      showPubKey: false,
      account: {},
    };
  },
  methods: {
    async validateAddress() {
      if (this.selectedNetwork === 'mainnet') {
        this.forSend.memo = '';
        this.forSend.addressIsValid = await storeWallet.validateAddress(this.forSend.recipientId);
      } else {
        this.forSend.addressIsValid = await storeWallet.validateAddressCrossChain(this.forSend.recipientId);
        if (this.forSend.addressIsValid) {
          this.forSend.memo = this.selectedNetwork + ':' + this.forSend.recipientId;
        }

      }
    },
    async txSend() {
      this.forSend.fee = this.networksTransfer[this.selectedNetwork].fee;
      this.txResult = await storeWallet.txTransfer(this.forSend);
      if (this.txResult) {
        this.txSendStep = 1;
        this.forSend = {
          network: this.selectedNetwork,
          addressIsValid: false,
          sender: this.$route.params.address,
          recipientId: "",
          amount: "",
          fee: 1,
          memo: "",
        };
        setTimeout(async () => {
          await this.accountUpdate();
        }, 10000);
      }
    },
    async accountUpdate() {
      await storeWallet.getAttributes(this.$route.params.address);
      await storeWallet.getTransactions(this.$route.params.address);
    },
    async decryptSecret() {
      //this.decryptedSecret = await storeWallet.addressDecrypt(accounts.value[this.$route.params.address].secret);
      this.decryptedSecret = await storeWallet.decryptByAddress(this.$route.params.address);
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
    startUpdateByTimer() {
      if (this.currentAddress) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        var self = this;
        //console.log('timer restart')
        this.$root.timerTx = setTimeout(async function tick() {
          if (self.page === "/address/" + self.$route.params.address) {
            await self.accountUpdate();
            self.$root.timerTx = setTimeout(tick, 20000); // (*)
          } else {
            clearTimeout(self.$root.timerTx);
            //console.log("stop timer");
          }
        }, 20000);
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
  async created() {

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
    transactions() {
      return storeWallet.transactions[this.$route.params.address];
    }
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


</style>
