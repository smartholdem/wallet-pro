<template>
  <div class="h-100">

    <card class="h-100 overflow-hidden">
      <card-header class="card-header fw-bold small">
        OPERATIONS
      </card-header>
      <card-body>
        <div v-if="!currentAddress" class="btn-group mb-3 mx-1">
          <button data-bs-toggle="modal" data-bs-target="#modalQr" type="button" class="btn btn-outline-theme">
            <i class="fas fa-lg fa-fw fa-qrcode" aria-hidden="true"></i>
          </button>
          <button @click="decryptSecret()" data-bs-toggle="modal" data-bs-target="#modalDecryptAddress" type="button"
                  class="btn btn-outline-theme">
            <i class="fa fa-key" aria-hidden="true"></i>
          </button>
        </div>

        <div v-if="currentAddress" class="btn-group mb-3 me-2">

          <button :disabled="balanceDecimal < 1" @click="sendTabPrepare" data-bs-toggle="modal" data-bs-target="#modalTransfer" type="button" class="btn btn-outline-theme">
            SEND
          </button>

          <button data-bs-toggle="modal" data-bs-target="#modalQr" type="button" class="btn btn-outline-theme">
            <i class="fas fa-lg fa-fw fa-qrcode" aria-hidden="true"></i>
          </button>
          <button @click="decryptSecret()" data-bs-toggle="modal" data-bs-target="#modalDecryptAddress" type="button"
                  class="btn btn-outline-theme">
            <i class="fa fa-key" aria-hidden="true"></i>
          </button>

          <button disabled="true" type="button" class="btn btn-outline-theme">
            mPays
          </button>
          <button disabled="true" type="button" class="btn btn-outline-theme">
            HTLC
          </button>
          <button data-bs-toggle="modal" data-bs-target="#modalSignMessage" type="button" class="btn btn-outline-theme">
            SIG
          </button>

        </div>

        <div v-if="currentAddress" class="btn-group mb-3">
          <button disabled="true" type="button" class="btn btn-outline-theme">
            2nd PWD
          </button>

          <button v-if="!currentAddress.attributes.delegate" data-bs-toggle="modal" data-bs-target="#modalDelegateReg" type="button" class="btn btn-outline-theme">
            DELEGATE REG
          </button>

          <button data-bs-toggle="modal" data-bs-target="#modalVote" type="button" class="btn btn-outline-theme">
            VOTE
          </button>
          <button disabled="true" type="button" class="btn btn-outline-theme">
            mSIG
          </button>

        </div>

      </card-body>
    </card>


    <!-- modal transfer -->
    <div class="modal fade modal-transfer" id="modalTransfer">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Transfer</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="w-100">
              <div v-if="txSendStep === 0">
                <div class="row">
                  <div class="col-md-10">
                    <div class="form-group mb-3">
                      <label class="form-label" for="sendRecipient">Recipient <i class="fa fa-address-book hover-info"></i></label>
                      <input v-model="forSend.recipientId" @input="validateAddress" type="text" class="form-control form-control-sm" :class="forSend.addressIsValid && forSend.recipientId !== this.address ? 'is-valid' : 'is-invalid'" id="sendRecipient"
                             placeholder="Enter address">
                    </div>
                  </div>
                  <div class="col-md-2" v-show="!isMobile">
                    <div class="form-group mb-3">
                      <label class="form-label" for="sendFee">Fee</label>
                      <input readonly :value="networksTransfer[selectedNetwork].fee" type="text" class="form-control form-control-sm" id="sendFee"
                      >
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-3">
                    <div class="form-group mb-3">
                      <label @click="forSend.amount = balanceDecimal - networksTransfer[selectedNetwork].fee" class="form-label" for="sendAmount">Amount <span class="badge text-info">[max]</span></label>
                      <input :placeholder="'min ' + networksTransfer[selectedNetwork].minAmount" v-model="forSend.amount" type="text" class="form-control form-control-sm" :class="forSend.amount > 0.00000001 ? 'is-valid' : 'is-invalid'" id="sendAmount">
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
                      <label class="form-label px-4" :class="'ico-' + selectedNetwork" for="sendNetwork" >Network</label>
                      <select v-model="selectedNetwork" @change="validateAddress" class="form-select form-select-sm" id="sendNetwork">
                        <option selected value="mainnet">MainNet</option>
                        <option value="bsc">BSC</option>
                        <option value="heco">HECO</option>
                        <option disabled value="eth">Ethereum</option>
                      </select>

                    </div>
                  </div>

                </div>
                <div>
                  <button :disabled="((forSend.amount * 1 + networksTransfer[selectedNetwork].fee) > balanceDecimal) || !forSend.addressIsValid || forSend.amount < 0.001 || !forSend.recipientId || forSend.recipientId === this.address"
                          @click="txSend"
                          type="button"
                          class="btn btn-sm"
                          :class="(((forSend.amount * 1 + networksTransfer[selectedNetwork].fee) > balanceDecimal) || !forSend.addressIsValid || forSend.amount < 0.001 || !forSend.recipientId || forSend.recipientId === this.address) ? 'btn-secondary' : 'btn-success'">
                    SEND STH
                  </button>
                </div>
              </div>
              <div v-if="txSendStep === 1" class="overflow-hidden overflow-x-auto">
                <div class="mb-3">
                  <table class="table">
                    <tbody>
                    <tr>
                      <td v-if="txErr === 0">Success txId</td>
                      <td v-if="txErr > 0" class="text-danger">Error txId</td>
                      <td><span class="text-primary">{{txResult.tx.id}}</span></td>
                    </tr>
                    <tr>
                      <td>Amount</td>
                      <td>{{(txResult.tx.amount / 1e8).toFixed(8)}} STH</td>
                    </tr>
                    <tr>
                      <td>Fee</td>
                      <td>{{(txResult.tx.fee / 1e8).toFixed(8) }} STH</td>
                    </tr>
                    <tr>
                      <td>Recipient</td>
                      <td>{{txResult.tx.recipientId}}</td>
                    </tr>
                    <tr v-if="txResult.tx.vendorField">
                      <td>Memo</td>
                      <td>{{txResult.tx.vendorField}}</td>
                    </tr>
                    <tr>
                      <td>Network&nbsp;<i class="px-3 py-1" :class="'ico-' + txResult.network"></i></td>
                      <td><span class="text-uppercase text-info">{{txResult.network}}</span></td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  <button @click="sendTabPrepare" type="button" class="btn btn-sm" :class="txErr > 0 ? 'btn-danger' : 'btn-success'">CONTINUE</button>&nbsp;<span v-show="waitConfirmTx">Please wait confirmation..</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <ModalVote :address="address"/>

    <ModalDelegateReg :address="address"/>

    <ModalSignMessage :address="address"/>

    <!-- modal decrypt -->
    <div class="modal fade" id="modalDecryptAddress">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">SECRET KEY</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>For address {{address}} </p>
            <textarea v-model="decryptedSecret" class="form-control text-info" rows="3"></textarea>
            <p class="small text-danger mt-2">Please keep in secret!</p>
          </div>

        </div>
      </div>
    </div>

    <!-- modal qr -->
    <div class="modal modal-cover fade" id="modalQr">
      <div class="modal-dialog">
        <div class="modal-content text-info text-center">
          <h3>Receiving address</h3>
          <p class="text-center">{{address}}</p>
          <div class="">
            <qrcode-vue class="m-auto border border-5 border-secondary" :value="address" :size="280" level="H" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QrcodeVue from "qrcode.vue";
