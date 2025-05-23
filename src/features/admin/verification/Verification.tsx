import Heading2 from '../../../components/headings/Heading2';
import EligibleUsers from './components/EligibleUsers';
import VerificationRoleSelect from './components/VerificationRoleSelect';
import VerifiedUsers from './components/VerifiedUsers';

export default function Verification() {

    return (
        <>
            <Heading2 className='mb-2'>Verification</Heading2>
            <p>Here you can manage verified users and users who are eligible for getting verified. <b>Note</b>, only admins can verify users.</p>
            <p>Verified users are able to skip the queue when proof is the only thing holding the submission back.</p>
            <VerificationRoleSelect />
            <EligibleUsers />
            <VerifiedUsers />
        </>
    );
}
