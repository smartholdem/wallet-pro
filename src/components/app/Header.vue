<script setup lang="ts">
import { slideToggle } from "@/composables/slideToggle.js";
import { useAppOptionStore } from "@/stores/app-option";
import { useStoreSettings } from "@/stores/app-settings";
import { RouterLink } from "vue-router";
import router from "@/router";
import packageJson from "/package.json";
import { useI18n } from "vue-i18n";
import { computed, ref } from 'vue';
import { Toast } from 'bootstrap';

const { locale } = useI18n();

const appOption = useAppOptionStore();
const appSettings = useStoreSettings();

const networkStatus = computed(() => appSettings.activeNodeStatus ? 'text-success' : 'text-danger');
const activeNode = computed(() => appSettings.activeNode);
const activeNodeStatus = computed(() => appSettings.activeNodeStatus);
const nodesStatus = computed(() => appSettings.nodesStatus);
const isRefreshing = ref(false);

const otherNodes = computed(() => {
  return nodesStatus.value.filter(node => node.node !== activeNode.value);
});

function getLatencyForNode(nodeName) {
  const node = nodesStatus.value.find(n => n.node === nodeName);
  return node && node.latency !== Infinity ? `${node.latency}ms` : '';
}

async function refreshNodes() {
  isRefreshing.value = true;
  const bestNode = await appSettings.updateNodes();
  isRefreshing.value = false;

  if (bestNode) {
    const toastEl = document.getElementById('toast-nodes');
    if (toastEl) {
      const toast = new Toast(toastEl);
      const toastBody = toastEl.querySelector('.toast-body');
      if (toastBody) {
          toastBody.textContent = `Выбран лучший узел: ${bestNode.node} (${bestNode.latency}ms)`;
      }
      toast.show();
    }
  }
}

const notificationData = [
  {
    icon: "bi bi-bag text-theme",
    title: "NEW MONEY RECEIVED (1,299 STH)",
    time: "JUST NOW",
  },
  {
    icon: "bi bi-person-circle text-theme",
    title: "3 NEW ACCOUNT CREATED",
    time: "2 MINUTES AGO",
  },
];

function setLocale(lang) {
  locale.value = lang;
  appSettings.updateSettings({ language: lang });
}

function currentVersion() {
  return packageJson.version;
}

function toggleAppSidebarCollapsed() {
  if (!appOption.appSidebarHide) {
    if (appOption.appSidebarCollapsed) {
      appOption.appSidebarToggled = !appOption.appSidebarToggled;
    } else if (appOption.appSidebarToggled) {
      appOption.appSidebarToggled = !appOption.appSidebarToggled;
    }
    appOption.appSidebarCollapsed = !appOption.appSidebarCollapsed;
  }
}
function toggleAppSidebarMobileToggled() {
  if (!(appOption.appTopNav && appOption.appSidebarHide)) {
    appOption.appSidebarMobileToggled = !appOption.appSidebarMobileToggled;
  } else {
    slideToggle(document.querySelector(".app-top-nav"));
    window.scrollTo(0, 0);
  }
}
function toggleAppHeaderSearch(event) {
  event.preventDefault();

  appOption.appHeaderSearchToggled = !appOption.appHeaderSearchToggled;
}
function checkForm(event) {
  event.preventDefault();
  this.$router.push({ path: "/extra/search" });
}

function walletLock() {
  appOption.appSidebarHide = true;
  appOption.appHeaderHide = true;
  appOption.appContentClass = "p-0";
  appSettings.tmpPin = "";
  router.push("/login");
}

let isFullScreen = false;

