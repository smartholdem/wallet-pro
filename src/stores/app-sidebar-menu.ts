import { defineStore } from "pinia";

export const useAppSidebarMenuStore = defineStore({
  id: "appSidebarMenu",
  state: () => {
    return [
      {
        text: "navigation",
        is_header: true,
      },
      {
        url: "/",
        icon: "fas fa-user",
        text: "wallet",
      },
      {
        url: "/delegates",
        icon: "fas fa-list-ol",
        text: "delegates",
      },
      {
        url: "/blockchain",
        icon: "fas fa-braille",
        text: "blockchain",
      },
      {
        url: "/address-book",
        icon: "fa fa-address-book",
        text: "address_book",
      },
      /**
      {
        "url": "/settings",
        "icon": "bi bi-gear",
        "text": "settings"
      },
      {
        "url": "/dashboard",
        "icon": "bi bi-cpu",
        "text": "dashboard"
      },
      {
        "url": "/analytics",
        "icon": "bi bi-bar-chart",
        "text": "analytics"
      },
      **/
    ];
  },
});
