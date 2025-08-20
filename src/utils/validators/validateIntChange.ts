export function validateIntChange(number: string): number | null {
    if (isNaN(parseInt(number))) return null;

    return parseInt(number);
}

export function validateIntInputChange(e: React.ChangeEvent<HTMLInputElement>, setter: (value: React.SetStateAction<string>) => void): void {
    const input = e.target.value;
    if (input === '') {
        setter('');
        return;
    }

    const parsed = parseInt(input);
    if (isNaN(parsed)) {
        return;
    }

    setter(parsed.toString());
}