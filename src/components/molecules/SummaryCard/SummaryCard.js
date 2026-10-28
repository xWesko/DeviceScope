import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useTheme } from '@/theme';
import { getFriendlyName, getPlatformLabel } from '@/utils/report';
import { formatValue } from '@/utils/formatters';
// Each Lock Task state gets its own badge color; none of them means "is a kiosk".
const KIOSK_BADGE_COLORS = {
    locked: ['successSoft', 'success'],
    none: ['neutralSoft', 'textMuted'],
    pinned: ['warningSoft', 'warning'],
    unavailable: ['neutralSoft', 'textMuted'],
    unknown: ['warningSoft', 'warning'],
};
function Badge({ background, color, label }) {
    const { backgrounds, components, fonts } = useTheme();
    return (<View style={[components.badge, backgrounds[background]]}>
      <Text style={[fonts.size_13, fonts.bold, fonts[color]]}>{label}</Text>
    </View>);
}
function SummaryCard({ diagnostics }) {
    const { t } = useTranslation();
    const { components, fonts, gutters, layout } = useTheme();
    const d = diagnostics;
    const [kioskBackground, kioskColor] = KIOSK_BADGE_COLORS[d.kioskState];
    const brandModel = [d.brand, d.model].filter(Boolean).join(' ');
    return (<View style={[components.card, gutters.gap_8]}>
      <Text style={[fonts.size_24, fonts.text, fonts.bold]}>{getFriendlyName(d)}</Text>
      <Text selectable style={[fonts.size_16, fonts.text]}>{formatValue(brandModel)}</Text>
      <Text style={[fonts.size_14, fonts.textMuted]}>
        {getPlatformLabel(d.platform)} {formatValue(d.osVersion)}
      </Text>
      <View style={[layout.row, layout.wrap, gutters.gap_8, gutters.marginTop_8]}>
        <Badge background="accentSoft" color="accent" label={t(`device_type.${d.deviceType}`)}/>
        <Badge background={kioskBackground} color={kioskColor} label={t(`kiosk_badge.${d.kioskState}`)}/>
      </View>
    </View>);
}
export default SummaryCard;
