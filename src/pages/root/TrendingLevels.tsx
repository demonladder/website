import { useQuery } from '@tanstack/react-query';
import InlineLoadingSpinner from '../../components/InlineLoadingSpinner';
import { getTrendingLevels } from '../../api/level/getTrendingLevels';
import { LevelPreview } from './PopularLevels';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

export default function TrendingLevels() {
    const { data, status } = useQuery({
        queryKey: ['trendingLevels'],
        queryFn: getTrendingLevels,
    });

    if (status === 'loading') return <div className='xl:col-span-3'><InlineLoadingSpinner /></div>
    if (status === 'error') return <div className='xl:col-span-3'>Error, could not fetch trending levels</div>

    return (
        <div className='xl:col-span-3'>
            <h2 className='text-3xl'>Trending Levels <i className='bx bx-trending-up' /></h2>
            <Swiper
                slidesPerView={1}
                spaceBetween={10}
                modules={[Autoplay, Navigation, Scrollbar]}
                autoplay={{ delay: 3000, pauseOnMouseEnter: true }}
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
