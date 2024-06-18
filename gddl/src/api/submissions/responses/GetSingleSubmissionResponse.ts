import Level from '../../types/Level';
import Meta from '../../types/Meta';
import Submission from '../../types/Submission';
import User from '../../types/User';

type GetSingleSubmissionResponse = Submission & { Level: Level & { Meta: Meta } } & { User: User } & { SecondaryUser: User | null };

export default GetSingleSubmissionResponse;