import React from 'react';
import { YellowBox, ImageBackground, StyleSheet, Platform } from 'react-native';
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
import BackgroundService from 'react-native-background-actions';
import BackgroundJob from 'react-native-background-actions';

const themes = { light, dark };



const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

const taskRandom = async taskData => {
  if (Platform.OS === 'ios') {
    console.warn(
      'This task will not keep your app alive in the background by itself, use other library like react-native-track-player that use audio,',
      'geolocalization, etc. to keep your app alive in the background while you excute the JS from this library.',
    );
  }
  await new Promise(async resolve => {
    // For loop with a delay
    const {delay} = taskData;
    for (let i = 0; BackgroundJob.isRunning(); i++) {
      console.log('Runned -> ', i);
      await sleep(delay);
    }
  });
};


const options = {
    taskName: '위치 추적 시스템',
    taskTitle: '운전자의 위치를 추적합니다',
    taskDesc: '화물 위치 추적중...',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#ffffff',
    parameters: {
        delay: 10000,
    },
};

export default (): React.ReactFragment => {
  const [theme, setTheme] = React.useState('dark');
  const currentTheme = themes[theme];

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  const toggleBackground = async () => {
    var playing = BackgroundJob.isRunning();

    playing = !playing;
    if (playing) {
      try {
        console.log('Trying to start background service');
        await BackgroundJob.start(taskRandom, options);
        console.log('Successful start!');
      } catch (e) {
        console.log('Error', e);
      }
    } else {
      console.log('Stop background service');
      await BackgroundJob.stop();
    }
  };

  toggleBackground();

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