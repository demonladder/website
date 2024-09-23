import useWindowDimensions from '../../hooks/useWindowDimensions';
import HeaderThin from './HeaderThin';
import HeaderWide from './HeaderWide';

export default function Header() {
    const { width } = useWindowDimensions();

    if (width >= 1536) {
        return <HeaderWide />;
    }

    return <HeaderThin />;
}