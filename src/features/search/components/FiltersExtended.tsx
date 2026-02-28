import { NumberInput, TextInput } from '../../../components/shared/input/Input';
import CheckBox from '../../../components/input/CheckBox';
import Select from '../../../components/shared/input/Select';
import { useCallback } from 'react';
import useSession from '../../../hooks/useSession';
import { BooleanParam, NumberParam, useQueryParam, useQueryParams, withDefault } from 'use-query-params';
import { QueryParamNames } from '../enums/QueryParamNames';
import { toast } from 'react-toastify';
import { useTags } from '../../../hooks/api/tags/useTags';
import { NaNToNull } from '../../../utils/NaNToNull';
import { TwoPlayerParam } from '../../../utils/queryParameters/twoPlayerParam';
import { UpdateParam } from '../../../utils/queryParameters/updateParam';
import Divider from '../../../components/divider/Divider';

const twoPlayerOptions = {
    any: 'Any',
    no: 'No two player',
    only: 'Only two player',
};

const updateOptions = {
    any: 'Any',
    '4-1729': '1.0',
    '1729-9228': '1.1',
    '9228-63099': '1.2',
    '63099-120716': '1.3',
    '120716-184402': '1.4',
    '184402-418434': '1.5',
    '418434-826013': '1.6',
    '826013-1619692': '1.7',
    '1619692-2808696': '1.8',
    '2808696-11007009': '1.9',
    '11007009-28355990': '2.0',
    '28355990-97452273': '2.1',
    '97452273-1000000000': '2.2',
};
type UpdateOption = keyof typeof updateOptions;

