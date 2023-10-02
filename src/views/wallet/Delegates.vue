<template>
  <div class="row justify-content-center">
    <div class="col-xl-12 mb-3">
      <card v-if="delegates">
        <card-header class="card-header fw-bold">
          Delegates
        </card-header>
        <card-body>

          <table class="table table-hover">
            <thead>
            <tr>
              <th scope="col">rank</th>
              <th scope="col">name</th>
              <th scope="col">votes</th>
              <th scope="col">produced</th>
              <th scope="col">forged</th>
              <th scope="col">status</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in delegates.data" :key="item.address">
              <td>
                {{item.rank}}
              </td>
              <td>
                {{item.username}}
              </td>
              <td>
                {{(item.votes / 1e8).toFixed(8)}}
              </td>
              <td>
                {{item.blocks.produced}}
              </td>
              <td>
                {{(item.forged.total / 1e8).toFixed(8)}}
              </td>
              <td>
                <span v-show-="item.last" class="text-success"><i class="fas fa-lg fa-fw me-2 fa-check-circle"></i></span>
                <span v-show-="item.last" class="text-warning"><i class="fas fa-lg fa-fw me-2 fa-circle"></i></span>
                <span v-show-="item.last" class="text-danger"><i class="fas fa-lg fa-fw me-2 fa-circle"></i></span>

              </td>
            </tr>
            </tbody>
          </table>

          {{ delegates.data }}
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
