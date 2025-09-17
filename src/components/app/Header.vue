<script setup lang="ts">
import { slideToggle } from "@/composables/slideToggle.js";
import { useAppOptionStore } from "@/stores/app-option";
import { useStoreSettings } from "@/stores/app-settings";
import { RouterLink } from "vue-router";
import router from "@/router";
import packageJson from "/package.json";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const appOption = useAppOptionStore();
const appSettings = useStoreSettings();
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
          <div class="menu-icon"><i class="fa fa-language"></i></div>
        </a>
        <div class="dropdown-menu dropdown-menu-end">
          <a @click.prevent="setLocale('en')" href="#" class="dropdown-item"
            >English</a
          >
          <a @click.prevent="setLocale('ru')" href="#" class="dropdown-item"
            >Русский</a
          >
          <a @click.prevent="setLocale('es')" href="#" class="dropdown-item"
            >Español</a
          >
          <a @click.prevent="setLocale('de')" href="#" class="dropdown-item"
            >Deutsch</a
          >
          <a @click.prevent="setLocale('fr')" href="#" class="dropdown-item"
            >Français</a
          >
          <a @click.prevent="setLocale('vi')" href="#" class="dropdown-item"
            >Tiếng Việt</a
          >
          <a @click.prevent="setLocale('id')" href="#" class="dropdown-item"
            >Bahasa Indonesia</a
          >
        </div>
      </div>
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
                  <!--<i class="bi bi-circle-fill position-absolute text-theme top-0 mt-n2 me-n2 fs-6px d-block text-center w-100"></i>-->
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
                  <img style="filter: grayscale(1)" src="/images/2fa48.png" alt="2fa sth"/>
                </div>
                <div class="fw-500 fs-10px text-inverse">2FA</div>
              </a>
            </div>
            <!--


            <div class="col-4">
              <RouterLink to="/settings" class="dropdown-item text-decoration-none p-3 bg-none">
                <div class="position-relative">
                  <i class="bi bi-circle-fill position-absolute text-theme top-0 mt-n2 me-n2 fs-6px d-block text-center w-100"></i>
                  <i class="bi bi-sliders h2 opacity-5 d-block my-1"></i>
                </div>
                <div class="fw-500 fs-10px text-inverse">SETTINGS</div>
              </RouterLink>
            </div>
            <div class="col-4">
              <RouterLink to="/widgets" class="dropdown-item text-decoration-none p-3 bg-none">
                <div><i class="bi bi-collection-play h2 opacity-5 d-block my-1"></i></div>
                <div class="fw-500 fs-10px text-inverse">WIDGETS</div>
              </RouterLink>
            </div>
            -->
          </div>
        </div>
      </div>
      <!--
			<div class="menu-item dropdown dropdown-mobile-full">
				<a href="#" data-bs-toggle="dropdown" data-bs-display="static" class="menu-link">
					<div class="menu-icon"><i class="bi bi-bell nav-icon"></i></div>
					<div class="menu-badge bg-theme" v-if="notificationData && notificationData.length > 0"></div>
				</a>
				<div class="dropdown-menu dropdown-menu-end mt-1 w-300px fs-11px pt-1">
					<h6 class="dropdown-header fs-10px mb-1">NOTIFICATIONS</h6>
					<div class="dropdown-divider mt-1"></div>
					<template v-if="notificationData && notificationData.length > 0">
						<a href="#" class="d-flex align-items-center py-10px dropdown-item text-wrap fw-semibold" v-for="(notification, index) in notificationData" v-bind:key="index">
							<div class="fs-20px">
								<i v-if="notification.icon" v-bind:class="notification.icon"></i>
							</div>
							<div class="flex-1 flex-wrap ps-3">
								<div class="mb-1 text-inverse">{{ notification.title }}</div>
								<div class="small text-inverse text-opacity-50">{{ notification.time }}</div>
							</div>
							<div class="ps-2 fs-16px">
								<i class="bi bi-chevron-right"></i>
							</div>
						</a>
					</template>
					<template v-else>
						<div class="px-3 pb-3 pt-2">
							No record found
						</div>
					</template>
					<hr class="m-0">
					<div class="py-10px mb-n2 text-center">
						<a href="#" class="text-decoration-none fw-bold">SEE ALL</a>
					</div>
				</div>
			</div>
			<div class="menu-item dropdown dropdown-mobile-full">
				<a href="#" data-bs-toggle="dropdown" data-bs-display="static" class="menu-link">
					<div class="menu-img online">
						<img src="/assets/img/user/profile.jpg" alt="Profile" height="60">
					</div>
					<div class="menu-text d-sm-block d-none w-170px">user@smartholdem.io</div>
				</a>
				<div class="dropdown-menu dropdown-menu-end me-lg-3 fs-11px mt-1">
					<RouterLink to="/profile" class="dropdown-item d-flex align-items-center">PROFILE <i class="bi bi-person-circle ms-auto text-theme fs-16px my-n1"></i></RouterLink>
					<RouterLink to="/email/inbox" class="dropdown-item d-flex align-items-center">INBOX <i class="bi bi-envelope ms-auto text-theme fs-16px my-n1"></i></RouterLink>
					<RouterLink to="/settings" class="dropdown-item d-flex align-items-center">SETTINGS <i class="bi bi-gear ms-auto text-theme fs-16px my-n1"></i></RouterLink>
					<div class="dropdown-divider"></div>
					<RouterLink to="/page/login" class="dropdown-item d-flex align-items-center">LOGOUT <i class="bi bi-toggle-off ms-auto text-theme fs-16px my-n1"></i></RouterLink>
				</div>
			</div>
-->
      <!--  -->
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
</template>
