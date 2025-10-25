<script setup lang="ts">
import {getCurrentInstance, onMounted, ref, watch, computed} from "vue";
import {RouterLink, RouterView, useRouter} from "vue-router";
import {useAppOptionStore} from "@/stores/app-option";
import {ProgressFinisher, useProgress} from "@marcoschulte/vue3-progress";
import AppSidebar from "@/components/app/Sidebar.vue";
import AppHeader from "@/components/app/Header.vue";
import AppTopNav from "@/components/app/TopNav.vue";
import AppFooter from "@/components/app/Footer.vue";
import AppThemePanel from "@/components/app/ThemePanel.vue";
import ChangelogModal from "@/components/app/ChangelogModal.vue";
//import UpdateProgressModal from "@/components/app/UpdateProgressModal.vue";
import TitleBar from "@/components/TitleBar.vue";
import router from "./router";
import {storeToRefs} from "pinia";
import {useStoreSettings} from "@/stores/app-settings";
import {useExchangeStore} from "@/stores/exchange";

import {useI18n} from "vue-i18n";
//import {useUpdater} from "@/composables/useUpdater";

const storeSettings = useStoreSettings();
const {settings} = storeToRefs(storeSettings);
const appOption = useAppOptionStore();
const isElectron = ref(false);
const storeExchange = useExchangeStore();
const internalInstance = getCurrentInstance();
const { t } = useI18n();
/*
const {
  checkForUpdate,
  isUpdateAvailable,
  downloadAndInstall,
  updateInfo,
  isDownloading,
  downloadProgress,
  downloadError
} = useUpdater();
 */

// Info Modal State
const infoModal = ref({
  show: false,
  message: ''
});

const sthUsdtPrice = computed(() => storeExchange.sth_usdt_price);

watch(sthUsdtPrice, (newPrice) => {
  if (!isElectron.value) { // Только для веб-версии
    if (newPrice > 0) {
      document.title = `STH/USDT ${newPrice.toFixed(6)} | SmartHoldem Wallet Pro`;
    } else {
      document.title = 'SmartHoldem Wallet Pro';
    }
  }
});

// --- Changelog Logic ---
const showChangelog = ref(false);
const changelogContent = ref('');
const handleCloseChangelog = () => {
  showChangelog.value = false;
  localStorage.setItem("appVersion", __APP_VERSION__);
};

watch(() => appOption.shouldShowChangelog, async (newValue) => {
  if (newValue) {
    try {
      const response = await fetch('/CHANGELOG.md');
      if (response.ok) {
        changelogContent.value = await response.text();
        showChangelog.value = true;
      } else {
        localStorage.setItem("appVersion", __APP_VERSION__);
      }
    } catch (error) {
      console.error('Failed to fetch changelog:', error);
      localStorage.setItem("appVersion", __APP_VERSION__);
    } finally {
      appOption.shouldShowChangelog = false;
    }
  }
});
// --- End Changelog Logic ---

onMounted(() => {

  //проверка на логин, пин код введён или нет?
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

  isElectron.value = navigator.userAgent.toLowerCase().includes("electron");
  appOption.isMobile = window.innerWidth < 768;

  if (settings.value.pinCode) {
    storeSettings.updateNodes();
    storeExchange.fetchSthUsdtPrice();
    setInterval(() => {
      storeExchange.fetchSthUsdtPrice();
    }, 300 * 1000);
  }

  // Handle sth: protocol links
  if (isElectron.value) {
    const router = useRouter();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    window.electronAPI.on('handle-sth-url', (rawUrl) => {
      const currentPath = router.currentRoute.value.path;

      if (currentPath.startsWith('/address/')) {
        try {
          const url = new URL(rawUrl.replace('sth:', 'sth://'));
          const recipient = url.pathname.replace('//', '');
          const amount = url.searchParams.get('amount');
          const label = url.searchParams.get('label');
          const message = url.searchParams.get('message');

          emitter.emit('fill-send-form', {
            recipient: recipient,
            amount: amount,
            memo: message || label
          });
        } catch (e) {
          console.error("Failed to parse sth: URL", e);
        }
      } else {
        infoModal.value = {
          show: true,
          message: t('sth_link_info')
        };
      }
    });
  }
});

const progresses = [] as ProgressFinisher[];

router.beforeEach(async (to, from) => {
  progresses.push(useProgress().start());
  appOption.currentPage = to.path;
  appOption.appSidebarMobileToggled = false;
  appOption.appSidebarToggled = false;
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;

  const targetElm = [].slice.call(
      document.querySelectorAll(".app-sidebar .menu-submenu")
  );
  targetElm.map(function (elm) {
    elm.style.display = "";
  });
  appOption.isMobile = window.innerWidth < 768;
});
router.afterEach(async (to, from) => {
  progresses.pop()?.finish();
});

