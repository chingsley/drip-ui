import { colors } from '@/constants/colors';
import React from 'react';
import { ActivityIndicator, GestureResponderEvent, StyleSheet, Text, TouchableOpacity } from 'react-native';


interface ButtonProps {
  text: string;
  onPress: ((event: GestureResponderEvent) => void) | undefined;
  loading?: boolean;
  disabled?: boolean;
  style?: Object;
}

const Button = ({ onPress, text, loading, disabled, style }: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled}
      style={styles.btn}
    >
      {
        loading ?
          <ActivityIndicator size={'small'} color={styles.actvIndicator.color} />
          :
          <Text style={[styles.btnText, styles.regularText]}>{text}</Text>
      }
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    width: 295,
    height: 48,
    backgroundColor: colors.PRIMARY,
    borderRadius: 10,
  },
  btnText: {
    color: colors.WHITE,
  },
  regularText: {
    fontFamily: 'Inter',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0,
    textAlign: 'center',
    verticalAlign: 'middle',

  },
  actvIndicator: {
    color: colors.WHITE,
  }
});