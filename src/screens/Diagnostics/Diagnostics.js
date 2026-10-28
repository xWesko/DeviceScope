import Clipboard from '@react-native-clipboard/clipboard';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Dimensions, Pressable, ScrollView, Share, Text, useWindowDimensions, View, } from 'react-native';
import useDeviceDiagnostics from '@/hooks/useDeviceDiagnostics';
import { useTheme } from '@/theme';
import { InfoSection, SummaryCard } from '@/components/molecules';
import { SafeScreen } from '@/components/templates';
import { formatDateTime } from '@/utils/formatters';
import { buildReport, buildSections } from '@/utils/report';
const TWO_COLUMN_MIN_WIDTH = 720;
const MAX_CONTENT_WIDTH = 1200;
const COPIED_MESSAGE_MS = 2500;
function ActionButton({ label, onPress, primary = false }) {
    const { components, fonts } = useTheme();
    return (<Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [
            components.button,
            primary ? components.buttonPrimary : components.buttonSecondary,
            { opacity: pressed ? 0.7 : 1 },
        ]}>
      <Text style={[fonts.size_16, fonts.bold, primary ? fonts.onAccent : fonts.text]}>
        {label}
      </Text>
    </Pressable>);
}
function Diagnostics() {
    const { t } = useTranslation();
    const { backgrounds, fonts, gutters, layout } = useTheme();
    const window = useWindowDimensions();
    const { diagnostics, isLoading, refresh } = useDeviceDiagnostics();
    const [message, setMessage] = useState(null);
    useEffect(() => {
        if (!message) {
            return undefined;
        }
        const timeout = setTimeout(() => {
            setMessage(null);
        }, COPIED_MESSAGE_MS);
        return () => {
            clearTimeout(timeout);
        };
    }, [message]);
    // Dimensions.get('screen') is cheap and stays in sync with window changes.
    const screenSize = Dimensions.get('screen');
    const screen = {
        fontScale: window.fontScale,
        height: window.height,
        scale: window.scale,
        screenHeight: screenSize.height,
        screenWidth: screenSize.width,
        width: window.width,
    };
    const sections = diagnostics ? buildSections(diagnostics, screen) : [];
    const isTwoColumn = window.width >= TWO_COLUMN_MIN_WIDTH;
    const columns = isTwoColumn
        ? [
            sections.filter((_, index) => index % 2 === 0),
            sections.filter((_, index) => index % 2 === 1),
        ]
        : [sections];
    const onCopy = () => {
        Clipboard.setString(buildReport(sections));
        setMessage(t('diagnostics.copied'));
    };
    const onShare = () => {
        void Share.share({ message: buildReport(sections) });
    };
    return (<SafeScreen style={backgrounds.background}>
      <ScrollView contentContainerStyle={[gutters.padding_16, gutters.gap_16, { alignSelf: 'center', maxWidth: MAX_CONTENT_WIDTH, width: '100%' }]}>
        <View style={[gutters.gap_4]}>
          <Text accessibilityRole="header" style={[fonts.size_28, fonts.text, fonts.bold]}>
            {t('diagnostics.title')}
          </Text>
          <Text style={[fonts.size_16, fonts.textMuted]}>{t('diagnostics.subtitle')}</Text>
          <Text style={[fonts.size_13, fonts.textMuted]}>
            {isLoading || !diagnostics
            ? t('diagnostics.loading')
            : t('diagnostics.updated_at', {
                date: formatDateTime(new Date(diagnostics.collectedAt)),
                interpolation: { escapeValue: false },
            })}
          </Text>
        </View>

        {diagnostics ? (<>
            <SummaryCard diagnostics={diagnostics}/>

            <View style={[layout.row, layout.wrap, gutters.gap_12]}>
              <ActionButton label={t('diagnostics.refresh')} onPress={() => void refresh()} primary/>
              <ActionButton label={t('diagnostics.copy')} onPress={onCopy}/>
              <ActionButton label={t('diagnostics.share')} onPress={onShare}/>
            </View>
            {message ? (<Text style={[fonts.size_14, fonts.success]}>{message}</Text>) : undefined}

            <View style={[isTwoColumn ? layout.row : layout.col, gutters.gap_16, layout.itemsStart]}>
              {columns.map((column, columnIndex) => (<View key={columnIndex} style={[layout.flex_1, gutters.gap_16, { minWidth: 0, width: isTwoColumn ? undefined : '100%' }]}>
                  {column.map((section) => (<InfoSection key={section.key} note={section.note} rows={section.rows} title={section.title}/>))}
                </View>))}
            </View>
          </>) : (<ActivityIndicator size="large" style={[gutters.marginTop_32]}/>)}
      </ScrollView>
    </SafeScreen>);
}
export default Diagnostics;
