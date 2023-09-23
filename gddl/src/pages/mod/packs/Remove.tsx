import { useState } from 'react';
import { DangerButton } from '../../../components/Button';
import PackSearchBox from '../../../components/PackSearchBox';
import { Pack, RemoveLevelFromPack } from '../../../api/packs';
import { toast } from 'react-toastify';
import useLevelSearch from '../../../hooks/useLevelSearch';
import renderToastError from '../../../utils/renderToastError';

export default function Remove() {
    const [packResult, setPackResult] = useState<Pack>();
    const { activeLevel, markInvalid, SearchBox } = useLevelSearch({ ID: 'packRemoveLevelSearch', options: { inPack: true } });
    
    function handleSubmit() {
        if (packResult === undefined) {
            return toast.error('Select a pack!');
        }
        
        if (activeLevel === undefined) {
            markInvalid();
            return toast.error('Select a level!');
        }

        toast.promise(RemoveLevelFromPack(packResult.ID, activeLevel.LevelID), {
            pending: 'Removing...',
            success: 'Removed level from pack!',
            error: renderToastError,
        });
    }

    return (
        <div>
            <div className='mb-4'>
                <label htmlFor='editPacksSearch' className='me-3 mb-0 align-self-center'>Choose pack</label>
                <PackSearchBox id='editPacksSearch' setResult={setPackResult} />
            </div>
            <div>
                <label htmlFor='addLevelSearch'>Level</label>
                {SearchBox}
            </div>
            <DangerButton onClick={handleSubmit}>Remove level</DangerButton>
        </div>
    );
}