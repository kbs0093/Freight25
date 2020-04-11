import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoute } from './app-routes';
import { SearchScreen } from '../scene/searchFreight'


const Stack = createStackNavigator();

export const SearchNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name={AppRoute.SEARCH_MAIN} component={SearchScreen}/>
  </Stack.Navigator>
);