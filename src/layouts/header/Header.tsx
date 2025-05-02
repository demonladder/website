import { useWindowSize } from 'usehooks-ts';
import HeaderThin from './HeaderThin';
import HeaderWide from './HeaderWide';

export default function Header() {
    const { width } = useWindowSize();

    if (width >= 1536) return <HeaderWide />;
    return <HeaderThin />;
}
