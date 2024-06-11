import { useEffect, useState } from 'react';
import { PrimaryButton } from '../../../components/Button';
import { NumberInput, TextInput } from '../../../components/Input';
import useLevelSearch from '../../../hooks/useLevelSearch';
import { validateIntInputChange } from '../../../utils/validators/validateIntChange';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import UpdateLevel from './UpdateLevel';
import useHash from '../../../hooks/useHash';

export default function EditLevel() {
    const [hash, setHash] = useHash();
    const { activeLevel, SearchBox } = useLevelSearch({ ID: 'editLevelSearch', required: true, options: { defaultLevel: parseInt(hash) || null } });
    const [defaultRating, setDefaultRating] = useState('');
    const [showcase, setShowcase] = useState('');

    useEffect(() => {
        setDefaultRating(activeLevel?.DefaultRating?.toString() ?? '');
        setShowcase(activeLevel?.Showcase ?? '');
        if (activeLevel) setHash(activeLevel.ID.toString());
    }, [activeLevel?.ID]);

    function onShowcase(e: React.ChangeEvent<HTMLInputElement>) {
        setShowcase(e.target.value);
    }

    function onSubmit() {
        if (!activeLevel) return;

        toast.promise(UpdateLevel(activeLevel.ID, { defaultRating, showcase }), {
            pending: 'Updating...',
            success: 'Saved!',
            error: renderToastError,
        });
    }

    return (
        <div>
            <h3 className='text-2xl mb-3'>Edit Level</h3>
            <div>
                <p>Level:</p>
                {SearchBox}
            </div>
            <div className='mt-4'>
                <div>
                    <p>Default rating</p>
                    <NumberInput value={defaultRating} onChange={(e) => validateIntInputChange(e, setDefaultRating)} />
                </div>
                <div className='mt-1'>
                    <p>Showcase link</p>
                    <TextInput value={showcase} onChange={onShowcase} />
                </div>
                <div>
                    <PrimaryButton onClick={onSubmit}>Save</PrimaryButton>
                </div>
            </div>
        </div>
    );
}