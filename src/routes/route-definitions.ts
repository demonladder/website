export const routes = {
    developer: {
        applications: '/developer/applications',
    },
    submit: {
        href: () => '/submit',
        path: 'submit',
        level: {
            href: (levelID: number) => `/submit/${levelID}`,
            path: 'submit/:levelID',
        },
    },
    staff: {
        href: () => '/mod',
        submissions: {
            search: {
                href: () => '/mod/submission-search',
                path: 'submission-search',
            },
        },
        editPack: {
            href: () => '/mod/edit-pack',
            path: 'edit-pack',
            withId: {
                href: (packId: number) => `/mod/edit-pack/${packId}`,
                path: 'edit-pack/:packId',
            },
        },
        achievements: {
            href: () => '/mod/achievements',
            path: 'achievements',
            withId: {
                href: (achievementId: number) => `/mod/achievements/${achievementId}`,
                path: 'achievements/:achievementId',
            },
        },
    },
} as const;
