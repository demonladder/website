import { DangerButton } from '../../../../components/ui/buttons/DangerButton';
import type { GetPackLevelsResponse as PackLevel } from '../../../singlePack/api/getPackLevels';

export function Level({ level, onRemove }: { level: PackLevel; onRemove: () => void }) {
    return (
        <li>
            <DangerButton className='me-1' onClick={() => onRemove()}>
                X
            </DangerButton>
            <span>
                {level.Level.Meta.Name} {level.EX === 1 && '[EX]'}
            </span>
        </li>
    );
}
