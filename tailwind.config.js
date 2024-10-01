const plugin = require('tailwindcss/plugin');

export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        fontFamily: {
            sans: ['Montserrat', 'sans-serif'],
        },
        extend: {
            colors: {
                primary: '#EFA51C',
                secondary: '#1a1a1a',
                header: {
                    200: '#ffc530',
                    300: '#ffb52c',
                    400: '#EFA51C',
                    500: '#df950c',
                },
                gray: {
                    500: '#4d4d4d',
                    600: '#454545',
                    700: '#353535',
                    800: '#2b2b2b',
                    900: '#262626',
                    950: '#1a1a1a',
                },
                button: {
                    primary: {
                        1: '#2c6cd4',
                        2: '#225bb8',
                        3: '#184a99',
                    },
                    info: {
                        1: '#47cc6b',
                        2: '#3dba5f',
                        3: '#32a852',
                    },
                    secondary: {
                        1: '#929292',
                        2: '#797979',
                        3: '#666666',
                    },
                    danger: {
                        1: '#b50000',
                        2: '#9b0000',
                        3: '#8e0000',
                    },
                    discord: {
                        primary: '#5865f2',
                        hover: '#4752c4',
                        active: '#3c45a5',
                    },
                },
                permission: {
                    0: 'white',
                    1: '#92ffa3',
                    2: '#cf9cff',
                    3: '#71ffcb',
                    4: '#efa51c',
                    5: '#efa51c',
                    6: '#ffef01',
                },
                refreshRate: {
                    60: '#5d5d5d',
                    75: '#ff9900',
                    120: '#ffff00',
                    144: '#00ff00',
                    240: '#00ffff',
                    360: '#000000',
                },
                role: {
                    listHelper: '#9bff99',
                }
            },
        },
    },
    safelist: [
        {
            pattern: /permission-[0-9]/,
        },
        {
            pattern: /refreshRate-.*/,
        },
        {
            pattern: /max-h-[0-9]*/,
        },
    ],
    plugins: [
        plugin(function({ addVariant }) {
            addVariant('round', '.round &');
        }),
    ],
    darkMode: 'media',
};