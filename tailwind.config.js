module.exports = {
    mode: 'jit',
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        screens: {
            sm: '480px',
            md: '690px',
            lg: '1024px',
            xl: '1366px',
        },
        backgroundColor: {
            skin: {
                'contrast-light': 'var(--bg-color-contrast-light)',
                contrast: 'var(--bg-color-contrast)',
                DEFAULT: 'var(--bg-color-default)',
            },
        },
        textColor: {
            skin: {
                light: 'var(--text-color-light)',
                DEFAULT: 'var(--text-color-default)',
                dark: 'var(--text-color-dark)',
            },
        },
        spacing: {
            xxl: '40px',
            xl: '30px',
            lg: '20px',
            md: '15px',
            sm: '10px',
            xs: '5px',
        },
        extend: {
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
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
