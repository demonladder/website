export default function Heading5(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
    return (
        <h5 {...props} className={'text-lg'.split(' ').concat(props.className?.split(' ') ?? []).join(' ')} />
    );
}
