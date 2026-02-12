import Select from '../../../components/shared/input/Select';
import FiltersExtended from './FiltersExtended';
import { TextInput } from '../../../components/shared/input/Input';
import { DangerButton } from '../../../components/ui/buttons/DangerButton';
import RatingFilter from './filters/RatingFilter';
import EnjoymentFilter from './filters/EnjoymentFilter';
import { createEnumParam, NumberParam, StringParam, useQueryParam, withDefault } from 'use-query-params';
import { QueryParamNames } from '../enums/QueryParamNames';
import _ from 'lodash';
import Divider from '../../../components/divider/Divider';
import { Heading2 } from '../../../components/headings';

type Props = {
    reset: () => void,
    show: boolean,
};

const difficultyOptions = {
    '0': 'Any',
    '1': 'Official',
    '2': 'Easy',
    '3': 'Medium',
    '4': 'Hard',
    '5': 'Insane',
    '6': 'Extreme',
};
type DifficultyOption = keyof typeof difficultyOptions;

const lengthOptions = {
    0: 'Any',
    1: 'Tiny',
    2: 'Short',
    3: 'Medium',
    4: 'Long',
    5: 'XL',
    6: 'Platformer',
};

export default function Filters({ reset, show }: Props) {
    const [creator, setCreator] = useQueryParam(QueryParamNames.Creator, withDefault(StringParam, ''));
    const [song, setSong] = useQueryParam(QueryParamNames.Song, withDefault(StringParam, ''));
    const [difficulty, setDifficulty] = useQueryParam(QueryParamNames.Difficulty, withDefault(createEnumParam(['0', '1', '2', '3', '4', '5', '6']), '0'));
    const [length, setLength] = useQueryParam(QueryParamNames.Length, withDefault(NumberParam, 0));

    function onDifficultyChange(key: DifficultyOption) {
        if (key === '0') setDifficulty(undefined);
        else setDifficulty(key);
    }

    return (
        <div className='grid overflow-hidden transition-[grid-template-rows] duration-700' style={{ gridTemplateRows: show ? '1fr' : '0fr', transitionTimingFunction: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)' }}>
            <div className='min-h-0 bg-theme-700 round:rounded-b-3xl'>
                <div className='px-7 py-4 flex flex-col gap-4 opacity-0 transition-opacity duration-700' style={{ opacity: show ? 1 : 0, transitionTimingFunction: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)' }}>
                    <div className='flex justify-between'>
                        <Heading2>Filters</Heading2>
                        <DangerButton onClick={reset}>Reset</DangerButton>
                    </div>
                    <div className='grid grid-cols-12 gap-4 gap-y-2'>
                        <RatingFilter />
                        <EnjoymentFilter />
                        <div className='col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-2'>
                            <p>Difficulty:</p>
                            <Select id='filtersDifficulty' options={difficultyOptions} activeKey={difficulty as DifficultyOption} onChange={onDifficultyChange} />
                        </div>
                        <div className='col-span-12 sm:col-span-6 lg:col-span-5 xl:col-span-2'>
                            <p>Creator:</p>
                            <TextInput value={creator} onChange={(e) => setCreator(e.target.value)} />
                        </div>
                        <div className='col-span-12 lg:col-span-7 xl:col-span-4'>
                            <p>Song:</p>
                            <TextInput value={song} onChange={(e) => setSong(e.target.value)} />
                        </div>
                        <div className='col-span-12 sm:col-span-6 lg:col-span-3 xl:col-span-2'>
                            <p className='form-label m-0'>Length:</p>
                            <Select activeKey={_.clamp(length, 0, 6) as keyof typeof lengthOptions} onChange={(key) => setLength(key)} options={lengthOptions} id='lengthSelectOptions' />
                        </div>
                    </div>
                    <Divider />
                    <FiltersExtended />
                </div>
            </div>
        </div>
    );
}
