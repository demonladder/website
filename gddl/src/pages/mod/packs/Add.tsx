import { useState } from 'react';
import LevelSearchBox from '../../../components/LevelSearchBox';
import { PrimaryButton } from '../../../components/Button';
import PackSearchBox from '../../../components/PackSearchBox';
import { toast } from 'react-toastify';
import { AddLevelToPack, Pack } from '../../../api/packs';
import { Level } from '../../../api/levels';
import { AxiosError } from 'axios';

export default function Add() {
    const [packResult, setPackResult] = useState<Pack>();
    const [levelResult, setLevelResult] = useState<Level>();

    const [levelInvalid, setLevelInvalid] = useState(false);
    
    function handleSubmit() {
        setLevelInvalid(false);

        if (packResult === undefined) {
            return toast.error('Select a pack!');
        }
        
        if (levelResult === undefined) {
            setLevelInvalid(true);
            return toast.error('Select a level!');
        }

        toast.promise(AddLevelToPack(packResult.ID, levelResult.LevelID), {
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
                <label htmlFor='addLevelSearch'>Level</label>
                <LevelSearchBox id='addLevelSearch' setResult={setLevelResult} invalid={levelInvalid} />
            </div>
            <PrimaryButton onClick={handleSubmit}>Add level</PrimaryButton>
        </div>
    );
}