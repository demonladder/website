import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import ModalProvider from '../context/ModalProvider';
import { Helmet } from 'react-helmet-async';
import Header from './header/Header';
import NavbarNotificationRenderer from '../context/NavbarNotification/NavbarNotificationRenderer';
import { Outlet } from 'react-router-dom';
import Footer from './footer/Footer';
import StorageManager from '../utils/StorageManager';
import { useCallback, useEffect, useRef } from 'react';
import noise3D from '../utils/noise/noise3D';
import { useWindowSize } from 'usehooks-ts';
import useResizeObserver from '@react-hook/resize-observer';
import useNavbarNotification from '../context/NavbarNotification/useNavbarNotification';

export default function MainLayout() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const points = useRef<{ x: number, y: number }[]>([]);
    const lines = useRef<[number, number][]>([]);
    const isBackgroundEnabled = StorageManager.getUseBackground();

    const variance = 100;
    const movementSpeed = 0.1;
    const movementScale = 250;
    const heightModifier = 3;

    function line(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    const draw = useCallback((prevFrameTime: DOMHighResTimeStamp) => {
        const canvas = canvasRef.current;
        if (!canvas) return console.error('Canvas not found');

        const ctx = canvas.getContext('2d');

        if (!ctx) {
            console.error('Canvas rendering not supported');
            return;
        }
        ctx.fillStyle = 'rgb(127 127 127)';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'currentColor';

        // Draw the lines
        for (const [i, j] of lines.current) {
            const p1 = points.current[i];
            const p2 = points.current[j];

            const offsetX1 = p1.x + Math.cos(prevFrameTime / 1000 * movementSpeed) * variance;
            const offsetY1 = p1.y + Math.sin(prevFrameTime / 1000 * movementSpeed) * variance;

            const offsetX2 = p2.x + Math.cos(prevFrameTime / 1000 * movementSpeed) * variance;
            const offsetY2 = p2.y + Math.sin(prevFrameTime / 1000 * movementSpeed) * variance;

            const noiseX1 = noise3D(offsetX1 / 100, offsetY1 / 100, i) * movementScale;
            const noiseY1 = noise3D(offsetX1 / 200, offsetY1 / 200, i) * movementScale;

            const noiseX2 = noise3D(offsetX2 / 100, offsetY2 / 100, j) * movementScale;
            const noiseY2 = noise3D(offsetX2 / 200, offsetY2 / 200, j) * movementScale;

            line(ctx, p1.x + noiseX1, p1.y + noiseY1, p2.x + noiseX2, p2.y + noiseY2);
        }
    }, []);

    const windowSize = useWindowSize();
    const setup = useCallback(() => {
        if (!isBackgroundEnabled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        if (!containerRef.current) return;

        const ctx = canvas.getContext('2d');

        if (!ctx) {
            console.error('Canvas rendering not supported');
            return;
        }

        const width = windowSize.width;
        const height = windowSize.height + (document.documentElement.scrollHeight - document.documentElement.clientHeight) / heightModifier;
        canvas.width = width;
        canvas.height = height;

        const density = 0.000008;
        lines.current = [];
        points.current = Array.from({ length: height * width * density }, () => ({
            x: Math.random() * (width + 200) - 100,
            y: Math.random() * height,
        }));

        for (let i = 0; i < points.current.length; i++) {
            const point1 = points.current[i];

            const closest = points.current
                .map((p2, j) => ({ j, dist: (point1.x - p2.x) ** 2 + (point1.y - p2.y) ** 2 }))
                .sort((a, b) => a.dist - b.dist);

            let l = 0;
            for (const { j } of closest) {
                if (l >= 3) break;
                const point2 = points.current[j];
                if (point1 === point2) continue;

                lines.current.push([i, j]);
                l++;
            }
        }

        // Remove duplicates
        lines.current = lines.current.filter((line, index, self) => {
            const [i, j] = line;
            return self.findIndex(l => (l[0] === i && l[1] === j) || (l[0] === j && l[1] === i)) === index;
        });

        function update(dt: number) {
            draw(dt);
            requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }, [draw, isBackgroundEnabled, windowSize.height, windowSize.width]);

    useResizeObserver(containerRef, setup);
    const { error: notifyError } = useNavbarNotification();

    useEffect(() => {
        const url = new URLSearchParams(location.search);
        const error = url.get('error');
        if (error) {
            if (error === 'already_linked') notifyError('This Discord account is already linked to another GDDL account.');
            else if (error === 'mismatching_discord_id') notifyError('The Discord account linked to this GDDL account does not match the Discord account you are trying to link with.');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onScroll = useCallback(() => {
        if (!canvasRef.current) return;

        canvasRef.current.style.transform = `translateY(-${window.scrollY / heightModifier}px)`;
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [onScroll]);

    return (
        <QueryParamProvider adapter={ReactRouter6Adapter} options={{ updateType: 'replaceIn' }} >
            <ModalProvider>
                <div className='fixed top-0 -z-50 w-full h-screen bg-linear-to-br from-theme-bg-from to-theme-bg-to' />
                {isBackgroundEnabled &&
                    <canvas ref={canvasRef} className='fixed top-0 pointer-events-none -z-50 text-theme-text/50' />
                }
                <Helmet>
                    <title>GD Demon Ladder</title>
                </Helmet>
                <div ref={containerRef} className='relative flex flex-col'>
                    <Header />
                    <NavbarNotificationRenderer />
                    <div className='hidden'>{/* Force Tailwind to include these colors. This is to reduce the final css bundle size. */}
                        <p className='bg-refreshRate-60'>60</p>
                        <p className='bg-refreshRate-75'>75</p>
                        <p className='bg-refreshRate-120'>120</p>
                        <p className='bg-refreshRate-144'>144</p>
                        <p className='bg-refreshRate-240'>240</p>
                        <p className='bg-refreshRate-360'>360</p>
                        <p className='text-permission-0'>0</p>
                        <p className='text-permission-1'>1</p>
                        <p className='text-permission-2'>2</p>
                        <p className='text-permission-3'>3</p>
                        <p className='text-permission-4'>4</p>
                        <p className='text-permission-5'>5</p>
                        <p className='text-permission-6'>6</p>
                    </div>
                    <div className='flex-grow over text-theme-text'>
                        <Outlet />
                    </div>
                    <Footer />
                </div>
            </ModalProvider>
        </QueryParamProvider>
    );
}
