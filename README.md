# react-native-ambient-background

[![npm version](https://badge.fury.io/js/react-native-ambient-background.svg)](https://www.npmjs.com/package/react-native-ambient-background)
[![CI](https://github.com/alansuhe/react-native-ambient-background/workflows/CI/badge.svg)](https://github.com/alansuhe/react-native-ambient-background/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org/)

**English** | [中文](./README.zh.md)

A high-performance animated background component for React Native based on Skia, providing various beautiful dynamic background effects.

## Features

- 🎨 **6 Beautiful Animation Effects**: Fluid, Mesh, Waves, Aurora, Colorful, Ripple
- ⚡ **High-Performance Rendering**: Hardware-accelerated with Skia
- 🔧 **Highly Customizable**: Support custom colors, speed, and animation styles
- 📱 **Cross-Platform**: Support both iOS and Android
- 🎯 **TypeScript**: Complete type support

## Demo

<!-- Add GIF or screenshot demo here -->
<!-- ![Demo](screenshots/demo.gif) -->

## Installation

### Prerequisites

This library depends on the following two packages, please install them first:

```bash
# Install Skia
npm install @shopify/react-native-skia

# Install Reanimated
npm install react-native-reanimated
```

Detailed installation guides:

- [React Native Skia Installation Guide](https://shopify.github.io/react-native-skia/docs/getting-started/installation)
- [Reanimated Installation Guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/)

### Install This Library

```bash
npm install react-native-ambient-background
```

Or using yarn:

```bash
yarn add react-native-ambient-background
```

Or using pnpm:

```bash
pnpm add react-native-ambient-background
```

## Usage

### Basic Usage

```tsx
import Background from 'react-native-ambient-background';

function App() {
  return (
    <Background variant="mesh" mainColor="#4facfe" speed={5}>
      {/* Your content */}
    </Background>
  );
}
```

### Complete Example

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Background from 'react-native-ambient-background';

export default function App() {
  return (
    <Background variant="fluid" mainColor="#667eea" speed={3}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome</Text>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
```

## API Documentation

### Props

| Property    | Type                                                                 | Default     | Description                          |
| ----------- | -------------------------------------------------------------------- | ----------- | ------------------------------------ |
| `variant`   | `'fluid' \| 'mesh' \| 'waves' \| 'aurora' \| 'colorful' \| 'ripple'` | `'mesh'`    | Animation effect style               |
| `mainColor` | `string`                                                             | `'#4facfe'` | Main color (supports hex, rgb, rgba) |
| `speed`     | `number`                                                             | `5`         | Animation speed (1-10)               |
| `children`  | `React.ReactNode`                                                    | -           | Child component content              |
| `style`     | `ViewStyle`                                                          | -           | Custom styles                        |

### Animation Effects Description

| Effect     | Description                                     | Suitable Scenarios          |
| ---------- | ----------------------------------------------- | --------------------------- |
| `fluid`    | Fluid smoke effect, soft dynamic flow           | Dark mode, tech interfaces  |
| `mesh`     | Diffused spot style, modern design trend        | Login pages, welcome pages  |
| `waves`    | Silk-like undulating waves                      | Music apps, art displays    |
| `aurora`   | Aurora gradient, extremely soft color changes   | Relaxation, meditation apps |
| `colorful` | Multi-color particle blend, lively and colorful | Children's apps, games      |
| `ripple`   | Water ripple effect                             | Water-themed, nature apps   |

## Example Project

Check the `example` directory for a complete example:

```bash
# Clone the repository
git clone https://github.com/alansuhe/react-native-ambient-background.git

# Enter the example directory
cd react-native-ambient-background/example

# Install dependencies
pnpm install

# Run the example
pnpm ios    # iOS
pnpm android # Android
```

## Contributing

Issues and Pull Requests are welcome!

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) to learn how to participate in the project.

## License

[MIT License](./LICENSE)

## Acknowledgments

- [React Native Skia](https://github.com/Shopify/react-native-skia) - Powerful 2D graphics rendering engine
- [React Native Reanimated](https://github.com/software-mansion/react-native-reanimated) - Smooth animation library

---

If you find this project helpful, please give it a ⭐️!
