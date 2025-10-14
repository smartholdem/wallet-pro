// typescript
import {defineStore} from "pinia";
import {generateMnemonic, validateMnemonic} from "bip39";
import {
    Crypto,
    Identities,
    Managers,
    Transactions,
    Utils,
} from "@smartholdem/crypto";
import {Connection} from "@smartholdem/client";
import CryptoJS from "crypto-js";
import axios from "axios";
import Web3 from "web3";
import {useStoreSettings} from "@/stores/app-settings";

Managers.configManager.setFromPreset("mainnet");
Managers.configManager.setHeight(5000000);

// Ленивые помощники: не трогают сторы до инициализации Pinia/персиста
const getActiveNode = (): string => {
    const settings = useStoreSettings();
    const host = settings?.activeNode || "node0.sth.cx";
    return `https://${host}/api`;
};
const apiClient = (): Connection => new Connection(getActiveNode());

// Типы
type HexString = string;

type AccountRecord = {
    secret: string;
    encrypt: "rabbit" | "aes" | string;
};

interface ApiResponse<T> {
    body: T;
}

interface CreateTransactionApiResponse {
    data: any;
}

interface Recipient {
    address: string;
    amount: number;
}

interface SchnorrVerifyPayload {
    address: string;
    message: string;
    signature: HexString;
}

interface SchnorrSignPayload {
    address: string;
    message: string;
}

interface AddressBookEntry {
    address: string;
    label?: string;
    network?: string;
}

interface TxVotePreparePayload {
    senderNonce: Utils.BigNumber;
    votes: string[];
    secretDecrypted: string;
}

interface TxVotePayload {
    sender: string;
    lastVote?: string;
    delegatePublicKey: string;
}

interface TxDelegateRegistrationPayload {
    sender: string;
    username: string;
}

interface TxTransferPayload {
    sender: string;
    fee: number;
    network: string;
    recipientId?: string;
    recipients?: Recipient[];
    txMax?: number;
    amount: number;
    memo?: string;
}

