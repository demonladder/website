import APIClient from '../../APIClient';
import GDDLPLevel from '../../types/GDDLPLevel';
import GDDLPTier from '../../types/GDDLPTier';

interface Response extends GDDLPTier {
    Levels: GDDLPLevel[];
}

export default async function GetGDDLPTiers(): Promise<Response[]> {
    return fakeGetGDDLPTiers();
    const res = await APIClient.get<Response[]>('/pack/GDDLP');
    return res.data;
}

function fakeGetGDDLPTiers() {
    return [
        {
            ID: 1,
            Name: 'Copper',
            Criteria: '13.1-5',
            Difficulty: 'Easy Demon',
            PrimaryColor: 'e69138',
            SecondaryColor: 'f6b26b',
            Levels: [
                {
                    TierID: 1,
                    LevelID: 76872448,
                    Skillset: 'Overall',
                },
            ],
        },
        {
            ID: 2,
            Name: 'Gold',
            Criteria: '6.11,5.12',
            Difficulty: 'Low End Hard Demon',
            PrimaryColor: 'ffe599',
            SecondaryColor: 'ffd966',
            Levels: [
                {
                    TierID: 2,
                    LevelID: 92416762,
                    Skillset: 'Awkward, off-screen',
                },
                {
                    TierID: 2,
                    LevelID: 76022083,
                    Skillset: 'Timings, Sync (Awkward)',
                },
            ],
        },
        {
            ID: 3,
            Name: 'Diamond',
            Criteria: '2.28,1.29',
            Difficulty: 'Former Low Extended List Demon',
            PrimaryColor: '6fa8dc',
            SecondaryColor: '3d85c6',
            Levels: [
                {
                    TierID: 3,
                    LevelID: 83164497,
                    Skillset: 'Nerve Control, Easy Memory, Ship',
                },
            ],
        },
    ];
}