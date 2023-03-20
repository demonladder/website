import axios from 'axios';
import serverIP from '../serverIP';

const user = JSON.parse(localStorage.getItem('user'));
const csrfToken = user ? user.csrfToken : null;

export function GetSubmissionQueue() {
    return axios.get(`${serverIP}/getPendingSubmissions`, { withCredentials: true, params: { csrfToken }}).then(res => res.data.map((s) => {
        s.id = s.LevelID + '_' + s.UserID;
        return s;
    }));
}

export function ApproveSubmission(info) {
    return axios.get(`${serverIP}/approveSubmission`, { withCredentials: true, params: { levelID: info.LevelID, userID: info.UserID, deny: info.deny, csrfToken }});
}

export function SendSubmission(submission) {
    return axios.post(`${serverIP}/submit`, { csrfToken, submission }, { withCredentials: true }).then(res => res.data);
}