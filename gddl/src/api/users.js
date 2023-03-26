import axios from "axios";
import serverIP from "../serverIP";

async function GetUser({ queryKey }) {
    const [_, id] = queryKey;
    const res = await axios.get(`${serverIP}/getUser?userID=${id}&all=true`);
    return res.data;
}

async function SaveProfile(user) {
    const csrfToken = localStorage.getItem('csrf');

    const res = await axios.post(`${serverIP}/saveUser?userID=${user.ID}`, { csrfToken, user }, {
        withCredentials: true,
    });
    return res.data;
}

export {
    GetUser,
    SaveProfile
}