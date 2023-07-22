import { useState } from 'react';
import LevelSearchBox from '../../../components/LevelSearchBox';
import { Pack } from '../../../api/packs';
import { uuid } from '../../../functions';
import { PrimaryButton } from '../../../components/Button';

type Props = {
    pack: Pack,
    setChangeList: (e: any) => void,
}

export default function Add({ pack, setChangeList }: Props) {
    const [result, setResult] = useState(null);
    
    function handleSubmit() {
        setChangeList((prev: any) => [
            ...prev,
            {
                type: 'add',
                level: result || { ID: '-1', Name: 'null' },
                pack,
                ID: uuid()
            }
        ]);    
    }

    return (
        <div className='mb-5 position-relative'>
            <div>
                <label htmlFor='addLevelSearch'>Level:</label>
                <LevelSearchBox id='addLevelSearch' setResult={setResult} />
            </div>
            <PrimaryButton onClick={handleSubmit}>Add level</PrimaryButton>
        </div>
    );
}