<script setup lang="ts">
import { getCurrentInstance, onMounted } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { useAppOptionStore } from "@/stores/app-option";
import { ProgressFinisher, useProgress } from "@marcoschulte/vue3-progress";
import AppSidebar from "@/components/app/Sidebar.vue";
import AppHeader from "@/components/app/Header.vue";
import AppTopNav from "@/components/app/TopNav.vue";
import AppFooter from "@/components/app/Footer.vue";
import AppThemePanel from "@/components/app/ThemePanel.vue";
import router from "./router";
import { storeToRefs } from 'pinia'
import { useStoreSettings } from '@/stores/app-settings.ts';
const storeSettings = useStoreSettings()
const { settings } = storeToRefs(storeSettings)

onMounted(() => {
  appOption.isMobile = window.innerWidth < 768;
  if (!settings.value.pinCode) {
    appOption.appSidebarCollapsed = true;
    appOption.appSidebarHide = true;
    appOption.appHeaderHide = true;
    router.push("/register");
  } else if (!settings.value.tmpPin) {
    appOption.appSidebarCollapsed = true;
    appOption.appSidebarHide = true;
    appOption.appHeaderHide = true;
    router.push("/login");
  }
});

const appOption = useAppOptionStore();
const internalInstance = getCurrentInstance();
const progresses = [] as ProgressFinisher[];

router.beforeEach(async (to, from) => {
  progresses.push(useProgress().start());
  appOption.currentPage = to.path;
  appOption.appSidebarMobileToggled = false;
  appOption.appSidebarToggled = false;
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;

  var targetElm = [].slice.call(document.querySelectorAll(".app-sidebar .menu-submenu"));
  targetElm.map(function(elm) {
    elm.style.display = "";
  });
});
router.afterEach(async (to, from) => {
  progresses.pop()?.finish();
});


document.querySelector("body").classList.add("app-init");
</script>

<template>
  <div class="app" v-bind:class="{
		'app-header-menu-search-toggled': appOption.appHeaderSearchToggled,
		'app-sidebar-toggled': appOption.appSidebarToggled && !appOption.appSidebarCollapsed,
		'app-sidebar-collapsed': appOption.appSidebarCollapsed,
		'app-sidebar-mobile-toggled': appOption.appSidebarMobileToggled,
		'app-sidebar-mobile-closed': appOption.appSidebarMobileClosed,
		'app-content-full-height': appOption.appContentFullHeight,
		'app-content-full-width': appOption.appSidebarHide,
		'app-without-sidebar': appOption.appSidebarHide,
		'app-without-header': appOption.appHeaderHide,
		'app-boxed-layout': appOption.appBoxedLayout,
		'app-with-top-nav': appOption.appTopNav,
		'app-footer-fixed': appOption.appFooterFixed,
	}">
    <vue3-progress-bar />
    <app-header v-if="!appOption.appHeaderHide" />
    <app-top-nav v-if="appOption.appTopNav" />
    <app-sidebar v-if="!appOption.appSidebarHide" />
    <div class="app-content" v-bind:class="appOption.appContentClass">
      <router-view></router-view>
    </div>
    <app-footer v-if="appOption.appFooter" />
    <app-theme-panel />
  </div>
</template>

<style>
@font-face {
  font-family: BankGothic;
  src: url("/assets/bankgothicmdbt_medium.otf") format("opentype");
}

@font-face {
  font-family: 'Chakra Petch';
  src: local('Chakra Petch Regular'), local('ChakraPetch-Regular'), url('/assets/Chakrapetchregular.woff2') format('woff2'), url('/assets/Chakrapetchregular.woff') format('woff'), url('/assets/Chakrapetchregular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: 'Chakra Petch Light';
  src: local('Chakra Petch Light'), local('ChakraPetch-Light'), url('/assets/Chakrapetchlight.woff2') format('woff2'), url('/assets/Chakrapetchlight.woff') format('woff'), url('/assets/Chakrapetchlight.ttf') format('truetype');
  font-weight: 300;
  font-style: normal;
}


h1 {
  font-family: "BankGothic";
}

.pointer {
  cursor: pointer;
}

.hover-info:hover {
  color: #009be3;
  cursor: pointer;
}

.ico-telegram {
  background-image:url('/images/telegram.svg');
  background-position: 0px 2px;
  background-repeat: no-repeat;
  background-size: 18px;
}

.ico-heco {
  background-image:url('/images/heco.svg');
  background-position: 0px 2px;
  background-repeat: no-repeat;
  background-size: 18px;
}

.ico-mainnet {
  background-image:url('/images/logo-green32.png');
  background-position: 0px 2px;
  background-repeat: no-repeat;
  background-size: 18px;
}

.ico-bsc {
  background-image:url('/images/bsc.svg');
  background-position: 0px 2px;
  background-repeat: no-repeat;
  background-size: 16px;
}
.ico-eth {
  background-image:url('/images/eth.svg');
  background-position: 0px 2px;
  background-repeat: no-repeat;
  background-size: 18px;
}
.ico-xbts {
  background-image:url('/images/xbts32.png');
  background-position: 0px 2px;
  background-repeat: no-repeat;
  background-size: 18px;
}

.ico-mainnet-18, .ico-heco-18, .ico-bsc-18, .ico-eth-18 {
  background-size: 18px;
}
</style>
