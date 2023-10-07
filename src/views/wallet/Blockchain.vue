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
      <card class="h-100" v-if="blockchain">
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
                {{ (blockchain.constants.fees.staticFees.transfer / 1e8).toFixed(0) }}
              </td>
            </tr>
            <tr>
              <td>
                Second Signature
              </td>
              <td>
                {{ (blockchain.constants.fees.staticFees.secondSignature / 1e8).toFixed(0) }}
              </td>
            </tr>
            <tr>
              <td>
                Delegate Registration
              </td>
              <td>
                {{ (blockchain.constants.fees.staticFees.delegateRegistration / 1e8).toFixed(0) }}
              </td>
            </tr>
            <tr>
              <td>
                Vote
              </td>
              <td>
                {{ (blockchain.constants.fees.staticFees.vote / 1e8).toFixed(0) }}
              </td>
            </tr>
            <tr>
              <td>
                Multi Signature
              </td>
              <td>
                {{ (blockchain.constants.fees.staticFees.multiSignature / 1e8).toFixed(0) }}
              </td>
            </tr>
            <tr>
              <td>
                IPFS
              </td>
              <td>
                {{ (blockchain.constants.fees.staticFees.ipfs / 1e8).toFixed(0) }}
              </td>
            </tr>
            <tr>
              <td>
                Multi Payment
              </td>
              <td>
                {{ (blockchain.constants.fees.staticFees.multiPayment / 1e8).toFixed(2) }}
              </td>
            </tr>
            <tr>
              <td>
                Delegate Resignation
              </td>
              <td>
                {{ (blockchain.constants.fees.staticFees.delegateResignation / 1e8).toFixed(0) }}
              </td>
            </tr>
            <tr>
              <td>
                HTLC Lock
              </td>
              <td>
                {{ (blockchain.constants.fees.staticFees.htlcLock / 1e8).toFixed(2) }}
              </td>
            </tr>
            <tr>
              <td>
                HTLC Claim
              </td>
              <td>
                {{ (blockchain.constants.fees.staticFees.htlcClaim / 1e8).toFixed(2) }}
              </td>
            </tr>
            <tr>
              <td>
                HTLC Refund
              </td>
              <td>
                {{ (blockchain.constants.fees.staticFees.htlcRefund / 1e8).toFixed(2) }}
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
      <card class="h-100" v-if="blockchain">
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
                {{ (blockchain.transactionPool.dynamicFees.minFeePool / 1e8).toFixed(8) }}
              </td>
            </tr>
            <tr>
              <td>
                Second Signature
              </td>
              <td>
                {{ (blockchain.transactionPool.dynamicFees.minFeeBroadcast / 1e8).toFixed(8) }}
              </td>
            </tr>
            <tr>
              <td>
                Delegate Registration
              </td>
              <td>
                {{ (blockchain.constants.fees.staticFees.delegateRegistration / 1e8).toFixed(0) }}
              </td>
            </tr>
            <tr>
              <td>
                Vote
              </td>
              <td>
                {{ (blockchain.constants.fees.staticFees.vote / 1e8).toFixed(0) }}
              </td>
            </tr>
            <tr>
              <td>
                Multi Signature
              </td>
              <td>
                {{ (blockchain.constants.fees.staticFees.multiSignature / 1e8).toFixed(0) }}
              </td>
            </tr>
            <tr>
              <td>
                IPFS
              </td>
              <td>
                {{ (blockchain.constants.fees.staticFees.ipfs / 1e8).toFixed(0) }}
              </td>
            </tr>
            <tr>
              <td>
                Multi Payment
              </td>
              <td>
                {{ (blockchain.constants.fees.staticFees.multiPayment / 1e8).toFixed(2) }}
              </td>
            </tr>
            <tr>
              <td>
                Delegate Resignation
              </td>
              <td>
                {{ (blockchain.constants.fees.staticFees.delegateResignation / 1e8).toFixed(0) }}
              </td>
            </tr>
            <tr>
              <td>
                HTLC Lock
              </td>
              <td>
                {{ (blockchain.constants.fees.staticFees.htlcLock / 1e8).toFixed(2) }}
              </td>
            </tr>
            <tr>
              <td>
                HTLC Claim
              </td>
              <td>
                {{ (blockchain.constants.fees.staticFees.htlcClaim / 1e8).toFixed(2) }}
              </td>
            </tr>
            <tr>
              <td>
                HTLC Refund
              </td>
              <td>
                {{ (blockchain.constants.fees.staticFees.htlcRefund / 1e8).toFixed(2) }}
              </td>
            </tr>
            </tbody>
          </table>

        </card-body>


      </card>
    </div>
    -->

    <div class="col-xl-7 mb-3">
      <card class="h-100" v-if="blockchain">
        <card-header class="card-header fw-bold small text-uppercase">Blockchain</card-header>
        <card-body>
          <table class="table table-striped">
            <tbody>
            <tr>
              <td>
                Net Hash
              </td>
              <td>
                {{ blockchain.nethash }}
              </td>
            </tr>
            <tr>
              <td>
                Token
              </td>
              <td>
                {{ blockchain.token }}
              </td>
            </tr>
            <tr>
              <td>
                Version
              </td>
              <td>
                {{ blockchain.version }}
              </td>
            </tr>
            <tr>
              <td>
                Slip44
              </td>
              <td>
                {{ blockchain.slip44 }}
              </td>
            </tr>
            <tr>
              <td>
                WIF
              </td>
              <td>
                {{ blockchain.wif }}
              </td>
            </tr>
            <tr>
              <td>
                Height
              </td>
              <td>
                {{ blockchain.constants.height }}
              </td>
            </tr>
            <tr>
              <td>
                Active Delegates
              </td>
              <td>
                {{ blockchain.constants.activeDelegates }}
              </td>
            </tr>
            <tr>
              <td>
                Block Time
              </td>
              <td>
                {{ blockchain.constants.blocktime }}
              </td>
            </tr>
            <tr>
              <td>
                Epoch
              </td>
              <td>
                {{ blockchain.constants.epoch }}
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
import { storeToRefs } from "pinia";
import { useStoreWallet } from "@/stores/wallet";

const storeWallet = useStoreWallet();
const { nodeConfig } = storeToRefs(storeWallet);

export default {
  name: "BlockchainPage",
  async created() {
    await storeWallet.getNodeConfig();
  },
  computed: {
    blockchain() {
      return storeWallet.nodeConfig;
    }
  }
};
</script>

<style scoped>

</style>
