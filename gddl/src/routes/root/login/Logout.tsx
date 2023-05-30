import { redirect } from "react-router-dom";
import serverIP from "../../../serverIP";
import { StorageManager } from "../../../storageManager";

export async function Logout() {
    await fetch(serverIP + '/logout', {
        credentials: 'include'
    });

    StorageManager.deleteSession();

    return redirect('/');
}