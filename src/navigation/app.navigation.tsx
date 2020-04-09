import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthNavigator } from './auth.navigator';
import { AppRoute } from './app-routes';

const Stack = createStackNavigator();

export const AppNavigator = (props): React.ReactElement => (
  <Stack.Navigator {...props} headerMode='none'>
    <Stack.Screen name={AppRoute.AUTH} component={AuthNavigator}/>
  </Stack.Navigator>
);