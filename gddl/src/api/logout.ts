import Cookies from "js-cookie";
import { StorageManager } from "../storageManager";

export default function logout() {
    // Remove local storage
    StorageManager.deleteSession();

    // Remove cookies
    Cookies.remove('session');

    const url = new URL(window.location.href)
    window.location.href = url.origin;
}