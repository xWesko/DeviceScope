const generateComponentStyles = ({ backgrounds, borders, fonts, layout, }) => {
    return {
        badge: {
            ...layout.row,
            ...layout.itemsCenter,
            ...borders.rounded_8,
            alignSelf: 'flex-start',
            paddingHorizontal: 10,
            paddingVertical: 4,
        },
        button: {
            ...layout.itemsCenter,
            ...layout.justifyCenter,
            ...borders.rounded_8,
            minHeight: 48,
            paddingHorizontal: 20,
        },
        buttonPrimary: {
            ...backgrounds.accent,
        },
        buttonSecondary: {
            ...backgrounds.surface,
            ...borders.w_1,
            ...borders.border,
        },
        card: {
            ...backgrounds.surface,
            ...borders.w_1,
            ...borders.border,
            ...borders.rounded_12,
            padding: 16,
        },
        sectionTitle: {
            ...fonts.size_13,
            ...fonts.textMuted,
            ...fonts.bold,
            ...fonts.uppercase,
            letterSpacing: 0.6,
        },
    };
};
export default generateComponentStyles;
