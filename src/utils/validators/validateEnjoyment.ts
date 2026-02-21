export function validateEnjoyment(input: string | number): boolean {
    const enjoyment = typeof input === 'number' ? input : parseInt(input);

    if (typeof input === 'string' && enjoyment.toString() !== input) return false;
    return enjoyment >= 0 && enjoyment <= 10;
}
