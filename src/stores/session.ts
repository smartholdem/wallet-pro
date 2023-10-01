import { defineStore } from "pinia";

export const useAppOptionStore = defineStore({
  id: "appSession",
  state: () => {
    return {
      pin: '',
    }
  }
});
