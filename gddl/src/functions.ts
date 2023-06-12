export function ParseDiff(diff: number): string {
    switch(diff) {
        case 0:
            return 'Official Demon';
        case 1:
            return 'Easy Demon';
        case 2:
            return 'Medium Demon';
        case 3:
            return 'Hard Demon';
        case 4:
            return 'Insane Demon';
        case 5:
            return 'Extreme Demon';
        default:
            return 'Unknown'
    }
}

export function ToFixed(f: string, d: number, def: string): string {
    if (isNaN( parseFloat(f))) return def;
    return parseFloat(f).toFixed(d);
}

export function discriminator() {
    let disc = '#';
    
    for (let i = 0; i < 4; i++) {
        disc += Math.floor(Math.random()*10);  // Get number from 0 to 10
    }

    return disc;
}