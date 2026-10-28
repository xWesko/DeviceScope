import { Text, View } from 'react-native';
import { useTheme } from '@/theme';
import InfoRow from '../InfoRow/InfoRow';
function InfoSection({ note = undefined, rows, title }) {
    const { backgrounds, borders, components, fonts, gutters } = useTheme();
    return (<View style={[components.card, gutters.gap_8]}>
      <Text accessibilityRole="header" style={components.sectionTitle}>{title}</Text>
      <View>
        {rows.map((item, index) => (<View key={item.label} style={index > 0 ? [borders.wTop_1, borders.border] : undefined}>
            <InfoRow label={item.label} note={item.note} value={item.value}/>
          </View>))}
      </View>
      {note ? (<View style={[backgrounds.neutralSoft, borders.rounded_8, gutters.padding_12]}>
          <Text style={[fonts.size_13, fonts.text]}>{note}</Text>
        </View>) : undefined}
    </View>);
}
export default InfoSection;
