import Role from '../../api/types/Role';

export default function UserRoleIcon({ roles }: { roles: Role[] }) {
    const topRole = roles.sort((a, b) => a.Ordering - b.Ordering).filter((role) => role.Icon !== null)[0];

    if (!topRole || !topRole.Icon) return;

    return (
        <span className='m-0 cursor-help' title={topRole.Name} role='img' aria-label='Role icon'>{topRole.Icon}</span>
    );
}