function fullScreen() {
  const element = document.querySelector("html");

  isFullScreen = !isFullScreen;

  if (isFullScreen) {
    element
      .requestFullscreen()
      .then(function () {
        // element has entered fullscreen mode successfully
      })
      .catch(function (error) {
        // element could not enter fullscreen mode
        // error message
        console.log(error.message);
      });
  } else {
    document
      .exitFullscreen()
      .then(function () {
        // element has exited fullscreen mode
      })
      .catch(function (error) {
        // element could not exit fullscreen mode
        // error message
        console.log(error.message);
      });
  }
}
</script>
<template>
  <div id="header" class="app-header">
    <!-- BEGIN desktop-toggler -->
    <div class="desktop-toggler">
      <button
        type="button"
        class="menu-toggler"
        v-on:click="toggleAppSidebarCollapsed"
      >
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
    </div>
    <!-- BEGIN desktop-toggler -->

    <!-- BEGIN mobile-toggler -->
    <div class="mobile-toggler">
      <button
        type="button"
        class="menu-toggler"
        v-on:click="toggleAppSidebarMobileToggled"
      >
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
    </div>
    <!-- END mobile-toggler -->

    <!-- BEGIN brand -->
    <div class="brand">
      <RouterLink to="/" class="brand-logo">
        <span class="brand-img">
          <span class="brand-img-text text-theme">S</span>
        </span>
        <div class="brand-text" style="line-height: 100%">
          SmartHoldem Wallet
          <span class="small text-success-emphasis"
            >v.{{ currentVersion() }}</span
          >
        </div>
      </RouterLink>
    </div>
    <!-- END brand -->

    <!-- BEGIN menu -->
    <div class="menu">
      <div class="menu-item dropdown">
        <a href="#" data-bs-toggle="dropdown" class="menu-link">
          <div class="menu-icon">
            <i class="fas fa-sm fa-fw fa-signal" :class="networkStatus"></i>
          </div>
        </a>
        <div class="dropdown-menu dropdown-menu-end">
          <div v-if="activeNodeStatus" class="dropdown-item d-flex align-items-center">
            <i class="fa fa-circle fs-9px fa-fw me-2 text-success"></i>
            <span class="flex-grow-1 fw-bold">{{ activeNode }}</span>
            <span class="small text-success">
              {{ getLatencyForNode(activeNode) }}
            </span>
          </div>
          <div v-else class="dropdown-item d-flex align-items-center">
            <i class="fa fa-circle fs-9px fa-fw me-2 text-danger"></i>
            <span class="flex-grow-1 fw-bold">Нет подключения</span>
          </div>
          <div class="dropdown-divider"></div>
          <div v-for="node in otherNodes" :key="node.node" class="dropdown-item d-flex align-items-center">
            <i class="fa fa-circle fs-9px fa-fw me-2" :class="node.synced ? 'text-success' : 'text-danger'"></i>
            <span class="flex-grow-1">{{ node.node }}</span>
            &nbsp;<span class="small" :class="node.synced ? 'text-success' : 'text-danger'">
              {{ node.latency !== Infinity ? node.latency + 'ms' : 'Offline' }}
            </span>
          </div>
          <div class="dropdown-divider"></div>
          <a href="#" class="dropdown-item d-flex align-items-center" @click.prevent="refreshNodes">
            <span v-if="isRefreshing" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="fa fa-redo fa-fw me-2"></i>
            Обновить список узлов
          </a>
        </div>
      </div>
      <div class="menu-item dropdown">
        <a href="#" data-bs-toggle="dropdown" class="menu-link">
          <div class="menu-icon"><i class="fa fa-language"></i></div>
        </a>
        <div class="dropdown-menu dropdown-menu-end">
          <a @click.prevent="setLocale('en')" href="#" class="dropdown-item">English</a>
          <a @click.prevent="setLocale('ru')" href="#" class="dropdown-item">Русский</a>
          <a @click.prevent="setLocale('es')" href="#" class="dropdown-item">Español</a>
          <a @click.prevent="setLocale('de')" href="#" class="dropdown-item">Deutsch</a>
          <a @click.prevent="setLocale('fr')" href="#" class="dropdown-item">Français</a>
          <a @click.prevent="setLocale('vi')" href="#" class="dropdown-item">Tiếng Việt</a>
          <a @click.prevent="setLocale('id')" href="#" class="dropdown-item">Bahasa Indonesia</a>
        </div>
      </div>

      <!--
      <div class="menu-item dropdown dropdown-mobile-full">
        <a
          href="#"
          data-bs-toggle="dropdown"
          data-bs-display="static"
          class="menu-link"
        >
          <div class="menu-icon">
            <i class="bi bi-grid-3x3-gap nav-icon"></i>
          </div>
        </a>
        <div
          class="dropdown-menu fade dropdown-menu-end w-300px text-center p-0 mt-1"
        >
          <div class="row row-grid gx-0">
            <div class="col-4">
              <div
                @click="fullScreen"
                class="dropdown-item text-decoration-none p-3 bg-none"
              >
                <div class="position-relative">
                  <i class="bi bi-circle-fill position-absolute text-theme top-0 mt-n2 me-n2 fs-6px d-block text-center w-100"></i>
                  <i class="fa fa-television h2 opacity-5 d-block my-1"></i>
                </div>
                <div class="fw-500 fs-10px text-inverse">FULLSCREEN</div>
              </div>
            </div>
            <div class="col-4">
              <a
                target="_blank"
                href="https://github.com/smartholdem/wallet-pro"
                class="dropdown-item text-decoration-none p-3 bg-none"
              >
                <div>
                  <i class="fa fa-github h2 opacity-5 d-block my-1"></i>
                </div>
                <div class="fw-500 fs-10px text-inverse">GITHUB</div>
              </a>
            </div>
            <div class="col-4">
              <a
                target="_blank"
                href="https://explorer.smartholdem.io"
                class="dropdown-item text-decoration-none p-3 bg-none"
              >
                <div>
                  <i class="bi bi-hdd-network h2 opacity-5 d-block my-1"></i>
                </div>
                <div class="fw-500 fs-10px text-inverse">EXPLORER</div>
              </a>
            </div>
          </div>
          <div class="row row-grid gx-0">
            <div class="col-4">
              <a
                target="_blank"
                href="https://github.com/technologiespro/smart2fa/releases"
                class="dropdown-item text-decoration-none p-3 bg-none"
              >
                <div>
                  <img
                    style="filter: grayscale(1)"
                    src="/images/2fa48.png"
                    alt="2fa sth"
                  />
                </div>
                <div class="fw-500 fs-10px text-inverse">2FA</div>
              </a>
            </div>
          </div>
        </div>
      </div>
      -->
      <div class="menu-item">
        <div v-on:click="walletLock" class="menu-link">
          <div class="menu-icon">
            <span class="">
              <i class="fas fa-lock text-success-emphasis"></i
            ></span>
          </div>
        </div>
      </div>
    </div>
    <!-- END menu -->
  </div>
  <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 9999">
    <div id="toast-nodes" class="toast hide" data-bs-delay="5000">
      <div class="toast-header">
        <i class="far fa-bell text-muted me-2"></i>
        <strong class="me-auto">Сеть</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body"></div>
    </div>
  </div>
</template>