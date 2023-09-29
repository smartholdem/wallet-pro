import { defineStore } from "pinia";
//import { useStorage } from "@vueuse/core";

export const useStore = defineStore('appSettings', {
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
  },
  persist: true,
});
