import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoute } from './app-routes';
import { ApplyScreen } from '../scene/applyFreight'


const Stack = createStackNavigator();

export const ApplyNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name={AppRoute.APPLY_MAIN} component={ApplyScreen}/>
  </Stack.Navigator>
);