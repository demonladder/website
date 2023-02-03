export default function ParseDiff(diff) {
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