import { DiscordLink, PrimaryButton } from '../Button';
import Modal from '../Modal';

interface Props {
    onClose: () => void;
}

export default function SyncDiscordModal({ onClose: close }: Props) {
    return (
        <Modal title='Sync Discord account' show={true} onClose={close}>
            <Modal.Body>
                <div className='my-6'>
                    <p>Hey there, in order to start submitting you must first sync your Discord account to GDDL.</p>
                    <p>This is mostly a security meassure, but it also adds your current profile picture to gddl and you will be able to receive DMs on Discord when your submissions gets approved should you choose it.</p>
                    <DiscordLink className='my-4' href={import.meta.env.VITE_DISCORD_OAUTH}>Sync to Discord</DiscordLink>
                    <p>You can always sync in <a href='/settings/profile' className='text-blue-500 underline' target='_blank' rel='noopener noreferrer'>profile settings</a> if you change your pfp and want it to show.</p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className='flex float-right round:gap-1'>
                    <PrimaryButton onClick={close}>Close</PrimaryButton>
                </div>
            </Modal.Footer>
        </Modal>
    );
}