import { useMutation } from '@tanstack/react-query';
import { PrimaryButton } from '../../../../components/ui/buttons/PrimaryButton';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import GenerateTierRoulette, { TierRouletteResponse } from '../../../../api/generators/GenerateTierRoulette';
import useLocalStorage from '../../../../hooks/useLocalStorage';
import { Link } from 'react-router-dom';
import IDButton from '../../../../components/IDButton';
import FormGroup from '../../../../components/form/FormGroup';
import FormInputLabel from '../../../../components/form/FormInputLabel';
import { NumberInput } from '../../../../components/Input';

export default function TierRoulette() {
    const [rouletteLevels, setRouletteLevels] = useLocalStorage<TierRouletteResponse[] | null>('tierRouletteLevels', null);
    const [progress, setProgress] = useLocalStorage('tierRouletteProgress', 0);

    const generateMutation = useMutation({
        mutationFn: () => GenerateTierRoulette(),
        onError: (error: AxiosError) => toast.error((error.response?.data as { error: string })?.error ?? 'An error occurred'),
        onSuccess: (data) => {
            setRouletteLevels(data);
            setProgress(0);
        },
    });

    function onSubmit() {
        generateMutation.mutate();
    }

    return (
        <div>
            <h2 className='text-3xl'>Tier roulette</h2>
            <p>Tier roulettes are a kind of roulette where the tier of the next level drops or increases over time. For example, the first 5 levels might be tier 30, the next 5 tier 29 and so on.</p>
            <p>Just like regular roulettes, you must get 1% more than the last level starting at 1% for level #1, 2% for level #2 and n% for level #n. Roulettes contain 100 levels, therefore you have to beat at least the very last level.</p>
            <div className='my-4'>
                <p>Options coming soon</p>
                <FormGroup>
                    <FormInputLabel>Starting tier</FormInputLabel>
                    <NumberInput placeholder='30' disabled={true} />
                </FormGroup>
                <PrimaryButton onClick={onSubmit}>Generate</PrimaryButton>
            </div>
            <List levels={rouletteLevels} progress={progress} setProgress={setProgress} />
            {rouletteLevels?.length === progress &&
                <p className='text-center font-bold py-4'>GG, you beat this tier roulette!!!</p>
            }
        </div>
    );
}

function List({ levels, progress, setProgress }: { levels?: TierRouletteResponse[] | null, progress: number, setProgress: (progress: number) => void }) {
    if (!levels) return;

    return (
        <ol className='mt-4 text-xl'>{levels.slice(0, progress + 1).map((l, i) => (
            <li className='even:bg-gray-700 py-4' key={l.ID}>
                <div className='flex'>
                    <p className='ps-2 py-1 grow'><b>{i + 1}%</b> <Link to={`/level/${l.ID}`} className='underline'>{l.Meta.Name}</Link> <i><IDButton className='italic text-gray-400' id={l.ID} /></i></p>
                    <p className={`w-20 text-center py-1 tier-${l.Rating.toFixed()}`}>{l.Rating.toFixed()}</p>
                    <p className={`w-20 text-center py-1 enj-${(l.Enjoyment ?? -1).toFixed()}`}>{l.Enjoyment?.toFixed() ?? 'N/A'}</p>
                </div>
                {i === progress &&
                    <div>
                        <PrimaryButton onClick={() => setProgress(progress + 1)}>Completed</PrimaryButton>
                    </div>
                }
            </li>
        ))}</ol>
    );
}