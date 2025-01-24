import { defineStore } from "pinia";
//import { useStorage } from "@vueuse/core";
import CryptoJS from "crypto-js";
import axios from "axios";

export const useStoreSettings = defineStore("appSettings", {
  state: () => ({
    settings: {
      darkMode: true,
      advancedMode: false,
      language: "",
      currency: "USDT",
      lockScreen: 600,
      pinCode: ""
    },
    tmpPin: "",
    nodes: [
      "node0.sth.cx",
      "node4.smartholdem.io",
      "node5.smartholdem.io",
      "node2.smartholdem.io",
      "node0.smartholdem.io",
      "node1.smartholdem.io",
    ],
    activeNode: "node2.smartholdem.io",
  }),
  actions: {
    async updateNodes() {
      this.activeNode = "node2.smartholdem.io";
      //setTimeout(async () => {
      for (let i = 0; i < this.nodes.length; i++) {
        let nodeStatus = null;
        try {
          nodeStatus = (
            await axios.get("https://" + this.nodes[i] + "/api/node/status")
          ).data;
          if (nodeStatus.synced) {
            this.activeNode = this.nodes[i];
          }
        } catch (e) {
          console.log("node err", this.nodes[i]);
        }
      }
      console.log("activeNode", this.activeNode);
      // }, 120);
    },
    updateSettings(partialSettings: object) {
      this.settings = {
        ...this.settings,
        ...partialSettings
      };
      //localStorage.setItem('appSettings', JSON.stringify(this.settings))
    },
    savePinCode(pin: string) {
      this.settings.pinCode = CryptoJS.SHA384(pin).toString();
      //console.log('sha384', this.settings.pinCode)
    },
    validatePinCode(password: string) {
      const pinSha384 = CryptoJS.SHA384(password).toString();
      return pinSha384 === this.settings.pinCode;
    }
  },
  persist: true
});
