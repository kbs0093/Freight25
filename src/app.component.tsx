import React from 'react';
import { YellowBox, ImageBackground, StyleSheet, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  light,
  mapping,
} from '@eva-design/eva';
import * as eva from '@eva-design/eva';
import {
  ApplicationProvider,
  IconRegistry,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { AppNavigator } from './navigation/app.navigation';
import { AppRoute } from './navigation/app-routes';


export default (): React.ReactFragment => {
  

  return (
    <React.Fragment>
      <IconRegistry icons={EvaIconsPack}/>
      <ApplicationProvider
        mapping={mapping}
        theme={eva.dark}>
        <SafeAreaProvider>
          <NavigationContainer>
            <AppNavigator initialRouteName={AppRoute.CHECK_LOGIN}/>
          </NavigationContainer>
        </SafeAreaProvider>
      </ApplicationProvider>
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