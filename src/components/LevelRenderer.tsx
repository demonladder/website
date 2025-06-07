interface LevelProps {
    ID: number;
    rating: number | null;
    enjoyment: number | null;
    name: string;
    creator: string;
    songName: string;
    difficulty: string;
    inPack: boolean;
    completed: boolean;
    selected?: boolean;
    showcase?: string | null;
}

interface LevelDTO {
    ID: number;
    Rating: number | null;
    Enjoyment: number | null;
    Showcase?: string | null;
    Meta: {
        Name: string;
        Creator: string;
        Song: {
            Name: string;
        };
        Difficulty: string;
    };
    Completed: 0 | 1;
}

interface Props {
    element: React.ComponentType<LevelProps>;
    className: string;
    levels: LevelDTO[];
    selectedLevel?: number;
}

export function LevelRenderer({ element: Element, className, levels, selectedLevel }: Props) {
    return <div className={className}>
        {levels.map((level, i) => (
            <Element ID={level.ID} rating={level.Rating} enjoyment={level.Enjoyment} name={level.Meta.Name} creator={level.Meta.Creator} songName={level.Meta.Song.Name} difficulty={level.Meta.Difficulty} inPack={false} completed={level.Completed === 1} selected={(i + 1) === selectedLevel} showcase={level.Showcase} key={level.ID} />
        ))}
    </div>;
}
