type Props = Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLImageElement>, HTMLImageElement>, 'src'>;

export default function YesTick(props: Props) {
    return <img src='/images/yes tick.webp' alt='Yes tick' {...props} />;
}
