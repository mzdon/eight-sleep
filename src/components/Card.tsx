import React from 'react';
import {StyleSheet} from 'react-native';
import {Card as RnpCard, CardProps as RnpCardProps} from 'react-native-paper';
import {PADDING} from '../theme';

export type CardProps = RnpCardProps;

const styles = StyleSheet.create({
  card: {
    padding: PADDING,
  },
});

const Card = ({children, style, ...rest}: CardProps) => (
  // @ts-ignore - TODO: fix card props issue complaining about 'mode'
  <RnpCard style={[styles.card, style]} {...rest}>
    {children}
  </RnpCard>
);

export default Card;
