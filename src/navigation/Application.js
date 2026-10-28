import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Diagnostics } from '@/screens';
const Stack = createStackNavigator();
function ApplicationNavigator() {
    const { navigationTheme } = useTheme();
    return (<SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen component={Diagnostics} name="diagnostics"/>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>);
}
export default ApplicationNavigator;
