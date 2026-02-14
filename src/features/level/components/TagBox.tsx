import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FullLevel } from '../../../api/types/compounds/FullLevel';
import { levelTagsClient, type Reaction } from '../../../api';
import { sendTagVoteRequest } from '../api/SendTagVoteRequest';
import { toast } from 'react-toastify';
import { getTagEligibility } from '../api/getTagEligibility';
import TagInfoModal from './TagInfoModal';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import { useTags } from '../../../hooks/api/tags/useTags';
import useContextMenu from '../../../context/menu/useContextMenu';
import { PermissionFlags } from '../../admin/roles/PermissionFlags';
import renderToastError from '../../../utils/renderToastError';
import Select from '../../../components/input/select/Select';
import InlineLoadingSpinner from '../../../components/ui/InlineLoadingSpinner';

export default function TagBox({ level }: { level: FullLevel }) {
    const [isLoading, setIsLoading] = useState(false);

    const queryClient = useQueryClient();
    const { data: levelTags } = useQuery({
        queryKey: ['level', level.ID, 'tags'],
        queryFn: () => levelTagsClient.getLevelTags(level.ID),
    });
    const { data: tags, status: tagStatus, fetchStatus: tagFetchStatus } = useTags();
    const { data: voteMeta } = useQuery({
        queryKey: ['level', level.ID, 'tags', 'eligible'],
        queryFn: () => getTagEligibility(level.ID),
    });

    function onVoteChange(tagID: number) {
        if (isLoading) return;
        if (tagID === 0) return;

        sendTagVoteRequest(level.ID, tagID)
            .then(() => {
                void queryClient.invalidateQueries({ queryKey: ['level', level.ID, 'tags'] });
            })
            .catch((err: Error) => {
                toast.error(renderToastError.render({ data: err }));
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const tagsToDisplay = [];
    const tagOptions: Record<string, string> = {};
    if (tags !== undefined) {
        tags.forEach((t) => (tagOptions[t.ID] = t.Name));
    }

    if (levelTags !== undefined) {
        const topThreeTags = levelTags.reactions.slice(0, 3);
        const userVotes = levelTags.reactions.filter(
            (t) => t.HasVoted && !topThreeTags.find((_t) => t.TagID === _t.TagID),
        );

        tagsToDisplay.push(...topThreeTags, ...userVotes);
    }

    const isContentLoading = levelTags === undefined || tagStatus === 'pending' || tagFetchStatus === 'fetching';
    const canVote = voteMeta?.eligible === true;

    return (
        <div className='bg-theme-700 border border-theme-outline shadow-md p-2 mt-2 round:rounded-xl flex flex-wrap gap-2'>
            <TagInfoModal />
            {!isContentLoading ? (
                <>
                    {levelTags.reactions.map((t, i) => (
                        <Tag
                            levelID={level.ID}
                            submission={t}
                            eligible={voteMeta?.eligible}
                            key={`tagSubmission_${level.ID}_${i}`}
                        />
                    ))}
                    {levelTags.reactions.length === 0 && <span>None yet</span>}
                </>
            ) : (
                <span className='mt-4 text-xl'>
                    <LoadingSpinner />
                </span>
            )}
            {!isContentLoading && canVote && (
                <div className='self-center'>
                    <Select
                        label={<i className='bx bx-plus text-2xl' />}
                        options={tagOptions}
                        id='voteTag'
                        onOption={(o) => onVoteChange(parseInt(o))}
                    />
                </div>
            )}
        </div>
    );
}

function Tag({ levelID, submission, eligible = false }: { levelID: number; submission: Reaction; eligible?: boolean }) {
    const queryClient = useQueryClient();
    const onContextMenu = useContextMenu([
        { text: 'Vote', onClick: handleClick },
        {
            type: 'danger',
            text: 'Remove votes',
            onClick: handleRemoveVotes,
            permission: PermissionFlags.MANAGE_SUBMISSIONS,
        },
    ]);

    const { data: tags, status } = useTags();
    if (status === 'pending') return <InlineLoadingSpinner />;
    if (status === 'error') return;
    const tag = tags.find((t) => t.ID === submission.TagID);
    if (!tag) return;

    function handleRemoveVotes() {
        void toast.promise(levelTagsClient.removeVotes(levelID, submission.TagID), {
            pending: 'Removing votes...',
            success: {
                render: () => {
                    void queryClient.invalidateQueries({ queryKey: ['level', levelID, 'tags'] });
                    return 'Votes removed successfully';
                },
            },
            error: renderToastError,
        });
    }

    function handleClick() {
        if (!eligible) return toast.error('You are not eligible to vote on skillsets for this level!');

        void sendTagVoteRequest(levelID, submission.TagID).then(() => {
            void queryClient.invalidateQueries({ queryKey: ['level', levelID, 'tags'] });
        });
    }

    return (
        <button
            onClick={handleClick}
            onContextMenu={onContextMenu}
            className={
                (eligible ? 'cursor-pointer hover:border-white ' : '') +
                'text-xl px-2 py-1 group round:rounded-lg select-none relative border ' +
                (submission.HasVoted
                    ? 'bg-blue-600/25 border-blue-400'
                    : 'bg-theme-600 border-theme-600  transition-colors')
            }
        >
            <span>
                {tag.Name} {submission.ReactCount}
            </span>
            {tag.Description && (
                <div className='pointer-events-none text-base absolute z-30 w-56 opacity-0 group-hover:opacity-100 transition-opacity left-1/2 top-full -translate-x-1/2 translate-y-1 bg-theme-500 border border-theme-400 round:rounded-lg shadow-lg px-2 py-1'>
                    {tag.Description}
                </div>
            )}
        </button>
    );
}
