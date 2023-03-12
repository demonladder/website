import axios from 'axios';
import serverIP from '../serverIP';

export function ChangeReferences(changes) {
    return axios({
        method: 'post',
        url: `${serverIP}/changeReferences`,
        withCredentials: true,
        data: changes.map(c => { return { ID: c.ID, Type: c.Type, Tier: c.Tier } })
    });
}

export function GetReferences() {
    return axios.get(`${serverIP}/getReferences`).then(res => res.data);
}