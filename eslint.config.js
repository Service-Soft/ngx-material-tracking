import config from 'eslint-config-service-soft';

export default [
    ...config,
    {
        files: ['**/*.ts'],
        rules: {
            "angular/component-selector": [
                "warn",
                {
                    "style": "kebab-case",
                    "type": "element",
                    "prefix": "ngx-mat-tracking"
                }
            ]
        }
    }
]