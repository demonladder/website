export default function Heading2(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
    return (
        <h1 {...props} className={'text-3xl font-bold'.split(' ').concat(props.className?.split(' ') ?? []).join(' ')} />
    );
}
