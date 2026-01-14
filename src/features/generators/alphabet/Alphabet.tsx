import { useState } from 'react';
import FormGroup from '../../../components/form/FormGroup';
import FormInputDescription from '../../../components/form/FormInputDescription';
import FormInputLabel from '../../../components/form/FormInputLabel';
import { NumberInput, TextInput } from '../../../components/shared/input/Input';
import Select from '../../../components/shared/input/Select';
import CheckBox from '../../../components/input/CheckBox';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { AlphabetResponse, Difficulty, generateAlphabet } from './api/generateAlphabet';
import { useLocalStorage } from 'usehooks-ts';
import { Link } from 'react-router';
import IDButton from '../../../components/ui/IDButton';
import useValidNumber from '../../../hooks/useValidNumber';
import _ from 'lodash';
import renderToastError from '../../../utils/renderToastError';

const MAX_TIER = parseInt(import.meta.env.VITE_MAX_TIER);

const difficultyOptions = {
    '-1': 'Any',
    1: 'Easy',
    2: 'Medium',
    3: 'Hard',
    4: 'Insane',
    5: 'Extreme',
};

export default function Alphabet() {
    const minTier = useValidNumber('');
    const maxTier = useValidNumber('');
    const minEnjoyment = useValidNumber('');
    const maxEnjoyment = useValidNumber('');
    const [difficulty, setDifficulty] = useState<keyof typeof difficultyOptions>('-1');
    const [uncompletedOnly, setUncompletedOnly] = useState(false);
    const [levels, setLevels] = useLocalStorage<AlphabetResponse[]>('alphabetLevels', []);

    const generateMutation = useMutation({
        mutationFn: () => generateAlphabet(
            _.clamp(parseFloat(minTier.value) + (minTier.isInteger ? -0.5 : 0), 1, MAX_TIER),
            _.clamp(parseFloat(maxTier.value) + (maxTier.isInteger ? 0.5 : 0), 1, MAX_TIER),
            _.clamp(parseFloat(minEnjoyment.value) + (minEnjoyment.isInteger ? -0.5 : 0), 0, 10),
            _.clamp(parseFloat(maxEnjoyment.value) + (maxEnjoyment.isInteger ? 0.5 : 0), 0, 10),
            difficulty !== '-1' ? difficulty as Difficulty : undefined,
            uncompletedOnly,
        ),
        onError: (error: AxiosError) => void toast.error(renderToastError.render({ data: error })),
        onSuccess: (data) => {
            setLevels(data);
        },
    });

    function submit() {
        if (!minTier.isValid) return toast.error('Minimum tier must be a number');
        if (!maxTier.isValid) return toast.error('Maximum tier must be a number');
        if (!minEnjoyment.isValid) return toast.error('Minimum enjoyment must be a number');
        if (!maxEnjoyment.isValid) return toast.error('Maximum enjoyment must be a number');

        generateMutation.mutate();
    }

    return (
        <div>
            <h2 className='text-3xl'>Alphabet</h2>
            <p>You get one level for every letter in the alphabet. It should be completed in alphabetical order but that's up to you really.</p>
            <div>
                <FormGroup>
                    <FormInputLabel>Minimum tier</FormInputLabel>
                    <NumberInput value={minTier.value} onChange={(e) => minTier.setValue(e.target.value)} id='minTier' min='1' max={MAX_TIER} invalid={!minTier.isValid} />
                    <FormInputDescription>Optional. The lowest tier of the alphabet. Use decimals for higher precision.</FormInputDescription>
                </FormGroup>
                <FormGroup>
                    <FormInputLabel>Maximum tier</FormInputLabel>
                    <TextInput value={maxTier.value} onChange={(e) => maxTier.setValue(e.target.value.trim())} id='maxTier' min='1' max={MAX_TIER} invalid={!maxTier.isValid} />
                    <FormInputDescription>Optional. The highest tier of the alphabet. Use decimals for higher precision.</FormInputDescription>
                </FormGroup>
                <FormGroup>
                    <FormInputLabel>Minimum enjoyment</FormInputLabel>
                    <TextInput value={minEnjoyment.value} onChange={(e) => minEnjoyment.setValue(e.target.value.trim())} id='minEnjoyment' min='0' max='10' invalid={!minEnjoyment.isValid} />
                    <FormInputDescription>Optional. The lowest enjoyment of the alphabet. Use decimals for higher precision.</FormInputDescription>
                </FormGroup>
                <FormGroup>
                    <FormInputLabel>Maximum enjoyment</FormInputLabel>
                    <TextInput value={maxEnjoyment.value} onChange={(e) => maxEnjoyment.setValue(e.target.value.trim())} id='maxEnjoyment' min='0' max='10' invalid={!maxEnjoyment.isValid} />
                    <FormInputDescription>Optional. The highest enjoyment of the alphabet. Use decimals for higher precision.</FormInputDescription>
                </FormGroup>
                <FormGroup>
                    <FormInputLabel>Difficulty</FormInputLabel>
                    <Select id='difficulty' options={difficultyOptions} activeKey={difficulty} onChange={setDifficulty} />
                    <FormInputDescription>Optional. The in-game difficulty of the alphabet.</FormInputDescription>
                </FormGroup>
                <FormGroup>
                    <label className='flex items-center gap-2 font-bold'>
                        <CheckBox checked={uncompletedOnly} onChange={(e) => setUncompletedOnly(e.target.checked)} />
                        Only uncompleted levels
                    </label>
                    <FormInputDescription>Optional. Only include levels that you have not completed.</FormInputDescription>
                </FormGroup>
                <PrimaryButton onClick={submit} loading={generateMutation.isPending}>Generate</PrimaryButton>
            </div>
            {levels &&
                <ol className='mt-4 text-xl'>{levels.map((l) => (
                    <li className='even:bg-gray-700 px-2 py-4' key={l.ID}>
                        <div className='flex'>
                            <p className='ps-2 py-1 grow'><Link to={`/level/${l.ID}`} className='underline'>{l.Name ?? l.Meta?.Name ?? 'Unknown'}</Link> <i><IDButton className='italic text-gray-400' id={l.ID} /></i></p>
                            <p className={`w-20 text-center py-1 tier-${l.Rating?.toFixed() ?? '0'}`}>{l.Rating?.toFixed() ?? 'N/A'}</p>
                            <p className={`w-20 text-center py-1 enj-${l.Enjoyment?.toFixed() ?? '-1'}`}>{l.Enjoyment?.toFixed() ?? 'N/A'}</p>
                        </div>
                    </li>
                ))}</ol>
            }
        </div>
    );
}
