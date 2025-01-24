<template>
  <div class="row justify-content-center">
    <div class="col-xl-12">
      <ul class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/">WALLET</router-link>
        </li>
        <li class="breadcrumb-item active text-uppercase">Blockchain</li>
      </ul>
    </div>

    <div class="col-xl-5 mb-3">
      <card class="h-100" v-if="nodeConfig">
        <card-header class="card-header fw-bold small text-uppercase">Static Fees</card-header>
        <card-body>
          <table class="table table-striped">
            <thead>
            <tr>
              <th>Operation</th>
              <th>Cost STH</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>
                Transfer
              </td>
              <td>
                {{ (nodeConfig.constants.fees.staticFees.transfer / 1e8).toFixed(0) }}
              </td>
            </tr>
            <tr>
              <td>
                Second Signature
              </td>
              <td>
                {{ (nodeConfig.constants.fees.staticFees.secondSignature / 1e8).toFixed(0) }}
              </td>
            </tr>
            <tr>
              <td>
                Delegate Registration
              </td>
              <td>
                {{ (nodeConfig.constants.fees.staticFees.delegateRegistration / 1e8).toFixed(0) }}
              </td>
            </tr>
            <tr>
              <td>
                Vote
              </td>
              <td>
                {{ (nodeConfig.constants.fees.staticFees.vote / 1e8).toFixed(0) }}
              </td>
            </tr>
            <tr>
              <td>
                Multi Signature
              </td>
              <td>
                {{ (nodeConfig.constants.fees.staticFees.multiSignature / 1e8).toFixed(0) }}
              </td>
            </tr>
            <tr>
              <td>
                IPFS
              </td>
              <td>
                {{ (nodeConfig.constants.fees.staticFees.ipfs / 1e8).toFixed(0) }}
              </td>
            </tr>
            <tr>
              <td>
                Multi Payment
              </td>
              <td>
                {{ (nodeConfig.constants.fees.staticFees.multiPayment / 1e8).toFixed(2) }}
              </td>
            </tr>
            <tr>
              <td>
                Delegate Resignation
              </td>
              <td>
                {{ (nodeConfig.constants.fees.staticFees.delegateResignation / 1e8).toFixed(0) }}
              </td>
            </tr>
            <tr>
              <td>
                HTLC Lock
              </td>
              <td>
                {{ (nodeConfig.constants.fees.staticFees.htlcLock / 1e8).toFixed(2) }}
              </td>
            </tr>
            <tr>
              <td>
                HTLC Claim
              </td>
              <td>
                {{ (nodeConfig.constants.fees.staticFees.htlcClaim / 1e8).toFixed(2) }}
              </td>
            </tr>
            <tr>
              <td>
                HTLC Refund
              </td>
              <td>
                {{ (nodeConfig.constants.fees.staticFees.htlcRefund / 1e8).toFixed(2) }}
              </td>
            </tr>
            </tbody>
          </table>

        </card-body>


      </card>
    </div>
    <!-- dynamic fees -->
    <!--
    <div class="col-xl-3 mb-3">
      <card class="h-100" v-if="nodeConfig">
        <card-header class="card-header fw-bold small text-uppercase">Dynamic Fees</card-header>
        <card-body>
          <table class="table table-striped">
            <thead>
            <tr>
              <th>Operation</th>
              <th>Cost STH</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>
                minFeePool
              </td>
              <td>
                {{ (nodeConfig.transactionPool.dynamicFees.minFeePool / 1e8).toFixed(8) }}
              </td>
            </tr>
            <tr>
              <td>
                Second Signature
              </td>
              <td>
                {{ (nodeConfig.transactionPool.dynamicFees.minFeeBroadcast / 1e8).toFixed(8) }}
              </td>
            </tr>
            <tr>
              <td>
                Delegate Registration
              </td>
              <td>
                {{ (nodeConfig.constants.fees.staticFees.delegateRegistration / 1e8).toFixed(0) }}
              </td>
            </tr>
            <tr>
              <td>
                Vote
              </td>
              <td>
                {{ (nodeConfig.constants.fees.staticFees.vote / 1e8).toFixed(0) }}
              </td>
            </tr>
            <tr>
              <td>
                Multi Signature
              </td>
              <td>
                {{ (nodeConfig.constants.fees.staticFees.multiSignature / 1e8).toFixed(0) }}
              </td>
            </tr>
            <tr>
              <td>
                IPFS
              </td>
              <td>
                {{ (nodeConfig.constants.fees.staticFees.ipfs / 1e8).toFixed(0) }}
              </td>
            </tr>
            <tr>
              <td>
                Multi Payment
              </td>
              <td>
                {{ (nodeConfig.constants.fees.staticFees.multiPayment / 1e8).toFixed(2) }}
              </td>
            </tr>
            <tr>
              <td>
                Delegate Resignation
              </td>
              <td>
                {{ (nodeConfig.constants.fees.staticFees.delegateResignation / 1e8).toFixed(0) }}
              </td>
            </tr>
            <tr>
              <td>
                HTLC Lock
              </td>
              <td>
                {{ (nodeConfig.constants.fees.staticFees.htlcLock / 1e8).toFixed(2) }}
              </td>
            </tr>
            <tr>
              <td>
                HTLC Claim
              </td>
              <td>
                {{ (nodeConfig.constants.fees.staticFees.htlcClaim / 1e8).toFixed(2) }}
              </td>
            </tr>
            <tr>
              <td>
                HTLC Refund
              </td>
              <td>
                {{ (nodeConfig.constants.fees.staticFees.htlcRefund / 1e8).toFixed(2) }}
              </td>
            </tr>
            </tbody>
          </table>

        </card-body>


      </card>
    </div>
    -->

    <div class="col-xl-7 mb-3">
      <card class="h-100" v-if="nodeConfig && blockchain">
        <card-header class="card-header fw-bold small text-uppercase">Blockchain</card-header>
        <card-body>
          <table class="table table-striped">
            <thead>
            <tr>
              <td>Option</td>
              <td>Value</td>
            </tr>
            </thead>

            <tbody>
            <tr v-show="!isMobile">
              <td>
                Net Hash
              </td>
              <td>
                {{ nodeConfig.nethash }}
              </td>
            </tr>
            <tr>
              <td>
                Height
              </td>
              <td>
                {{ blockchain.block.height }}
              </td>
            </tr>
            <tr>
              <td>
                Coin
              </td>
              <td>
                {{ nodeConfig.token }}
              </td>
            </tr>
            <tr>
              <td>
                Supply
              </td>
              <td>
                {{ (blockchain.supply / 1e8 - 92068).toFixed(0) }} STH
              </td>
            </tr>
            <tr>
              <td>
                SmartHolder Lock
              </td>
              <td v-if="smartHolder.total">
                {{ (smartHolder.total['realAmount'] * 1).toFixed(0) }} STH <span class="small text-info">{{(smartHolder.total['realAmount'] / (blockchain['supply'] / 1e8 - 92068) * 100).toFixed(0)}}%</span>
              </td>
              <td v-if="!smartHolder.total">
                Loading...
              </td>
            </tr>

            <tr>
              <td>
                Version
              </td>
              <td>
                {{ nodeConfig.version }} <span class="">[0x{{(nodeConfig.version * 1).toString(16)}}]</span>
              </td>
            </tr>
            <tr>
              <td>
                Slip44
              </td>
              <td>
                {{ (nodeConfig.slip44) }} <span class="">[0x{{(nodeConfig.slip44 * 1).toString(16)}}]</span>
              </td>
            </tr>
            <tr>
              <td>
                WIF
              </td>
              <td>
                {{ nodeConfig.wif }} <span class="">[0x{{(nodeConfig.wif * 1).toString(16)}}]</span>
              </td>
            </tr>
            <tr>
              <td>
                Active Delegates
              </td>
              <td>
                {{ nodeConfig.constants.activeDelegates }}
              </td>
            </tr>
            <tr>
              <td>Block Time</td>
              <td>{{ nodeConfig.constants.blocktime }}s</td>
            </tr>
            <tr>
              <td>
                Epoch
              </td>
              <td>
                {{ nodeConfig.constants.epoch }}
              </td>
            </tr>
            </tbody>
          </table>
        </card-body>
      </card>
    </div>

  </div>
