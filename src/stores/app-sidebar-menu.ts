import { defineStore } from "pinia";

export const useAppSidebarMenuStore = defineStore({
  id: "appSidebarMenu",
  state: () => {
    return [
      {
        "text": "Navigation",
        "is_header": true
      },
      {
        "url": "/",
        "icon": "fas fa-user",
        "text": "Wallet"
      },
      {
        "url": "/delegates",
        "icon": "fas fa-list-ol",
        "text": "Delegates"
      },
      {
        "url": "/blockchain",
        "icon": "fas fa-braille",
        "text": "Blockchain"
      },
      {
        "url": "/address-book",
        "icon": "fas fa-address-book",
        "text": "Address Book"
      },
      /**
      {
        "url": "/settings",
        "icon": "bi bi-gear",
        "text": "Settings"
      },
      {
        "url": "/dashboard",
        "icon": "bi bi-cpu",
        "text": "Dashboard"
      },
      {
        "url": "/analytics",
        "icon": "bi bi-bar-chart",
        "text": "Analytics"
      },
      **/
    ];
  }

});
