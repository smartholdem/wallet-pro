import { defineStore } from "pinia";
import { generateMnemonic, validateMnemonic } from "bip39";
import { Transactions, Managers, Utils, Identities } from "@smartholdem/crypto";
import { Connection } from "@smartholdem/client";
import CryptoJS from "crypto-js";
import axios from "axios";
import web3 from "web3";

import { storeToRefs } from "pinia";
import { useStoreSettings } from "@/stores/app-settings.ts";

const storeSettings = useStoreSettings();

const activeNode = "https://" + storeSettings.activeNode + "/api";


const client = new Connection(activeNode);
Managers.configManager.setFromPreset("mainnet");
Managers.configManager.setHeight(539000);

export const useStoreWallet = defineStore("walletStorage", {
  state: () => ({
    accounts: {},
    attributes: {},
    transactions: {},
    delegates: {},
    nodeConfig: {},
    blockchain: {},
    smartHolder: {},
    addressBook: {}
  }),
  actions: {
    /**
     *
     * @param options
     * address - string
     * label - string
     * network - string
     */
    async addInAddressBook(options: object) {
      const result = {};
      result[options.address] = options;
      this.addressBook = {
        ...this.addressBook,
        ...result
      };
    },
    async validateAddressCrossChain(address: string) {
      let result = false;
      try {
        result = await web3.utils.isAddress(address);
      } catch (e) {
        console.log("err validator");
      }
      return result;
    },
    async getSmartHolder() {
      let result = {};
      try {
        result = (await axios.get("https://smartholder.xbts.io/api/public/percents")).data;
        this.smartHolder = result;
      } catch (e) {
        console.log("err: get smartHolder");
      }
    },
    async getBlockchain() {
      let result = {};
      try {
        result = (await axios.get(activeNode + "/blockchain")).data.data;
        this.blockchain = result;
      } catch (e) {
        console.log("err: get blockchain");
      }
    },
    async validateAddress(address: string) {
      return Identities.Address.validate(address);
    },
    async getNodeConfig() {
      let result = {};
      try {
        result = (await axios.get(activeNode + "/node/configuration")).data.data;
        this.nodeConfig = result;
      } catch (e) {
        console.log("err: get node config");
      }
    },
    async getDelegate(userName: string) {
      let result = null;
      try {
        result = (await axios.get(activeNode + "/delegates/" + userName)).data.data;
      } catch (e) {
        console.log("err: get delegate " + userName);
      }
      return result;
    },
    async getDelegates() {
      let result = {};
      try {
        result = (await axios.get(activeNode + "/delegates?page=1&limit=100")).data;
        this.delegates = {
          ...this.delegates,
          ...result
        };
      } catch (e) {
        console.log("err: get delegates");
      }
    },
    async txVotePrepare(payload: object) {
      return Transactions.BuilderFactory.vote()
        .version(2)
        .nonce(payload.senderNonce.toFixed())
        .votesAsset([payload.vote + payload.delegatePublicKey])
        .sign(payload.secretDecrypted);
    },
    async txVote(payload: object) {
      const txs = [];
      const secretDecrypted = await this.decryptByAddress(payload.sender);
      // Step 1: Retrieve the incremental nonce of the sender wallet
      const senderWallet = await client.api("wallets").get(payload.sender);
      const senderNonce = Utils.BigNumber.make(senderWallet.body.data.nonce).plus(1);

      if (payload.lastVote) {
        // Step 2: Create the transaction
        const transactionUnVote = await this.txVotePrepare({
          vote: "-",
          senderNonce: senderNonce,
          delegatePublicKey: payload.lastVote,
          secretDecrypted: secretDecrypted,
        });
        txs.push(transactionUnVote.build().toJson())
      }

      // Step 2: Create the transaction
      const transactionVote = await this.txVotePrepare({
        vote: "+",
        senderNonce: senderNonce,
        delegatePublicKey: payload.delegatePublicKey,
        secretDecrypted: secretDecrypted,
      });

      txs.push(transactionVote.build().toJson())
      // Step 4: Broadcast the transaction
      let broadcastResponse = {};
      try {
        broadcastResponse = await client.api("transactions").create({ transactions: txs });
      } catch (e) {
        console.log("err: tx vote");
      }
      return {
        response: broadcastResponse,
        tx: txs,
        network: "mainnet"
      };
    },
    /**
     * Delegate Registration
     * @param payload
     */
    async txDelegateRegistration(payload: object) {
      const secretDecrypted = await this.decryptByAddress(payload.sender);
      // Step 1: Retrieve the incremental nonce of the sender wallet
      const senderWallet = await client.api("wallets").get(payload.sender);
      const senderNonce = Utils.BigNumber.make(senderWallet.body.data.nonce).plus(1);
      // Step 2: Create the transaction
      const transaction = Transactions.BuilderFactory.delegateRegistration()
        .version(2)
        .nonce(senderNonce.toFixed())
        .usernameAsset(payload.username)
        .sign(secretDecrypted);
      // Step 4: Broadcast the transaction
      const tx = transaction.build().toJson();
      let broadcastResponse = {};
      try {
        broadcastResponse = await client.api("transactions").create({ transactions: [tx] });
      } catch (e) {
        console.log("err: tx delegate");
      }
      return {
        response: broadcastResponse,
        tx: [tx],
        network: "mainnet"
      };

    },
    /**
     * Transfer coins
     * @param payload
     */
    async txTransfer(payload: object) {
      //console.log(payload)
      const txs = [];
      const secretDecrypted = await this.decryptByAddress(payload.sender);
      // Step 1: Retrieve the incremental nonce of the sender wallet
      const senderWallet = await client.api("wallets").get(payload.sender);
      const senderNonce = Utils.BigNumber.make(senderWallet.body.data.nonce).plus(1);


      if (payload.network == "mainnet") {
        const transaction = Transactions.BuilderFactory.transfer()
          .fee((payload.fee * 1e8).toString())
          .version(2)
          .nonce(senderNonce.toFixed())
          .recipientId(payload.recipientId)
          .amount((payload.amount * 1e8).toFixed(0))
          .vendorField(payload.memo)
          .sign(secretDecrypted);
        txs.push(transaction.build().toJson());
      } else {
        const transaction = Transactions.BuilderFactory.transfer()
          .fee((payload.fee * 1e8).toString())
          .version(2)
          .nonce(senderNonce.toFixed())
          .recipientId("STQnKW8JQ6cMKwLrcfdfMwhChyHUysccts")
          .amount(((payload.amount) * 1e8).toFixed(0))
          .vendorField(payload.memo)
          .sign(secretDecrypted);
        txs.push(transaction.build().toJson());
      }
      let broadcastResponse = {};
      try {
        broadcastResponse = (await client.api("transactions").create({ transactions: txs })).body.data;
      } catch (e) {
        console.log("err: tx send");
      }
      return {
        response: broadcastResponse,
        tx: txs[0],
        network: payload.network
      };
    },
    async getTransactions(address, limit = 10, page = 1) {
      if (!address) {
        return;
      }
      const result = {};
      result[address] = {};
      try {
        result[address] = (await axios.get(activeNode + "/wallets/" + address + "/transactions?page=" + page + "&limit=" + limit)).data;
        this.transactions = {
          ...this.transactions,
          ...result
        };
      } catch (e) {
        console.log("err: address not stored in blockchain");
      }
      return result[address];
    },
    async getAttributes(address) {
      if (!address) {
        return;
      }
      const result = {};
      result[address] = {};
      try {
        result[address] = (await axios.get(activeNode + "/wallets/" + address)).data.data;
        this.attributes = {
          ...this.attributes,
          ...result
        };
      } catch (e) {
        result[address] = {
          publicKey: false
        };
        console.log("err: address not stored in blockchain");
      }

      return result;
    },
    async addressNew() {
      const mnemonic = generateMnemonic();
      return {
        secret: mnemonic,
        address: Identities.Address.fromPassphrase(mnemonic, 63)
      };
    },
    async addressSave(payload: object) {
      console.log(payload);
      this.accounts = {
        ...this.accounts,
        ...payload
      };
    },
    addressDelete(address) {
      const keys = Object.keys(this.accounts);
      const accounts = {};
      for (let i = 0; i < keys.length; i++) {
        accounts[keys[i]] = this.accounts[keys[i]];
      }
      delete accounts[address];
      this.accounts = accounts;
    },
    async addressDecrypt(secret: string) {
      if (!secret) {
        console.log("no secret");
        return;
      }
      console.log("cipher secret", secret);
      const hash = CryptoJS.SHA384(storeSettings.tmpPin).toString();
      const accountBytes = CryptoJS.AES.decrypt(
        secret.toString(),
        storeSettings.tmpPin + hash
      );
      return accountBytes.toString(CryptoJS.enc.Utf8); //
    },
    async decryptByAddress(address: string) {
      const hash = CryptoJS.SHA384(storeSettings.tmpPin).toString();
      let result = "";
      if (this.accounts[address].encrypt == "rabbit") {
        const accountBytes = await CryptoJS.Rabbit.decrypt(
          this.accounts[address].secret,
          storeSettings.tmpPin + hash
        );
        result = accountBytes.toString(CryptoJS.enc.Utf8); //
      } else {
        const accountBytes = await CryptoJS.AES.decrypt(
          this.accounts[address].secret,
          storeSettings.tmpPin + hash
        );
        result = accountBytes.toString(CryptoJS.enc.Utf8); //
      }
      return result;
    },
    addressFromPassword(secret: string) {
      const isBip39 = validateMnemonic(secret);
      const address = Identities.Address.fromPassphrase(secret, 63);
      return {
        isBip39: isBip39,
        address: address
      };
    }
  },
  persist: true
});
