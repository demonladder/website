import axios from "axios";
import serverIP from "../serverIP";

const instance = axios.create({
    baseURL: serverIP,
    timeout: 5000,
});

export default instance;