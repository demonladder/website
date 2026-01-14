import Page from '../../components/layout/Page';
import './diversion.css';
import crushedCan from './images/crushed can.png';
import image2 from './images/goth in bed.jpg';
import image3 from './images/w mirror.jpg';
import maid from './images/maid.jpg';
import blahaj from './images/blahaj.jpg';
import bed from './images/bed.jpg';
import nyiwa from './images/nyiwa.jpg';

export default function Diversion() {
    return (
        <Page title='Diversion'>
            <div className='gallery grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 grid-flow-dense'>
                <img src={nyiwa} />
                <img src={crushedCan} />
                <img src={image2} />
                <img src={image3} />
                <img src={maid} />
                <img src={blahaj} />
                <img src={bed} />
            </div>
            <p>^ dev btw</p>
        </Page>
    );
}
