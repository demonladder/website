interface Props extends Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, 'className'> {
    variant?: 'default' | 'medium' | 'large';
    color?: 'primary' | 'secondary' | 'tertiary';
}

export default function FAB({ variant = 'default', color = 'secondary', ...props }: Props) {
    let classNames = {
        default: 'size-14 rounded-[16px] text-2xl',
        medium: 'size-20 rounded-[20px] text-[28px]',
        large: 'size-24 rounded-[28px] text-4xl',
    }[variant];

    classNames += {
        primary: ' bg-primary text-on-primary hover:before:bg-on-primary/[8%] active:before:bg-on-primary/10',
        secondary: ' bg-secondary text-on-secondary hover:before:bg-on-secondary/[8%] active:before:bg-on-secondary/10',
        tertiary: ' bg-tertiary text-on-tertiary hover:before:bg-on-tertiary/[8%] active:before:bg-on-tertiary/10',
    }[color];

    classNames += ' fixed z-30 right-4 bottom-10 shadow-xl hover:shadow-2xl active:shadow-xl transition-all before:transition-all before:size-full before:absolute before:inset-0 before:bg-on-primary/0 before:rounded-[inherit]';

    return (
        <button {...props} className={' ' + classNames} />
    );
}
