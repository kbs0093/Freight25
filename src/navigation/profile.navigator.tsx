import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AppRoute} from './app-routes';
import {ProfileScreen} from '../scene/profile';

const Stack = createStackNavigator();

export const ProfileNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen name={AppRoute.PROFILE_MAIN} component={ProfileScreen} />
  </Stack.Navigator>
);
