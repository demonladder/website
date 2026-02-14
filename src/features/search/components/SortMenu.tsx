import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import SegmentedButtonGroup from '../../../components/input/buttons/segmented/SegmentedButtonGroup';
import Select from '../../../components/input/select/Select';
import { QueryParamNames } from '../enums/QueryParamNames';

const sorts = {
    ID: 'Level ID',
    name: 'Name',
    rating: 'Rating',
    enjoyment: 'Enjoyment',
    ratingCount: 'Rating count',
    enjoymentCount: 'Enjoyment count',
    deviation: 'Deviation',
    popularity: 'Popularity',
};
type Sorts = keyof typeof sorts;

const sortDirections = {
    asc: 'Asc',
    desc: 'Desc',
} as const;
type SortDirections = keyof typeof sortDirections;

export default function SortMenu() {
    const [sorter, setSorter] = useQueryParam('sort', withDefault(StringParam, 'ID'));
    const [sortDirection, setSortDirection] = useQueryParam(
        QueryParamNames.SortDirection,
        withDefault(StringParam, 'asc'),
    );

    return (
        <div className='max-md:grow flex items-center mt-4 gap-2'>
            <Select label={`Sort by: ${sorts[sorter as Sorts]}`} options={sorts} onOption={setSorter} />
            <SegmentedButtonGroup
                options={sortDirections}
                activeKey={sortDirection as SortDirections}
                onSetActive={setSortDirection}
            />
        </div>
    );
}
