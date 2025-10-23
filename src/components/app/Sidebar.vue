<script setup lang="ts">
import { useAppSidebarMenuStore } from "@/stores/app-sidebar-menu";
import { useAppOptionStore } from "@/stores/app-option";
import { onMounted, onBeforeMount } from "vue";
import SidebarNav from "@/components/app/SidebarNav.vue";
import { Carousel } from 'bootstrap';

const appSidebarMenu = useAppSidebarMenuStore();
const appOption = useAppOptionStore();
const isExtension = IS_EXTENSION;

function appSidebarMobileToggled() {
  appOption.appSidebarMobileToggled = !appOption.appSidebarMobileToggled;
}

onMounted(() => {
  const handleSidebarMenuToggle = function (menus) {
    menus.map(function (menu) {
      menu.onclick = function (e) {
        e.preventDefault();
        const target = this.nextElementSibling;

        menus.map(function (m) {
          const otherTarget = m.nextElementSibling;
          if (otherTarget !== target) {
            otherTarget.style.display = "none";
            otherTarget.closest(".menu-item").classList.remove("expand");
          }
        });

        const targetItemElm = target.closest(".menu-item");

        if (
          targetItemElm.classList.contains("expand") ||
          (targetItemElm.classList.contains("active") && !target.style.display)
        ) {
          targetItemElm.classList.remove("expand");
          target.style.display = "none";
        } else {
          targetItemElm.classList.add("expand");
          target.style.display = "block";
        }
      };
    });
  };

  const menuBaseSelector = ".app-sidebar .menu > .menu-item.has-sub";
  const submenuBaseSelector = " > .menu-submenu > .menu-item.has-sub";

  // menu
  const menuLinkSelector = menuBaseSelector + " > .menu-link";
  const menus = [].slice.call(document.querySelectorAll(menuLinkSelector));
  handleSidebarMenuToggle(menus);

  // submenu lvl 1
  const submenuLvl1Selector = menuBaseSelector + submenuBaseSelector;
  const submenusLvl1 = [].slice.call(
    document.querySelectorAll(submenuLvl1Selector + " > .menu-link")
  );
  handleSidebarMenuToggle(submenusLvl1);

  // submenu lvl 2
  const submenuLvl2Selector =
    menuBaseSelector + submenuBaseSelector + submenuBaseSelector;
  const submenusLvl2 = [].slice.call(
    document.querySelectorAll(submenuLvl2Selector + " > .menu-link")
  );
  handleSidebarMenuToggle(submenusLvl2);
  
  // Initialize the carousel to ensure autoplay starts
  const carouselElement = document.getElementById('carouselExample');
  if (carouselElement) {
    const carousel = new Carousel(carouselElement, {
      interval: 5000,
    });
  }
});
</script>
<template>
  <div id="sidebar" class="app-sidebar">
    <perfect-scrollbar class="app-sidebar-content">
      <div class="menu">
        <template v-for="menu in appSidebarMenu">
          <div class="menu-header" v-if="menu.is_header">{{ $t(menu.text) }}</div>
          <div class="menu-divider" v-else-if="menu.is_divider"></div>
          <template v-else>
            <sidebar-nav v-if="menu.text" v-bind:menu="menu"></sidebar-nav>
          </template>
        </template>


        <div v-if="!isExtension" class="p-3 px-4 mt-auto">
          <template >
            <a target="_blank" class=" " href="https://t.me/sthhubbot/start">
              <img style="opacity: 0.9" class="border border-secondary-subtle rounded w-100" src="/images/sthhub.png"/>
            </a>
            <div class="mt-3">
              <a target="_blank" class=" " href="https://t.me/smartnewscannel/319">
                <img style="opacity: 0.9" class="border border-secondary-subtle rounded w-100" src="/images/airdrop.png"/>
              </a>
            </div>
          </template>
          <div
              id="carouselExample"
              class="carousel slide mt-3 mb-3"
              data-bs-ride="carousel"
          >

            <ol class="carousel-indicators">
              <li data-bs-target="#carouselExample" data-bs-slide-to="0" class="active"></li>
              <li data-bs-target="#carouselExample" data-bs-slide-to="1"></li>
            </ol>

            <div class="carousel-inner border border-secondary-subtle rounded">
              <div class="carousel-item active">
                <a
                    target="_blank"
                    class=""
                    href="https://app.xbts.io/#/smartholder"
                ><img
                    src="@/assets/smartholder.png"
                    alt=""
                    class="d-block w-100"
                    style="opacity: 1"
                /></a>
                <!--
                <div class="carousel-caption d-none d-md-block">
                  <h5 class="text-dark">First slide label</h5>
                  <p class="text-dark">DeFi</p>
                </div>
                --->
              </div>
              <div class="carousel-item">
                <a
                    target="_blank"
                    href="https://ex.xbts.io/market/XBTSX.STH_XBTSX.BTC"
                ><img src="@/assets/xbts.png" alt="" class="d-block w-100"
                /></a>
                <!--
               <div class="carousel-caption d-none d-md-block">
                 <h5 class="text-dark">First slide label</h5>
                 <p class="text-dark">Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </div>
                  -->
              </div>
            </div>
            <a
                class="carousel-control-prev"
                href="#carouselExample"
                data-bs-slide="prev"
            >
              <span class="carousel-control-prev-icon"></span>
            </a>
            <a
                class="carousel-control-next"
                href="#carouselExample"
                data-bs-slide="next"
            >
              <span class="carousel-control-next-icon"></span>
            </a>
          </div>
          <a
              href="https://explorer.smartholdem.io"
              target="_blank"
              class="btn d-block btn-outline-theme"
          >
            <i class="bi bi-hdd-network me-2 ms-n2 opacity-5"></i> Explorer
          </a>

      </div>

        <!--
        <a href="https://wiki.smartholdem.io" target="_blank" class="btn d-block btn-outline-theme">
          <i class="fa fa-code-branch me-2 ms-n2 opacity-5"></i> Documentation
        </a>
        -->
      </div>
    </perfect-scrollbar>
  </div>
  <button
    class="app-sidebar-mobile-backdrop"
    v-on:click="appSidebarMobileToggled"
  ></button>
</template>

<style>
.carousel-control-next-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%2300ff00'%3e%3cpath d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
}

.carousel-control-prev-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%2300ff00'%3e%3cpath d='M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z'/%3e%3c/svg%3e");
}

/* Убираем прозрачность, чтобы цвет был ярким */
.carousel-control-prev,
.carousel-control-next {
  opacity: 0.9;
}

.carousel-control-prev:hover,
.carousel-control-next:hover {
  opacity: 1;
}
</style>
