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
                    <object data={`https://cdn.discordapp.com/avatars/${user.data.DiscordData?.ID ?? '-'}/${user.data.DiscordData?.Avatar ?? '-'}.png`} type='image/png' className='rounded-full mx-auto'>
                        <i className='bx bxs-user-circle text-9xl' />
                    </object>
                    <p className='text-2xl mb-2'>{user.data.Name}</p>
                    <TextButton onClick={onUnSet} className='text-base'>Un-set</TextButton>
                </>
            )}
        </div>
    );
}
