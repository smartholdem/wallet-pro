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
        nodesStatus: [],
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
            
            const statuses = [];
            for (let i = 0; i < results.length; i++) {
                const result = results[i];
                if (result.status === 'fulfilled') {
                    statuses.push(result.value);
                } else {
                    statuses.push({ node: this.nodes[i], status: null, latency: Infinity, synced: false });
                }
            }
            this.nodesStatus = statuses.sort((a, b) => a.latency - b.latency);

            const successfulResponses = this.nodesStatus.filter(node => node.synced);

            if (successfulResponses.length > 0) {
                const bestNode = successfulResponses[0];
                this.activeNode = bestNode.node;
                this.activeNodeStatus = bestNode.status;
                console.log(`Выбрана лучшая нода: ${bestNode.node} с задержкой ${bestNode.latency}ms`);
                return bestNode;
            } else {
                console.log("Не найдено синхронизированных нод. Используется нода по-умолчанию.");
                this.activeNodeStatus = null;
                return null;
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
