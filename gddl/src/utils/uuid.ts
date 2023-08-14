import randomBytes from "./randomBytes";

export function uuid() {
    return randomBytes(4) + '-' + randomBytes(2) + '-' + randomBytes(2) + '-' + randomBytes(2) + '-' + randomBytes(6);
}