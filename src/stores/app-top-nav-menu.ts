import { defineStore } from "pinia";

export const useAppTopNavMenuStore = defineStore({
  id: "appTopNavMenu",
  state: () => {
    return [
      {
        url: "/",
        icon: "bi bi-cpu",
        text: "Dashboard",
      },
    ];
  },
});
