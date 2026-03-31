import Surface from '../../../../components/layout/Surface';
import { XIcon } from '../../../../components/shared/icons';
import { DangerButton } from '../../../../components/ui/buttons';
import type { GetPackLevelsResponse as PackLevel } from '../../../singlePack/api/getPackLevels';

export function Level({ level, onRemove }: { level: PackLevel; onRemove: () => void }) {
    return (
        <li>
            <Surface variant='700'>
                <div className='flex items-center justify-between'>
                    <p>
                        <span className={`px-1 round:rounded tier-${level.Level.Rating?.toFixed() ?? 0}`}>
                            {level.Level.Rating?.toFixed(2) ?? '-'}
                        </span>{' '}
                        {level.Level.Meta.Name} {level.EX === 1 && '[EX]'}
                    </p>
                    <DangerButton className='me-1' onClick={() => onRemove()}>
                        <XIcon />
                    </DangerButton>
                </div>
            </Surface>
        </li>
    );
}
