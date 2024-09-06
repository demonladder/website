import Header from '../../layouts/header/Header';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Footer from '../../layouts/footer/Footer';
import { useCallback, useRef } from 'react';
import useResizeObserver from '@react-hook/resize-observer';
import noise3D from '../../utils/noise/noise3D';
import StorageManager from '../../utils/StorageManager';
import NavbarNotificationRenderer from '../../context/NavbarNotification/NavbarNotificationRenderer';

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

    return (
        <div ref={containerRef} className='relative flex flex-col'>
            <Helmet>
                <title>GD Demon Ladder</title>
            </Helmet>
            <Header />
            <NavbarNotificationRenderer />
            <main className='flex-grow over'>
                <Outlet />
            </main>
            <Footer />
            {/* {getBrowserName() === 'Firefox' &&
                <div className='snow' />
            } */}
            <canvas ref={canvasRef} className='pointer-events-none absolute -z-50' />
        </div>
    );
}