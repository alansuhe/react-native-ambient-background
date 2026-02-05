# react-native-ambient-background

[![npm version](https://badge.fury.io/js/react-native-ambient-background.svg)](https://www.npmjs.com/package/react-native-ambient-background)
[![CI](https://github.com/alansuhe/react-native-ambient-background/workflows/CI/badge.svg)](https://github.com/alansuhe/react-native-ambient-background/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org/)

[English](./README.md) | **中文**

一个基于 React Native Skia 的高性能动画背景组件，提供多种精美的动态背景效果。

## 特性

- 🎨 **6 种精美动画效果**：流体、弥散光斑、波浪、极光、彩色质点、涟漪
- ⚡ **高性能渲染**：基于 Skia 硬件加速
- 🔧 **高度可定制**：支持自定义颜色、速度、动画风格
- 📱 **跨平台支持**：同时支持 iOS 和 Android
- 🎯 **TypeScript**：完整的类型支持

## 演示

<!-- 在这里添加 GIF 或截图演示 -->
<!-- ![演示](screenshots/demo.gif) -->

## 安装

### 前提条件

本库依赖以下两个包，请先安装：

```bash
# 安装 Skia
npm install @shopify/react-native-skia

# 安装 Reanimated
npm install react-native-reanimated
```

详细安装说明：

- [React Native Skia 安装指南](https://shopify.github.io/react-native-skia/docs/getting-started/installation)
- [Reanimated 安装指南](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/)

### 安装本库

```bash
npm install react-native-ambient-background
```

或使用 yarn：

```bash
yarn add react-native-ambient-background
```

或使用 pnpm：

```bash
pnpm add react-native-ambient-background
```

## 使用方法

### 基础用法

```tsx
import Background from 'react-native-ambient-background';

function App() {
  return (
    <Background variant="mesh" mainColor="#4facfe" speed={5}>
      {/* 你的内容 */}
    </Background>
  );
}
```

### 完整示例

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Background from 'react-native-ambient-background';

export default function App() {
  return (
    <Background variant="fluid" mainColor="#667eea" speed={3}>
      <View style={styles.container}>
        <Text style={styles.title}>欢迎使用</Text>
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

## API 文档

### Props

| 属性        | 类型                                                                 | 默认值      | 说明                          |
| ----------- | -------------------------------------------------------------------- | ----------- | ----------------------------- |
| `variant`   | `'fluid' \| 'mesh' \| 'waves' \| 'aurora' \| 'colorful' \| 'ripple'` | `'mesh'`    | 动画效果风格                  |
| `mainColor` | `string`                                                             | `'#4facfe'` | 主色调（支持 hex、rgb、rgba） |
| `speed`     | `number`                                                             | `5`         | 动画速度（1-10）              |
| `children`  | `React.ReactNode`                                                    | -           | 子组件内容                    |
| `style`     | `ViewStyle`                                                          | -           | 自定义样式                    |

### 动画效果说明

| 效果       | 描述                         | 适用场景             |
| ---------- | ---------------------------- | -------------------- |
| `fluid`    | 流体烟雾效果，柔和的动态流动 | 深色模式、科技感界面 |
| `mesh`     | 弥散光斑风格，现代设计趋势   | 登录页、欢迎页       |
| `waves`    | 丝绸般的起伏波浪             | 音乐应用、艺术展示   |
| `aurora`   | 极光渐变，极度柔和的色调变化 | 放松、冥想类应用     |
| `colorful` | 多色质点混合，活泼多彩       | 儿童应用、游戏       |
| `ripple`   | 水波涟漪效果                 | 水主题、自然类应用   |

## 示例项目

查看 `example` 目录获取完整示例：

```bash
# 克隆仓库
git clone https://github.com/alansuhe/react-native-ambient-background.git

# 进入示例目录
cd react-native-ambient-background/example

# 安装依赖
pnpm install

# 运行示例
pnpm ios    # iOS
pnpm android # Android
```

## 贡献

欢迎提交 Issue 和 Pull Request！

请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解如何参与项目。

## 许可

[MIT License](./LICENSE)

## 致谢

- [React Native Skia](https://github.com/Shopify/react-native-skia) - 强大的 2D 图形渲染引擎
- [React Native Reanimated](https://github.com/software-mansion/react-native-reanimated) - 流畅的动画库

---

如果使用本项目，请给一个 ⭐️ 支持一下！
