import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoute } from './app-routes';
import { ApplyScreen } from '../scene/applyFreight'
import { TopTapBar } from '../component/toptabbar';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


const Stack = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();

export const ApplyNavigator = (): React.ReactElement => (
/*  <Stack.Navigator headerMode='none'>
    <Stack.Screen name={AppRoute.APPLY_MAIN} component={ApplyScreen} />
  </Stack.Navigator>
*/
  <TopTab.Navigator tabBar={(props) => <TopTapBar {...props} />}>
    <Stack.Screen name={AppRoute.APPLY_MAIN} component={ApplyScreen} />
  </TopTab.Navigator>
);