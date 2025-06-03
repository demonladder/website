import { DangerButton } from '../../../../components/ui/buttons/DangerButton';
import { Reference } from '../../../references/api/getReferences';

interface Props {
    data: Reference;
    remove: () => void;
}

export default function Level({ data, remove }: Props) {
    return (
        <div className='flex gap-2'>
            <div className='grow flex justify-between items-center'>
                <div className='flex gap-2 items-center'>
                    <DangerButton onClick={remove}>X</DangerButton>
                    <div>
                        <h4 className='break-all'>{data.Level.Meta.Name}</h4>
                        <p>{data.LevelID}</p>
                    </div>
                </div>
            </div>
            <div className={`w-16 flex justify-center tier-${data.Level.Rating?.toFixed() ?? 0}`}>
                <p className='self-center'>{data.Level.Rating?.toFixed(2) ?? '-'}</p>
            </div>
        </div>
    );
}
