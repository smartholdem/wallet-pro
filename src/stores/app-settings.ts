import { defineStore } from "pinia";
//import { useStorage } from "@vueuse/core";
import CryptoJS from 'crypto-js'

export const useStoreSettings = defineStore('appSettings', {
  state: () => ({
    /*
    settings: useStorage('appSettings', {
      darkMode: true,
      advancedMode: false,
      language: "",
      currency: "USDT",
      lockScreen: 600,
    }),
     */
    settings: {
      darkMode: true,
      advancedMode: false,
      language: "",
      currency: "USDT",
      lockScreen: 600,
      pinCode: "",
    },
  }),
  actions: {
    updateSettings(partialSettings: object) {
      this.settings = {
        ...this.settings,
        ...partialSettings,
      };
      //localStorage.setItem('appSettings', JSON.stringify(this.settings))
    },
    savePinCode(pin: string) {
      this.settings.pinCode = CryptoJS.SHA384(pin).toString();
      //console.log('sha384', this.settings.pinCode)
    },
  },
  persist: true,
});
