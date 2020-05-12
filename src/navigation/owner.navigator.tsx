import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoute } from './app-routes';
import { OwnerScreen } from '../scene/home'
import { TopTapBar } from '../component/toptabbar'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


const Stack = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();

export const OwnerNavigator = (): React.ReactElement => (
  <TopTab.Navigator tabBar={props => <TopTapBar {...props} />}>
    <Stack.Screen name={AppRoute.OWNER_MAIN} component={OwnerScreen}/>
  </TopTab.Navigator> 
);