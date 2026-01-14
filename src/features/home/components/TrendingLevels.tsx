import { useQuery } from '@tanstack/react-query';
import InlineLoadingSpinner from '../../../components/ui/InlineLoadingSpinner';
import { getTrendingLevels } from '../api/getTrendingLevels';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import { LevelPreview } from './PopularLevels';
import Heading2 from '../../../components/headings/Heading2';

export default function TrendingLevels() {
    const { data, status } = useQuery({
        queryKey: ['trendingLevels'],
        queryFn: getTrendingLevels,
    });

    if (status === 'pending') return <div className='xl:col-span-3'><InlineLoadingSpinner /></div>;
    if (status === 'error') return <div className='xl:col-span-3'>Error, could not fetch trending levels</div>;

    return (
        <div className='xl:col-span-3'>
            <Heading2 className='flex items-center gap-2'><i className='bx bx-trending-up pt-1' /> Trending Levels</Heading2>
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
                {data.length === 0 && (
                    <div className='p-4 text-center'>No trending levels found.</div>
                )}
            </Swiper>
        </div>
    );
}
