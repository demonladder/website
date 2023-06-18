import React, { useState } from 'react';
import LevelSearchBox from '../../../components/LevelSearchBox';
import { Level } from '../../../api/levels';
import SubmissionList from './SubmissionList';

export default function DeleteSubmission() {
    const [result, setResult] = useState<Level>();

    return (
        <div>
            <h3 className='mb-3'>Delete Submission</h3>
            <div className='mb-5'>
                <label>Level:</label>
                <LevelSearchBox setResult={setResult} />
            </div>
            <SubmissionList levelID={result?.ID || 0} />
        </div>
    );
}