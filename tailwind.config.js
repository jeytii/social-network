module.exports = {
    mode: 'jit',
    purge: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    // darkMode: false, // or 'media' or 'class'
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
                // lighter: 'rgba(17, 123, 182, .1)',
                // light: 'rgba(17, 123, 182, .3)',
                // DEFAULT: 'rgba(36, 142, 201, .8)',
                // dark: 'rgb(36, 142, 201)',
                DEFAULT: 'var(--primary-default)',
                dark: 'var(--primary-dark)',
                light: 'var(--primary-light)',
                transparent: 'var(--primary-transparent)',
            },
            success: {
                // lighter: 'rgba(34, 157, 46, .1)',
                // light: 'rgba(34, 157, 46, .3)',
                // DEFAULT: 'rgba(51, 171, 62, .8)',
                // dark: 'rgb(51, 171, 62)',
                transparent: 'rgba(9, 171, 35, 0.2)',
                light: 'rgba(9, 171, 35, 0.6)',
                DEFAULT: 'rgba(9, 171, 35, .8)',
                dark: 'rgb(9, 171, 35)',
            },
            danger: {
                // lighter: 'rgba(182, 17, 17, .1)',
                // light: 'rgba(229, 59, 59, .3)',
                // DEFAULT: 'rgba(229, 59, 59, .8)',
                // dark: 'rgb(229, 59, 59)',
                transparent: 'rgba(182, 17, 17, 0.2)',
                light: 'rgba(182, 17, 17, 0.6)',
                DEFAULT: 'rgba(182, 17, 17, 0.8)',
                dark: 'rgb(182, 17, 17)',
            },
            skin: {
                main: 'var(--skin-main)',
                primary: 'var(--skin-primary)',
                secondary: 'var(--skin-secondary)',
                white: '#fff',
            },
        },
        fontFamily: {
            sans: ['Arimo', 'sans-serif'],
        },
        fontSize: {
            xl: '24px',
            lg: '20px',
            md: '14px',
            sm: '12px',
            xs: '10px',
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
            current: 'var(--primary-light)',
        },
        borderRadius: {
            sm: '5px',
            DEFAULT: '10px',
            full: '2rem',
        },
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
