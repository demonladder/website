interface Props {
    className?: string;
    src: string | null;
}

export default function PackIcon({ className, src }: Props) {
    if (!src) return;

    return <img width='24px' height='24px' src={'/packIcons/' + src} className={className} />;
}
