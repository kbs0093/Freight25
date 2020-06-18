import React from 'react';
import { YellowBox, ImageBackground, StyleSheet, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  light,
  dark,
  mapping,
} from '@eva-design/eva';
import {
  ApplicationProvider,
  IconRegistry,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { AppNavigator } from './navigation/app.navigation';
import { AppRoute } from './navigation/app-routes';
import { ThemeContext } from '../src/component/theme-context';

const themes = { light, dark };

export default (): React.ReactFragment => {
  const [theme, setTheme] = React.useState('dark');
  const currentTheme = themes[theme];

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  return (
    <React.Fragment>
      <IconRegistry icons={EvaIconsPack}/>
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          <ApplicationProvider mapping={mapping} theme={currentTheme}>
            <SafeAreaProvider>
              <NavigationContainer>
                <AppNavigator initialRouteName={AppRoute.CHECK_LOGIN}/>
              </NavigationContainer>
            </SafeAreaProvider>
          </ApplicationProvider>
        </ThemeContext.Provider>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  appBar: {
    flex: 1,
  },
});

YellowBox.ignoreWarnings([
  'RCTRootView cancelTouches',
]);