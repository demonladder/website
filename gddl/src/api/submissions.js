import axios from 'axios';
import serverIP from '../serverIP';

export function GetSubmissionQueue() {
    return axios.get(`${serverIP}/getPendingSubmissions`, { withCredentials: true}).then(res => res.data.map((s) => {
        s.id = s.LevelID + '_' + s.UserID;
        return s;
    }));
}

export function ApproveSubmission(info) {
    return axios.get(`${serverIP}/approveSubmission?levelID=${info.LevelID}&userID=${info.UserID}${info.deny ? '&deny=true' : ''}`, { withCredentials: true});
}