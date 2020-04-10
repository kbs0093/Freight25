import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoute } from './app-routes';
import { MainScreen } from '../scene/home'


const Stack = createStackNavigator();

export const HomeNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name={AppRoute.MAIN} component={MainScreen}/>
  </Stack.Navigator>
);