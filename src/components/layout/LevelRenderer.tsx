import { Difficulties, Rarity } from '../../features/level/types/LevelMeta';

interface LevelProps {
    ID: number;
    rating: number | null;
    enjoyment: number | null;
    name: string;
    creator?: string | null;
    songName: string;
    difficulty: Difficulties;
    rarity: Rarity;
    inPack: boolean;
    completed?: boolean;
    selected?: boolean;
    showcase?: string | null;
    proof?: string;
}

interface LevelDTO {
    ID: number;
    Rating: number | null;
    Enjoyment: number | null;
    Showcase?: string | null;
    Meta: {
        Name: string;
        Song: {
            Name: string;
        };
        Publisher?: {
            name: string | null;
        };
        Difficulty: Difficulties;
        Rarity: Rarity;
    };
    InPack?: 0 | 1;
    Completed?: 0 | 1;
}

interface Props {
    element: React.ComponentType<LevelProps>;
    className?: string;
    levels: LevelDTO[];
    selectedLevel?: number;
}

export function LevelRenderer({ element: Element, className, levels, selectedLevel }: Props) {
    return (
        <div className={className}>
            {levels.map((level, i) => (
                <Element
                    ID={level.ID}
                    rarity={level.Meta.Rarity}
                    rating={level.Rating}
                    enjoyment={level.Enjoyment}
                    name={level.Meta.Name}
                    creator={level.Meta.Publisher?.name}
                    songName={level.Meta.Song.Name}
                    difficulty={level.Meta.Difficulty}
                    inPack={level.InPack === 1}
                    completed={level.Completed === 1}
                    selected={i + 1 === selectedLevel}
                    showcase={level.Showcase}
                    proof={level.Showcase ? `https://youtu.be/${level.Showcase}` : undefined}
                    key={level.ID}
                />
            ))}
        </div>
    );
}
