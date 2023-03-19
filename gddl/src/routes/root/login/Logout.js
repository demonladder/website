import { redirect } from "react-router-dom";
import serverIP from "../../../serverIP";

export async function Logout() {
    await fetch(serverIP + '/logout', {
        credentials: 'include'
    });

    localStorage.clear('user');

    return redirect('/');
}