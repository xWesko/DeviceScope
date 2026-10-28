import { DarkTheme, DefaultTheme } from '@react-navigation/native';
const colorsLight = {
    accent: '#1F4FD8',
    accentSoft: '#E7EDFB',
    background: '#F5F6F8',
    border: '#E1E4E8',
    danger: '#B42318',
    neutralSoft: '#EEF0F3',
    onAccent: '#FFFFFF',
    success: '#1E7F4F',
    successSoft: '#E4F3EB',
    surface: '#FFFFFF',
    text: '#1A1D21',
    textMuted: '#5F6670',
    warning: '#9A5700',
    warningSoft: '#FBEFDC',
};
const colorsDark = {
    accent: '#7FA2FF',
    accentSoft: '#1D2742',
    background: '#0F1115',
    border: '#2A2F37',
    danger: '#F07171',
    neutralSoft: '#22262D',
    onAccent: '#0F1115',
    success: '#5CC98F',
    successSoft: '#15291F',
    surface: '#171A20',
    text: '#E8EAED',
    textMuted: '#9AA1AB',
    warning: '#F0B357',
    warningSoft: '#2E2414',
};
const sizes = [4, 8, 12, 13, 14, 16, 20, 24, 28, 32];
export const config = {
    backgrounds: colorsLight,
    borders: {
        colors: colorsLight,
        radius: [8, 12],
        widths: [1],
    },
    colors: colorsLight,
    fonts: {
        colors: colorsLight,
        sizes,
    },
    gutters: sizes,
    navigationColors: {
        ...DefaultTheme.colors,
        background: colorsLight.background,
        card: colorsLight.surface,
    },
    variants: {
        dark: {
            backgrounds: colorsDark,
            borders: {
                colors: colorsDark,
            },
            colors: colorsDark,
            fonts: {
                colors: colorsDark,
            },
            navigationColors: {
                ...DarkTheme.colors,
                background: colorsDark.background,
                card: colorsDark.surface,
            },
        },
    },
};
