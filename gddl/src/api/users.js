import axios from "axios";
import serverIP from "../serverIP";

function GetUser(id) {
    return axios.get(`${serverIP}/getUser?userID=${id}&all=true`).then(res => res.data);
}

function SaveProfile(user) {
    const csrfToken = JSON.parse(localStorage.getItem('user')).csrfToken;

    return axios.post(`${serverIP}/saveUser?userID=${user.ID}`, { csrfToken, user }, {
        withCredentials: true,
    }).then(res => res.data);
}

export {
    GetUser,
    SaveProfile
}