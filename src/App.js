import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ApplicationNavigator from '@/navigation/Application';
import { ThemeProvider } from '@/theme';
import '@/translations';
function App() {
    return (<GestureHandlerRootView>
      <ThemeProvider>
        <ApplicationNavigator />
      </ThemeProvider>
    </GestureHandlerRootView>);
}
export default App;
