import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoute } from './app-routes';
import { CheckScreen } from '../scene/checkFreight'

const Stack = createStackNavigator();

export const CheckNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name={AppRoute.CHECK_MAIN} component={CheckScreen}/>
  </Stack.Navigator>
);