export default function FiltersExtended() {
    const session = useSession();
    const [minSubCount, setMinSubCount] = useQueryParam(QueryParamNames.MinSubmissionCount, NumberParam);
    const [maxSubCount, setMaxSubCount] = useQueryParam(QueryParamNames.MaxSubmissionCount, NumberParam);
    const [minEnjoymentCount, setMinEnjoymentCount] = useQueryParam(QueryParamNames.MinEnjoymentCount, NumberParam);
    const [maxEnjoymentCount, setMaxEnjoymentCount] = useQueryParam(QueryParamNames.MaxEnjoymentCount, NumberParam);
    const [minDeviation, setMinDeviation] = useQueryParam(QueryParamNames.MinDeviation, NumberParam);
    const [maxDeviation, setMaxDeviation] = useQueryParam(QueryParamNames.MaxDeviation, NumberParam);
    const [minID, setMinID] = useQueryParam(QueryParamNames.MinID, NumberParam);
    const [maxID, setMaxID] = useQueryParam(QueryParamNames.MaxID, NumberParam);
    const [twoPlayer, setTwoPlayer] = useQueryParam(QueryParamNames.TwoPlayer, withDefault(TwoPlayerParam, 'any'));
    const [update] = useQueryParam(QueryParamNames.Update, withDefault(UpdateParam, 'any'));
    const [topTagID, setTopTagID] = useQueryParam(QueryParamNames.TopTagID, withDefault(NumberParam, 0));
    const [excludeCompleted, setExcludeCompleted] = useQueryParam(
        QueryParamNames.ExcludeCompleted,
        withDefault(BooleanParam, false),
    );
    const [excludeUnrated, setExcludeUnrated] = useQueryParam(
        QueryParamNames.ExcludeUnrated,
        withDefault(BooleanParam, false),
    );
    const [excludeUnratedEnj, setExcludeUnratedEnj] = useQueryParam(
        QueryParamNames.ExcludeUnratedEnjoyment,
        withDefault(BooleanParam, false),
    );
    const [excludeRated, setExcludeRated] = useQueryParam(
        QueryParamNames.ExcludeRated,
        withDefault(BooleanParam, false),
    );
    const [excludeRatedEnj, setExcludeRatedEnj] = useQueryParam(
        QueryParamNames.ExcludeRatedEnjoyment,
        withDefault(BooleanParam, false),
    );
    const [inPack, setInPack] = useQueryParam(QueryParamNames.InPack, withDefault(BooleanParam, false));
    const [_, setQueryParams] = useQueryParams();

    const { data: tags } = useTags();

    const onUpdateChange = useCallback(
        (key: UpdateOption) => {
            if (key !== 'any') {
                const lowID = parseInt(key.split('-')[0]);
                const highID = parseInt(key.split('-')[1]);

                if (isNaN(lowID) || isNaN(highID)) {
                    toast.error('Invalid update range');
                    return;
                }

                setQueryParams((prev) => ({
                    ...prev,
                    [QueryParamNames.MinID]: lowID,
                    [QueryParamNames.MaxID]: highID,
                    [QueryParamNames.Update]: key,
                }));
            } else {
                setQueryParams((prev) => ({
                    ...prev,
                    [QueryParamNames.MinID]: undefined,
                    [QueryParamNames.MaxID]: undefined,
                    [QueryParamNames.Update]: key,
                }));
            }
        },
        [setQueryParams],
    );

    const tagOptions: Record<number, string> = {};
    (tags ?? []).forEach((tag) => {
        tagOptions[tag.ID] = tag.Name;
    });
    tagOptions[0] = 'Any';

    return (
        <div className='flex flex-col gap-3'>
            <div className='grid grid-cols-12 gap-3'>
                <div className='col-span-12 sm:col-span-6 lg:col-span-3 xl:col-span-2'>
                    <p className='form-label m-0'>Submission count:</p>
                    <div className='flex items-center'>
                        <NumberInput
                            value={minSubCount ?? undefined}
                            min='1'
                            max='1000'
                            onChange={(e) => setMinSubCount(NaNToNull(parseInt(e.target.value)))}
                        />
                        <p className='m-0 mx-2'>to</p>
                        <NumberInput
                            value={maxSubCount ?? undefined}
                            min='1'
                            max='1000'
                            onChange={(e) => setMaxSubCount(NaNToNull(parseInt(e.target.value)))}
                        />
                    </div>
                </div>
                <div className='col-span-12 sm:col-span-6 lg:col-span-3 xl:col-span-2'>
                    <p className='form-label m-0'>Enjoyment count:</p>
                    <div className='flex items-center'>
                        <NumberInput
                            value={minEnjoymentCount ?? undefined}
                            min='1'
                            max='1000'
                            onChange={(e) => setMinEnjoymentCount(NaNToNull(parseInt(e.target.value)))}
                        />
                        <p className='m-0 mx-2'>to</p>
                        <NumberInput
                            value={maxEnjoymentCount ?? undefined}
                            min='1'
                            max='1000'
                            onChange={(e) => setMaxEnjoymentCount(NaNToNull(parseInt(e.target.value)))}
                        />
                    </div>
                </div>
                <div className='col-span-12 sm:col-span-6 lg:col-span-3 xl:col-span-2'>
                    <p className='form-label m-0'>Rating deviation:</p>
                    <div className='flex items-center'>
                        <NumberInput
                            className='num-lg'
                            value={minDeviation ?? undefined}
                            min='1'
                            max='10'
                            onChange={(e) => setMinDeviation(NaNToNull(parseFloat(e.target.value)))}
                        />
                        <p className='m-0 mx-2'>to</p>
                        <NumberInput
                            className='num-lg'
                            value={maxDeviation ?? undefined}
                            min='1'
                            max='10'
                            onChange={(e) => setMaxDeviation(NaNToNull(parseFloat(e.target.value)))}
                        />
                    </div>
                </div>
                <div className='col-span-12 md:col-span-6 xl:col-span-6'>
                    <p className='form-label m-0'>Level ID:</p>
                    <div className='flex items-center'>
                        <TextInput
                            className='num-lg'
                            value={minID ?? undefined}
                            min='1'
                            max='500000000'
                            onChange={(e) => setMinID(NaNToNull(parseInt(e.target.value)))}
                        />
                        <p className='m-0 mx-2'>to</p>
                        <TextInput
                            className='num-lg'
                            value={maxID ?? undefined}
                            min='1'
                            max='500000000'
                            onChange={(e) => setMaxID(NaNToNull(parseInt(e.target.value)))}
                        />
                    </div>
                </div>
                <div className='col-span-12 sm:col-span-6 lg:col-span-3 xl:col-span-2'>
                    <p className='form-label m-0'>Two player:</p>
                    <Select
                        height='28'
                        activeKey={twoPlayer ?? 'any'}
                        options={twoPlayerOptions}
                        onChange={(key) => setTwoPlayer(key)}
                        id='twoPlayerSelectOptions'
                    />
                </div>
                <div className='col-span-12 sm:col-span-6 lg:col-span-3 xl:col-span-2'>
                    <p>Update:</p>
                    <Select
                        height='28'
                        activeKey={update ?? 'any'}
                        options={updateOptions}
                        onChange={onUpdateChange}
                        id='updateSelectOptions'
                    />
                </div>
                <div className='col-span-12 sm:col-span-6 lg:col-span-3 xl:col-span-2'>
                    <p>Top skillset:</p>
                    <Select
                        height='28'
                        activeKey={topTagID}
                        options={tagOptions}
                        onChange={(key) => setTopTagID(key)}
                        id='skillsetSelectOptions'
                    />
                </div>
            </div>
            <Divider />
            <div className='grid grid-cols-12'>
                <label
                    className={
                        'col-span-12 md:col-span-6 xl:col-span-4 flex items-center gap-2 select-none' +
                        (session.user ? '' : ' text-gray-500 line-through')
                    }
                >
                    <CheckBox
                        checked={excludeCompleted}
                        onChange={() => setExcludeCompleted((prev) => !prev)}
                        disabled={!session.user}
                    />
                    Uncompleted only
                </label>
                <label className='col-span-12 md:col-span-6 xl:col-span-4 flex items-center gap-2 select-none'>
                    <CheckBox checked={excludeUnrated} onChange={() => setExcludeUnrated((prev) => !prev)} />
                    Rated tier only
                </label>
                <label className='col-span-12 md:col-span-6 xl:col-span-4 flex items-center gap-2 select-none'>
                    <CheckBox checked={excludeUnratedEnj} onChange={() => setExcludeUnratedEnj((prev) => !prev)} />
                    Has enjoyment
                </label>
                <label className='col-span-12 md:col-span-6 xl:col-span-4 flex items-center gap-2 select-none'>
                    <CheckBox checked={excludeRated} onChange={() => setExcludeRated((prev) => !prev)} />
                    Unrated tier only
                </label>
                <label className='col-span-12 md:col-span-6 xl:col-span-4 flex items-center gap-2 select-none'>
                    <CheckBox checked={excludeRatedEnj} onChange={() => setExcludeRatedEnj((prev) => !prev)} />
                    No enjoyment ratings
                </label>
                <label className='col-span-12 md:col-span-6 xl:col-span-4 flex items-center gap-2 select-none'>
                    <CheckBox checked={inPack} onChange={() => setInPack((prev) => !prev)} />
                    Pack levels only
                </label>
            </div>
        </div>
    );
}
