import { Text, View } from 'react-native';
import { useTheme } from '@/theme';
function InfoRow({ label, note = undefined, value }) {
    const { fonts, gutters, layout } = useTheme();
    return (<View style={[gutters.paddingVertical_8]}>
      <View style={[layout.row, layout.justifyBetween, gutters.gap_12]}>
        <Text style={[fonts.size_14, fonts.textMuted, layout.flex_1]}>{label}</Text>
        <Text selectable style={[fonts.size_14, fonts.text, layout.flex_1, { fontWeight: '600', textAlign: 'right' }]}>
          {value}
        </Text>
      </View>
      {note ? (<Text style={[fonts.size_12, fonts.textMuted, gutters.marginTop_4]}>{note}</Text>) : undefined}
    </View>);
}
export default InfoRow;
