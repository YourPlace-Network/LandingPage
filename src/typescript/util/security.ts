import {isValidAddress} from "algosdk";
import {CID} from "multiformats/cid";
import { isAddress } from "web3-validator";

export function IsValidAlgoAddress(address: string): boolean {
    return isValidAddress(address);
}
export function IsValidBaseAddress(address: string): boolean {
    return isAddress(address);
}
export function IsValidIpfsCid(cid: string): boolean {
    try {
        CID.parse(cid);
        return true;
    } catch (error) {
        return false;
    }
}
export function IsValidHttpsURL(url: string): boolean {
    try {
        let urlObj = new URL(url);
        return urlObj.protocol == "https:";
    } catch (error) {
        return false;
    }
}
export function MaskToken(token: string): string {
    if (token.length <= 15) return "**********";
    return token.slice(0, 3) + "**********" + token.slice(-3);
}
