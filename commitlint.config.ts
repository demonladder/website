import { RuleConfigSeverity, type UserConfig } from '@commitlint/types';

const configuration: UserConfig = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [RuleConfigSeverity.Error, 'always', [
            'build',
            'chore',
            'ci',
            'docs',
            'enhancement',
            'feat',
            'fix',
            'perf',
            'refactor',
            'revert',
            'style',
            'test',
        ]],
    },
};

export default configuration;
