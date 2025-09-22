import {defineStore} from "pinia";
//import { useStorage } from "@vueuse/core";
import CryptoJS from "crypto-js";
import axios from "axios";

export const useStoreSettings = defineStore("appSettings", {
    state: () => ({
        settings: {
            darkMode: true,
            advancedMode: false,
            language: "",
            currency: "USDT",
            lockScreen: 600,
            pinCode: "",
        },
        tmpPin: "",
        nodes: [
            "node0.smartholdem.io",
            "node1.smartholdem.io",
            "node2.smartholdem.io",
            "node3.smartholdem.io",
            "node4.smartholdem.io",
            "node5.smartholdem.io",
            "node0.sth.cx",
        ],
        activeNode: "node0.smartholdem.io",
        activeNodeStatus: null,
    }),
    actions: {
        async updateNodes() {
            const nodePromises = this.nodes.map(async (node) => {
                const startTime = Date.now();
                try {
                    const response = await axios.get(`https://${node}/api/node/status`, { timeout: 5000 });
                    const latency = Date.now() - startTime;
                    if (response.data && response.data.data) {
                        return {
                            node,
                            status: response.data.data,
                            latency,
                            synced: response.data.data.synced,
                        };
                    }
                    return { node, status: null, latency: Infinity, synced: false };
                } catch (error) {
                    return { node, status: null, latency: Infinity, synced: false };
                }
            });

            const results = await Promise.allSettled(nodePromises);

            const successfulResponses = results
                .filter(result => result.status === 'fulfilled' && result.value.synced)
                .map(result => result.value);

            if (successfulResponses.length > 0) {
                successfulResponses.sort((a, b) => a.latency - b.latency);
                const bestNode = successfulResponses[0];
                this.activeNode = bestNode.node;
                this.activeNodeStatus = bestNode.status;
                console.log(`Выбрана лучшая нода: ${bestNode.node} с задержкой ${bestNode.latency}ms`);
            } else {
                console.log("Не найдено синхронизированных нод. Используется нода по-умолчанию.");
            }
        },
        updateSettings(partialSettings: object) {
            this.settings = {
                ...this.settings,
                ...partialSettings,
            };
            //localStorage.setItem('appSettings', JSON.stringify(this.settings))
        },
        savePinCode(pin: string) {
            this.settings.pinCode = CryptoJS.SHA384(pin).toString();
            //console.log('sha384', this.settings.pinCode)
        },
        validatePinCode(password: string) {
            const pinSha384 = CryptoJS.SHA384(password).toString();
            return pinSha384 === this.settings.pinCode;
        },
    },
    persist: true,
});
