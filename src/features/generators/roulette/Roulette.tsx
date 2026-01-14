import { useState } from 'react';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import FormGroup from '../../../components/form/FormGroup';
import FormInputDescription from '../../../components/form/FormInputDescription';
import FormInputLabel from '../../../components/form/FormInputLabel';
import { TextInput } from '../../../components/shared/input/Input';
import CheckBox from '../../../components/input/CheckBox';
import Select from '../../../components/shared/input/Select';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import GenerateRoulette, { RouletteResponse } from '../../../api/generators/GenerateRoulette';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { Link } from 'react-router';
import IDButton from '../../../components/ui/IDButton';
import useValidNumber from '../../../hooks/useValidNumber';
import validateParameter from '../../../utils/validators/validateParameter';
import renderToastError from '../../../utils/renderToastError';
import Heading2 from '../../../components/headings/Heading2';

const MAX_TIER = parseInt(import.meta.env.VITE_MAX_TIER);

const difficultyOptions = {
    '-1': 'Any',
    1: 'Easy',
    2: 'Medium',
    3: 'Hard',
    4: 'Insane',
    5: 'Extreme',
} as const;
type Difficulty = keyof typeof difficultyOptions;

export default function Roulette() {
    const minTier = useValidNumber('');
    const maxTier = useValidNumber('');
    const minEnjoyment = useValidNumber('');
    const maxEnjoyment = useValidNumber('');
    const [difficulty, setDifficulty] = useState<Difficulty>('-1');
    const [excludeCompleted, setExcludeCompleted] = useState(false);

    const [rouletteLevels, setRouletteLevels] = useLocalStorage<RouletteResponse[] | null>('rouletteLevels', null);
    const [progress, setProgress] = useLocalStorage('rouletteProgress', 0);

    const generateMutation = useMutation({
        mutationFn: () => GenerateRoulette(
            parseFloat(minTier.value) + (minTier.isInteger ? -0.5 : 0),
            parseFloat(maxTier.value) + (maxTier.isInteger ? 0.5 : 0),
            parseFloat(minEnjoyment.value) + (minEnjoyment.isInteger ? -0.5 : 0),
            parseFloat(maxEnjoyment.value) + (maxEnjoyment.isInteger ? 0.5 : 0),
            difficulty !== '-1' ? difficulty : undefined,
            excludeCompleted,
        ),
        onError: (err: AxiosError) => void toast.error(renderToastError.render({ data: err })),
        onSuccess: (data) => {
            setRouletteLevels(data);
            setProgress(0);
        },
    });

    function submit() {
        if (minTier.value !== '' && !validateParameter(minTier.isValid, minTier.value, 'Minimum tier')) return;
        if (maxTier.value !== '' && !validateParameter(maxTier.isValid, maxTier.value, 'Maximum tier')) return;
        if (minEnjoyment.value !== '' && !validateParameter(minEnjoyment.isValid, minEnjoyment.value, 'Minimum enjoyment')) return;
        if (maxEnjoyment.value !== '' && !validateParameter(maxEnjoyment.isValid, maxEnjoyment.value, 'Maximum enjoyment')) return;

        generateMutation.mutate();
    }

    return (
        <div>
            <Heading2>Roulette</Heading2>
            <p>Generate a roulette. For every level you have to get 1% more than the last level. Eg. you must get at least 1% on level #1, 2% on level #2, 3% on level #3 and so on until you reach level #100 where you have to get 100%.</p>
            <FormGroup>
                <FormInputLabel>Minimum tier</FormInputLabel>
                <TextInput value={minTier.value} onChange={(e) => minTier.setValue(e.target.value.trim())} id='minTier' min='1' max={MAX_TIER} invalid={!minTier.isValid} />
                <FormInputDescription>Optional. The lowest tier of the roulette. Use decimals for higher precision.</FormInputDescription>
            </FormGroup>
            <FormGroup>
                <FormInputLabel>Maximum tier</FormInputLabel>
                <TextInput value={maxTier.value} onChange={(e) => maxTier.setValue(e.target.value.trim())} id='maxTier' min='1' max={MAX_TIER} invalid={!maxTier.isValid} />
                <FormInputDescription>Optional. The highest tier of the roulette. Use decimals for higher precision.</FormInputDescription>
            </FormGroup>
            <FormGroup>
                <FormInputLabel>Minimum enjoyment</FormInputLabel>
                <TextInput value={minEnjoyment.value} onChange={(e) => minEnjoyment.setValue(e.target.value.trim())} id='minEnjoyment' min='0' max='10' invalid={!minEnjoyment.isValid} />
                <FormInputDescription>Optional. The lowest enjoyment of the roulette. Use decimals for higher precision.</FormInputDescription>
            </FormGroup>
            <FormGroup>
                <FormInputLabel>Maximum enjoyment</FormInputLabel>
                <TextInput value={maxEnjoyment.value} onChange={(e) => maxEnjoyment.setValue(e.target.value.trim())} id='maxEnjoyment' min='0' max='10' invalid={!maxEnjoyment.isValid} />
                <FormInputDescription>Optional. The highest enjoyment of the roulette. Use decimals for higher precision.</FormInputDescription>
            </FormGroup>
            <FormGroup>
                <FormInputLabel>Difficulty</FormInputLabel>
                <Select id='difficulty' options={difficultyOptions} activeKey={difficulty} onChange={setDifficulty} />
                <FormInputDescription>Optional. The in-game difficulty of the roulette.</FormInputDescription>
            </FormGroup>
            <FormGroup>
                <label className='flex items-center gap-2 font-bold'>
                    <CheckBox checked={excludeCompleted} onChange={(e) => setExcludeCompleted(e.target.checked)} />
                    Only uncompleted levels
                </label>
                <FormInputDescription>Optional. Only include levels that you have not completed.</FormInputDescription>
            </FormGroup>
            <PrimaryButton onClick={submit} loading={generateMutation.isPending}>Generate</PrimaryButton>
            <List levels={rouletteLevels} progress={progress!} setProgress={setProgress} />
            {rouletteLevels?.length === progress &&
                <p className='text-center font-bold py-4'>GG, you beat this roulette!!!</p>
            }
        </div>
    );
}

function List({ levels, progress, setProgress }: { levels?: RouletteResponse[] | null, progress: number, setProgress: (progress: number) => void }) {
    if (!levels) return;

    return (
        <ol className='mt-4 text-xl'>{levels.slice(0, progress + 1).map((l, i) => (
            <li className='even:bg-gray-700 px-2 py-4' key={l.ID}>
                <div className='flex'>
                    <p className='ps-2 py-1 grow'><b>{i + 1}%</b> <Link to={`/level/${l.ID}`} className='underline'>{l.Name ?? l.Meta?.Name ?? 'Unknown'}</Link> <i><IDButton className='italic text-gray-400' id={l.ID} /></i></p>
                    <p className={`w-20 text-center py-1 tier-${l.Rating?.toFixed() ?? 0}`}>{l.Rating?.toFixed() ?? '-'}</p>
                    <p className={`w-20 text-center py-1 enj-${l.Enjoyment?.toFixed() ?? -1}`}>{l.Enjoyment?.toFixed() ?? '-'}</p>
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
