import { useState } from 'react';
import { useShowcaseSuggestions } from '../hooks/useShowcaseSuggestions';
import PageButtons from '../../../../components/PageButtons';
import Heading2 from '../../../../components/headings/Heading2';
import DemonFace from '../../../../components/DemonFace';
import { DemonLogoSizes } from '../../../../utils/difficultyToImgSrc';
import Heading3 from '../../../../components/headings/Heading3';
import { SecondaryButton } from '../../../../components/ui/buttons/SecondaryButton';
import TextButton from '../../../../components/input/buttons/text/TextButton';
import { Link } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { acceptShowcaseSuggestion } from '../api/acceptShowcaseSuggestion';
import { deleteShowcaseSuggestion } from '../api/deleteShowcaseSuggestion';
import { toast } from 'react-toastify';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';

export default function Showcases() {
    const [page, setPage] = useState(0);
    const { data: suggestions, status } = useShowcaseSuggestions({ page, limit: 2 });
    const queryClient = useQueryClient();

    const acceptMutation = useMutation({
        mutationFn: acceptShowcaseSuggestion,
        onSuccess: () => {
            toast.success('Showcase accepted');
            void queryClient.invalidateQueries({ queryKey: ['showcase-suggestions'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteShowcaseSuggestion,
        onSuccess: () => {
            toast.warn('Showcase deleted');
            void queryClient.invalidateQueries({ queryKey: ['showcase-suggestions'] });
        },
    });

    return (
        <section className='mt-8'>
            <Heading2>Showcase suggestions</Heading2>
            {status === 'success' && <>
                {suggestions.total === 0 &&
                    <p>No new showcase suggestions</p>
                }
                <ul className='grid lg:grid-cols-2 gap-4'>
                    {suggestions.suggestions.map((suggestion) => <li className='bg-theme-700 border border-theme-600 round:rounded-2xl p-4' key={suggestion.ID}>
                        <div className='flex items-center mb-2'>
                            <DemonFace diff={suggestion.level.Meta.Difficulty} rarity={suggestion.level.Meta.Rarity} size={DemonLogoSizes.MEDIUM} />
                            <div className='grow'>
                                <Heading3><Link to={`/level/${suggestion.levelID}`}><b>{suggestion.level.Meta.Name}</b> by {suggestion.level.Meta.Publisher?.name ?? '(-)'}</Link></Heading3>
                                <p>Suggested by: <Link to={`/profile/${suggestion.userID}`}>{suggestion.user.Name}</Link></p>
                                <p className='text-theme-400'>{new Date(suggestion.updatedAt.replace(' +00:00', 'Z').replace(' ', 'T')).toLocaleString()}</p>
                            </div>
                        </div>
                        <LiteYouTubeEmbed id={suggestion.videoID} title={suggestion.level.Meta.Name} />
                        <div className='flex justify-end gap-1 mt-2'>
                            <TextButton onClick={() => deleteMutation.mutate(suggestion.ID)}>Deny</TextButton>
                            <SecondaryButton onClick={() => acceptMutation.mutate(suggestion.ID)}>Accept</SecondaryButton>
                        </div>
                    </li>)}
                </ul>
                <PageButtons onPageChange={setPage} meta={{ limit: suggestions.limit, page, total: suggestions.total }} />
            </>
            }
        </section>
    );
}
