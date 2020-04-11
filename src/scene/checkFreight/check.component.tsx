import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Linking,
} from 'react-native';
import {
  LayoutElement,
} from '@ui-kitten/components';
import { CheckScreenProps } from '../../navigation/check.navigator';
import { AppRoute } from '../../navigation/app-routes';

export const CheckScreen = (props: CheckScreenProps): LayoutElement => {
    return (
        <React.Fragment>
          <View style={styles.viewForm}>
            <Text>화물 확인화면입니다</Text>
          </View>
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    viewForm: {
      flex: 4,
      justifyContent: "center",
      alignItems: "center",
    },
});