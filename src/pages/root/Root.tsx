import Header from '../../layouts/header/Header';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Footer from '../../layouts/footer/Footer';
import { useCallback, useEffect, useRef } from 'react';
import useResizeObserver from '@react-hook/resize-observer';
import noise3D from '../../utils/noise/noise3D';
import StorageManager from '../../utils/StorageManager';
import NavbarNotificationRenderer from '../../context/NavbarNotification/NavbarNotificationRenderer';
import useNavbarNotification from '../../context/NavbarNotification/useNavbarNotification';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';

export default function Root() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const randomPoints = useRef<{ x: number, y: number }[]>([]);

    const variance = 10;
    const movementSpeed = 0.3;
    const movementScale = 250;

    function line(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    const draw = useCallback((prevFrameTime: DOMHighResTimeStamp) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        if (!ctx) {
            console.error('Canvas rendering not supported');
            return;
        }

        //const dt = (performance.now() - prevFrameTime) / 1000;

        const randPoints = randomPoints.current;

        //const simplex = new Simplex();
        const offsetPoints = randPoints.map((p, i) => {
            const offsetX = p.x + Math.cos(prevFrameTime / 1000 * movementSpeed) * variance;
            const offsetY = p.y + Math.sin(prevFrameTime / 1000 * movementSpeed) * variance;

            const noiseX = noise3D(offsetX / 100, offsetY / 100, i) * movementScale;
            const noiseY = noise3D(offsetX / 200, offsetY / 200, i) * movementScale;

            return { x: p.x + noiseX, y: p.y + noiseY };
        });

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgb(127 127 127)';
        ctx.strokeStyle = 'rgb(127 127 127)';

        // Connect each line to the 4 nearest points
        for (let i = 0; i < offsetPoints.length; i++) {
            const p1 = offsetPoints[i];

            const closest = offsetPoints
                .map((p2, j) => ({ j, dist: (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2 }))
                .sort((a, b) => a.dist - b.dist)
                .slice(1, 5);

            for (const { j } of closest) {
                const p2 = offsetPoints[j];
                line(ctx, p1.x, p1.y, p2.x, p2.y);
            }
        }
    }, [randomPoints]);

    const setup = useCallback((entry: ResizeObserverEntry) => {
        if (!StorageManager.getUseBackground()) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        if (!containerRef.current) return;

        const width = entry.contentRect.width;
        const height = entry.contentRect.height;
        if (height > 3000) return;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');

        if (!ctx) {
            console.error('Canvas rendering not supported');
            return;
        }

        const density = 0.000005;

        randomPoints.current = Array.from({ length: height * width * density }, () => ({
            x: Math.random() * (width + 200) - 100,
            y: Math.random() * height,
        }));

        function update(dt: number) {
            draw(dt);
            requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }, [draw]);

    useResizeObserver(containerRef, setup);
    const { error: notifyError } = useNavbarNotification();

    useEffect(() => {
        const url = new URLSearchParams(location.search);
        const error = url.get('error');
        if (error) {
            if (error === 'already_linked') notifyError('This Discord account is already linked to another GDDL account.');
            else if (error === 'mismatching_disord_id') notifyError('The Discord account linked to this GDDL account does not match the Discord account you are trying to link with.');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <QueryParamProvider adapter={ReactRouter6Adapter} options={{ updateType: 'replaceIn' }} >
            <div ref={containerRef} className='relative flex flex-col'>
                <Helmet>
                    <title>GD Demon Ladder</title>
                </Helmet>
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
                <div className='flex-grow over'>
                    <Outlet />
                </div>
                <Footer />
                <canvas ref={canvasRef} className='pointer-events-none absolute -z-50' />
            </div>
        </QueryParamProvider>
    );
}
