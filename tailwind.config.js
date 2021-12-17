module.exports = {
    mode: 'jit',
    purge: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        screens: {
            xs: { max: '360px' },
            sm: { max: '480px' },
            md: { max: '720px' },
            lg: { max: '1024px' },
            xl: { max: '1366px' },
        },
        colors: {
            primary: {
                lighter: 'rgba(17, 123, 182, .1)',
                light: 'rgba(17, 123, 182, .3)',
                DEFAULT: 'rgba(36, 142, 201, .8)',
                dark: 'rgb(36, 142, 201)',
            },
            success: {
                lighter: 'rgba(34, 157, 46, .1)',
                light: 'rgba(34, 157, 46, .3)',
                DEFAULT: 'rgba(51, 171, 62, .8)',
                dark: 'rgb(51, 171, 62)',
            },
            danger: {
                lighter: 'rgba(182, 17, 17, .1)',
                light: 'rgba(229, 59, 59, .3)',
                DEFAULT: 'rgba(229, 59, 59, .8)',
                dark: 'rgb(229, 59, 59)',
            },
            skin: {
                bg: {
                    'contrast-light': 'var(--skin-bg-contrast-light)',
                    contrast: 'var(--skin-bg-contrast)',
                    DEFAULT: 'var(--skin-bg-default)',
                },
                text: {
                    light: 'var(--skin-text-light)',
                    DEFAULT: 'var(--skin-text-default)',
                    dark: 'var(--skin-text-dark)',
                },
            },
        },
        fontFamily: {
            sans: ['Arimo', 'sans-serif'],
        },
        fontSize: {
            xl: '24px',
            lg: '20px',
            md: '15px',
            sm: '13px',
            xs: '11px',
        },
        spacing: {
            xxl: '40px',
            xl: '30px',
            lg: '20px',
            md: '15px',
            sm: '10px',
            xs: '5px',
        },
        stroke: {
            current: 'rgba(36, 142, 201, .8)',
        },
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
