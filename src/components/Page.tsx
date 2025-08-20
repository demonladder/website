import { useState } from 'react';
import Container from './Container';

interface Props extends Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>, 'className'> {
    title?: string;
}

export default function Page({ title, children, onContextMenu, ...props }: Props) {
    const [rand] = useState(Math.random());
    const randomImages = [
        'https://i.pinimg.com/736x/15/fc/13/15fc131659dd9f08bc15060dc030a7bb.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqMJZQ6-HVxTRfYYT8Y9WRpg_uostv_J4_gg&s',
        'https://cdna.artstation.com/p/assets/images/images/046/018/868/large/ttv-sylvee-epuich6weaeb1pm.jpg?1644105959',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3tpYgB26euCCliseVOWfBX9ZFWHENboo4lQ&s',
        'https://images.steamusercontent.com/ugc/2027231506438808635/7218683C6474BDD63DB8C603EF94A8DAE3A9407D/',
    ];
    const [imageRoll] = useState(Math.floor(Math.random() * randomImages.length));

    return (
        <main {...props} className='relative py-4'>
            {title && <title>{title}</title>}
            {rand < 0.01 &&
                <img src={randomImages[imageRoll]} className='absolute opacity-[2%] z-10 top-0 left-1/2 -translate-x-1/2 h-full pointer-events-none' />
            }
            <Container onContextMenu={onContextMenu}>
                {children}
            </Container>
        </main>
    );
}
