import Header from '../../layouts/header/Header';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Footer from '../../layouts/footer/Footer';

// function getBrowserName() {
//     const browserInfo = navigator.userAgent;
    
//     if (browserInfo.includes('Opera') || browserInfo.includes('Opr')) {
//         return 'Opera';
//     } else if (browserInfo.includes('Edg')) {
//         return 'Edge';
//     } else if (browserInfo.includes('Chrome')) {
//         return 'Chrome';
//     } else if (browserInfo.includes('Safari')) {
//         return 'Safari';
//     } else if (browserInfo.includes('Firefox')) {
//         return 'Firefox'
//     }
    
//     return 'unknown';
// }

export default function Root() {
    return (
        <div className='relative flex flex-col'>
            <Helmet>
                <title>GD Demon Ladder</title>
            </Helmet>
            <Header />
            <main className='flex-grow over'>
                <Outlet />
            </main>
            <Footer />
            {/* {getBrowserName() === 'Firefox' &&
                <div className='snow' />
            } */}
        </div>
    );
}