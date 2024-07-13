import HeaderThin from './HeaderThin';
import HeaderWide from './HeaderWide';

export default function Header() {
    return (
        <>
            <div className='hidden 2xl:block'>
                <HeaderWide />
            </div>
            <div className='hidden max-2xl:block'>
                <HeaderThin />
            </div>
        </>
    );
}