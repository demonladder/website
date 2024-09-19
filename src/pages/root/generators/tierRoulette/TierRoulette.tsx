import { useMutation } from '@tanstack/react-query';
import { PrimaryButton } from '../../../../components/Button';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import GenerateTierRoulette, { TierRouletteResponse } from '../../../../api/generators/GenerateTierRoulette';
import useLocalStorage from '../../../../hooks/useLocalStorage';
import { Link } from 'react-router-dom';
import IDButton from '../../../../components/IDButton';

export default function TierRoulette() {
    const [progress, setProgress] = useLocalStorage('tierRouletteProgress', 0);

    const generateMutation = useMutation({
        mutationFn: () => GenerateTierRoulette(),
        onError: (error: AxiosError) => toast.error((error.response?.data as { error: string })?.error ?? 'An error occurred'),
        onSuccess: () => setProgress(0),
    });

    function onSubmit() {
        generateMutation.mutate();
    }

    return (
        <div>
            <h2 className='text-3xl'>Tier roulette</h2>
            <PrimaryButton onClick={onSubmit}>Generate</PrimaryButton>
            {generateMutation.data &&
                <List levels={generateMutation.data} progress={progress} setProgress={setProgress} />
            }
        </div>
    );
}

function List({ levels, progress, setProgress }: { levels?: TierRouletteResponse[] | null, progress: number, setProgress: (progress: number) => void }) {
    if (!levels) return;

    return (
        <ol className='mt-4 text-xl'>{levels.slice(0, progress + 1).map((l, i) => (
            <li className='even:bg-gray-700 p-4' key={l.ID}>
                <div className='flex'>
                    <p className='ps-2 py-1 grow'><b>#{i + 1}</b> <Link to={`/level/${l.ID}`} className='underline'>{l.Meta.Name}</Link> <i><IDButton className='italic text-gray-400' id={l.ID} /></i></p>
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