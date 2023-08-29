import SubmissionList from './SubmissionList';
import useLevelSearch from '../../../hooks/useLevelSearch';

export default function DeleteSubmission() {
    const { activeLevel, SearchBox } = useLevelSearch({ ID: 'deleteSubmissionSearch' });

    return (
        <div>
            <h3 className='text-2xl mb-3'>Delete Submission</h3>
            <div className='mb-5'>
                <label htmlFor='deleteSubmissionSearch'>Level:</label>
                {SearchBox}
            </div>
            <SubmissionList levelID={activeLevel?.LevelID || 0} />
        </div>
    );
}