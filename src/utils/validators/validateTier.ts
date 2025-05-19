export function validateTier(input: string | number): boolean {
    const tier = (typeof input === 'number') ? input : parseInt(input);
    
    if (typeof input === 'string' && tier.toString() !== input) return false;
    if (tier < 1 || tier > 35) return false;
    
    return true;
}
