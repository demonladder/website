import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FullLevel } from '../../../api/levels';
import { LevelTagRequest, TagSubmission } from '../../../api/level/requests/LevelTagRequest';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Select from '../../../components/Select';
import { SendTagVoteRequest } from '../../../api/level/requests/SendTagVoteRequest';
import { toast } from 'react-toastify'
import renderToastError from '../../../utils/renderToastError';
import { GetTags } from '../../../api/level/requests/GetTags';
import { GetTagEligibility } from '../../../api/level/requests/GetTagEligibility';
import TagInfoModal from './TagInfoModal';

export default function TagBox({ level }: { level: FullLevel }) {
    const [isLoading, setIsLoading] = useState(false);

    const queryClient = useQueryClient();
    const { data: levelTags } = useQuery({
        queryKey: ['level', 'tags', level.LevelID],
        queryFn: () => LevelTagRequest(level.LevelID),
    });
    const { data: tags, status: tagStatus } = useQuery({
        queryKey: ['tags'],
        queryFn: GetTags,
    });
    const { data: voteMeta } = useQuery({
        queryKey: ['level', 'tags', level.LevelID, 'eligible'],
        queryFn: () => GetTagEligibility(level.LevelID),
    });

    function onVoteChange(key: string) {
        if (isLoading) return;
        if (parseInt(key) === 0) return;

        toast.promise(SendTagVoteRequest(level.LevelID, parseInt(key)), {
            pending: 'Sending...',
            success: 'Sent',
            error: renderToastError,
        }).then(() => {
            void queryClient.invalidateQueries(['level', 'tags', level.LevelID]);
        }).finally(() => {
            setIsLoading(false);
        });
    }
    
    const isContentLoading = levelTags === undefined || tagStatus === 'loading';
    return (
        <section className='my-2 px-4 py-3 bg-gray-700 round:rounded-xl text-xl flex justify-between gap-y-4 max-lg:flex-col'>
            <div className='flex max-lg:flex-col'>
                <span className='me-2 lg:self-center'><TagInfoModal /> Top 3 tags:</span>
                <div className='flex gap-2 max-md:flex-col'>
                    {levelTags?.map((t, i) => <Tag submission={t} key={`tagSubmission_${level.LevelID}_${i}`} />)}
                </div>
                {isContentLoading && (<LoadingSpinner />)}
                {levelTags?.length === 0 && (<span>None</span>)}
            </div>
            {(voteMeta?.eligible === true && tags !== undefined) &&
                <div className='md:self-center w-40'>
                    <Select options={[{ key: '0', value: 'Vote here' }, ...tags.map((t, i) => ({ key: (i+1).toString(), value: t.Name })), { key: '-1', value: '-Remove all-' }]} activeKey='0' id='voteTag' onChange={onVoteChange} />
                </div>
            }
        </section>
    );
}

function Tag({ submission }: { submission: TagSubmission }) {
    const queryClient = useQueryClient();

    function handleClick() {
        SendTagVoteRequest(submission.LevelID, submission.TagID).then(() => {
            queryClient.invalidateQueries(['level', 'tags', submission.LevelID]);
        })
    }

    return (
        <div onClick={handleClick} className={'px-2 group round:rounded-lg relative border ' + (submission.HasVoted ? 'bg-blue-600 bg-opacity-25 border-blue-400' : 'bg-gray-600 border-gray-600 hover:border-white transition-colors')}>
            <span>{submission.Name} </span>
            <span>{Math.round(submission.Percent * 100)}%</span>
            {submission.Description &&
                <div className='absolute w-52 hidden group-hover:block left-1/2 top-full -translate-x-1/2 translate-y-1 bg-gray-500 round:rounded shadow-lg px-2 py-1'>{submission.Description}</div>
            }
        </div>
    );
}