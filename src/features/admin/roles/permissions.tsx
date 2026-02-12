import { PermissionFlags } from './PermissionFlags';

interface Permission {
    ID: number;
    Name: string;
    Description?: string;
    Flag: PermissionFlags;
}

export const permissions: Permission[] = [
    {
        ID: 3,
        Name: 'Staff dashboard',
        Description: 'Allows users to view the staff dashboard.',
        Flag: PermissionFlags.STAFF_DASHBOARD,
    },
    {
        ID: 1,
        Name: 'Manage submissions',
        Description: 'Allows users to accept, reject and edit submissions.',
        Flag: PermissionFlags.MANAGE_SUBMISSIONS,
    },
    {
        ID: 21,
        Name: 'Manage Discord integration',
        Description: 'Allows users to delete the link between a users Discord account and GDDL account.',
        Flag: PermissionFlags.MANAGE_DISCORD_INTEGRATION,
    },
    {
        ID: 16,
        Name: 'Skip queue',
        Description: 'Users will have all their submission be automatically accepted.',
        Flag: PermissionFlags.SKIP_QUEUE,
    },
    {
        ID: 14,
        Name: 'Manage notes',
        Description: 'Allows users to create, delete and edit notes.',
        Flag: PermissionFlags.MANAGE_NOTES,
    },
    {
        ID: 18,
        Name: 'Signup links',
        Description: 'Allows users to create signup links for users.',
        Flag: PermissionFlags.CREATE_SIGNUP_TOKEN,
    },
    {
        ID: 19,
        Name: 'View audit log',
        Flag: PermissionFlags.VIEW_AUDIT_LOG,
    },
    {
        ID: 20,
        Name: 'Manage favorite levels',
        Description: 'Allows users to add or delete levels from users\' preferences',
        Flag: PermissionFlags.MANAGE_FAVORITE_LEVELS,
    },
    {
        ID: 11,
        Name: 'Ban users',
        Description: 'Allows users to ban other users.',
        Flag: PermissionFlags.BAN_USERS,
    },
    {
        ID: 6,
        Name: 'Delete users',
        Description: 'Allows users to delete other users and all their data.',
        Flag: PermissionFlags.DELETE_USER,
    },
    {
        ID: 12,
        Name: 'Manage packs',
        Description: 'Allows users to create, delete and edit packs.',
        Flag: PermissionFlags.MANAGE_PACKS,
    },
    {
        ID: 9,
        Name: 'Manage tags',
        Description: 'Allows users to create, delete and edit tags.',
        Flag: PermissionFlags.MANAGE_TAGS,
    },
    {
        ID: 10,
        Name: 'Manage roles',
        Description: 'Allows users to create, delete and edit roles.',
        Flag: PermissionFlags.MANAGE_ROLES,
    },
    {
        ID: 13,
        Name: 'Delete levels',
        Description: 'Allows users to delete levels.',
        Flag: PermissionFlags.DELETE_LEVELS,
    },
    {
        ID: 7,
        Name: 'Auto accept settings',
        Description: 'Allows users to change the auto accept settings.',
        Flag: PermissionFlags.AUTO_ACCEPT_SETTINGS,
    },
    {
        ID: 8,
        Name: 'Site settings',
        Description: 'Allows users to change the site settings.',
        Flag: PermissionFlags.SITE_SETTINGS,
    },
    {
        ID: 15,
        Name: 'Administrator',
        Description: 'Allows users to access all settings and features.',
        Flag: PermissionFlags.ADMIN,
    },
    {
        ID: 4,
        Name: 'Bot control',
        Description: 'Allows users to control the GDDL bot.',
        Flag: PermissionFlags.BOT_CONTROL,
    },
    {
        ID: 5,
        Name: 'Experimental',
        Description: 'Allows users to access experimental settings.',
        Flag: PermissionFlags.EXPERIMENTAL,
    },
    {
        ID: 17,
        Name: 'Beta access',
        Description: 'Allows users to log into the beta subdomain.',
        Flag: PermissionFlags.BETA_ACCESS,
    },
];
