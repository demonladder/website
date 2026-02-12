import { useQuery } from '@tanstack/react-query';
import PackResponse from '../../api/pack/responses/PackResponse';
import Page from '../../components/layout/Page';
import Leaderboard from '../packs/components/Leaderboard';
import GetGDDLPTiers from '../../api/pack/requests/GetGDDLPTiers';
import pluralS from '../../utils/pluralS';
import { Heading1 } from '../../components/headings';

interface Props {
    pack: PackResponse;
}

// Function that takes a comma separated string like "13.1-5" and returns a human readable string like "13 tier 1 to 5s"
function parseCriteria(criteria: string) {
    return criteria.split(',').map((c) => {
        const [tier, levels] = c.split('.');
        return `${tier} tier ${levels.replace('-', ' to ')}${pluralS(parseInt(tier))}`;
    }).join(', ');
}

export default function GDDLP({ pack }: Props) {
    const { data } = useQuery({
        queryKey: ['GDDLPTiers'],
        queryFn: GetGDDLPTiers,
    });

    // Map data to merge with pack prop
    const tiers = data?.map((tier) => ({
        ...tier,
        Levels: pack.Levels.filter((l) => tier.Levels.some((m) => m.LevelID === l.LevelID)),
    }));

    return (
        <Page>
            <div className='flex gap-2 mb-4'>
                <div>
                    {pack.IconName && <img src={'/packIcons/' + pack.IconName} style={{ minWidth: '64px' }} />}
                </div>
                <div>
                    <Heading1 className='mb-1'>{pack.Name}</Heading1>
                    <p>{pack.Description}</p>
                </div>
            </div>
            <div className='grid grid-cols-3'>
                {tiers?.map((tier) => (
                    <div className='text-black' style={{ backgroundColor: `#${tier.SecondaryColor}` }}>
                        <h3 className='py-2 text-xl font-bold text-center' style={{ backgroundColor: `#${tier.PrimaryColor}` }}>{`${tier.Name} Demons`}</h3>
                        <h4 className='text-lg text-center my-2'>{tier.Difficulty}</h4>
                        <ul>
                            <li className='flex px-2 font-bold'>
                                <p className='w-4/12 text-left'>Level</p>
                                <p className='w-3/12 text-left'>ID</p>
                                <p className='w-4/12 text-left'>Skillset</p>
                                <p className='w-1/12 text-center'>Tier</p>
                            </li>
                            {tier.Levels.map((l) => (
                                <li className='flex border-t border-gray-500' key={l.LevelID}>
                                    <p className='w-4/12 ps-2'>{l.Name}</p>
                                    <p className='w-3/12'>{l.LevelID}</p>
                                    <p className='w-4/12'>{data?.find((t) => t.ID === tier.ID)?.Levels.find((m) => m.LevelID === l.LevelID)?.Skillset}</p>
                                    <div className={`w-1/12 px-2 flex justify-center tier-${l.Rating?.toFixed(0) ?? '-'}`}>
                                        <p className='self-center'>{l.Rating?.toFixed(0) ?? '-'}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <p className='text-center mt-4'>Beat any: {parseCriteria(tier.Criteria)}</p>
                    </div>
                ))}
            </div>
            <Leaderboard packID={pack.ID} />
        </Page>
    );
}
