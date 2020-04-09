import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoute } from './app-routes';
import { LoadingScreen, AuthScreen } from '../scene/auth';


const Stack = createStackNavigator();

export const AuthNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name={AppRoute.CHECK_LOGIN} component={LoadingScreen}/>
    <Stack.Screen name={AppRoute.SIGN_IN} component={AuthScreen}/>
  </Stack.Navigator>
);