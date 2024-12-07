import {ethers} from "ethers";
import {CoinbaseWalletSDK, ProviderInterface} from "@coinbase/wallet-sdk";
import {Web3} from "web3";
import {createThirdwebClient, ThirdwebClient} from "thirdweb";
import {base} from "thirdweb/chains";
import {resolveAvatar, resolveL2Name} from "thirdweb/extensions/ens";
import {createPublicClient, http, parseEther} from "viem";
import {base as viemBase} from "viem/chains";

// ---------- Global Variables ---------- //
export const mainnetBase = {
    chainId: 8453,
    name: "Base",
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
    rpcUrl: "https://mainnet.base.org",
    ensResolverAddress: "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD",
}
const metadataYourPlace = {
    name: "YourPlace",
    description: "Distributed Social Media",
    url: "https://yourplace.network",
    icons: ["https://yourplace.network/static/image/yourplace-logo.png"],
}
let baseInit = false;
let web3: Web3;
let thirdwebClient: ThirdwebClient;
let viemClient: any;
let sdk: CoinbaseWalletSDK;
let provider: ProviderInterface;

// ---------- Initialization Functions ---------- //
async function initBaseWallet() {
    if (baseInit) { return; }

    sdk = new CoinbaseWalletSDK({
        appName: metadataYourPlace.name,
        appChainIds: [mainnetBase.chainId],
        appLogoUrl: metadataYourPlace.icons[0],
    });
    provider = sdk.makeWeb3Provider();
    provider.on("disconnect", () => {
        baseDisconnectWallet();
    });

    thirdwebClient = createThirdwebClient({clientId: "66e1c0e1046045455f135d411daa1b3f",});
    web3 = new Web3(mainnetBase.rpcUrl!);
    viemClient = createPublicClient({
        transport: http(mainnetBase.rpcUrl!),
        chain: viemBase
    });
    baseInit = true;
}
initBaseWallet().then();

// ---------- Core Wallet Functions ---------- //
export async function baseConnectWallet(): Promise<void | string> {
    let account = "";
    try {
        await provider.request({method: "eth_requestAccounts"}).then(response => {
            const accounts: string[] = response as string[];
            account = accounts[0];
            web3.eth.defaultAccount = accounts[0];
        });
    } catch(error) {
        return;
    }
    return account;
}
export async function baseDisconnectWallet(): Promise<void> {
    await provider.disconnect();
}


// ---------- Get Functions ---------- //
export async function baseGetName(_address: string): Promise<string> {
    let storedAddress = localStorage.getItem("accountAddress");
    if (storedAddress === _address) {
        let storedName = localStorage.getItem("baseName");
        if (storedName) {
            return storedName;
        }
    }
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            let basename = await resolveL2Name({
                address: _address as `0x${string}`,
                client: thirdwebClient,
                resolverChain: base,
                resolverAddress: mainnetBase.ensResolverAddress,
            });
            if (basename) {
                localStorage.setItem("baseName", basename);
                return basename;
            }
        } catch (e) {
            if (attempt === 3) {
                break;
            }
        }
    }
    return "";
}
export async function baseGetENSText(_address: string, key: string): Promise<string> {
    if (viemClient == null || !viemClient) {
        await initBaseWallet().then();
    }
    let baseName = await baseGetName(_address);
    let textRecord = await viemClient!.getEnsText({
        name: baseName,
        key: key,
        universalResolverAddress: mainnetBase.ensResolverAddress,
    });
    if (textRecord) {
        return textRecord;
    }
    return "";
}