import Role from '../api/types/Role';

export default function ProfileTypeIcon({ roles }: { roles: Role[] }) {
    const topRole = roles.sort((a, b) => a.Order - b.Order)[0];

    if (!topRole || !topRole.Icon) return;

    return (
        <span className='m-0 cursor-help' title={topRole.Name} role='img' aria-label='Role icon'>{topRole.Icon}</span>
    );
}