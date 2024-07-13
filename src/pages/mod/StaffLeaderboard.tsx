import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../components/LoadingSpinner';
import GetStaffLeaderboard, { StaffLeaderboardRecord } from '../../api/staffLeaderboard/GetStaffLeaderboard';
import pluralS from '../../utils/pluralS';

function StaffLeaderboardEntry({ data, highestScore }: { data: StaffLeaderboardRecord, highestScore?: number }) {
    if (highestScore === undefined) return (<LoadingSpinner />);

    const width = data.Points * 100 / highestScore;

    return (
        // <div className='mt-[2px] max-md:text-xs'>
        //     <Link to={`/profile/${data.UserID}`} style={{ width: width + '%', backgroundColor: `#${profileColor.toString(16)}` }} className='inline-block relative h-10 bg-gray-500'>
        //         {data.User?.DiscordUserData?.Avatar &&
        //             <object data={pfp} type='image/png' className='rounded-full w-10 -ms-12' />
        //         }
        //         <span className='absolute right-2 top-1/2 -translate-y-1/2 overflow-hidden' style={{ color: `rgb(${textCol}, ${textCol}, ${textCol})` }}>{data.User?.Name}</span>
        //         <span className='absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full'>{data.Points}pt{pluralS(data.Points)}</span>
        //     </Link>
        // </div>
        <tr>
            <td className='pe-4'>
                <p>{data.User?.Name}</p>
            </td>
            <td className='w-full'>
                <div className='h-10 bg-gray-500 flex justify-end' style={{ width: width + '%' }}>
                    <p className='self-center me-2'>{`${data.Points.toFixed(1)}pt${pluralS(data.Points)}`}</p>
                </div>
            </td>
        </tr>
    );
}

export default function StaffLeaderboard() {
    const { data } = useQuery({
        queryKey: ['staffLeaderboard'],
        queryFn: GetStaffLeaderboard,
    });

    const highestScore = data?.reduce((prev, cur) => Math.max(prev, cur.Points), 0);

    return (
        <section className='mt-4'>
            <h2 className='text-3xl'>Leaderboard</h2>
            <p>You get more points the higher the tier of the level is</p>
            <p>Bonus points for proof (Remember to check it)</p>
            <p>Points are also awarded for denied submissions so no mindlessly approving submissions</p>
            <table className='mt-2 pe-8'>
                <tbody>
                    {data?.map((contestant) => (<StaffLeaderboardEntry data={contestant} highestScore={highestScore} key={'leader_' + contestant.UserID} />))}
                </tbody>
            </table>
        </section>
    );
}