import { storeToRefs } from "pinia";
import { useAppOptionStore } from "@/stores/app-option.ts";
const appOption = useAppOptionStore();

import { useStoreWallet } from "@/stores/wallet.ts";
const storeWallet = useStoreWallet();

import ModalVote from "@/components/wallet/ModalVote.vue";
import ModalDelegateReg from "@/components/wallet/ModalDelegateReg.vue";
import ModalSignMessage from "@/components/wallet/ModalSignMessage.vue";

export default {
  name: "OperationsComponent",
  components: {
    QrcodeVue,
    ModalVote,
    ModalDelegateReg,
    ModalSignMessage,
  },
  props: {
    address: String,
  },
  data() {
    return {
      decryptedSecret: "",
      waitConfirmTx: true,
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
      invoice: {
        amount: '',
        memo: '',
      },
      isMobile: appOption.isMobile,
      txSendStep: 0,
      txResult: {
        response: null,
        tx: null,
      },
      forSend: {
        network: 'mainnet',
        addressIsValid: false,
        sender: this.address,
        recipientId: "",
        amount: "",
        fee: 1,
        memo: "",
      },
      selectedNetwork: "mainnet",
      txErr: 0,
    }
  },
  computed: {
    book() {
      return storeWallet.addressBook;
    },
    balanceDecimal() {
      return this.currentAddress.balance / 10 ** 8;
    },
    currentAddress() {
      return storeWallet.attributes[this.address];
    },
  },
  watch: {
    txResult: {
      handler: function() {
        this.$emit('txResultData', this.txResult);
      },
      deep: true
    }
  },
  methods: {
    async copyText(text) {
      navigator.clipboard.writeText(text);
    },
    async sendTabPrepare() {
      this.txResult = {
        response: null,
        tx: null,
      };
      this.txErr = 0;
      this.waitConfirmTx = true;
      this.txSendStep = 0;
      this.selectedNetwork = 'mainnet';
      this.forSend = {
        network: 'mainnet',
        addressIsValid: false,
        sender: this.address,
        recipientId: "",
        amount: "",
        fee: 1,
        memo: "",
      };
    },
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
      this.forSend.network = this.selectedNetwork; // net fix
      this.txResult = await storeWallet.txTransfer(this.forSend);
      if (this.txResult.response) {
        this.txErr = this.txResult.response.invalid.length;
        this.txSendStep = 1;
        this.selectedNetwork = 'mainnet'
        this.forSend = {
          network: 'mainnet',
          addressIsValid: false,
          sender: this.address,
          recipientId: "",
          amount: "",
          fee: 1,
          memo: "",
        };
        setTimeout(async () => {
          this.waitConfirmTx = false;
          await this.accountUpdate();
          await this.sendTabPrepare();
        }, 9200);
      }
    },
    async decryptSecret() {
      this.decryptedSecret = await storeWallet.decryptByAddress(this.address);
    },
    async accountUpdate() {
      if (this.address) {
        await storeWallet.getAttributes(this.address);
        await storeWallet.getTransactions(this.address, 20);
      } else {
        console.log('accountUpdate err', this.address);
      }
    }
  },
};
</script>

<style scoped>

.modal-transfer {
  --bs-modal-width: 700px;
}

</style>
