export function preventNonNumericals(e: React.KeyboardEvent) {
    if (['arrow', 'backspace'].find((k) => e.key.toLowerCase().match(k))) return;
    if (!e.key.match(/[0-9.]/)) e.preventDefault();
}