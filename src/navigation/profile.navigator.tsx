import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AppRoute} from './app-routes';
import {TopTapBar} from '../component/toptabbar';
import {ProfileOwnerScreen} from '../scene/profile';
import {ProfileDriverScreen} from '../scene/profile';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Stack = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();

export const ProfileOwnerNavigator = (): React.ReactElement => (
  <TopTab.Navigator tabBar={(props) => <TopTapBar {...props} />}>
    <Stack.Screen
      name={AppRoute.PROFILE_OWNER}
      component={ProfileOwnerScreen}
    />
  </TopTab.Navigator>
);
export const ProfileDriverNavigator = (): React.ReactElement => (
  <TopTab.Navigator tabBar={(props) => <TopTapBar {...props} />}>
    <Stack.Screen
      name={AppRoute.PROFILE_DRIVER}
      component={ProfileDriverScreen}
    />
  </TopTab.Navigator>
);
