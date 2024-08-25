import { useState } from 'react';
import { PrimaryButton } from '../../../../components/Button';
import FormGroup from '../../../../components/form/FormGroup';
import FormInputDescription from '../../../../components/form/FormInputDescription';
import FormInputLabel from '../../../../components/form/FormInputLabel';
import { NumberInput } from '../../../../components/Input';
import CheckBox from '../../../../components/input/CheckBox';
import Select from '../../../../components/Select';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import GenerateRoulette, { RouletteResponse } from '../../../../api/generators/GenerateRoulette';
import useLocalStorage from '../../../../hooks/useLocalStorage';
import { Link } from 'react-router-dom';
import IDButton from '../../../../components/IDButton';

const difficultyOptions = {
    '-1': 'Any',
    'easy': 'Easy',
    'medium': 'Medium',
    'hard': 'Hard',
    'insane': 'Insane',
    'extreme': 'Extreme',
};

export default function Roulette() {
    const [minTier, setMinTier] = useState<number>();
    const [maxTier, setMaxTier] = useState<number>();
    const [minEnjoyment, setMinEnjoyment] = useState<number>();
    const [maxEnjoyment, setMaxEnjoyment] = useState<number>();
    const [difficulty, setDifficulty] = useState('-1');
    const [rouletteLevels, setRouletteLevels] = useLocalStorage<RouletteResponse[] | null>('rouletteLevels', null);
    const [progress, setProgress] = useLocalStorage('rouletteProgress', 0);

    const generateMutation = useMutation({
        mutationFn: () => GenerateRoulette(minTier, maxTier, minEnjoyment, maxEnjoyment, difficulty !== '-1' ? difficulty : undefined),
        onError: (error: AxiosError) => toast.error((error.response?.data as { error: string })?.error ?? 'An error occurred'),
        onSuccess: (data) => {
            setRouletteLevels(data);
            setProgress(0);
        },
    });

    function submit() {
        generateMutation.mutate();
    }

    return (
        <div>
            <h2 className='text-3xl'>Roulette</h2>
            <p>Generate a roulette. For every level you have to get 1% more than the last level. Eg. you must get at least 1% on level #1, 2% on level #2, 3% on level #3 and so on.</p>
            <FormGroup>
                <FormInputLabel>Minimum tier</FormInputLabel>
                <NumberInput value={minTier} onChange={(e) => setMinTier(parseFloat(e.target.value))} id='minTier' min='1' max='35' />
                <FormInputDescription>Optional. The lowest tier of the alphabet. Does not correct for rounding eg. for tier 2 type "1.5"</FormInputDescription>
            </FormGroup>
            <FormGroup>
                <FormInputLabel>Maximum tier</FormInputLabel>
                <NumberInput value={maxTier} onChange={(e) => setMaxTier(parseFloat(e.target.value))} id='maxTier' min='1' max='35' />
                <FormInputDescription>Optional. The highest tier of the alphabet. Does not correct for rounding eg. for tier 2 type "1.5"</FormInputDescription>
            </FormGroup>
            <FormGroup>
                <FormInputLabel>Minimum enjoyment</FormInputLabel>
                <NumberInput value={minEnjoyment} onChange={(e) => setMinEnjoyment(parseFloat(e.target.value))} id='minEnjoyment' min='0' max='10' />
                <FormInputDescription>Optional. The lowest enjoyment of the alphabet. Does not correct for rounding eg. for enjoyment 2 type "1.5"</FormInputDescription>
            </FormGroup>
            <FormGroup>
                <FormInputLabel>Maximum enjoyment</FormInputLabel>
                <NumberInput value={maxEnjoyment} onChange={(e) => setMaxEnjoyment(parseFloat(e.target.value))} id='maxEnjoyment' min='0' max='10' />
                <FormInputDescription>Optional. The highest enjoyment of the alphabet. Does not correct for rounding eg. for enjoyment 2 type "1.5"</FormInputDescription>
            </FormGroup>
            <FormGroup>
                <FormInputLabel>Difficulty</FormInputLabel>
                <Select id='difficulty' options={difficultyOptions} activeKey={difficulty} onChange={setDifficulty} />
                <FormInputDescription>Optional. The in-game difficulty of the alphabet.</FormInputDescription>
            </FormGroup>
            <FormGroup>
                <label className='flex items-center gap-2 font-bold'>
                    <CheckBox />
                    Only uncompleted levels
                </label>
                <FormInputDescription>Optional. Only include levels that you have not completed.</FormInputDescription>
            </FormGroup>
            <PrimaryButton onClick={submit} loading={generateMutation.isLoading}>Generate</PrimaryButton>
            <List levels={rouletteLevels} progress={progress} setProgress={setProgress} />
        </div>
    );
}

function List({ levels, progress, setProgress }: { levels?: RouletteResponse[] | null, progress: number, setProgress: (progress: number) => void }) {
    if (!levels) return;

    return (
        <ol className='mt-4 text-xl'>{levels.slice(0, progress + 1).map((l, i) => (
            <li className='even:bg-gray-700 p-4' key={l.ID}>
                <div className='flex'>
                    <p className='ps-2 py-1 grow'><b>#{i + 1}</b> <Link to={`/level/${l.ID}`} className='underline'>{l.Name}</Link> <i><IDButton className='italic text-gray-400' id={l.ID} /></i></p>
                    <p className={`w-20 text-center py-1 tier-${l.Rating.toFixed()}`}>{l.Rating.toFixed()}</p>
                    <p className={`w-20 text-center py-1 enj-${l.Enjoyment.toFixed()}`}>{l.Enjoyment.toFixed()}</p>
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