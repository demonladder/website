import axios from 'axios';
import serverIP from '../serverIP';

export function ChangeReferences(changes) {
    const csrfToken = JSON.parse(localStorage.getItem('user')).csrfToken;

    return axios.post(`${serverIP}/changeReferences`, { csrfToken, changes: changes.map(c => { return { ID: c.ID, Type: c.Type, Tier: c.Tier }})}, {
        withCredentials: true
    });
}

export function GetReferences() {
    return axios.get(`${serverIP}/getReferences`).then(res => res.data);
}