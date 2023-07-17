const colors = require('tailwindcss/colors');

export default {
    darkMode: 'class',
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        fontFamily: {
            sans: ['Montserrat'],
        },
        extend: {},
        colors: {
            ...colors,
            primary: '#EFA51C',
            secondary: '#1a1a1a',
            gray: {
                ...colors.gray,
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
            },
        },
    },
    plugins: [],
};