import { defineStore } from "pinia";

export const useAppOptionStore = defineStore({
  id: "appOption",
  state: () => {
    return {
      appMode: "dark",
      appThemeClass: "",
      appCoverClass: "bg-cover-1",
      appBoxedLayout: false,
      appHeaderHide: false,
      appHeaderSearchToggled: false,
      appSidebarCollapsed: false,
      appSidebarMobileToggled: false,
      appSidebarMobileClosed: false,
      appSidebarHide: false,
      appContentFullHeight: false,
      appContentClass: "",
      appTopNav: false,
      appFooter: false,
      appFooterFixed: false,
      appThemePanelToggled: false,
      currentPage: "",
      isMobile: false,
    };
  },
});
