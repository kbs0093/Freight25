import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AppRoute} from './app-routes';
import {TopTapBar} from '../component/toptabbar';
import {ProfileScreen} from '../scene/profile';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Stack = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();

export const ProfileNavigator = (): React.ReactElement => (
  <TopTab.Navigator tabBar={(props) => <TopTapBar {...props} />}>
    <Stack.Screen name={AppRoute.PROFILE_MAIN} component={ProfileScreen} />
  </TopTab.Navigator>
);
