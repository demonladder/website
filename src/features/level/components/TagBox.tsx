import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FullLevel } from '../../../api/types/compounds/FullLevel';
import { TopTags, getLevelTags } from '../api/getLevelTags';
import { sendTagVoteRequest } from '../api/SendTagVoteRequest';
import { toast } from 'react-toastify';
import { getTagEligibility } from '../api/getTagEligibility';
import TagInfoModal from './TagInfoModal';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { KeyboardAccessibility } from '../../../utils/KeyboardAccessibility';
import { useTags } from '../../../hooks/api/tags/useTags';
import useContextMenu from '../../../components/ui/menuContext/useContextMenu';
import { PermissionFlags } from '../../admin/roles/PermissionFlags';
import { removeTagVotes } from '../api/removeTagVotes';
import renderToastError from '../../../utils/renderToastError';
import Select from '../../../components/input/select/Select';

export default function TagBox({ level }: { level: FullLevel }) {
    const [isLoading, setIsLoading] = useState(false);

    const queryClient = useQueryClient();
    const { data: levelTags } = useQuery({
        queryKey: ['level', level.ID, 'tags'],
        queryFn: () => getLevelTags(level.ID),
    });
    const { data: tags, status: tagStatus, fetchStatus: tagFetchStatus } = useTags();
    const { data: voteMeta } = useQuery({
        queryKey: ['level', level.ID, 'tags', 'eligible'],
        queryFn: () => getTagEligibility(level.ID),
    });

    function onVoteChange(tagID: number) {
        if (isLoading) return;
        if (tagID === 0) return;

        sendTagVoteRequest(level.ID, tagID).then(() => {
            void queryClient.invalidateQueries({ queryKey: ['level', level.ID, 'tags'] });
        }).catch((err: Error) => {
            toast.error(renderToastError.render({ data: err }));
        }).finally(() => {
            setIsLoading(false);
        });
    }

    const tagsToDisplay = [];
    const tagOptions: Record<string, string> = {};
    if (tags !== undefined) {
        tags.forEach((t) => tagOptions[t.ID] = t.Name);
    }

    if (levelTags !== undefined) {
        const topThreeTags = levelTags.slice(0, 3);
        const userVotes = levelTags.filter((t) => t.HasVoted && !topThreeTags.find((_t) => t.TagID === _t.TagID));

        tagsToDisplay.push(...topThreeTags, ...userVotes);
    }

    const isContentLoading = levelTags === undefined || tagStatus === 'pending' || tagFetchStatus === 'fetching';
    const canVote = voteMeta?.eligible === true;

    return (
        <div className='bg-theme-700 border border-theme-outline shadow-md p-2 mt-2 round:rounded-xl flex flex-wrap gap-2'>
            <TagInfoModal />
            {!isContentLoading
                ? <>
                    {levelTags.map((t, i) => (<Tag levelID={level.ID} submission={t} eligible={voteMeta?.eligible} key={`tagSubmission_${level.ID}_${i}`} />))}
                    {levelTags.length === 0 && (<span>None yet</span>)}
                </>
                : <span className='mt-4 text-xl'><LoadingSpinner /></span>
            }
            {(!isContentLoading && canVote) &&
                <div className='self-center'>
                    <Select label={<i className='bx bx-plus text-xl' />} options={tagOptions} id='voteTag' onOption={(o) => onVoteChange(parseInt(o))} />
                </div>
            }
        </div>
    );
}

function Tag({ levelID, submission, eligible = false }: { levelID: number, submission: TopTags, eligible?: boolean }) {
    const queryClient = useQueryClient();
    const onContextMenu = useContextMenu([
        { text: 'Vote', onClick: handleClick },
        { type: 'danger', text: 'Remove votes', onClick: handleRemoveVotes, permission: PermissionFlags.MANAGE_SUBMISSIONS },
    ]);

    function handleRemoveVotes() {
        void toast.promise(removeTagVotes(levelID, submission.TagID), {
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
        <div onClick={handleClick} onKeyDown={KeyboardAccessibility.onSelect(handleClick)} tabIndex={0} onContextMenu={onContextMenu} className={(eligible ? 'cursor-pointer hover:border-white ' : '') + 'text-xl px-2 py-1 group round:rounded-lg select-none relative border ' + (submission.HasVoted ? 'bg-blue-600/25 border-blue-400' : 'bg-theme-600 border-theme-600  transition-colors')}>
            <span>{submission.Tag.Name} {submission.ReactCount}</span>
            {submission.Tag.Description &&
                <div className='pointer-events-none absolute z-30 w-56 opacity-0 group-hover:opacity-100 transition-opacity left-1/2 top-full -translate-x-1/2 translate-y-1 bg-theme-500 border border-theme-400 round:rounded-lg shadow-lg px-2 py-1'>{submission.Tag.Description}</div>
            }
        </div>
    );
}
