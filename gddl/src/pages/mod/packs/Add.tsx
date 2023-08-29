import { useState } from 'react';
import { PrimaryButton } from '../../../components/Button';
import PackSearchBox from '../../../components/PackSearchBox';
import { toast } from 'react-toastify';
import { AddLevelToPack, Pack } from '../../../api/packs';
import { AxiosError } from 'axios';
import useLevelSearch from '../../../hooks/useLevelSearch';

export default function Add() {
    const [packResult, setPackResult] = useState<Pack>();

    const { activeLevel, markInvalid, SearchBox} = useLevelSearch({ ID: 'packAddLevelSearch' })
    
    function handleSubmit() {
        if (packResult === undefined) {
            return toast.error('Select a pack!');
        }
        
        if (activeLevel === undefined) {
            markInvalid();
            return toast.error('Select a level!');
        }

        toast.promise(AddLevelToPack(packResult.ID, activeLevel.LevelID), {
            pending: 'Adding...',
            success: 'Added level to pack!',
            error: {
                render({ data }: { data?: AxiosError | undefined }) {
                    if (data?.response && data.response.data && (data.response.data as any).error) {
                        return (data.response.data as any).error;
                    }
                    
                    return 'An error occurred';
                }
            }
        });
    }

    return (
        <div>
            <div className='mb-4'>
                <label htmlFor='editPacksSearch' className='me-3 mb-0 align-self-center'>Choose pack</label>
                <PackSearchBox id='editPacksSearch' setResult={setPackResult} />
            </div>
            <div>
                <label htmlFor='packAddLevelSearch'>Level</label>
                {SearchBox}
            </div>
            <PrimaryButton onClick={handleSubmit}>Add level</PrimaryButton>
        </div>
    );
}