<!-- Не забудь вынести транзакции в отдельный модуль -->
<template>
  <div class="col-xl-12 mb-3">
    <card v-if="transactions && !isMobile" style="overflow: hidden">
      <card-header class="card-header fw-bold small text-uppercase"
      >Transactions
      </card-header
      >
      <card-body style="overflow-x: auto">
        <table class="table table-hover">
          <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">id</th>
            <th scope="col">Time</th>
            <th scope="col">Amount</th>
            <th scope="col">Sender</th>
            <th scope="col">Recipient</th>
            <th scope="col">Fee</th>
            <th scope="col" title="confirmations">
              <i class="fas fa-fw fa-clock"></i>
            </th>
            <th scope="col">Memo</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="newTx && transactions.data[0].id !== newTx.id" class="text-secondary">
            <td class="text-secondary">
              {{ newTx.id.slice(0, 5) }} .. {{ newTx.id.slice(-5) }}
            </td>
            <td class="text-secondary">Now</td>
            <td class="text-secondary">
              <i class="text-secondary fas fa-sm fa-fw me-2 fa-angle-double-up"></i>
              {{ (newTx.amount / 1e8).toFixed(8) }}
            </td>
            <td class="text-secondary">
              {{ address.slice(0, 5) }} .. {{ address.slice(-5) }}
            </td>
            <td class="text-secondary">
              {{ newTx.recipientId.slice(0, 5) }} ..
              {{ newTx.recipientId.slice(-5) }}
            </td>
            <td class="text-secondary">{{ (newTx.fee / 1e8).toFixed(3) }}</td>
            <td class="text-secondary">
              <i class="fas fa-fw fa-hourglass"></i>
            </td>
            <td class="text-secondary">
              {{ newTx.vendorField ? newTx.vendorField : "" }}
            </td>
          </tr>

          <tr
            v-for="(item, index) in transactions.data"
            :key="item.id"
            :class="item.confirmations < 8 ? 'table-dark' : ''"
          >
            <td>
              {{ index + 1 + (tbPage - 1) * 10 }}
            </td>
            <td :title="item.id">
                <span v-if="item.type === 3">
                  <i
                    title="Vote+"
                    class="text-success fas fa-fw me-2 fa-plus-circle"
                  ></i>
                </span>

              <span v-if="item.vendorField">
                  <span
                    v-if="networksTransfer[item.vendorField.split(':')[0]]"
                    :class="'ico-' + item.vendorField.split(':')[0]"
                    style="padding: 3px 16px 3px 3px;">&nbsp;</span>
                </span>
              <span v-if="item.sender === 'SR1W4qS8DCPN65oV9Jd8JSLbfU5vhmEEky'">
                  <span
                    :class="'ico-telegram'"
                    style="padding: 3px 16px 3px 3px;">&nbsp;</span>
                </span>

              <span
                v-if="item.sender === 'Sau5rthYK9fCmzrAAzLDLNbmsWMYosSAsb'"
              >
                  <span
                    :class="'ico-xbts'"
                    style="padding: 3px 16px 3px 3px;">&nbsp;</span>
                </span>

              <a
                :class="
                    item.recipient === this.address
                      ? 'text-success'
                      : 'text-default'
                  "
                :href="
                    'https://explorer.smartholdem.io/#/transaction/' + item.id
                  "
                target="_blank"
              >
                  <span>
                    {{ item.id.slice(0, 5) }} .. {{ item.id.slice(-5) }}
                  </span>
              </a>
            </td>
            <td>
                <span
                  :class="item.recipient === this.address ? 'text-success' : ''"
                >
                  {{ tmFormat(item.timestamp.unix, "DD/MM/YY") }}
                  <span class="small">{{
                      format_time(item.timestamp.unix * 1000)
                    }}</span>
                </span>
            </td>
            <td>
              <i
                :class="
                    item.recipient === this.address && item.amount > 0
                      ? 'text-warning fas fa-sm fa-fw me-2 fa-angle-double-down'
                      : 'text-info fas fa-sm fa-fw me-2 fa-angle-double-up'
                  "
              ></i>
              <span
                :class="item.recipient === this.address || item.type === 6 ? 'text-success' : ''"
              >
                  {{ item.type === 6 ? "MultiPay (" + item["asset"].payments.length + ")" : (item.amount / 1e8).toFixed(8)
                }}
                </span>
              <div v-if="item.type === 6">
                <div v-for="itm in item.asset.payments" v-show="itm.recipientId === this.address"
                     v-bind:key="itm.recipientId">
                  {{ itm.amount / 1e8 }}
                </div>
              </div>

            </td>
            <td>
              <a
                :class="
                    item.recipient === this.address
                      ? 'text-success'
                      : 'text-default'
                  "
                :href="
                    'https://explorer.smartholdem.io/#/wallets/' + item.sender
                  "
                target="_blank"
              >
                  <span>
                    {{ item.sender.slice(0, 5) }} .. {{ item.sender.slice(-5) }}
                  </span>
              </a>
            </td>
            <td>
              <a
                :class="
                    item.recipient === this.address
                      ? 'text-success'
                      : 'text-default'
                  "
                :href="
                    'https://explorer.smartholdem.io/#/wallets/' +
                    item.recipient
                  "
                target="_blank"
              >
                  <span
                  >{{ item.recipient.slice(0, 5) }} ..
                    {{ item.recipient.slice(-5) }}</span
                  >
              </a>
            </td>
            <td>
                <span
                  :class="item.recipient === this.address ? 'text-success' : ''"
                >{{ (item.fee / 1e8).toFixed(3) }}</span
                >
            </td>
            <td>
                <span
                  v-if="item.recipient === this.address"
                  :class="
                    item.confirmations > 7 ? 'text-success' : 'text-warning'
                  "
                >{{ item.confirmations }}</span
                >
              <span
                v-if="item.recipient !== this.address"
                :class="
                    item.confirmations > 7 ? 'text-default' : 'text-warning'
                  "
              >{{ item.confirmations }}</span
              >
            </td>
            <td>
              <span v-if="item.type === 3"> Vote+ </span>
              <span>{{ item.vendorField }}</span>
            </td>
          </tr>
          </tbody>
        </table>
        <div>
          <!--
                    <div class="btn-toolbar">
                      <div class="btn-group me-2">
                        <button :disabled="tbPage === 1" @click="txsPageSelect(1)" type="button" class="btn btn-outline-secondary"><i class="fas fa-lg fa-fw me-2 fa-angle-double-left"></i></button>
                        <button :disabled="tbPage === 1" @click="txsPageSelect(tbPage - 1)" type="button" class="btn btn-outline-secondary"><i class="fas fa-lg fa-fw me-2 fa-angle-left"></i></button>
                        <button @click="txsPageSelect(tbPage)" type="button" :class="tbPage === 1 ? 'btn  btn-success' : 'btn btn-outline-secondary'">{{tbPage}}</button>
                        <button :disabled="transactions.data.length < 10" @click="txsPageSelect(tbPage+1)" type="button" :class="tbPage === 2 ? 'btn  btn-success' : 'btn btn-outline-secondary'">{{tbPage+1}}</button>
                        <button :disabled="transactions.data.length < 10" @click="txsPageSelect(tbPage + 1)" type="button" class="btn btn-outline-secondary"><i class="fas fa-lg fa-fw me-2 fa-angle-double-right"></i></button>
                        <button :disabled="transactions.data.length < 10" @click="txsPageSelect(tbPage + 1)" type="button" class="btn btn-outline-secondary"><i class="fas fa-lg fa-fw me-2 fa-angle-right"></i></button>
                      </div>
                    </div>
          -->
        </div>
      </card-body>
    </card>
    <!-- tx mobile -->
    <div v-if="transactions && isMobile" style="overflow: hidden">
      <card>
        <div class="card-header fw-bold small text-uppercase">Transactions</div>
      </card>

      <card>
        <card-body
          v-if="newTx && transactions.data[0].id !== newTx.id"
          class="overflow-hidden text-secondary"
        >
          <transition name="slide-fade">
            <table class="table table-striped">
              <tbody>
              <tr>
                <td>id</td>
                <td class="text-secondary">
                  {{ newTx.id.slice(0, 5) }} .. {{ newTx.id.slice(-5) }}
                </td>
              </tr>
              <tr>
                <td>Time</td>
                <td class="text-secondary">Now</td>
              </tr>
              <tr>
                <td>Amount</td>
                <td class="text-secondary">
                  <i
                    class="text-secondary fas fa-sm fa-fw me-2 fa-angle-double-up"
                  ></i>
                  {{ (newTx.amount / 1e8).toFixed(8) }}
                </td>
              </tr>
              <tr>
                <td>Sender</td>
                <td class="text-secondary">
                  {{ address.slice(0, 5) }} .. {{ address.slice(-5) }}
                </td>
              </tr>
              <tr>
                <td>Recipient</td>
                <td class="text-secondary">
                  {{ newTx.recipientId.slice(0, 5) }} ..
                  {{ newTx.recipientId.slice(-5) }}
                </td>
              </tr>
              <tr>
                <td>Fee</td>
                <td class="text-secondary">
                  {{ (newTx.fee / 1e8).toFixed(3) }}
                </td>
              </tr>
              <tr>
                <td>Confirmations</td>
                <td><i class="fas fa-fw fa-clock text-info"></i></td>
              </tr>
              <tr v-if="newTx.vendorField">
                <td>Memo</td>
                <td class="text-secondary">
                  {{ newTx.vendorField ? newTx.vendorField : "" }}
                </td>
              </tr>
              </tbody>
            </table>
          </transition>
        </card-body>
      </card>

      <card v-for="item in transactions.data" :key="item.id">
        <card-body class="overflow-hidden">
          <table class="table table-striped">
            <tbody>
            <tr>
              <td>id</td>
              <td>
                  <span
                    v-if="item.sender === 'Sau5rthYK9fCmzrAAzLDLNbmsWMYosSAsb'"
                  >
                    <span
                        :class="'ico-xbts'"
                        style="padding: 3px 16px 3px 3px;"
                    >&nbsp;</span
                    >
                  </span>
                <span v-if="item.vendorField">
                    <span
                      v-if="networksTransfer[item.vendorField.split(':')[0]]"
                      :class="'ico-' + item.vendorField.split(':')[0]"
                      style="padding: 3px 16px 3px 3px;"
                    >&nbsp;</span
                    >
                  </span>
                <a
                  :class="
                      item.recipient === this.address
                        ? 'text-success'
                        : 'text-default'
                    "
                  :href="
                      'https://explorer.smartholdem.io/#/transaction/' + item.id
                    "
                  target="_blank"
                >
                    <span>
                      {{ item.id.slice(0, 11) }}..{{ item.id.slice(-11) }}
                    </span>
                </a>
              </td>
            </tr>
            <tr>
              <td>Time</td>
              <td>
                  <span
                    :class="
                      item.recipient === this.address ? 'text-success' : ''
                    "
                  >
                    {{ tmFormat(item.timestamp.unix, "DD/MM/YY") }}
                    <span class="small">{{
                        format_time(item.timestamp.unix * 1000)
                      }}</span>
                  </span>
              </td>
            </tr>
            <tr>
              <td>Amount</td>
              <td>
                  <span
                    :class="item.recipient === this.address || item.type === 6 ? 'text-success' : ''"
                  >
                  {{ item.type === 6 ? "MultiPay (" + item["asset"].payments.length + ")" : (item.amount / 1e8).toFixed(8)
                    }}
                </span>
                <div v-if="item.type === 6">
                  <div v-for="itm in item.asset.payments" v-show="itm.recipientId === this.address"
                       v-bind:key="itm.recipientId">
                    +{{ itm.amount / 1e8 }} STH
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="item.type !== 6">
              <td>Sender</td>
              <td>
                  <span
                    :class="
                      item.recipient === this.address ? 'text-success' : ''
                    "
                  >
                    {{ item.sender.slice(0, 11) }}..{{ item.sender.slice(-11) }}
                  </span>
              </td>
            </tr>
            <tr v-if="item.type !== 6">
              <td>Recipient</td>
              <td>
                  <span
                    :class="
                      item.recipient === this.address ? 'text-success' : ''
                    "
                  >
                    {{ item.recipient.slice(0, 11) }}..{{
                      item.recipient.slice(-11)
                    }}
                  </span>
              </td>
            </tr>
            <tr>
              <td>Fee</td>
              <td>
                  <span
                    :class="
                      item.recipient === this.address ? 'text-success' : ''
                    "
                  >{{ (item.fee / 1e8).toFixed(3) }}</span
                  >
              </td>
            </tr>
            <tr>
              <td>Confirmations</td>
              <td>
                  <span
                    v-if="item.recipient === this.address"
                    :class="
                      item.confirmations > 7 ? 'text-success' : 'text-warning'
                    "
                  >{{ item.confirmations }}</span
                  >
                <span
                  v-if="item.recipient !== this.address"
                  :class="
                      item.confirmations > 7 ? 'text-default' : 'text-warning'
                    "
                >{{ item.confirmations }}</span
                >
              </td>
            </tr>

            <tr v-if="item.vendorField">
              <td>Memo</td>
              <td>
                  <span>{{
                      item.vendorField.length < 40
                        ? item.vendorField
                        : item.vendorField.slice(0, 25) + ".."
                    }}</span>
              </td>
            </tr>
            </tbody>
          </table>
        </card-body>
      </card>
    </div>

    <div v-if="!transactions">No transactions</div>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useAppOptionStore } from "@/stores/app-option";

