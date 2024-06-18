import ISubmission from '../../types/Submission';
import User from '../../types/User';

export type Submission = (ISubmission & { User: User });

type GetLevelSubmissionsResponse = {
    total: number,
    limit: number,
    page: number,
    submissions: Submission[],
}

export default GetLevelSubmissionsResponse;