<template>
  <div class="row justify-content-center">
    <div class="col-xl-12 mb-3">
      <ul class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">WALLET</router-link></li>
        <li class="breadcrumb-item active">DELEGATE</li>
      </ul>
      <card v-if="delegates">
        <card-header class="card-header fw-bold">
          DELEGATE LIST
        </card-header>
        <card-body style="overflow-x: hidden; overflow-y: auto;">
          <table class="table table-hover">
            <thead>
            <tr class="text-uppercase">
              <th scope="col">Rank</th>
              <th scope="col">Name</th>
              <th scope="col">Blocks produced</th>
              <th scope="col">Votes</th>
              <th scope="col">Forged fees</th>
              <!--<th scope="col">status</th>-->
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in delegates.data" :key="item.address" :class="item.rank > 21 ? 'bg-gradient' : ''">
              <td>
                {{item.rank}}
              </td>
              <td>
                {{item.username}}
              </td>
              <td>
                {{item.blocks.produced}}
              </td>
              <td>
                {{(item.votes / 1e8).toFixed(0)}}
              </td>
              <td>
                {{(item.forged.total / 1e8).toFixed(0)}}
              </td>
              <!--
              <td>
                <span v-show-="item.last" class="text-success"><i class="fas fa-lg fa-fw me-2 fa-check-circle"></i></span>
                <span v-show-="item.last" class="text-warning"><i class="fas fa-lg fa-fw me-2 fa-circle"></i></span>
                <span v-show-="item.last" class="text-danger"><i class="fas fa-lg fa-fw me-2 fa-circle"></i></span>
              </td>
              -->
            </tr>
            </tbody>
          </table>
        </card-body>
      </card>

    </div>
  </div>
</template>

<script>
import { useStoreWallet } from "@/stores/wallet";

const storeWallet = useStoreWallet();

export default {
  name: "DelegatesPage",
  async created() {
    await storeWallet.getDelegates();
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    var self = this;
    this.$root.timerDelegates = setTimeout(async function tick() {
      if (self.page === "/delegates") {
        await storeWallet.getDelegates();
        self.$root.timerDelegates = setTimeout(tick, 60000 * 20); // (*)
      } else {
        clearTimeout(self.$root.timerDelegates);
        console.log("stop timer delegates");
      }
    }, 60000 * 10);
  },
  computed: {
    delegates() {
      return storeWallet.delegates;
    }
  }
};
</script>

<style scoped>

</style>
