import React, { useState } from 'react';
import { Alert, Form, Spinner } from 'react-bootstrap';
import pako from 'pako';
import convert from 'xml-js';
import parseDict from './ParseDict';
import serverIP from '../../serverIP';
import IDButton from '../../components/IDButton';

export default function UploadProgress() {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    function setAlert(msg) {
        setShowAlert(true);
        setAlertMessage(msg);
    }

    function onFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsText(file);
        reader.onloadend = () => {
            processData(reader.result)
            .catch(e => {
                setAlert('Something went wrong when parsing the file. Did you choose the correct file?');
                setLoading(false);
            });
        }
        setLoading(true);
        setShowAlert(false);
    }

    async function processData(raw) {
        const extra = raw.length % 4;
        const xored = raw.split('').map(c => String.fromCharCode(c.charCodeAt() ^ 11)).join('').replace(/-/g, '+').replace(/_/g, '/').slice(0, extra === 0 ? raw.length : -extra);
        const decoded = atob(xored).split('').map(s => s.charCodeAt());
        const decompressed = pako.inflate(decoded, { to: 'string' });
        const json = JSON.parse(convert.xml2json(decompressed, { compact: false, spaces: 4 }));
        const data = parseDict(json.elements[0].elements[0].elements);
        
        const demonProgress = Object.values(data.officialLevels).filter(e => e.k25 && e.k19);  // Get official demons
        demonProgress.forEach(e => {  // Correct the IDs
            switch(e.k1) {
                case 14: e.k1 = 1; break;
                case 18: e.k1 = 2; break;
                case 20: e.k1 = 3; break;
                default: break;
            }
        });
        Object.values(data.onlineLevels).filter(e => e.k25 && e.k19).forEach(e => demonProgress.push(e));  // Add online demons
        
        // Remove unnecessary info
        demonProgress.forEach(e => {
            const id = e.k1;
            const p = e.k19;
        
            Object.keys(e).forEach(k => {
                delete e[k];
            });
        
            e.levelID = id;
            e.progress = p;
        });

        fetch(`${serverIP}/postProgress`, {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                commit: false,
                progress: demonProgress
            })
        }).then(res => {
            setLoading(false);

            if (res.status === 200) res.json().then(data => {
                demonProgress.forEach(e => {
                    const level = data.find(l => l.ID === e.levelID);
                    if (!level) return;

                    e.Name = level.Name || null;
                    e.Rating = level.Rating.toFixed(2) || 'NaN';
                });
                setProgress(demonProgress.filter(l => l.Name));
            });
            else res.json().then(msg => setAlert(msg.message));
        }).catch(e => {
            setAlert('Something went wrong when connecting to the server!')
            setLoading(false);
            setProgress(demonProgress);
        });
    }

    return (
        <div>
            <p className='my-5 fs-4'><b className='text-warning'>NEVER, under any circumstance, give away CCGameManager.dat to any untrusted sources! The file contains your raw, unprotected GD password and username!</b></p>
            <p>Use this tool quickly load progress into your user profile. After parsing CCGameManager.dat, the browser will only send the IDs to the webserver to retrieve the level name and tier.</p>
            <Form.Group controlId='saveFile' className='mb-4'>
                <Form.Label>Select CCGameManager.dat:</Form.Label>
                <Form.Control type='file' onChange={onFileChange} />
            </Form.Group>
            <Spinner className={!loading ? 'd-none' : null} />
            <Alert show={showAlert} variant='danger' onClose={() => setShowAlert(false)} dismissible>
                <Alert.Heading>Whoops, an error has occured!</Alert.Heading>
                <p>{alertMessage}</p>
            </Alert>

            <div>
                {progress.length > 0 ?
                    <div className='row border-bottom'>
                        <h3 className='col-8 m-0'>Level name</h3>
                        <div className='col-2 align-self-end text-end'><p className='m-0'>Level ID</p></div>
                        <div className='col-1 p-0 align-self-end'><p className='m-0'>Progress</p></div>
                        <div className='col-1 align-self-end'><p className='m-0'>Tier</p></div>
                    </div> : null
                }
                {progress.map(p =>
                    <div className='row' key={p.levelID}>
                        <h3 className='col-8 m-0'><a href={`/level/${p.levelID}`} className='text-light underline' target='_blank' rel='noopener noreferrer'>{p.Name}</a></h3>
                        <div className='col-2 text-end'><IDButton id={p.levelID} /></div>
                        <div className='col-1 text-center'><p className='m-0'>{p.progress}%</p></div>
                        <div className={`col-1 d-flex justify-content-center tier-${Math.round(p.Rating)}`}><p className='m-0 align-self-center'>{p.Rating}</p></div>
                    </div>)
                }
            </div>
        </div>
    )
}