export default function ProfileTypeIcon({ permissionLevel }: { permissionLevel: number }) {
    switch(permissionLevel) {
        case 2: return <span className='m-0 cursor-help' title='List Helper' role='img' aria-label='Role icon'>📝</span>;
        case 3: return <span className='m-0 cursor-help' title='Developer' role='img' aria-label='Role icon'>🖥️</span>;
        case 4: return <span className='m-0 cursor-help' title='Moderator' role='img' aria-label='Role icon'>🔰</span>;
        case 5: return <span className='m-0 cursor-help' title='Admin' role='img' aria-label='Role icon'>🛡️</span>;
        case 6: return <span className='m-0 cursor-help' title='Co-Owner' role='img' aria-label='Role icon'>🎖️</span>;
        case 7: return <span className='m-0 cursor-help' title='Owner' role='img' aria-label='Role icon'>⭐</span>;
        default: return;
    }
}