const completedMigrations = JSON.parse(localStorage.getItem('completedMigrations') ?? '[]') as string[];

function runMigration(name: string, migration: () => void) {
    if (completedMigrations.includes(name)) return;
    migration();
    completedMigrations.push(name);
    localStorage.setItem('completedMigrations', JSON.stringify(completedMigrations));
}

runMigration('0', () => {
    const device = localStorage.getItem('settings.submissions.defaultDevice');
    if (device === null) return;

    switch (device) {
        case '"1"': return localStorage.setItem('settings.submissions.defaultDevice', JSON.stringify('pc'));
        case '"2"': return localStorage.setItem('settings.submissions.defaultDevice', JSON.stringify('mobile'));
    }
});

runMigration('1', () => {
    localStorage.removeItem('newLabels');
});

runMigration('2', () => {
    const stored = localStorage.getItem('settings.submissions.defaultDevice');
    if (stored) {
        localStorage.setItem('defaultDevice', stored);
        localStorage.removeItem('settings.submissions.defaultDevice');
    }
});

runMigration('3', () => {
    const stored = localStorage.getItem('accessToken');
    if (!stored) return;

    if (!stored.startsWith('"')) {
        localStorage.removeItem('accessToken');
    }
});

runMigration('4', () => {
    localStorage.removeItem('isRounded');
    localStorage.removeItem('highlightCompleted');
    localStorage.removeItem('background');
});

runMigration('5', () => {
    const defaultDevice = JSON.parse(localStorage.getItem('defaultDevice') ?? '"pc"');
    const defaultRefreshRate = JSON.parse(localStorage.getItem('settings') ?? '{}')?.submission?.defaultRefreshRate ?? 60;

    const app = JSON.parse(localStorage.getItem('app') ?? '{}');

    if (!app.defaultRefreshRate) app.defaultRefreshRate = defaultRefreshRate;
    if (!app.defaultDevice) app.defaultDevice = defaultDevice;

    localStorage.setItem('app', JSON.stringify(app));
    localStorage.removeItem('defaultDevice');
    localStorage.removeItem('settings');
});

runMigration('6', () => {
    localStorage.removeItem('token');
});
