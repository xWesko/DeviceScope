import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Example, Startup } from '@/screens';
const Stack = createStackNavigator();
function ApplicationNavigator() {
    const { navigationTheme, variant } = useTheme();
    return (<SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator key={variant} screenOptions={{ headerShown: false }}>
          <Stack.Screen component={Startup} name={"startup" /* Paths.Startup */}/>
          <Stack.Screen component={Example} name={"example" /* Paths.Example */}/>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>);
}
export default ApplicationNavigator;
