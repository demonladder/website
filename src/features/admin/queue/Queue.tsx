import { useQuery } from '@tanstack/react-query';
import { getPendingSubmissions } from './api/getPendingSubmissions';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import Submission from './components/Submission';
import FloatingLoadingSpinner from '../../../components/ui/FloatingLoadingSpinner';
import Select from '../../../components/shared/input/Select';
import PageButtons from '../../../components/shared/PageButtons';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import Heading1 from '../../../components/headings/Heading1';
import useSessionStorage from '../../../hooks/useSessionStorage';
import pluralS from '../../../utils/pluralS';
import LevelSearchBox from '../../../components/SearchBox/LevelSearchBox';
import { SecondaryButton } from '../../../components/ui/buttons/SecondaryButton';

const proofFilterOptions = {
    all: 'All',
    extremes: 'Extremes only',
    noExtremes: 'No extremes',
    noProof: 'No proof',
};

export default function Queue() {
    const [proofFilter, setProofFilter] = useSessionStorage<keyof typeof proofFilterOptions>('queue.filter', 'all');
    const [page, setPage] = useQueryParam('page', withDefault(NumberParam, 0));
    const [levelID, setLevelID] = useQueryParam('levelID', NumberParam);

    const { status, isFetching, data: queue } = useQuery({
        queryKey: ['submissionQueue', { page, proofFilter, levelID }],
        queryFn: () => getPendingSubmissions({ proofFilter, limit: 5, page, levelID: levelID ?? undefined }),
    });

    function Content() {
        if (status === 'pending') return <LoadingSpinner />;
        if (status === 'error') return <p>Error: couldn't fetch queue</p>;

        if (queue.total === 0) return <h5>Queue empty :D</h5>;

        return (<ul>{queue.submissions.map((s) => <Submission submission={s} key={s.ID} />)}</ul>);
    }

    return (
        <div>
            <FloatingLoadingSpinner isLoading={isFetching} />
            <Heading1 className='mb-3'>Pending submissions</Heading1>
            <p><b>Filters</b></p>
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-2'>
                <div>
                    <p>Proof</p>
                    <Select id='submissionQueueSortOrder' options={proofFilterOptions} activeKey={proofFilter} onChange={setProofFilter} />
                </div>
                <div>
                    <p>Level</p>
                    <div className='flex gap-2'>
                        <LevelSearchBox ID='queueLevelSearch' onLevel={(level) => setLevelID(level?.ID)} />
                        <SecondaryButton onClick={() => setLevelID(undefined)}>Clear</SecondaryButton>
                    </div>
                </div>
            </div>
            <Content />
            <PageButtons meta={{ limit: 5, page, total: queue?.total ?? 0 }} onPageChange={(p) => setPage(p)} />
            <p className='text-center'><b>{queue?.total ?? 0}</b> submission{pluralS(queue?.total ?? 0)} found</p>
        </div>
    );
}
