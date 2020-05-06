import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoute } from './app-routes';
import { SignupDriverScreen, SignupOwnerScreen } from '../scene/signUp';


const Stack = createStackNavigator();

export const SignupOwnerNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name={AppRoute.SIGNUP_OWNER_MAIN} component={SignupOwnerScreen}/>
  </Stack.Navigator>
);