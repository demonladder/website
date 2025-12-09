import LoadingSpinner from '../../../components/LoadingSpinner';
import EditableSubmission from './components/EditableSubmission';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import getSubmission from '../../../api/submissions/getSubmission';
import Heading2 from '../../../components/headings/Heading2';

export default function EditSubmission() {
    const submissionID = parseInt(useParams().submissionID ?? '');

    const { data: submission, status } = useQuery({
        queryKey: ['submission', submissionID],
        queryFn: () => getSubmission(submissionID),
        enabled: !isNaN(submissionID),
    });

    if (status === 'pending') return (<LoadingSpinner />);
    if (status === 'error') return 'An error occurred';

    return (
        <main>
            <Heading2>Edit Submission</Heading2>
            {submission &&
                <EditableSubmission submission={submission} key={`${submission.LevelID}_${submission.UserID}`} />
            }
        </main>
    );
}
