import SegmentedButtonGroup from '../../../components/input/buttons/segmented/SegmentedButtonGroup';

interface Props {
    isList: boolean;
    onViewList: () => void;
    onViewGrid: () => void;
}

export default function ViewType({ isList, onViewList, onViewGrid }: Props) {
    const options = {
        LIST: 'List',
        GRID: 'Grid',
    };

    function onSetActive(key: keyof typeof options) {
        if (key === 'LIST') {
            onViewList();
        } else if (key === 'GRID') {
            onViewGrid();
        }
    }

    return <SegmentedButtonGroup options={options} activeKey={isList ? 'LIST' : 'GRID'} onSetActive={onSetActive} />;
}
