import TextButton from '../../../../components/input/buttons/text/TextButton';
import useUserQuery from '../../../../hooks/queries/useUserQuery';

interface Props {
    userID: number;
    onUnSet: () => void;
}

export default function UserPreview({ userID, onUnSet }: Props) {
    const user = useUserQuery(userID);

    return (
        <div>
            {user.isSuccess && (
                <>
                    {user.data.avatar ? (
                        <img
                            src={`https://cdn.gdladder.com/avatars/${user.data.ID}/${user.data.avatar}.png`}
                            width='256'
                            height='256'
                            className='rounded-full mx-auto'
                            alt='Profile picture'
                        />
                    ) : (
                        <i className='bx bxs-user-circle text-9xl mx-auto' />
                    )}
                    <p className='text-2xl mb-2'>{user.data.Name}</p>
                    <TextButton onClick={onUnSet} className='text-base'>
                        Un-set
                    </TextButton>
                </>
            )}
        </div>
    );
}
