import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoute } from './app-routes';
import { SplitScreen, SignupDriverScreen, SignupOwnerScreen } from '../scene/signUp';

const Stack = createStackNavigator();

export const SignupNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name={AppRoute.SIGNUP_MAIN} component={SplitScreen}/>
    <Stack.Screen name={AppRoute.SIGNUP_OWNER_MAIN} component={SignupOwnerScreen}/>
    <Stack.Screen name={AppRoute.SIGNUP_DRIVER_MAIN} component={SignupDriverScreen}/>
  </Stack.Navigator>
);