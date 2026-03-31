import { PrimaryButton } from '../../../../components/ui/buttons';
import { Level } from './Level';
import useLevelSearch from '../../../../hooks/useLevelSearch';
import usePackLevels from '../../../singlePack/hooks/usePackLevels';
import { GetPackLevelsResponse as PackLevel } from '../../../singlePack/api/getPackLevels';
import { useState } from 'react';
import { SearchLevelResponse } from '../../../search/api/getLevels.ts';
import Heading3 from '../../../../components/headings/Heading3.tsx';

interface Props {
    addLevel: (levelID: number, levelName: string, ex?: boolean) => void;
    packID: number;
    removeLevel: (level: PackLevel) => void;
}

export default function List({ addLevel, packID, removeLevel }: Props) {
    const [level, setLevel] = useState<SearchLevelResponse>();
    const addLevelSearch = useLevelSearch('editPacksAddSearch', { onLevel: setLevel });
    const levelFilter = addLevelSearch.value;

    const { data } = usePackLevels(packID);

    function onAdd(EX = false) {
        if (level === undefined) return;

        addLevel(level.ID, level.Meta.Name, EX);
    }

    return (
        <section className='mb-6'>
            <Heading3 className='mb-2'>Levels</Heading3>
            <div className='mb-4 flex gap-4'>
                {addLevelSearch.SearchBox}
                <div>
                    <PrimaryButton onClick={() => onAdd()} className='me-2'>
                        Add
                    </PrimaryButton>
                    <PrimaryButton onClick={() => onAdd(true)}>Add EX</PrimaryButton>
                </div>
            </div>
            <div>
                <ul className='grid grid-cols-3 gap-2'>
                    {data
                        ?.filter((l) => levelFilter === '' || l.Level.Meta.Name.toLowerCase().startsWith(levelFilter))
                        .map((l) => (
                            <Level level={l} onRemove={() => removeLevel(l)} key={`pack_${packID}_${l.LevelID}`} />
                        ))}
                </ul>
            </div>
        </section>
    );
}