const appOption = useAppOptionStore();

import { useStoreWallet } from "@/stores/wallet";
import moment from "moment";

const storeWallet = useStoreWallet();

export default {
  name: "ComponentTransactions",
  props: {
    address: String,
    newTx: {}
  },

  data() {
    // Table config
    return {
      hideNewTx: true,
      isMobile: appOption.isMobile,
      timerTx: null,
      networksTransfer: {
        mainnet: true,
        ton: true,
        bsc: true,
        eth: true
      },
      tbPage: 1
    };
  },
  computed: {
    transactions() {
      return storeWallet.transactions[this.address];
    }
  },
  methods: {
    async txsPageSelect(page) {
      if (page < 1) {
        this.tbPage = 1;
      } else {
        this.tbPage = page;
        await storeWallet.getTransactions(this.address, 10, this.tbPage);
      }
    },
    tmFormat(tm, format = "MM/DD/YYYY") {
      moment.locale("pt-br");
      return moment.unix(tm).format(format);
    },
    format_time(s) {
      const dtFormat = new Intl.DateTimeFormat("ru", {
        timeStyle: "medium"
        //timeZone: "UTC"
      });
      return dtFormat.format(new Date(s));
    }
  }
};
</script>

<style scoped>
.ico-ton {
  background-image: url('/images/ton.svg');
  background-position: 0 2px;
  background-repeat: no-repeat;
  background-size: 16px;
}

</style>
