import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FullLevel } from '../../../api/levels';
import { LevelTagRequest, TagSubmission } from '../../../api/level/requests/LevelTagRequest';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Select from '../../../components/Select';
import { SendTagVoteRequest } from '../../../api/level/requests/SendTagVoteRequest';
import { toast } from 'react-toastify';
import { GetTags } from '../../../api/level/requests/GetTags';
import { GetTagEligibility } from '../../../api/level/requests/GetTagEligibility';
import TagInfoModal from './TagInfoModal';

export default function TagBox({ level }: { level: FullLevel }) {
    const [isLoading, setIsLoading] = useState(false);

    const queryClient = useQueryClient();
    const { data: levelTags } = useQuery({
        queryKey: ['level', level.LevelID, 'tags'],
        queryFn: () => LevelTagRequest(level.LevelID),
    });
    const { data: tags, status: tagStatus } = useQuery({
        queryKey: ['tags'],
        queryFn: GetTags,
    });
    const { data: voteMeta } = useQuery({
        queryKey: ['level', level.LevelID, 'tags', 'eligible'],
        queryFn: () => GetTagEligibility(level.LevelID),
    });

    function onVoteChange(key: string) {
        if (isLoading) return;
        if (parseInt(key) === 0) return;

        SendTagVoteRequest(level.LevelID, parseInt(key)).then(() => {
            queryClient.invalidateQueries(['level', level.LevelID, 'tags']);
        }).catch(() => {
            toast.error('An error occurred');
        }).finally(() => {
            setIsLoading(false);
        });
    }

    const tagsToDisplay = [];

    if (levelTags !== undefined) {
        const topThreeTags = levelTags.slice(0, 3);
        const userVotes = levelTags.filter((t) => t.HasVoted && !topThreeTags.find((_t) => t.TagID === _t.TagID));

        tagsToDisplay.push(...topThreeTags, ...userVotes);
    }

    const isContentLoading = levelTags === undefined || tagStatus === 'loading';
    return (
        <section className='text-xl'>
            <div className='my-2 px-4 py-3 bg-gray-700 round:rounded-xl flex justify-between gap-y-4 max-lg:flex-col'>
                <div className='flex max-lg:flex-col'>
                    <span className='me-2 lg:self-center'><TagInfoModal /> Top skillsets:</span>
                    <div className='flex flex-wrap gap-2 max-md:flex-col'>
                        {tagsToDisplay.map((t, i) => (<Tag submission={t} key={`tagSubmission_${level.LevelID}_${i}`} />))}
                    </div>
                    {isContentLoading && (<LoadingSpinner />)}
                    {levelTags?.length === 0 && (<span>None</span>)}
                </div>
                {(voteMeta?.eligible === true && tags !== undefined) &&
                    <div className='md:self-center w-40'>
                        <Select options={[{ key: '0', value: 'Vote tags' }, ...tags.map((t, i) => ({ key: (i + 1).toString(), value: t.Name })), { key: '-1', value: '-Remove all-' }]} activeKey='0' id='voteTag' onChange={onVoteChange} />
                    </div>
                }
            </div>
            {/* <div className='my-2 px-4 py-3 bg-gray-700 round:rounded-xl flex justify-between gap-y-4 max-lg:flex-col'>
                <div className='flex max-lg:flex-col'>
                    <span className='me-2 lg:self-center'><TagInfoModal /> Theme:</span>
                    <div className='flex gap-2 max-md:flex-col'>
                        <div className='px-2 group round:rounded-lg relative border bg-gray-600 border-gray-600 hover:border-white transition-colors'>
                            <span>Nine Circles </span>
                            <span>100%</span>
                        </div>
                    </div>
                </div>
            </div> */}
        </section>
    );
}

function Tag({ submission }: { submission: TagSubmission }) {
    const queryClient = useQueryClient();

    function handleClick() {
        SendTagVoteRequest(submission.LevelID, submission.TagID).then(() => {
            queryClient.invalidateQueries(['level', submission.LevelID, 'tags']);
        });
    }

    return (
        <div onClick={handleClick} className={'px-2 group round:rounded-lg cursor-pointer relative border ' + (submission.HasVoted ? 'bg-blue-600 bg-opacity-25 border-blue-400' : 'bg-gray-600 border-gray-600 hover:border-white transition-colors')}>
            <span>{submission.Name} </span>
            <span>{Math.round(submission.Percent * 100)}%</span>
            {submission.Description &&
                <div className='absolute z-10 w-56 hidden group-hover:block left-1/2 top-full -translate-x-1/2 translate-y-1 bg-gray-500 border border-gray-400 round:rounded-lg shadow-lg px-2 py-1'>{submission.Description}</div>
            }
        </div>
    );
}