</template>

<script>
import { useAppOptionStore } from "@/stores/app-option";
const appOption = useAppOptionStore();

import { storeToRefs } from "pinia";
import { useStoreWallet } from "@/stores/wallet";

const storeWallet = useStoreWallet();
const { nodeConfig } = storeToRefs(storeWallet);

export default {
  name: "nodeConfigPage",
  data() {
    return {
      isMobile: appOption.isMobile,
    }
  },
  async created() {
    await storeWallet.getNodeConfig();
    await storeWallet.getBlockchain();
    await storeWallet.getSmartHolder();
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    var self = this;
    this.$root.timerNode = setTimeout(async function tick() {
      if (self.page === "/blockchain") {
        await storeWallet.getNodeConfig();
        self.$root.timerNode = setTimeout(tick, 60000 * 60); // (*)
      } else {
        clearTimeout(self.$root.timerNode);
        //console.log("stop timer node");
      }
    }, 60000 * 60);

    this.$root.timerChain = setTimeout(async function tick() {
      if (self.page === "/blockchain") {
        await storeWallet.getBlockchain();
        self.$root.timerChain = setTimeout(tick, 8000); // (*)
      } else {
        clearTimeout(self.$root.timerChain);
        console.log("stop timer chain");
      }
    }, 8000);
  },

  computed: {
    page() {
      return appOption.currentPage;
    },
    nodeConfig() {
      return storeWallet.nodeConfig;
    },
    blockchain() {
      return storeWallet.blockchain;
    },
    smartHolder() {
      return storeWallet.smartHolder;
    },

  }
};
</script>

<style scoped>

</style>
