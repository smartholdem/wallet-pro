<template>
  <div class="modal fade modal-transfer" id="modalDelegateReg">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">New Delegate Registration</h5>
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
                      >Delegate Name
                      <i class="fa fa-address-book hover-info"></i>
                      <i
                        @click="searchClear"
                        title="clear search"
                        class="ms-2 fas fa-lg fa-fw me-2 fa-window-close text-secondary hover-info float-right pointer"
                      ></i>
                    </label>
                    <input
                      v-model="userName"
                      @input="validateDelegate"
                      type="text"
                      class="form-control form-control"
                      :class="
                        !foundDelegate && userName.length > 3
                          ? 'is-valid'
                          : 'is-invalid'
                      "
                      id="sendDelegateName"
                      placeholder="enter delegate name"
                    />
                  </div>

                  <p>
                    Before registering as a delegate, please familiarize
                    yourself with the
                    <a
                      target="_blank"
                      href="https://github.com/smartholdem/sth-core#smartholdem-core-blockchain"
                      >node installation</a
                    >
                  </p>

                  <div v-if="foundDelegate">
                    <card>
                      <card-header class="card-header fw-bold text-warning">
                        <i class="fas fa-lg fa-fw me-1 fa-university"></i
                        >DELEGATE is exist
                        <span class="text-info">{{
                          foundDelegate.username
                        }}</span>
                      </card-header>
                      <card-body>
                        <ul class="list-group list-group-flush">
                          <li class="list-group-item">
                            Rank
                            <span class="text-info">{{
                              foundDelegate.rank
                            }}</span>
                          </li>
                          <li class="list-group-item">
                            Votes
                            <span class="text-info">{{
                              (foundDelegate.votes / 10 ** 8).toFixed(8)
                            }}</span>
                            STH
                          </li>
                          <li class="list-group-item">
                            Forged fees
                            <span class="text-info">{{
                              (foundDelegate.forged.total / 10 ** 8).toFixed(8)
                            }}</span>
                            STH
                          </li>
                          <li class="list-group-item">
                            Produced blocks
                            <span class="text-info">{{
                              foundDelegate.blocks.produced
                            }}</span>
                          </li>
                        </ul>
                      </card-body>
                    </card>
                  </div>

                  <div v-if="!foundDelegate && userName.length > 3">
                    <p>
                      Fee 10 000 STH
                      <span class="small">(balance {{ balanceDecimal }})</span>
                    </p>
                    <button
                      :disabled="balanceDecimal < 10001"
                      @click="delegateRegister"
                      type="button"
                      class="btn btn-sm"
                      :class="foundDelegate ? 'btn-secondary' : 'btn-success'"
                    >
                      REGISTER - {{ userName }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="txSendStep === 1">
              <div v-if="txResult">
                <card>
                  <card-header class="card-header">
                    Delegate registration result
                  </card-header>
                  <card-body>
                    <p>{{ txResult }}</p>
                    <span class="text-success">Success!</span>
                  </card-body>
                </card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStoreWallet } from "@/stores/wallet.ts";
const storeWallet = useStoreWallet();

export default {
  name: "ModalDelegateReg",
  props: {
    address: String,
  },
  data() {
    return {
      txSendStep: 0,
      timerDelegateSearch: null,
      foundDelegate: null,
      nameIsValid: false,
      userName: "",
      txResult: null,
    };
  },
  mounted() {
    this.searchClear();
  },
  computed: {
    balanceDecimal() {
      return this.currentAddress.balance / 10 ** 8;
    },
    currentAddress() {
      return storeWallet.attributes[this.address];
    },
  },
  methods: {
    async delegateRegister() {
      this.txResult = await storeWallet.txDelegateRegistration({
        sender: this.address,
        username: this.userName,
      });
      this.txSendStep = 1;
    },
    searchClear() {
      this.txSendStep = 0;
      this.foundDelegate = null;
      this.userName = "";
      this.txResult = null;
    },
    async validateDelegate() {
      this.userName = this.userName.toLowerCase();
      const p = /[^a-z0-9]+/g;
      this.userName = this.userName.replace(p, "");
      clearTimeout(this.timerDelegateSearch);
      this.timerDelegateSearch = setTimeout(async () => {
        this.voteResult = null;
        this.foundDelegate = await storeWallet.getDelegate(this.userName);
      }, 800);
    },
  },
};
</script>

<style scoped></style>
