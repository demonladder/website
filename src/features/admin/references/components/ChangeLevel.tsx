import { Change, ChangeType } from '../../../../api/references/ChangeReferences';
import { DangerButton } from '../../../../components/ui/buttons/DangerButton';

interface ChangeLevelProps {
    data: Change;
    remove: () => void;
}

export default function ChangeLevel({ data, remove }: ChangeLevelProps) {
    const prefix = data.Type === ChangeType.Remove ? 'from' : 'to';

    return (
        <div className='flex justify-between'>
            <div className='flex gap-2 items-center'>
                <DangerButton onClick={remove}>X</DangerButton>
                <div className='name'>
                    <h4 className='break-word'>{data.Name}</h4>
                    <p>{`${data.Type} ${prefix} tier ${data.Tier}`}</p>
                </div>
            </div>
            <p>{data.ID}</p>
        </div>
    );
}
