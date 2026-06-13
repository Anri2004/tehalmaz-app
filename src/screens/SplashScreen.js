import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LogoFull } from '../components/Icons';

export default function SplashScreen({ onDone }) {
  const opacity  = new Animated.Value(0);
  const scale    = new Animated.Value(0.85);

  useEffect(() => {
    // Плавное появление логотипа
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(scale,   { toValue: 1, friction: 6,   useNativeDriver: true }),
    ]).start();

    // Через 2 секунды — плавно уходим
    const timer = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true })
        .start(() => onDone());
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <LogoFull width={240} height={192} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
