import { Text, View, StyleSheet } from 'react-native';
import AmbientBackground from 'react-native-ambient-background';


export default function App() {
  return (
    <View style={styles.container}>
      <AmbientBackground
        variant={'ripple'}
        speed={0.1}
        mainColor={'#cd6879'}
      />
      <Text>Test</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
