<template>
  <div class="row justify-content-left">
    <div class="col-xl-8 mb-3">
      <ul class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/">{{ $t("wallet") }}</router-link>
        </li>
        <li class="breadcrumb-item active">{{ $t("delegate") }}</li>
      </ul>
      <card v-if="delegates">
        <card-header class="card-header fw-bold"> {{ $t("delegate_list") }} </card-header>
        <card-body style="overflow-x: hidden; overflow-y: auto" :style="isExtension ? 'max-height: 400px;': ''">
          <table class="table table-hover table-responsive">
            <thead>
              <tr class="text-uppercase">
                <th scope="col">{{ $t("rank") }}</th>
                <th scope="col">{{ $t("name") }}</th>
                <th scope="col">{{ $t("produced_blocks") }}</th>
                <th scope="col">{{ $t("votes") }}</th>
                <th scope="col">{{ $t("forged_fees") }}</th>
                <!--<th scope="col">status</th>-->
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in delegates.data"
                :key="item.address"
                :class="item.rank > 21 ? 'bg-gradient' : ''"
              >
                <td>
                  {{ item.rank }}
                </td>
                <td>
                  {{ item.username }}
                </td>
                <td>
                  {{ item.blocks.produced }}
                </td>
                <td>
                  {{ (item.votes / 1e8).toFixed(0) }}
                </td>
                <td>
                  {{ (item.forged.total / 1e8).toFixed(0) }}
                </td>
                <!--
              <td>
                <span v-show-="item.last" class="text-success"><i class="fas fa-lg fa-fw me-2 fa-check-circle"></i></span>
                <span v-show-="item.last" class="text-warning"><i class="fas fa-lg fa-fw me-2 fa-circle"></i></span>
                <span v-show-="item.last" class="text-danger"><i class="fas fa-lg fa-fw me-2 fa-circle"></i></span>
              </td>
              --></tr>
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

import { useStoreWallet } from "@/stores/wallet";

const storeWallet = useStoreWallet();

export default {
  name: "DelegatesPage",
  data() {
    return {
      isExtension: IS_EXTENSION,
    }
  },
  async created() {
    await storeWallet.getDelegates();
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    this.$root.timerDelegates = setTimeout(async function tick() {
      if (self.page === "/delegates") {
        await storeWallet.getDelegates();
        self.$root.timerDelegates = setTimeout(tick, 21 * 8 * 1000); // (*)
      } else {
        clearTimeout(self.$root.timerDelegates);
        console.log("stop timer delegates");
      }
    }, 21 * 8 * 1000);
  },
  computed: {
    page() {
      return appOption.currentPage;
    },
    delegates() {
      return storeWallet.delegates;
    },
  },
};
</script>

<style scoped></style>
