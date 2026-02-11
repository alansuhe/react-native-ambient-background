import { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import AmbientBackground, {
  AnimationStyles,
  type AnimationStyle,
} from 'react-native-ambient-background';

const Colors = ['#FF6B6B', '#4ECDC4', '#9B59B6', '#27AE60', '#F39C12'];
export default function App() {
  const [animationVariant, setAnimationVariant] =
    useState<AnimationStyle>('ripple');
  const [mainColor, setMainColor] = useState(Colors[0] as string);
  return (
    <View style={styles.container}>
      <AmbientBackground
        variant={animationVariant}
        speed={0.1}
        mainColor={mainColor}
      />
      {AnimationStyles.map((variant) => {
        const isSelected = animationVariant === variant;
        return (
          <TouchableOpacity
            key={variant}
            onPress={() => setAnimationVariant(variant)}
            style={styles.variantButton}
          >
            <Text style={{ color: 'white', fontSize: isSelected ? 32 : 16 }}>
              {variant}
            </Text>
          </TouchableOpacity>
        );
      })}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          marginTop: 64,
        }}
      >
        {Colors.map((color) => (
          <TouchableOpacity
            key={color}
            onPress={() => setMainColor(color)}
            style={[
              styles.colorPicker,
              { backgroundColor: color },
              color === mainColor && styles.bordered,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  variantButton: {
    padding: 8,
  },
  colorPicker: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  bordered: {
    borderWidth: 1,
    borderColor: 'white',
  },
});
