import { Text, View, StyleSheet } from 'react-native';
import { ShareButton } from 'react-native-ambient-background';


export default function App() {
  return (
    <View style={styles.container}>
      <Text>Test</Text>
      <ShareButton />
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
