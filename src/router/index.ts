import {
    createRouter,
    createWebHistory,
    createWebHashHistory,
} from "vue-router";

const isElectron =
    typeof navigator !== "undefined" &&
    navigator.userAgent.toLowerCase().includes(" electron/");
const history = isElectron
    ? createWebHashHistory(import.meta.env.BASE_URL)
    : createWebHistory(import.meta.env.BASE_URL);

const router = createRouter({
    history,
    routes: [
        {path: "/", component: () => import("../views/wallet/Wallet.vue")},
        {
            path: "/address/:address",
            component: () => import("../views/wallet/Address.vue"),
        },
        {
            path: "/delegates",
            component: () => import("../views/wallet/Delegates.vue"),
        },
        {
            path: "/limitations",
            component: () => import("../views/wallet/LegalLimitations.vue"),
        },
        {
            path: "/terms",
            component: () => import("../views/wallet/LegalTerms.vue"),
        },
        {
            path: "/warranties",
            component: () => import("../views/wallet/LegalWarranties.vue"),
        },
        {
            path: "/blockchain",
            component: () => import("../views/wallet/Blockchain.vue"),
        },
        {
            path: "/settings",
            component: () => import("../views/Settings.vue"),
        },
        {path: "/page/error", component: () => import("../views/PageError.vue")},
        {path: "/login", component: () => import("../views/PageLogin.vue")},
        {path: "/register", component: () => import("../views/PageRegister.vue")},
        {
            path: "/address-book",
            component: () => import("../views/wallet/AddressBook.vue"),
        },
        {
            path: "/:pathMatch(.*)*",
            component: () => import("../views/PageError.vue"),
        },
    ],
});

export default router;
