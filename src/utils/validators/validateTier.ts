const MAX_TIER = parseInt(import.meta.env.VITE_MAX_TIER);

export function validateTier(input: string | number): boolean {
    const tier = typeof input === 'number' ? input : parseInt(input);

    if (typeof input === 'string' && tier.toString() !== input) return false;
    return tier >= 1 && tier <= MAX_TIER;
}
