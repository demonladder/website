import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../../../LoadingSpinner';
import serverIP from '../../../serverIP';
import Submission from './Submissions';

export default function Queue() {
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch(`${serverIP}/getPendingSubmissions`, {
            credentials: 'include'
        }).then(async (res) => {
            return {
                statusCode: res.status,
                data: await res.json()
            }
        })
        .then(res => {
            if (res.statusCode === 200) {
                setQueue(res.data.map((s) => {
                    s.id = s.LevelID + '_' + s.UserID;
                    return s;
                }));
                setLoading(false);
            }
        })
        .catch(e => {
            console.log('Error ocurred');
            setError(true);
        });
    }, []);

    function onSubmissionApprove(info, deny) {
        setLoading(true);
        fetch(`${serverIP}/approveSubmission?levelID=${info.LevelID}&userID=${info.UserID}${deny ? '&deny=true' : ''}`, { credentials: 'include' })
        .then(res => {
            setLoading(false);
            const newQueue = queue.filter(s => !(s.UserID === info.UserID && s.LevelID === info.LevelID));
            if (res.status === 200) setQueue(newQueue);
        })
        .catch(e => {
            setLoading(false);
        });
    }

    function onSubmissionDelete(info) {
        onSubmissionApprove(info, true);
    }

    return (
        <div>
            <h1>Submissions</h1>
            <div>
                <LoadingSpinner isLoading={loading} />
                {queue.map(s => <Submission info={s} approve={onSubmissionApprove} remove={onSubmissionDelete} key={s.LevelID + '_' + s.UserID} />)}
                {queue.length === 0 && !error && !loading ? <h3>{'Queue empty :D'}</h3> : ''}
                {error ? <h3>Couldn't connect to the server!</h3> : ''}
            </div>
        </div>
    );
}