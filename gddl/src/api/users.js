import axios from "axios";
import serverIP from "../serverIP";

async function GetUser(userID) {
    const res = await axios.get(`${serverIP}/user?userID=${userID}&all=true`);
    return res.data;
}

async function GetUserSubmissions(userID, page = 1) {
    return (await axios.get(`${serverIP}/user/submissions?userID=${userID}&page=${page}`)).data;
}

async function SaveProfile(user) {
    const csrfToken = localStorage.getItem('csrf');

    const res = await axios.put(`${serverIP}/user?userID=${user.ID}`, { csrfToken, user }, {
        withCredentials: true,
    });
    return res.data;
}

export {
    GetUser,
    GetUserSubmissions,
    SaveProfile
}