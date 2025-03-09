import { NumberParam, useQueryParam } from 'use-query-params';
import { NumberInput } from '../../../../components/Input';
import { parseNumber } from '../../../../utils/parse/parseNumber';
import { QueryParamNames } from '../QueryParamNames';

export default function EnjoymentFilter() {
    const [minEnjoyment, setMinEnjoyment] = useQueryParam(QueryParamNames.MinEnjoyment, NumberParam);
    const [maxEnjoyment, setMaxEnjoyment] = useQueryParam(QueryParamNames.MaxEnjoyment, NumberParam);

    return (
        <div className='col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-2'>
            <p>Enjoyment:</p>
            <div className='flex items-center'>
                <NumberInput min='0' max='10' value={minEnjoyment ?? ''} onChange={(e) => setMinEnjoyment(parseNumber(e.target.value))} />
                <p className='m-0 mx-2'>to</p>
                <NumberInput min='0' max='10' value={maxEnjoyment ?? ''} onChange={(e) => setMaxEnjoyment(parseNumber(e.target.value))} />
            </div>
        </div>
    );
}
