import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { generateBackgrounds, staticBackgroundStyles, } from '@/theme/backgrounds';
import { generateBorderColors, generateBorderRadius, generateBorderWidths, staticBorderStyles, } from '@/theme/borders';
import componentsGenerator from '@/theme/components';
import { generateFontColors, generateFontSizes, staticFontStyles, } from '@/theme/fonts';
import { generateGutters, staticGutterStyles } from '@/theme/gutters';
import layout from '@/theme/layout';
import generateConfig from '@/theme/ThemeProvider/generateConfig';
export const ThemeContext = createContext(undefined);
function ThemeProvider({ children = false }) {
    // Follow the system light/dark setting
    const colorScheme = useColorScheme();
    const variant = colorScheme === 'dark' ? 'dark' : 'default';
    // Flatten config with current variant
    const fullConfig = useMemo(() => {
        return generateConfig(variant);
    }, [variant]);
    const fonts = useMemo(() => {
        return {
            ...generateFontSizes(),
            ...generateFontColors(fullConfig),
            ...staticFontStyles,
        };
    }, [fullConfig]);
    const backgrounds = useMemo(() => {
        return {
            ...generateBackgrounds(fullConfig),
            ...staticBackgroundStyles,
        };
    }, [fullConfig]);
    const gutters = useMemo(() => {
        return {
            ...generateGutters(fullConfig),
            ...staticGutterStyles,
        };
    }, [fullConfig]);
    const borders = useMemo(() => {
        return {
            ...generateBorderColors(fullConfig),
            ...generateBorderRadius(),
            ...generateBorderWidths(),
            ...staticBorderStyles,
        };
    }, [fullConfig]);
    const navigationTheme = useMemo(() => {
        if (variant === 'dark') {
            return {
                ...DarkTheme,
                colors: fullConfig.navigationColors,
                dark: true,
            };
        }
        return {
            ...DefaultTheme,
            colors: fullConfig.navigationColors,
            dark: false,
        };
    }, [variant, fullConfig.navigationColors]);
    const theme = useMemo(() => {
        return {
            backgrounds,
            borders,
            colors: fullConfig.colors,
            fonts,
            gutters,
            layout,
            variant,
        };
    }, [variant, fonts, backgrounds, borders, fullConfig.colors, gutters]);
    const components = useMemo(() => {
        return componentsGenerator(theme);
    }, [theme]);
    const value = useMemo(() => {
        return { ...theme, components, navigationTheme };
    }, [theme, components, navigationTheme]);
    return (<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>);
}
export default ThemeProvider;
