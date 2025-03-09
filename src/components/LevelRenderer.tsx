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
}

interface LevelDTO {
    ID: number;
    Rating: number | null;
    Enjoyment: number | null;
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

export function LevelRenderer({ element: Element, className, levels, header }: { element: React.ComponentType<LevelProps>; className: string; levels: LevelDTO[]; header?: React.ReactNode; }) {
    return <div className={className}>
        {header}
        {levels.map((level) => (
            <Element ID={level.ID} rating={level.Rating} enjoyment={level.Enjoyment} name={level.Meta.Name} creator={level.Meta.Creator} songName={level.Meta.Song.Name} difficulty={level.Meta.Difficulty} inPack={false} completed={level.Completed === 1} key={level.ID} />
        ))}
    </div>;
}
