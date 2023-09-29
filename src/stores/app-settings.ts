import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const useStore = defineStore('appSettings', {
  state: () => ({
    settings: useStorage('appSettings', {
      darkMode: true,
      advancedMode: false,
      language: "",
      currency: "USDT",
      lockScreen: 600,
    }),
  }),
  actions: {
    updateSettings(partialSettings: any) {
      this.settings = {
        ...this.settings,
        ...partialSettings,
      }
      //localStorage.setItem('main', JSON.stringify(this.settings))
    },

  },

  persist: true,
})
