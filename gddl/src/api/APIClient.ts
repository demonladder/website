import axios from 'axios';
import StorageManager from '../utils/StorageManager';

const APIClient = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL as string,
    timeout: 10000,
    headers: {
        Authorization: `Bearer ${StorageManager.getToken()}`,
    }
});

export default APIClient;