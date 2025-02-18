import React, { ReactNode } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

interface AnimatedViewProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  duration?: number;
}

export const AnimatedView: React.FC<AnimatedViewProps> = ({
  children,
  style,
  duration = 200,
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, duration]);

  return (
    <Animated.View style={[style, { opacity: fadeAnim }]}>
      {children}
    </Animated.View>
  );
};
