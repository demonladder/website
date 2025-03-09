import Select from '../../../components/Select';
import FiltersExtended from './FiltersExtended';
import { TextInput } from '../../../components/Input';
import { DangerButton } from '../../../components/Button';
import RatingFilter from './filters/RatingFilter';
import EnjoymentFilter from './filters/EnjoymentFilter';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import { QueryParamNames } from './QueryParamNames';

type Props = {
    creator: string,
    setCreator: (value: string) => void,
    song: string,
    setSong: (value: string) => void,
    reset: () => void,
    show: boolean,
}

const difficultyOptions = {
    [-1]: 'Any',
    0: 'Official',
    1: 'Easy',
    2: 'Medium',
    3: 'Hard',
    4: 'Insane',
    5: 'Extreme',
};

const lengthOptions = {
    0: 'Any',
    1: 'Tiny',
    2: 'Short',
    3: 'Medium',
    4: 'Long',
    5: 'XL',
    6: 'Platformer',
};

export default function FilterMenu({ creator, setCreator, song, setSong, reset, show }: Props) {
    const [difficulty, setDifficulty] = useQueryParam(QueryParamNames.Difficulty, withDefault(NumberParam, -1));
    const [length, setLength] = useQueryParam(QueryParamNames.Length, withDefault(NumberParam, 0));

    return (
        <div className='grid overflow-hidden transition-[grid-template-rows]' style={{ gridTemplateRows: show ? '1fr' : '0fr' }}>
            <div className='min-h-0 bg-gray-700 round:rounded-b-3xl'>
                <div className='px-7 py-4 flex flex-col gap-4'>
                    <div className='flex justify-between'>
                        <h2 className='text-2xl' style={{ color: 'currentColor' }}>Filters</h2>
                        <DangerButton onClick={reset}>Reset</DangerButton>
                    </div>
                    <div className='grid grid-cols-12 gap-4 gap-y-2'>
                        <RatingFilter />
                        <EnjoymentFilter />
                        <div className='col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-2'>
                            <p>Difficulty:</p>
                            <Select id='filtersDifficulty' options={difficultyOptions} activeKey={difficulty.toString()} onChange={(o) => setDifficulty(parseInt(o))} />
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
                            <Select activeKey={length.toString()} onChange={(key) => setLength(parseInt(key))} options={lengthOptions} id='lengthSelectOptions' />
                        </div>
                    </div>
                    <div className='divider my-3'></div>
                    <FiltersExtended />
                </div>
            </div>
        </div>
    );
}
