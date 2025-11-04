import { useMutation, useQueryClient } from '@tanstack/react-query';
import APIClient from '../../../api/APIClient';
import { toast } from 'react-toastify';
import useSession from '../../../hooks/useSession';
import type { FullLevel } from '../../../api/types/compounds/FullLevel';
import type { GetFavoriteLevelsResponse } from '../../profile/api/getFavoriteLevels';

interface Options {
    onSuccess?: () => void;
}

export function useAddFavoriteMutation(options?: Options) {
    const session = useSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (levelID: number) => {
            const userID = session.user?.ID;
            if (!userID) throw new Error('You must be signed in to add favorites');
            return APIClient.post(`/user/${userID}/favorites`, { levelID });
        },
        onSuccess: (_, levelID) => {
            toast.success('Added as favorite');

            const userID = session.user?.ID;
            if (!userID) return;

            const level = queryClient.getQueryData<FullLevel>(['level', levelID]);
            if (!level) {
                // If we don't have the level in cache, refetch favorites list instead
                void queryClient.invalidateQueries({ queryKey: ['user', userID, 'favorites'] });
                options?.onSuccess?.();
                return;
            }

            const newFavorite: GetFavoriteLevelsResponse = {
                ID: level.ID,
                Rating: level.Rating,
                Enjoyment: level.Enjoyment,
                Showcase: level.Showcase,
                Meta: {
                    Name: level.Meta.Name,
                    Difficulty: level.Meta.Difficulty,
                    Rarity: level.Meta.Rarity,
                    Publisher: level.Meta.Publisher ? { name: level.Meta.Publisher.name } : undefined,
                },
            };

            queryClient.setQueryData<GetFavoriteLevelsResponse[]>(['user', userID, 'favorites'], (existing) => {
                if (!existing || existing.length === 0) return [newFavorite];
                if (existing.some((favorite) => favorite.ID === levelID)) return existing;
                return [...existing, newFavorite];
            });

            options?.onSuccess?.();
        },
        onError: (error: unknown) => {
            const message = error instanceof Error ? error.message : 'Failed to add favorite';
            toast.error(message);
        },
    });
}
