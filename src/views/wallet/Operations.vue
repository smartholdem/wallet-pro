<template>
  <div>

    <card class="h-100">
      <card-header class="card-header fw-bold small">
        OPERATIONS
      </card-header>
      <card-body>
        <div v-if="!currentAddress" class="btn-group mb-3">
          <button data-bs-toggle="modal" data-bs-target="#modalQr" type="button" class="btn btn-outline-theme">
            <i class="fas fa-lg fa-fw fa-qrcode" aria-hidden="true"></i>
          </button>
          <button @click="decryptSecret()" data-bs-toggle="modal" data-bs-target="#modalDecryptAddress" type="button"
                  class="btn btn-outline-theme">
            <i class="fa fa-key" aria-hidden="true"></i>
          </button>
        </div>

        <div v-if="currentAddress" class="btn-group mb-3">
          <button @click="sendTabPrepare" type="button" class="btn btn-outline-theme">
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

          <button v-if="!currentAddress.attributes.delegate" disabled="true" @click="operation = 3" type="button" class="btn btn-outline-theme">
            DELEGATE REG
          </button>

          <button disabled="true" @click="operation = 4" type="button" class="btn btn-outline-theme">
            VOTE
          </button>
        </div>


        <div v-if="operation === 1" class="w-100">
          <!-- send sth prepare tx -->
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
                  <label class="form-label px-4" :class="'ico-' + selectedNetwork" for="sendAmount" >Network</label>
                  <select v-model="selectedNetwork" @change="validateAddress" class="form-select form-select-sm" id="sendNetwork">
                    <option selected value="mainnet">MainNet</option>
                    <!--<option value="bsc">BSC</option>-->
                    <option value="heco">HECO</option>
                    <!--<option disabled value="eth">Ethereum</option>-->
                  </select>
                </div>
              </div>

            </div>
            <div>
              <button :disabled="((forSend.amount * 1 + networksTransfer[selectedNetwork].fee) > balanceDecimal) || !forSend.addressIsValid || forSend.amount < 0.001 || !forSend.recipientId || forSend.recipientId === this.$route.params.address" @click="txSend" type="button" class="btn btn-success btn-sm">SEND STH</button>
            </div>
          </div>

          <!-- tx result -->
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
            <p class="mb-3" v-show="waitConfirmTx">
              Please wait confirmation.
            </p>
            <p>
              <button @click="sendTabPrepare" type="button" class="btn btn-sm" :class="txErr > 0 ? 'btn-danger' : 'btn-success'">CONTINUE</button>
            </p>
          </div>
        </div>
      </card-body>
    </card>

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
export default {
  name: "OperationsComponent"
};
</script>

<style scoped>

</style>
