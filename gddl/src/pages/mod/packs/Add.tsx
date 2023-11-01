import { useState, useRef } from 'react';
import { PrimaryButton } from '../../../components/Button';
import PackSearchBox from '../../../components/PackSearchBox';
import { toast } from 'react-toastify';
import { AddLevelToPack, PackShell } from '../../../api/packs';
import useLevelSearch from '../../../hooks/useLevelSearch';
import FormGroup from '../../../components/form/FormGroup';
import { CheckBox } from '../../../components/Input';
import renderToastError from '../../../utils/renderToastError';

export default function Add() {
    const [packResult, setPackResult] = useState<PackShell>();

    const { activeLevel, markInvalid, SearchBox} = useLevelSearch({ ID: 'packAddLevelSearch' })
    const EXRef = useRef<HTMLInputElement>(null);
    
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (EXRef.current === null) return toast.error('An error occurred');

        if (packResult === undefined) {
            return toast.error('Select a pack!');
        }
        
        if (activeLevel === undefined) {
            markInvalid();
            return toast.error('Select a level!');
        }

        void toast.promise(AddLevelToPack(packResult.ID, activeLevel.LevelID, EXRef.current?.checked), {
            pending: 'Adding...',
            success: 'Added level to pack!',
            error: renderToastError,
        });
    }

    return (
        <form>
            <FormGroup>
                <label htmlFor='editPacksSearch' className='me-3 mb-0 align-self-center'>Choose pack</label>
                <PackSearchBox id='editPacksSearch' setResult={setPackResult} />
            </FormGroup>
            <FormGroup>
                <label htmlFor='packAddLevelSearch'>Level</label>
                {SearchBox}
            </FormGroup>
            <FormGroup>
                <label className='flex items-center gap-2 select-none cursor-pointer'><CheckBox ref={EXRef} /> Is EX level</label>
            </FormGroup>
            <PrimaryButton type='submit' onClick={handleSubmit}>Add level</PrimaryButton>
        </form>
    );
}