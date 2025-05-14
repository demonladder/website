export default function Heading3(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
    return (
        <h3 {...props} className={'text-2xl'.split(' ').concat(props.className?.split(' ') ?? []).join(' ')} />
    );
}
