<template>
  <!-- modal vote -->
  <div class="modal fade modal-transfer" id="modalVote">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t("modal_vote_title") }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div v-if="currentAddress" class="modal-body">
          <div class="w-100">
            <div v-if="txSendStep === 0">
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group mb-3">
                    <label class="form-label w-100" for="sendDelegateName"
                      >{{ $t("modal_vote_delegate_name") }}
                      <i class="fa fa-address-book hover-info"></i>
                      <i
                        @click="searchClear"
                        title="clear search"
                        class="ms-2 fas fa-lg fa-fw me-2 fa-window-close text-secondary hover-info float-right pointer"
                      ></i>
                    </label>
                    <span class=""> </span>

                    <input
                      v-model="forSend.userName"
                      @input="validateDelegate"
                      type="text"
                      class="form-control form-control"
                      :class="foundDelegate ? 'is-valid' : 'is-invalid'"
                      id="sendDelegateName"
                      :placeholder="$t('modal_vote_enter_delegate_name')"
                    />
                  </div>

                  <div v-if="foundDelegate">
                    <card>
                      <card-header class="card-header fw-bold">
                        <i class="fas fa-lg fa-fw me-1 fa-university"></i
                        >{{ $t("modal_vote_delegate") }}
                        <span class="text-info">{{
                          foundDelegate.username
                        }}</span>
                      </card-header>
                      <card-body>
                        <ul class="list-group list-group-flush">
                          <li class="list-group-item">
                            {{ $t("modal_vote_rank") }}
                            <span class="text-info">{{
                              foundDelegate.rank
                            }}</span>
                          </li>
                          <li class="list-group-item">
                            {{ $t("modal_vote_votes") }}
                            <span class="text-info">{{
                              (foundDelegate.votes / 10 ** 8).toFixed(8)
                            }}</span>
                            STH
                          </li>
                          <li class="list-group-item">
                            {{ $t("modal_vote_forged_fees") }}
                            <span class="text-info">{{
                              (foundDelegate.forged.total / 10 ** 8).toFixed(8)
                            }}</span>
                            STH
                          </li>
                          <li class="list-group-item">
                            {{ $t("modal_vote_produced_blocks") }}
                            <span class="text-info">{{
                              foundDelegate.blocks.produced
                            }}</span>
                          </li>
                        </ul>
                        <button
                          :disabled="!foundDelegate"
                          @click="voteForDelegate"
                          type="button"
                          class="btn btn-sm text-uppercase"
                          :class="
                            !foundDelegate ? 'btn-secondary' : 'btn-success'
                          "
                        >
                          {{ $t("modal_vote_button") }}
                          {{ foundDelegate ? foundDelegate.username : "" }}
                        </button>
                      </card-body>
                    </card>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="voteResult">
            <card>
              <card-header class="card-header">
                {{ $t("modal_vote_result_title") }}
              </card-header>
              <card-body>
                <!--{{voteResult}}-->
                <span class="text-success">{{ $t("modal_vote_success") }}</span>
              </card-body>
            </card>
          </div>
          {{ $t("modal_vote_power") }} {{ balanceDecimal }} STH
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStoreWallet } from "@/stores/wallet.ts";
const storeWallet = useStoreWallet();

export default {
  name: "ModalVote",
  props: {
    address: String,
  },
  data() {
    return {
      txSendStep: 0,
      timerDelegateSearch: null,
      foundDelegate: null,
      nameIsValid: false,
      forSend: {
        userName: "",
      },
      voteResult: null,
    };
  },
  computed: {
    balanceDecimal() {
      return this.currentAddress.balance / 10 ** 8;
    },
    currentAddress() {
      return storeWallet.attributes[this.address];
    },
  },
  mounted() {
    this.searchClear();
  },
  methods: {
    searchClear() {
      this.foundDelegate = null;
      this.forSend.userName = "";
      this.voteResult = null;
    },
    async voteForDelegate() {
      this.voteResult = await storeWallet.txVote({
        sender: this.address,
        delegatePublicKey: this.foundDelegate.publicKey,
        lastVote: this.currentAddress.attributes.vote || null,
      });
    },
    async validateDelegate() {
      clearTimeout(this.timerDelegateSearch);
      this.timerDelegateSearch = setTimeout(async () => {
        this.voteResult = null;
        this.foundDelegate = await storeWallet.getDelegate(
          this.forSend.userName.toLowerCase()
        );
      }, 800);
    },
  },
};
</script>

<style scoped></style>
