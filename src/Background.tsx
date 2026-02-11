import { Canvas, Fill, Shader, Skia } from '@shopify/react-native-skia';
import React, { memo, useEffect, useMemo } from 'react';
import {
  Dimensions,
  type LayoutChangeEvent,
  StyleSheet,
  View,
  type ViewProps,
} from 'react-native';
import {
  Easing,
  cancelAnimation,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { type AnimationStyle, Shaders } from './shaders';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AnimationBackgroundProps extends ViewProps {
  speed?: number;
  mainColor?: string;
  variant?: AnimationStyle;
  children?: React.ReactNode;
}

const Background: React.FC<AnimationBackgroundProps> = ({
  speed = 5,
  mainColor = '#4facfe',
  variant = 'mesh',
  style,
  children,
  ...props
}) => {
  // 初始化使用屏幕尺寸防止第一帧黑屏
  const iResolution = useSharedValue([SCREEN_WIDTH, SCREEN_HEIGHT]);
  const iTime = useSharedValue(0);

  useEffect(() => {
    iTime.value = 0;
    iTime.value = withRepeat(
      withTiming(10000, {
        duration: 500000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
    return () => cancelAnimation(iTime);
  }, [iTime]);

  // 恢复你原代码中有效的颜色解析方式
  const colorVec = useMemo<number[]>(() => {
    try {
      const c = Skia.Color(mainColor);
      // 兼容性处理：如果返回数组则取前三位，如果返回数字则按位解析
      if (Array.isArray(c) || Math.hasOwnProperty.call(c, '0')) {
        return [c[0] ?? 0, c[1] ?? 0, c[2] ?? 0];
      } else {
        const n = c as unknown as number;
        return [
          ((n >> 16) & 255) / 255,
          ((n >> 8) & 255) / 255,
          (n & 255) / 255,
        ];
      }
    } catch (e) {
      console.warn('Color parsing failed', e);
      return [0.3, 0.6, 1.0]; // 默认蓝色
    }
  }, [mainColor]);

  const uniforms = useDerivedValue(() => {
    return {
      iTime: iTime.value,
      iMainColor: colorVec,
      iResolution: iResolution.value,
      iSpeed: speed,
    };
  }, [speed, colorVec]);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      iResolution.value = [width, height];
    }
  };

  // 核心优化：直接从 Shaders 对象中按需提取
  const shaderSource = useMemo(
    () => Shaders[variant] || Shaders.mesh,
    [variant]
  );

  return (
    <View
      style={[StyleSheet.absoluteFill, style]}
      onLayout={onLayout}
      {...props}
    >
      <Canvas style={styles.container}>
        <Fill>
          <Shader source={shaderSource} uniforms={uniforms} />
        </Fill>
      </Canvas>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export const MemodBackground = memo(Background);
