import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PrimaryButton } from '../../../../components/ui/buttons/PrimaryButton';
import GenerateDecathlon from '../../../../api/generators/decathlon/GenerateDecathlon';
import GetDecathlon from '../../../../api/generators/decathlon/GetDecathlon';
import { Link } from 'react-router-dom';
import IDButton from '../../../../components/IDButton';
import NextDecathlonLevel from '../../../../api/generators/decathlon/NextDecathlonLevel';
import ReRollDecathlonLevel from '../../../../api/generators/decathlon/ReRollDecathlonLevel';
import { toast } from 'react-toastify';
import renderToastError from '../../../../utils/renderToastError';
import pluralS from '../../../../utils/pluralS';
import Heading2 from '../../../../components/headings/Heading2';

export default function Decathlon() {
    const queryClient = useQueryClient();

    const generateMutation = useMutation({
        mutationFn: () => toast.promise(GenerateDecathlon, { pending: 'Generating...', success: 'Generated!', error: renderToastError }),
        onSuccess: () => {
            void queryClient.invalidateQueries(['decathlon']);
        },
    });

    const nextMutation = useMutation({
        mutationFn: NextDecathlonLevel,
        onSuccess: () => {
            void queryClient.invalidateQueries(['decathlon']);
        },
    });

    const reRollMutation = useMutation({
        mutationFn: () => toast.promise(ReRollDecathlonLevel, { pending: 'Rolling...', success: 'Level re-rolled!', error: renderToastError }),
        onSuccess: () => {
            void queryClient.invalidateQueries(['decathlon']);
        },
    });

    const { data } = useQuery({
        queryKey: ['decathlon'],
        queryFn: GetDecathlon,
    });

    return (
        <div>
            <Heading2>Decathlon</Heading2>
            <p>A decathlon is a notoriously difficult challenge as it is very RNG heavy.</p>
            <p>The rules are simple. You will be given 10 random levels which will have to be beaten in ascending difficulty. You cannot see all of the run ahead of time, only the next level in line.</p>
            <p>Depending the tier of your current hardest, you will be given re-rolls:</p>
            <p>32-35: 0 re-rolls</p>
            <p>27-31: 1 re-roll</p>
            <p>23-26: 2 re-rolls</p>
            <p>19-22: 3 re-rolls</p>
            <p>15-18: 4 re-rolls</p>
            <p>10-14: 5 re-rolls</p>
            <p>6-9: 6 re-rolls</p>
            <p>1-5: 7 re-rolls</p>
            <p>The run will not contain levels you have already beaten.</p>
            <PrimaryButton onClick={() => generateMutation.mutate()} loading={generateMutation.isLoading}>{data ? 'Re-g' : 'G'}enerate</PrimaryButton>
            {data && <>
                <p className='my-4'>You have <b>{data.Description.reRolls} re-roll{pluralS(data.Description.reRolls)}</b> left</p>
                <ol className='mt-4 text-xl'>
                    {data.levels.map((l, i) => (
                        <li className='even:bg-gray-700 py-4' key={l.LevelID}>
                            <div className='flex'>
                                <p className='ps-2 py-1 grow'><b>#{i + 1}</b> <Link to={`/level/${l.LevelID}`} className='underline'>{l.Level.Meta.Name}</Link> <i><IDButton className='italic text-gray-400' id={l.LevelID} /></i></p>
                                <p className={`w-20 text-center py-1 tier-${l.Level.Rating!.toFixed()}`}>{l.Level.Rating!.toFixed()}</p>
                                <p className={`w-20 text-center py-1 enj-${(l.Level.Enjoyment ?? -1).toFixed()}`}>{l.Level.Enjoyment?.toFixed() ?? 'N/A'}</p>
                            </div>
                            {i === data.Description.levelsCompleted &&
                                <div>
                                    <PrimaryButton onClick={() => nextMutation.mutate()}>Next</PrimaryButton>
                                    <button onClick={() => reRollMutation.mutate()} className='text-red-400 disabled:line-through disabled:text-gray-400 ms-2 underline-t' disabled={data.Description.reRolls <= -1}>Re-roll</button>
                                </div>
                            }
                        </li>
                    ))}
                </ol>
            </>}
        </div>
    );
}
