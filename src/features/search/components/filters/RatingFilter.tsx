import { NumberParam, useQueryParam } from 'use-query-params';
import { NumberInput } from '../../../../components/Input';
import { parseNumber } from '../../../../utils/parse/parseNumber';
import { QueryParamNames } from '../../enums/QueryParamNames';

export default function RatingFilter() {
    const [minRating, setMinRating] = useQueryParam(QueryParamNames.MinRating, NumberParam);
    const [maxRating, setMaxRating] = useQueryParam(QueryParamNames.MaxRating, NumberParam);

    return (
        <div className='col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-2'>
            <p>Tier:</p>
            <div className='flex items-center'>
                <NumberInput min='1' max='35' value={minRating ?? ''} onChange={(e) => setMinRating(parseNumber(e.target.value))} />
                <p className='m-0 mx-2'>to</p>
                <NumberInput min='1' max='35' value={maxRating ?? ''} onChange={(e) => setMaxRating(parseNumber(e.target.value))} />
            </div>
        </div>
    );
}
