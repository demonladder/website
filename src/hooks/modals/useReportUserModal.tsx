import ReportUserModal from '../../components/modals/ReportUserModal';
import useModal from './useModal';

export function useReportUserModal() {
    const { createModal, closeModal } = useModal();

    function open(userID: number) {
        const ID = `reportUser-${userID}`;

        createModal(
            ID,
            <ReportUserModal userID={userID} onClose={() => closeModal(ID)} />,
        );
    }

    return open;
}
