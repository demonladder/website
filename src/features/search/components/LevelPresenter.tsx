import type { ReactNode } from 'react';
import useSession from '../../../hooks/useSession';
import type { SearchLevelResponse } from '../api/getLevels';
import useAddListLevelModal from '../../../hooks/modals/useAddListLevelModal';
import useContextMenu from '../../../context/menu/useContextMenu';
import Level from '../../../components/shared/Level';
import { GridLevel } from '../../../components/shared/GridLevel';
import { copyText } from '../../../utils/copyText';

type LevelItemProps = {
    level: SearchLevelResponse;
    isSelected: boolean;
    userId?: number;
};

type LevelPresenterProps = {
    levels: SearchLevelResponse[];
    selectedLevel: number;
    className?: string;
    renderLevel: (props: LevelItemProps) => ReactNode;
};

function LevelPresenter({ levels, selectedLevel, className, renderLevel }: LevelPresenterProps) {
    const session = useSession();

    return (
        <div className={className}>
            {levels.map((level, i) =>
                renderLevel({
                    level,
                    isSelected: i + 1 === selectedLevel,
                    userId: session.user?.ID,
                }),
            )}
        </div>
    );
}

export function ListLevelPresenter({
    levels,
    selectedLevel,
}: {
    levels: SearchLevelResponse[];
    selectedLevel: number;
}) {
    return (
        <LevelPresenter
            levels={levels}
            selectedLevel={selectedLevel}
            className='mt-2'
            renderLevel={({ level, isSelected, userId }) => (
                <ListLevel key={level.ID} level={level} isSelected={isSelected} userId={userId} />
            )}
        />
    );
}

export function GridLevelPresenter({
    levels,
    selectedLevel,
}: {
    levels: SearchLevelResponse[];
    selectedLevel: number;
}) {
    return (
        <LevelPresenter
            levels={levels}
            selectedLevel={selectedLevel}
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 my-2'
            renderLevel={({ level, isSelected, userId }) => (
                <GridLevelItem key={level.ID} level={level} isSelected={isSelected} userId={userId} />
            )}
        />
    );
}

function useLevelContextMenu(levelId: number, userId?: number) {
    const openAddToListModal = useAddListLevelModal();
    return useContextMenu([
        { text: 'Open', to: `/level/${levelId}` },
        { text: 'Submit', to: `/submit/${levelId}`, requireSession: true },
        { text: 'Add to list', onClick: () => openAddToListModal(userId!, levelId), requireSession: true },
        { type: 'divider' },
        { text: 'Copy ID', onClick: () => copyText(levelId.toString()) },
    ]);
}

function ListLevel({ level, isSelected, userId }: LevelItemProps) {
    const onContextMenu = useLevelContextMenu(level.ID, userId);

    return (
        <Level
            ID={level.ID}
            difficulty={level.Meta.Difficulty}
            enjoyment={level.Enjoyment}
            rarity={level.Meta.Rarity}
            rating={level.Rating}
            name={level.Meta.Name}
            creator={level.Meta.Publisher?.name}
            selected={isSelected}
            onContextMenu={onContextMenu}
        />
    );
}

function GridLevelItem({ level, isSelected, userId }: LevelItemProps) {
    const onContextMenu = useLevelContextMenu(level.ID, userId);

    return (
        <GridLevel
            ID={level.ID}
            difficulty={level.Meta.Difficulty}
            enjoyment={level.Enjoyment}
            rarity={level.Meta.Rarity}
            rating={level.Rating}
            name={level.Meta.Name}
            creator={level.Meta.Publisher?.name}
            selected={isSelected}
            proof={level.Showcase}
            inPack={level.InPack === 1}
            onContextMenu={onContextMenu}
        />
    );
}
