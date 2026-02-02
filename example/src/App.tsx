import { Text, View, StyleSheet } from 'react-native';
import Background from 'react-native-ambient-background';


export default function App() {
  return (
    <View style={styles.container}>
      <Background
        variant={'ripple'}
        speed={0.1}
        mainColor={'#627fc3'}
      />
      <Text>Test</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