export const useStoreWallet = defineStore("walletStorage", {
    state: () => ({
        accounts: {} as Record<string, AccountRecord>,
        attributes: {} as Record<string, any>,
        transactions: {} as Record<string, any>,
        delegates: {} as any,
        nodeConfig: {} as any,
        blockchain: {} as any,
        smartHolder: {} as any,
        addressBook: {} as Record<string, AddressBookEntry>,
    }),
    actions: {
        async validateSigSchnorr(payload: SchnorrVerifyPayload) {
            const secretDecrypted = await this.decryptByAddress(payload.address);
            const publicKey = Identities.PublicKey.fromPassphrase(secretDecrypted);
            const hash = Crypto.HashAlgorithms.sha256(payload.message);
            return Crypto.Hash.verifySchnorr(hash, payload.signature, publicKey);
        },

        async signMessageSchnorr(payload: SchnorrSignPayload) {
            const secretDecrypted = await this.decryptByAddress(payload.address);
            const keys = Identities.Keys.fromPassphrase(secretDecrypted);
            const hash = Crypto.HashAlgorithms.sha256(payload.message);
            const signature = Crypto.Hash.signSchnorr(hash, keys);
            return {message: payload.message, hash: hash.toString('hex'), signature};
        },

        async validateSigECDSA(payload: SchnorrVerifyPayload) {
            const secretDecrypted = await this.decryptByAddress(payload.address);
            const publicKey = Identities.PublicKey.fromPassphrase(secretDecrypted);
            const hash = Crypto.HashAlgorithms.sha256(payload.message);
            return Crypto.Hash.verifyECDSA(hash, payload.signature, publicKey);
        },

        async signMessageECDSA(payload: SchnorrSignPayload) {
            const secretDecrypted = await this.decryptByAddress(payload.address);
            const keys = Identities.Keys.fromPassphrase(secretDecrypted);
            const hash = Crypto.HashAlgorithms.sha256(payload.message);
            console.log('keys', keys)
            const signature = Crypto.Hash.signECDSA(hash, keys);
            return {message: payload.message, hash: hash.toString('hex'), signature};
        },

        // Address book
        async addInAddressBook(entry: AddressBookEntry) {
            const result: Record<string, AddressBookEntry> = {
                [entry.address]: entry,
            };
            this.addressBook = {...this.addressBook, ...result};
        },

        deleteFromAddressBook(address: string) {
            const {[address]: _, ...rest} = this.addressBook;
            this.addressBook = {...rest};
        },

        async validateAddressCrossChain(address: string) {
            try {
                return Web3.utils.isAddress(address);
            } catch {
                console.log("err validator");
                return false;
            }
        },

        async getSmartHolder() {
            try {
                this.smartHolder = (
                    await axios.get("https://smartholder.xbts.io/api/public/percents")
                ).data;
            } catch {
                console.log("err: get smartHolder");
            }
        },

        async getBlockchain() {
            try {
                this.blockchain = (
                    await axios.get(getActiveNode() + "/blockchain")
                ).data.data;
            } catch {
                console.log("err: get blockchain");
            }
        },

        async validateAddress(address: string) {
            return Identities.Address.validate(address);
        },

        async getNodeConfig() {
            try {
                this.nodeConfig = (
                    await axios.get(getActiveNode() + "/node/configuration")
                ).data.data;
            } catch {
                console.log("err: get node config");
            }
        },

        async getDelegate(userName: string) {
            try {
                return (await axios.get(getActiveNode() + "/delegates/" + userName))
                    .data.data;
            } catch {
                console.log("err: get delegate " + userName);
                return null;
            }
        },

        async getDelegates() {
            try {
                const result = (
                    await axios.get(getActiveNode() + "/delegates?page=1&limit=100")
                ).data;
                this.delegates = {...this.delegates, ...result};
            } catch {
                console.log("err: get delegates");
            }
        },

        async getAddress(address: string) {
            try {
                const response = await axios.get(`${getActiveNode()}/wallets/${address}`);
                const data = response.data.data;
                data.balance = parseFloat((data.balance / 1e8).toFixed(8));
                return data;
            } catch (e) {
                console.error(`Error fetching address ${address}:`, e);
                return null;
            }
        },

        async txVotePrepare(payload: TxVotePreparePayload) {
            return Transactions.BuilderFactory.vote()
                .version(2)
                .nonce(payload.senderNonce.toFixed())
                .votesAsset(payload.votes)
                .sign(payload.secretDecrypted);
        },

        async txVote(payload: TxVotePayload) {
            const client = apiClient();
            const txs: any[] = [];
            const secretDecrypted = await this.decryptByAddress(payload.sender);

            const senderWallet = await client.api("wallets").get(payload.sender);
            const senderNonce = Utils.BigNumber.make(
                senderWallet.body.data.nonce
            ).plus(1);

            const votes: string[] = [];
            if (payload.lastVote) votes.push("-" + payload.lastVote);
            votes.push("+" + payload.delegatePublicKey);

            const transactionVote = await this.txVotePrepare({
                votes,
                senderNonce,
                secretDecrypted,
            });

            txs.push(transactionVote.build().toJson());

            let broadcastResponse: any = {};
            try {
                broadcastResponse = await client
                    .api("transactions")
                    .create({transactions: txs});
            } catch {
                console.log("err: tx vote");
            }
            return {response: broadcastResponse, tx: txs, network: "mainnet"};
        },

        async txDelegateRegistration(payload: TxDelegateRegistrationPayload) {
            const client = apiClient();
            const secretDecrypted = await this.decryptByAddress(payload.sender);

            const senderWallet = await client.api("wallets").get(payload.sender);
            const senderNonce = Utils.BigNumber.make(
                senderWallet.body.data.nonce
            ).plus(1);

            const transaction = Transactions.BuilderFactory.delegateRegistration()
                .version(2)
                .nonce(senderNonce.toFixed())
                .usernameAsset(payload.username)
                .sign(secretDecrypted);

            const tx = transaction.build().toJson();
            let broadcastResponse: any = {};
            try {
                broadcastResponse = await client
                    .api("transactions")
                    .create({transactions: [tx]});
            } catch {
                console.log("err: tx delegate");
            }
            return {response: broadcastResponse, tx: [tx], network: "mainnet"};
        },

        // отправка мультиплатежей с smartholdem blockchain api txType = 6
        async txTransferMulti(payload: TxTransferPayload) {
            if (!payload.recipients || payload.recipients.length === 0) {
                throw new Error("Recipients array is required and cannot be empty");
            }

            const paymentsCountAll = payload.recipients.length;
            const txMax = payload.txMax || 150; // число мультиплатежей в одной multipayment транзакции, если > 150 разбить на несколько транзакций, default = 150
            const txPlus = paymentsCountAll % txMax; // остаток платежей, которые не войдут в полную транзакцию, может быть < txMax (последняя транзакция с платежами в очереди)
            const txQue = Math.trunc(paymentsCountAll / txMax); // число транзакция с мультиплатежами, каждая транзакция может содержать txMax платежей на разные адреса
            let payIndex = 0;
            const allPayments = [];

            // инициализация SmartHoldem API
            const client = apiClient();
            const secretDecrypted = await this.decryptByAddress(payload.sender);
            const senderWallet = await client.api("wallets").get(payload.sender);

            // если существует очередь транзакций
            if (txQue > 0) {
                for (let i = 0; i < txQue; i++) {
                    const senderNonce = Utils.BigNumber.make(
                        senderWallet.body.data.nonce
                    ).plus(i + 1); // новая транзакция должнга содержать nonce+1 олученный из блокчейн
                    // инициализация мультиплатёжной транзакции
                    const transaction = Transactions.BuilderFactory.multiPayment()
                        .fee((payload.fee * 1e8).toString())
                        .version(2)
                        .nonce(senderNonce.toFixed());
                    //перебор мультиплатежей в одной транзакции из recipients
                    for (let j = 0; j < txMax; j++) {
                        transaction.addPayment(
                            payload.recipients[payIndex].address,
                            (payload.recipients[payIndex]["amount"] * 1e8).toFixed(0)
                        ); // * 1e8
                        payIndex++;
                    }
                    transaction
                        .vendorField(payload.memo || "airdrop")
                        .sign(secretDecrypted);
                    allPayments.push(transaction.build().toJson());
                }
            }

            // если существует остаток платежей, которые не вошли в полную транзакцию < txMax
            if (txPlus > 0) {
                const senderNonce = Utils.BigNumber.make(
                    senderWallet.body.data.nonce
                ).plus(txQue + 1);
                const transaction = Transactions.BuilderFactory.multiPayment()
                    .version(2)
                    .nonce(senderNonce.toFixed());
                for (let i = 0; i < txPlus; i++) {
                    transaction.addPayment(
                        payload.recipients[payIndex]["address"],
                        (payload.recipients[payIndex]["amount"] * 1e8).toFixed(0)
                    );
                    payIndex++;
                }
                transaction
                    .vendorField(payload.memo || "airdrop")
                    .sign(secretDecrypted);
                allPayments.push(transaction.build().toJson());
            }

            let broadcastResponse: any = {};
            if (allPayments.length > 0) {
                broadcastResponse = await client
                    .api("transactions")
                    .create({transactions: allPayments});
            }

            return broadcastResponse.body?.data
                ? {
                    response: broadcastResponse.body.data,
                    tx: allPayments,
                    network: payload.network,
                }
                : {response: null, tx: allPayments, network: payload.network};
        },

        // отправка одиночной транзакции, txType = 2
        async txTransfer(payload: TxTransferPayload) {
            const client = apiClient();
            const secretDecrypted = await this.decryptByAddress(payload.sender);

            const senderWallet = await client.api("wallets").get(payload.sender);
            const senderNonce = Utils.BigNumber.make(
                senderWallet.body.data.nonce
            ).plus(1);

            const txs: any[] = [];
            if (payload.network === "mainnet") {
                const builder = Transactions.BuilderFactory.transfer()
                    .fee((payload.fee * 1e8).toString())
                    .version(2)
                    .nonce(senderNonce.toFixed())
                    .recipientId(payload.recipientId as string)
                    .amount((payload.amount * 1e8).toFixed(0));

                if (payload.memo && payload.memo.length) {
                    builder.vendorField(payload.memo);
                }

                const transaction = builder.sign(secretDecrypted);
                txs.push(transaction.build().toJson());
            } else {
                const builder = Transactions.BuilderFactory.transfer()
                    .fee((payload.fee * 1e8).toString())
                    .version(2)
                    .nonce(senderNonce.toFixed())
                    .recipientId("STQnKW8JQ6cMKwLrcfdfMwhChyHUysccts")
                    .amount((payload.amount * 1e8).toFixed(0));

                if (payload.memo && payload.memo.length) {
                    builder.vendorField(payload.memo);
                }

                const transaction = builder.sign(secretDecrypted);
                txs.push(transaction.build().toJson());
            }

            let broadcastResponse: any = {};
            try {
                broadcastResponse = (
                    await client.api("transactions").create({transactions: txs})
                ).body.data;
            } catch {
                console.log("err: tx send");
            }
            return {
                response: broadcastResponse,
                tx: txs[0],
                network: payload.network,
            };
        },

        async getTransactions(address: string, limit = 10, page = 1) {
            if (!address) return;
            const result: Record<string, any> = {[address]: {}};
            try {
                result[address] = (
                    await axios.get(
                        `${getActiveNode()}/wallets/${address}/transactions?page=${page}&limit=${limit}`
                    )
                ).data;
                this.transactions = {...this.transactions, ...result};
            } catch {
                console.log("err: address not stored in blockchain");
            }
            return result[address];
        },

        async getAttributes(address: string) {
            if (!address) return;
            const result: Record<string, any> = {[address]: {}};
            try {
                result[address] = (
                    await axios.get(`${getActiveNode()}/wallets/${address}`)
                ).data.data;
                if (result[address].attributes?.vote) {
                    result[address].voteFor = (
                        await axios.get(
                            `${getActiveNode()}/delegates/${result[address].attributes.vote}`
                        )
                    ).data.data;
                }
                // гарантируем наличие balance
                if (typeof result[address].balance === "undefined") {
                    result[address].balance = 0;
                }
                this.attributes = {...this.attributes, ...result};
            } catch {
                // безопасный дефолт
                result[address] = {publicKey: false, voteFor: null, balance: 0};
                console.log("err: address not stored in blockchain");
            }
            return result[address]; // возвращаем объект адреса, а не карту
        },

        async addressNew() {
            const mnemonic = generateMnemonic();
            return {
                secret: mnemonic,
                address: Identities.Address.fromPassphrase(mnemonic, 63),
            };
        },

        async addressSave(payload: Record<string, AccountRecord>) {
            this.accounts = {...this.accounts, ...payload};
        },

        addressDelete(address: string) {
            const {[address]: _, ...rest} = this.accounts;
            this.accounts = {...rest};
        },

        async addressDecrypt(secret: string) {
            if (!secret) {
                console.log("no secret");
                return;
            }
            const settings = useStoreSettings();
            const hash = CryptoJS.SHA384(settings.tmpPin).toString();
            const accountBytes = CryptoJS.AES.decrypt(
                secret.toString(),
                settings.tmpPin + hash
            );
            return accountBytes.toString(CryptoJS.enc.Utf8);
        },

        async decryptByAddress(address: string) {
            const settings = useStoreSettings();
            const hash = CryptoJS.SHA384(settings.tmpPin).toString();

            const acc = this.accounts[address];
            if (!acc) throw new Error("account not found");

            if (acc.encrypt === "rabbit") {
                const accountBytes = CryptoJS.Rabbit.decrypt(
                    acc.secret,
                    settings.tmpPin + hash
                );
                return accountBytes.toString(CryptoJS.enc.Utf8);
            } else {
                const accountBytes = CryptoJS.AES.decrypt(
                    acc.secret,
                    settings.tmpPin + hash
                );
                return accountBytes.toString(CryptoJS.enc.Utf8);
            }
        },

        addressFromPassword(secret: string) {
            const isBip39 = validateMnemonic(secret);
            const address = Identities.Address.fromPassphrase(secret, 63);
            return {isBip39, address};
        },

        async pubKeyToAddress(publicKey: string) {
            return Identities.Address.fromPublicKey(publicKey, 63);
        }
    },
    persist: true,
});
