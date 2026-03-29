import { DetailedHTMLProps, ImgHTMLAttributes } from 'react';

type Props = Omit<DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, 'src'>;

export default function YesTick(props: Props) {
    return <img src='/images/yes tick.webp' alt='Yes tick' {...props} />;
}
