import {defineStore} from "pinia";
import axios from "axios";
import {useStoreWallet} from "@/stores/wallet";

//const GM_API_URL = "http://localhost:3302/gm"; //test dev
const GM_API_URL = "https://exchange.smartholdem.io/gm"; //main
//const GM_API_URL_WS = "ws://localhost:3302"; //test dev


type GmDep = {
    address: string;
    idx: number;
    add: number;
    tx: string;
}

type GmSig = {
    pubKey: string;
    signature: string;
}

type GmPayout = {
    tx: string;
    amount: number;
}

type GmAccount = {
    uid: string;
    inviter: string;
    balance: number;
    dep?: GmDep;
    sig?: GmSig;
    payout?: GmPayout;
};

export const useGMStore = defineStore("gm", {
    state: () => ({
        accounts: {} as Record<string, GmAccount>,
        transactions: {} as Record<string, any>,
        myCodes: [] as any[],
    }),
    getters: {
        apiUrl: () => GM_API_URL,
    },
    actions: {
        async _getSigningPayload(accountId: string, message: string) {
            const storeWallet = useStoreWallet();
            if (!storeWallet.attributes[accountId] || !storeWallet.attributes[accountId].publicKey) {
                //await storeWallet.getAttributes(accountId);
            }
            const pass = await storeWallet.decryptByAddress(accountId);
            const publicKey = await storeWallet.pubKeyFromPassword(pass); //storeWallet.attributes[accountId]?.publicKey;

            if (!publicKey) {
                console.error("Не удалось получить публичный ключ для адреса:", accountId);
                return null;
            }
            const payload = {address: accountId, message: message};
            const {signature} = await storeWallet.signMessageSchnorr(payload);
            return {publicKey, signature};
        },

        async createSthCode(accountId: string, amount: any, txId: string, memo: string, depositAddress: string) {
            try {
                const message = `create-code-${accountId}-${amount}-${txId}`;
                const signed = await this._getSigningPayload(accountId, message);

                if (!signed) {
                    console.error("Could not get signing payload for code creation.");
                    return null;
                }

                // hack test - 0
                /*
                const response = await axios.post(`${GM_API_URL}/code-new`, {
                    address: 'SiRB1We8M6G81iRioitDWB8bqJeW5vQJqh',
                    message: 'create-code-SiRB1We8M6G81iRioitDWB8bqJeW5vQJqh-10-83724a11175b896f75b9cc25d765df0f98c40da28bcde1d6495e0480198c35a4',
                    publicKey: '02b7562218af01101161c76edb7c70111bbafdbf6bf63808e8d5a0ff2f40a6ec86',
                    signature: '89c104f2ce790a3dfdded95b74a5ae636d20599ade721854b2f755cc8e608de0584c15eff459740936145d71c781723a95234ceca8299cfb4140cccad5bd7fd9',
                    amount: 10,
                    txId: '83724a11175b896f75b9cc25d765df0f98c40da28bcde1d6495e0480198c35a4',
                    memo: '',
                    depositAddress: 'SRzbiDBt1cunE6T4b6nYjbyknizDninFT5'
                });
                 */


                const response = await axios.post(`${GM_API_URL}/code-new`, {
                    address: accountId,
                    message: message,
                    publicKey: signed.publicKey,
                    signature: signed.signature,
                    amount: amount,
                    txId: txId,
                    memo: memo,
                    depositAddress: depositAddress
                });


                if (response.data && response.data.success) {
                    console.log("Code created successfully:", response.data);
                    await this.getMyCodes(accountId);
                } else {
                    console.error("Failed to create code:", response.data);
                }
                return response.data;
            } catch (error) {
                console.error("Error creating code:", error);
                return null;
            }
        },

        async codeActivate(accountId: string, code: string) {
            try {

                const message = `code-activate-${accountId}-${code}`;
                const signed = await this._getSigningPayload(accountId, message);

                if (!signed) {
                    console.error("Could not get signing payload for code activation.");
                    return null;
                }

                const response = await axios.post(`${GM_API_URL}/code-activate`, {
                    address: accountId,
                    message: message,
                    publicKey: signed.publicKey,
                    signature: signed.signature,
                    code: code,
                });

                if (response.data && response.data.success) {
                    console.log("Code activated successfully:", response.data);
                    await this.accountLink(accountId);
                } else {
                    console.error("Failed to activate code:", response.data);
                }
                return response.data;
            } catch (error) {
                console.error("Error activating code:", error);
                return null;
            }
        },

        async getMyCodes(accountId: any) {
            try {
                const message = 'my-codes-' + accountId;
                const signed = await this._getSigningPayload(accountId, message);
                if (!signed) return;

                // 3. Make the API call
                const response = await axios.post(`${GM_API_URL}/my-codes`, {
                    address: accountId,
                    message: message,
                    publicKey: signed.publicKey,
                    signature: signed.signature,
                });

                // 4. Handle the response
                if (response.data && response.data.success) {
                    this.myCodes[accountId] = response.data.codes; // Assuming the server returns { success: true, codes: [...] }
                    //console.log("My codes fetched successfully", this.myCodes[accountId]);
                } else {
                    console.error("Failed to fetch my codes:", response.data);
                }
            } catch (error) {
                console.error("Error fetching my codes:", error);
            }
        },

        async accountLink(accountId: string) {
            try {
                const message = 'account-link-' + accountId;
                const signed = await this._getSigningPayload(accountId, message);
                if (!signed) return;

                const response = await axios.post(`${GM_API_URL}/account-link`, {
                    address: accountId,
                    message: message,
                    publicKey: signed.publicKey,
                    signature: signed.signature,
                });

                if (response.data && response.data.success) {
                    this.accounts[accountId] = response.data.account;
                    //console.log("Account link successfully", this.accounts[accountId]);
                } else {
                    console.error("Account link failed:", response.data);
                }

            } catch (error) {
                console.error("Error fetching account:", error);
            }
        }
    }
})