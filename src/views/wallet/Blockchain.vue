<template>
  <div class="row justify-content-center">
    <div class="col-xl-12">
      <ul class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/">{{ $t("wallet") }}</router-link>
        </li>
        <li class="breadcrumb-item active text-uppercase">{{ $t("blockchain") }}</li>
      </ul>
    </div>

    <div class="col-xl-5 mb-3">
      <card class="h-100" v-if="nodeConfig">
        <card-header class="card-header fw-bold small text-uppercase"
          >{{ $t("static_fees") }}</card-header
        >
        <card-body class="overflow-hidden">
          <table class="table table-striped text-capitalize">
            <thead>
              <tr>
                <th>{{ $t("operation") }}</th>
                <th>{{ $t("cost_sth") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ $t("transfer") }}</td>
                <td>
                  0.25 -
                  {{
                    (
                      nodeConfig.constants.fees.staticFees.transfer / 1e8
                    ).toFixed(2)
                  }}
                </td>
              </tr>
              <tr>
                <td>{{ $t("second_signature") }}</td>
                <td>
                  {{
                    (
                      nodeConfig.constants.fees.staticFees.secondSignature / 1e8
                    ).toFixed(0)
                  }}
                </td>
              </tr>
              <tr>
                <td>{{ $t("delegate_registration") }}</td>
                <td>
                  {{
                    (
                      nodeConfig.constants.fees.staticFees
                        .delegateRegistration / 1e8
                    ).toFixed(0)
                  }}
                </td>
              </tr>
              <tr>
                <td>{{ $t("vote") }}</td>
                <td>
                  {{
                    (nodeConfig.constants.fees.staticFees.vote / 1e8).toFixed(0)
                  }}
                </td>
              </tr>
              <tr>
                <td>{{ $t("multi_signature") }}</td>
                <td>
                  {{
                    (
                      nodeConfig.constants.fees.staticFees.multiSignature / 1e8
                    ).toFixed(0)
                  }}
                </td>
              </tr>
              <tr>
                <td>{{ $t("ipfs") }}</td>
                <td>
                  {{
                    (nodeConfig.constants.fees.staticFees.ipfs / 1e8).toFixed(0)
                  }}
                </td>
              </tr>
              <tr>
                <td>{{ $t("multi_payment") }}</td>
                <td>
                  {{
                    (
                      nodeConfig.constants.fees.staticFees.multiPayment / 1e8
                    ).toFixed(2)
                  }}
                </td>
              </tr>
              <tr>
                <td>{{ $t("delegate_resignation") }}</td>
                <td>
                  {{
                    (
                      nodeConfig.constants.fees.staticFees.delegateResignation /
                      1e8
                    ).toFixed(0)
                  }}
                </td>
              </tr>
              <tr>
                <td>{{ $t("htlc_lock") }}</td>
                <td>
                  {{
                    (
                      nodeConfig.constants.fees.staticFees.htlcLock / 1e8
                    ).toFixed(2)
                  }}
                </td>
              </tr>
              <tr>
                <td>{{ $t("htlc_claim") }}</td>
                <td>
                  {{
                    (
                      nodeConfig.constants.fees.staticFees.htlcClaim / 1e8
                    ).toFixed(2)
                  }}
                </td>
              </tr>
              <tr>
                <td>{{ $t("htlc_refund") }}</td>
                <td>
                  {{
                    (
                      nodeConfig.constants.fees.staticFees.htlcRefund / 1e8
                    ).toFixed(2)
                  }}
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
        <card-header class="card-header fw-bold small text-uppercase">{{ $t("dynamic_fees") }}</card-header>
        <card-body>
          <table class="table table-striped">
            <thead>
            <tr>
              <th>{{ $t("operation") }}</th>
              <th>{{ $t("cost_sth") }}</th>
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
                {{ $t("second_signature") }}
              </td>
              <td>
                {{ (nodeConfig.transactionPool.dynamicFees.minFeeBroadcast / 1e8).toFixed(8) }}
              </td>
            </tr>
            <tr>
              <td>
                {{ $t("delegate_registration") }}
              </td>
              <td>
                {{ (nodeConfig.constants.fees.staticFees.delegateRegistration / 1e8).toFixed(0) }}
              </td>
            </tr>
            <tr>
              <td>
                {{ $t("vote") }}
              </td>
              <td>
                {{ (nodeConfig.constants.fees.staticFees.vote / 1e8).toFixed(0) }}
              </td>
            </tr>
            <tr>
              <td>
                {{ $t("multi_signature") }}
              </td>
              <td>
                {{ (nodeConfig.constants.fees.staticFees.multiSignature / 1e8).toFixed(0) }}
              </td>
            </tr>
            <tr>
              <td>
                {{ $t("ipfs") }}
              </td>
              <td>
                {{ (nodeConfig.constants.fees.staticFees.ipfs / 1e8).toFixed(0) }}
              </td>
            </tr>
            <tr>
              <td>
                {{ $t("multi_payment") }}
              </td>
              <td>
                {{ (nodeConfig.constants.fees.staticFees.multiPayment / 1e8).toFixed(2) }}
              </td>
            </tr>
            <tr>
              <td>
                {{ $t("delegate_resignation") }}
              </td>
              <td>
                {{ (nodeConfig.constants.fees.staticFees.delegateResignation / 1e8).toFixed(0) }}
              </td>
            </tr>
            <tr>
              <td>
                {{ $t("htlc_lock") }}
              </td>
              <td>
                {{ (nodeConfig.constants.fees.staticFees.htlcLock / 1e8).toFixed(2) }}
              </td>
            </tr>
            <tr>
              <td>
                {{ $t("htlc_claim") }}
              </td>
              <td>
                {{ (nodeConfig.constants.fees.staticFees.htlcClaim / 1e8).toFixed(2) }}
              </td>
            </tr>
            <tr>
              <td>
                {{ $t("htlc_refund") }}
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

    <div v-show="!isExtension" class="col-xl-7 mb-3">
      <card class="h-100" v-if="nodeConfig && blockchain">
        <card-header class="card-header fw-bold small text-uppercase"
          >{{ $t("blockchain") }}</card-header
        >
        <card-body class="overflow-hidden">
          <table class="table table-striped">
            <thead>
              <tr>
                <td>{{ $t("option") }}</td>
                <td>{{ $t("value") }}</td>
              </tr>
            </thead>

            <tbody>
              <tr v-show="!isMobile">
                <td>{{ $t("net_hash") }}</td>
                <td>
                  {{ nodeConfig.nethash }}
                </td>
              </tr>
              <tr>
                <td>{{ $t("height") }}</td>
                <td>
                  {{ blockchain.block.height }}
                </td>
              </tr>
              <tr>
                <td>{{ $t("coin") }}</td>
                <td>
                  {{ nodeConfig.token }}
                </td>
              </tr>
              <tr>
                <td>{{ $t("supply") }}</td>
                <td>{{ (blockchain.supply / 1e8 - 92068).toFixed(0) }} STH</td>
              </tr>
              <tr>
                <td>{{ $t("smartholder_lock") }}</td>
                <td v-if="smartHolder.total">
                  {{ (smartHolder.total["realAmount"] * 1).toFixed(0) }} STH
                  <span class="small text-info"
                    >{{
                      (
                        (smartHolder.total["realAmount"] /
                          (blockchain["supply"] / 1e8 - 92068)) *
                        100
                      ).toFixed(0)
                    }}%</span
                  >
                </td>
                <td v-if="!smartHolder.total">{{ $t("loading") }}...</td>
              </tr>

              <tr>
                <td>{{ $t("version") }}</td>
                <td>
                  {{ nodeConfig.version }}
                  <span class=""
                    >[0x{{ (nodeConfig.version * 1).toString(16) }}]</span
                  >
                </td>
              </tr>
              <tr>
                <td>{{ $t("slip44") }}</td>
                <td>
                  {{ nodeConfig.slip44 }}
                  <span class=""
                    >[0x{{ (nodeConfig.slip44 * 1).toString(16) }}]</span
                  >
                </td>
              </tr>
              <tr>
                <td>{{ $t("wif") }}</td>
                <td>
                  {{ nodeConfig.wif }}
                  <span class=""
                    >[0x{{ (nodeConfig.wif * 1).toString(16) }}]</span
                  >
                </td>
              </tr>
              <tr>
                <td>{{ $t("active_delegates") }}</td>
                <td>
                  {{ nodeConfig.constants.activeDelegates }}
                </td>
              </tr>
              <tr>
                <td>{{ $t("block_time") }}</td>
                <td>{{ nodeConfig.constants.blocktime }}s</td>
              </tr>
              <tr>
                <td>{{ $t("epoch") }}</td>
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
      isExtension: IS_EXTENSION,
      isMobile: appOption.isMobile,
    };
  },
  async created() {
    await storeWallet.getNodeConfig();
    await storeWallet.getBlockchain();
    await storeWallet.getSmartHolder();
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
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
  },
};
</script>

<style scoped></style>
