import { ChangeType } from '../../../../api/references/ChangeReferences';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import { useReferences } from '../../../references/hooks/useReferences';
import ChangeLevel from './ChangeLevel';

interface Props {
    references: number[];
    undo: (ID: number) => void;
}

export default function RemoveList({ references, undo }: Props) {
    const { data } = useReferences();

    if (!data) return <LoadingSpinner isLoading={true} />;

    const referencesToChange = references.map((ID) => data.find((r) => r.LevelID === ID)).filter((r) => r !== undefined);

    return (
        <div>
            <h3 className='text-xl'>To remove</h3>
            <ul>{referencesToChange.map((r) => (
                <ChangeLevel data={{ ID: r.LevelID, Name: r.Level.Meta.Name, Tier: r.Tier, Type: ChangeType.Remove }} remove={() => undo(r.LevelID)} key={r.LevelID} />
            ))}</ul>
        </div>
    );
}
