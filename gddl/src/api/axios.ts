import axios from 'axios';
import serverIP from '../serverIP';

const instance = axios.create({
    baseURL: serverIP.serverIP,
    timeout: 10000,
});

export default instance;