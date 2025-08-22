import { LoaderFunctionArgs } from 'react-router';
import { QueryParamNames } from './enums/QueryParamNames';
import { BooleanParam, NumberParam, StringParam, withDefault } from 'use-query-params';

export function searchLoader({ request }: LoaderFunctionArgs) {
    const params = new URL(request.url).searchParams;

    if (!sessionStorage.getItem('level-filters'))
        sessionStorage.setItem(
            'level-filters',
            JSON.stringify({
                [QueryParamNames.Name]: StringParam.decode(params.get(QueryParamNames.Name) ?? undefined),
                [QueryParamNames.Creator]: StringParam.decode(params.get(QueryParamNames.Creator) ?? undefined),
                [QueryParamNames.Song]: StringParam.decode(params.get(QueryParamNames.Song) ?? undefined),
                [QueryParamNames.Sort]: withDefault(StringParam, 'ID').decode(
                    params.get(QueryParamNames.Sort) ?? undefined,
                ),
                [QueryParamNames.SortDirection]: withDefault(StringParam, 'asc').decode(
                    params.get(QueryParamNames.SortDirection) ?? undefined,
                ),
                [QueryParamNames.MinRating]: NumberParam.decode(params.get(QueryParamNames.MinRating) ?? undefined),
                [QueryParamNames.MaxRating]: NumberParam.decode(params.get(QueryParamNames.MaxRating) ?? undefined),
                [QueryParamNames.MinEnjoyment]: NumberParam.decode(
                    params.get(QueryParamNames.MinEnjoyment) ?? undefined,
                ),
                [QueryParamNames.MaxEnjoyment]: NumberParam.decode(
                    params.get(QueryParamNames.MaxEnjoyment) ?? undefined,
                ),
                [QueryParamNames.Difficulty]: StringParam.decode(params.get(QueryParamNames.Difficulty) ?? undefined),
                [QueryParamNames.Length]: NumberParam.decode(params.get(QueryParamNames.Length) ?? undefined),
                [QueryParamNames.MinSubmissionCount]: NumberParam.decode(
                    params.get(QueryParamNames.MinSubmissionCount) ?? undefined,
                ),
                [QueryParamNames.MaxSubmissionCount]: NumberParam.decode(
                    params.get(QueryParamNames.MaxSubmissionCount) ?? undefined,
                ),
                [QueryParamNames.MinEnjoymentCount]: NumberParam.decode(
                    params.get(QueryParamNames.MinEnjoymentCount) ?? undefined,
                ),
                [QueryParamNames.MaxEnjoymentCount]: NumberParam.decode(
                    params.get(QueryParamNames.MaxEnjoymentCount) ?? undefined,
                ),
                [QueryParamNames.MinDeviation]: NumberParam.decode(
                    params.get(QueryParamNames.MinDeviation) ?? undefined,
                ),
                [QueryParamNames.MaxDeviation]: NumberParam.decode(
                    params.get(QueryParamNames.MaxDeviation) ?? undefined,
                ),
                [QueryParamNames.MinID]: NumberParam.decode(params.get(QueryParamNames.MinID) ?? undefined),
                [QueryParamNames.MaxID]: NumberParam.decode(params.get(QueryParamNames.MaxID) ?? undefined),
                [QueryParamNames.TwoPlayer]: StringParam.decode(params.get(QueryParamNames.TwoPlayer) ?? undefined),
                [QueryParamNames.Update]: StringParam.decode(params.get(QueryParamNames.Update) ?? undefined),
                [QueryParamNames.TopSkillset]: StringParam.decode(params.get(QueryParamNames.TopSkillset) ?? undefined),
                [QueryParamNames.ExcludeCompleted]: BooleanParam.decode(
                    params.get(QueryParamNames.ExcludeCompleted) ?? undefined,
                ),
                [QueryParamNames.ExcludeUnrated]: BooleanParam.decode(
                    params.get(QueryParamNames.ExcludeUnrated) ?? undefined,
                ),
                [QueryParamNames.ExcludeUnratedEnjoyment]: BooleanParam.decode(
                    params.get(QueryParamNames.ExcludeUnratedEnjoyment) ?? undefined,
                ),
                [QueryParamNames.ExcludeRated]: BooleanParam.decode(
                    params.get(QueryParamNames.ExcludeRated) ?? undefined,
                ),
                [QueryParamNames.ExcludeRatedEnjoyment]: BooleanParam.decode(
                    params.get(QueryParamNames.ExcludeRatedEnjoyment) ?? undefined,
                ),
                [QueryParamNames.InPack]: BooleanParam.decode(params.get(QueryParamNames.InPack) ?? undefined),
            }),
        );

    return null;
}
