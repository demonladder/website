import { useQuery } from '@tanstack/react-query';
import InlineLoadingSpinner from '../../components/InlineLoadingSpinner';
import { Link } from 'react-router-dom';
import DemonLogo from '../../components/DemonLogo';
import { getPopularLevels, LevelPreviewDTO } from '../../api/level/getPopularLevels';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import 'swiper/css/scrollbar';

export default function PopularLevels() {
    const { data, status } = useQuery({
        queryKey: ['popularLevels'],
        queryFn: getPopularLevels,
    });

    if (status === 'loading') return <div className='xl:col-span-3'><InlineLoadingSpinner /></div>
    if (status === 'error') return <div className='xl:col-span-3'>Error, could not fetch popular levels</div>

    return (
        <div className='xl:col-span-3'>
            <h2 className='text-3xl'>All-time Popular Levels <i className='bx bxs-hot' /></h2>
            <Swiper
                slidesPerView={1}
                spaceBetween={10}
                modules={[Autoplay, Navigation, Scrollbar]}
                autoplay={{ delay: 3250, pauseOnMouseEnter: true }}
                breakpoints={{
                    768: { slidesPerView: 2, spaceBetween: 10 },
                    1280: { slidesPerView: 3, spaceBetween: 10 },
                }}
                navigation
                scrollbar={{ draggable: true }}
            >
                {data.map((level, i) => (
                    <SwiperSlide key={level.ID}>
                        <LevelPreview level={level} index={i + 1} />
                    </SwiperSlide>
                ))}
            </Swiper>

        </div>
    );
}

export function LevelPreview({ level, index }: { level: LevelPreviewDTO, index: number }) {
    return (
        <Link to={`/level/${level.ID}`} className='bg-gray-800 round:rounded-lg p-3 flex items-center gap-2'>
            <DemonLogo diff={level.Meta.Difficulty} className='w-16' />
            <div className='flex flex-col'>
                <h3 className='text-xl'>{index}. {level.Meta.Name}</h3>
                <div>
                    <span className={`rounded px-2 tier-${level.Rating?.toFixed(0) ?? '-'}`}>{level.Rating?.toFixed(0)}</span>
                    <span className={`rounded px-2 enj-${level.Enjoyment?.toFixed(0) ?? '-'}`}>{level.Enjoyment?.toFixed(0)}</span>
                </div>
            </div>
        </Link>
    );
}
