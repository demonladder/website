import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import { Level } from './EditPack';
import useLevelSearch from '../../../hooks/useLevelSearch';
import usePackLevels from '../../../hooks/api/usePackLevels';
import { GetPackLevelsResponse as PackLevel } from '../../../api/pack/requests/GetPackLevels';

interface Props {
    addLevel: (levelID: number, levelName: string, ex?: boolean) => void;
    packID: number;
    removeLevel: (level: PackLevel) => void;
}

export default function List({ addLevel, packID, removeLevel }: Props) {
    const addLevelSearch = useLevelSearch({ ID: 'editPacksAddSearch' });
    const levelFilter = addLevelSearch.value;

    const { data } = usePackLevels(packID);

    function onAdd(EX = false) {
        if (addLevelSearch.activeLevel === undefined) return;

        addLevel(addLevelSearch.activeLevel.ID, addLevelSearch.activeLevel.Meta.Name, EX);
    }

    return (
        <div className='mb-6'>
            <div className='divider my-8'></div>
            <h3 className='text-xl'>Levels:</h3>
            <div className='mb-4'>
                {addLevelSearch.SearchBox}
                <PrimaryButton onClick={() => onAdd()} className='me-2'>Add</PrimaryButton>
                <PrimaryButton onClick={() => onAdd(true)}>Add EX</PrimaryButton>
            </div>
            <div>
                <ul className='grid grid-cols-3 gap-2'>
                    {data?.filter((l) => levelFilter === '' || l.Level.Meta.Name.toLowerCase().startsWith(levelFilter)).map((l) => (
                        <Level level={l} onRemove={() => removeLevel(l)} key={`pack_${packID}_${l.LevelID}`} />
                    ))}
                </ul>
            </div>
        </div>
    );
}