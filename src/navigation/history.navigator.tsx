import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoute } from './app-routes';
import { HistoryScreen } from '../scene/historyFreight'


const Stack = createStackNavigator();

export const HistoryNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name={AppRoute.HISTORY_MAIN} component={HistoryScreen}/>
  </Stack.Navigator>
);