document.querySelector("body").classList.add("app-init");
</script>
<template>
  <div
      class="app"
      :class="{
      'is-electron': isElectron,
      'app-header-menu-search-toggled': appOption.appHeaderSearchToggled,
      'app-sidebar-toggled':
        appOption.appSidebarToggled && !appOption.appSidebarCollapsed,
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
    }"
  >
    <title-bar v-if="isElectron"/> <!-- Наша новая шапка, только для Electron -->
    <vue3-progress-bar/>
    <app-header v-if="!appOption.appHeaderHide"/>
    <app-top-nav v-if="appOption.appTopNav"/>
    <app-sidebar v-if="!appOption.appSidebarHide"/>
    <div class="app-content" v-bind:class="appOption.appContentClass" :style="{ paddingTop: isElectron ? '64px' : '' }">
      <!-- Динамический отступ -->
      <router-view></router-view>
    </div>
    <app-footer v-if="appOption.appFooter"/>
    <app-theme-panel/>

    <!-- --- Add Changelog Modal --- -->
    <ChangelogModal
        :show="showChangelog"
        :content="changelogContent"
        @close="handleCloseChangelog"
    />
    <!--
    <UpdateProgressModal 
      :show="isDownloading" 
      :progress="downloadProgress" 
      :version="updateInfo?.version"
      :error="downloadError"
    />
    -->
    <!-- --- End Changelog Modal --- -->

    <!-- Info Modal for STH Link -->
    <div v-if="infoModal.show" class="modal fade show" style="display: block;" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ t('sth_link_title') }}</h5>
            <button @click="infoModal.show = false" type="button" class="btn-close"></button>
          </div>
          <div class="modal-body">
            <p>{{ infoModal.message }}</p>
          </div>
          <div class="modal-footer">
            <button @click="infoModal.show = false" type="button" class="btn btn-secondary">OK</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="infoModal.show" class="modal-backdrop fade show"></div>

  </div>
</template>

<style>
-moz-scrollbar,
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar {
  background-color: #fefdf9;
}

::-webkit-scrollbar-thumb {
  background: var(
      --bs-theme
  ); /**linear-gradient(-45deg, #88d0ba 1%, #3cd2a5 48%, #288f70); /**var(--bs-theme); **/
  border: 1px solid #434a52;
}

/**
@font-face {
  font-family: BankGothic;
  src: url("/assets/bankgothicmdbt_medium.otf") format("opentype");
}
 **/

@font-face {
  font-family: "Chakra Petch";
  src: local("Chakra Petch Regular"), local("ChakraPetch-Regular"),
  url("/assets/Chakrapetchregular.woff2") format("woff2"),
  url("/assets/Chakrapetchregular.woff") format("woff"),
  url("/assets/Chakrapetchregular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: "Chakra Petch Light";
  src: local("Chakra Petch Light"), local("ChakraPetch-Light"),
  url("/assets/Chakrapetchlight.woff2") format("woff2"),
  url("/assets/Chakrapetchlight.woff") format("woff"),
  url("/assets/Chakrapetchlight.ttf") format("truetype");
  font-weight: 300;
  font-style: normal;
}

/*
h1 {
  font-family: "BankGothic";
}

 */

.pointer {
  cursor: pointer;
}

.hover-info:hover {
  color: #009be3 !important;
  cursor: pointer;
}

.ico-telegram {
  background-image: url("/images/telegram.svg");
  background-position: 0px 2px;
  background-repeat: no-repeat;
  background-size: 18px;
}

.ico-ton {
  background-image: url("/images/ton.svg");
  background-position: 0px 2px;
  background-repeat: no-repeat;
  background-size: 18px;
}

.ico-heco {
  background-image: url("/images/heco.svg");
  background-position: 0px 2px;
  background-repeat: no-repeat;
  background-size: 18px;
}

.ico-mainnet {
  background-image: url("/images/logo-green32.png");
  background-position: 0px 2px;
  background-repeat: no-repeat;
  background-size: 18px;
}

.ico-bsc {
  background-image: url("/images/bsc.svg");
  background-position: 0 2px;
  background-repeat: no-repeat;
  background-size: 16px;
}

.ico-eth {
  background-image: url("/images/eth.svg");
  background-position: 0px 2px;
  background-repeat: no-repeat;
  background-size: 18px;
}

.ico-xbts {
  background-image: url("/images/xbts32.png");
  background-position: 0px 2px;
  background-repeat: no-repeat;
  background-size: 18px;
}

.ico-mainnet-18,
.ico-heco-18,
.ico-bsc-18,
.ico-ton-18,
.ico-eth-18 {
  background-size: 18px;
}
</style>
