import { useQuery } from '@tanstack/react-query';
import { getShowcaseSuggestions, GetShowcaseSuggestionsOptions } from '../api/getShowcaseSuggestions';

export function useShowcaseSuggestions(options?: GetShowcaseSuggestionsOptions) {
    return useQuery({
        queryKey: ['showcase-suggestions', options],
        queryFn: () => getShowcaseSuggestions(options),
    });
}
