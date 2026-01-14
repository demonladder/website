import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import 'swiper/css/scrollbar';
import { getPopularLevels, LevelPreviewDTO } from '../api/getPopularLevels';
import InlineLoadingSpinner from '../../../components/ui/InlineLoadingSpinner';
import DemonFace from '../../../components/shared/DemonFace';
import Heading2 from '../../../components/headings/Heading2';
import Heading4 from '../../../components/headings/Heading4';
import { DemonLogoSizes } from '../../../utils/difficultyToImgSrc';

export default function PopularLevels() {
    const { data, status } = useQuery({
        queryKey: ['popularLevels'],
        queryFn: getPopularLevels,
    });

    if (status === 'pending') return <div className='xl:col-span-3'><InlineLoadingSpinner /></div>;
    if (status === 'error') return <div className='xl:col-span-3'>Error, could not fetch popular levels</div>;

    return (
        <div className='xl:col-span-3'>
            <Heading2 className='flex items-center gap-2'><i className='bx bxs-hot pt-1' /> All-time Popular Levels</Heading2>
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
        <Link to={`/level/${level.ID}`} className='bg-theme-800 shadow border border-theme-outline round:rounded-lg p-3 flex items-center gap-2'>
            <DemonFace diff={level.Meta.Difficulty} rarity={level.Meta.Rarity} size={DemonLogoSizes.MEDIUM} />
            <div className='flex flex-col gap-0.5'>
                <Heading4>#{index} {level.Meta.Name}</Heading4>
                <div className='text-lg'>
                    <span className={`round:rounded-s px-4 py-1 tier-${level.Rating?.toFixed() ?? '0'}`}>{level.Rating?.toFixed() ?? '-'}</span>
                    <span className={`round:rounded-e px-4 py-1 enj-${level.Enjoyment?.toFixed() ?? '-'}`}>{level.Enjoyment?.toFixed()}</span>
                </div>
            </div>
        </Link>
    );
}
