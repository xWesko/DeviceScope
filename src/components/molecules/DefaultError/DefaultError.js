import { useErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/theme';
function DefaultErrorScreen({ onReset = undefined }) {
    const { fonts, gutters, layout } = useTheme();
    const { t } = useTranslation();
    const { resetBoundary } = useErrorBoundary();
    return (<View style={[
            layout.flex_1,
            layout.justifyCenter,
            layout.itemsCenter,
            gutters.gap_16,
            gutters.padding_16,
        ]}>
      <Text style={[fonts.text, fonts.bold, fonts.size_16]}>
        {t('error_boundary.title')}
      </Text>
      <Text style={[fonts.text, fonts.size_12, fonts.alignCenter]}>
        {t('error_boundary.description')}
      </Text>

      {onReset ? (<TouchableOpacity onPress={() => {
                resetBoundary();
                onReset();
            }}>
          <Text style={[fonts.text, fonts.size_16]}>
            {t('error_boundary.cta')}
          </Text>
        </TouchableOpacity>) : undefined}
    </View>);
}
export default DefaultErrorScreen;
