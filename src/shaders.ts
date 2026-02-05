import { Skia } from '@shopify/react-native-skia';

/**
 * 核心优化说明：
 * 1. 强制使用 half4 main(vec2 fragCoord) 签名，符合最新 Skia 标准。
 * 2. 所有浮点数显式标注 .0，防止部分安卓设备 GPU 驱动解析失败。
 * 3. 优化了循环和三角函数计算，减少 GPU 功耗。
 */

export const Shaders = {
  // 1. Fluid: 经典的流体烟雾感，适合深色模式
  fluid: Skia.RuntimeEffect.Make(`
uniform float iTime;
uniform vec3 iMainColor;
uniform vec2 iResolution;
uniform float iSpeed;

half4 main(vec2 fragCoord) {
  vec2 uv = fragCoord / iResolution.xy;
  float t = iTime * iSpeed * 0.05;

  // ===== 流体扰动（结构不变）=====
  for(float n = 1.0; n < 4.0; n++){
    uv.x += 0.5 / n * sin(n * 3.0 * uv.y + t);
    uv.y += 0.5 / n * cos(n * 3.0 * uv.x + t);
  }

  vec3 baseColor = iMainColor * 0.8;
  vec3 colorDir = normalize(iMainColor + 0.0001);

  // ===== 大尺度雾层 =====
  float bigFlow = sin(t * 0.4 + uv.y * 1.2);

  // ===== 中尺度主流层 =====
  float rawMidFlow = sin(t + uv.x * 2.5 + uv.y * 3.0);
  float midFlow = mix(
    rawMidFlow,
    smoothstep(-1.0, 1.0, rawMidFlow) * 2.0 - 1.0,
    0.5
  );

  // ===== 细节高光层 =====
  float highlightFlow = sin(t * 1.3 + uv.x * 5.0 + uv.y * 4.0);
  highlightFlow = smoothstep(0.4, 1.0, highlightFlow);

  // ===== 颜色叠加 =====
  vec3 finalColor =
    baseColor
    + colorDir * bigFlow * 0.12
    + colorDir * midFlow * 0.22
    + colorDir * highlightFlow * 0.1;

  // ===== 暗部保护 =====
  finalColor = max(finalColor, baseColor * 0.85);

  return half4(finalColor, 1.0);
}
  `)!,

  // 2. Mesh: 弥散光斑风格，目前 UI 设计最流行的风格
  mesh: Skia.RuntimeEffect.Make(`
uniform float iTime;
uniform vec3 iMainColor;
uniform vec2 iResolution;
uniform float iSpeed;

vec2 move(float currentT, float moveWeight, float offset) {
  float t = currentT * moveWeight + offset;
  return vec2(
    0.5 + 0.35 * sin(t * 1.1),
    0.5 + 0.35 * cos(t * 0.9)
  );
}

half4 main(vec2 fragCoord) {
  vec2 res = max(iResolution, vec2(1.0));
  vec2 uv = fragCoord / res;
  float globalT = iTime * iSpeed * 0.5;

  vec2 p[6];
  p[0] = move(globalT, 0.2, 0.0);
  p[1] = move(globalT, 0.3, 2.0);
  p[2] = move(globalT, 0.25, 4.0);
  p[3] = move(globalT, 0.4, 1.0);
  p[4] = move(globalT, 0.35, 3.0);
  p[5] = move(globalT, 0.45, 5.0);

  // ===== 颜色准备 =====
  vec3 colorDir = normalize(iMainColor + 0.0001);

  vec3 baseColor = iMainColor * 0.85;
  vec3 darkColor = iMainColor * 0.45;
  vec3 highlightColor = iMainColor + colorDir * 0.45;

  vec3 c[6];
  c[0] = baseColor;
  c[1] = baseColor;
  c[2] = darkColor;
  c[3] = highlightColor;
  c[4] = baseColor;
  c[5] = darkColor;

  float totalWeight = 0.0;
  vec3 finalCol = vec3(0.0);

  for(int i = 0; i < 6; i++) {
    float d = distance(uv, p[i]);
    float w = pow(max(0.0, 1.0 - d), 5.0);

    // 高光遮罩（越中心越亮）
    float light = smoothstep(0.6, 1.0, w);

    // 高光混合（幅度很小）
    vec3 col = mix(c[i], highlightColor, light * 0.35);

    finalCol += col * w;
    totalWeight += w;
  }

  finalCol /= max(totalWeight, 0.001);

  return half4(finalCol, 1.0);
}
  `)!,

  // 3. Waves: 丝绸般的起伏波浪
  waves: Skia.RuntimeEffect.Make(`
    uniform float iTime;
    uniform vec3 iMainColor;
    uniform vec2 iResolution;
    uniform float iSpeed;

    half4 main(vec2 fragCoord) {
      vec2 uv = fragCoord / max(iResolution, vec2(1.0));
      float t = iTime * iSpeed * 0.15;

      float wave1 = sin(uv.x * 4.0 + t * 0.8 + uv.y * 2.0) * 0.2;
      float wave2 = sin(uv.x * 7.0 - t * 1.2 + uv.y * 1.5) * 0.1;
      float wave3 = cos(uv.x * 2.5 + t * 0.5) * 0.15;

      float combinedWave = wave1 + wave2 + wave3;
      
      float mask = smoothstep(0.4 + combinedWave, 0.7 + combinedWave, uv.y);
      
      vec3 topColor = iMainColor * 1.2;
      vec3 bottomColor = iMainColor * 0.4;
      
      // 添加动态高光带
      float highlight = pow(1.0 - abs(uv.y - 0.5 - combinedWave), 12.0);
      vec3 finalCol = mix(bottomColor, topColor, mask);
      finalCol += vec3(0.6) * highlight * 0.4;

      return half4(finalCol, 1.0);
    }
  `)!,

  // 4. Aurora: 极光/极简极度柔和的渐变变化
  aurora: Skia.RuntimeEffect.Make(`
uniform float iTime;
uniform vec3 iMainColor;
uniform vec2 iResolution;
uniform float iSpeed;

vec3 rotateHue(vec3 c, float angle) {
  float s = sin(angle);
  float cs = cos(angle);
  mat3 m = mat3(
    vec3(0.299 + 0.701 * cs + 0.168 * s, 0.587 - 0.587 * cs + 0.330 * s, 0.114 - 0.114 * cs - 0.497 * s),
    vec3(0.299 - 0.299 * cs - 0.328 * s, 0.587 + 0.413 * cs + 0.035 * s, 0.114 - 0.114 * cs + 0.292 * s),
    vec3(0.299 - 0.300 * cs + 1.250 * s, 0.587 - 0.588 * cs - 1.050 * s, 0.114 + 0.886 * cs - 0.203 * s)
  );
  return clamp(m * c, 0.0, 1.0);
}

half4 main(vec2 fragCoord) {
  vec2 uv = fragCoord / max(iResolution, vec2(1.0));
  float t = iTime * iSpeed * 0.1;

  float band =
    0.5 + 0.5 *
    sin(uv.x * 1.6 + t) *
    sin(uv.y * 1.1 + t * 0.7);

  vec3 colorCold = rotateHue(iMainColor, -0.6);
  vec3 colorMid  = iMainColor;
  vec3 colorWarm = rotateHue(iMainColor,  0.6);

  vec3 color = mix(colorCold, colorMid, smoothstep(0.2, 0.5, band));
  color = mix(color, colorWarm, smoothstep(0.5, 0.8, band));

  vec3 highlightColor = iMainColor + normalize(iMainColor + 0.0001) * 0.2;
  color = mix(color, highlightColor, smoothstep(0.85, 1.0, band));

  color *= 0.8 + 0.35 * sin(uv.x * 3.0 + t);

  return half4(color, 1.0);
}
  `)!,

  colorful: Skia.RuntimeEffect.Make(`
    uniform float iTime;
    uniform vec3 iMainColor;
    uniform vec2 iResolution;
    uniform float iSpeed;

    vec2 move(float currentT, float moveWeight, float offset) {
      float t = currentT * moveWeight + offset;
      return vec2(
        0.5 + 0.35 * sin(t * 1.1),
        0.5 + 0.35 * cos(t * 0.9)
      );
    }

    half4 main(vec2 fragCoord) {
      vec2 res = max(iResolution, vec2(1.0));
      vec2 uv = fragCoord / res;
      float globalT = iTime * iSpeed * 0.5;

      // 动态计算 6 个彩色质点的位置
      vec2 p[6];
      p[0] = move(globalT, 0.2, 0.0);
      p[1] = move(globalT, 0.3, 2.0);
      p[2] = move(globalT, 0.25, 4.0);
      p[3] = move(globalT, 0.4, 1.0);
      p[4] = move(globalT, 0.35, 3.0);
      p[5] = move(globalT, 0.45, 5.0);

      // 基于主色的衍生色
      vec3 c[6];
      c[0] = iMainColor;
      c[1] = iMainColor.gbr * 0.8;
      c[2] = iMainColor.brg * 1.2;
      c[3] = vec3(1.0) - iMainColor * 0.3;
      c[4] = iMainColor * 0.6 + vec3(0.2, 0.1, 0.4);
      c[5] = iMainColor * 1.4;

      float totalWeight = 0.0;
      vec3 finalCol = vec3(0.0);

      for(int i = 0; i < 6; i++) {
        float d = distance(uv, p[i]);
        // 5.0 的幂次决定了光斑的弥散半径，数值越大越聚焦
        float w = pow(max(0.0, 1.0 - d), 5.0); 
        finalCol += c[i] * w;
        totalWeight += w;
      }

      return half4(finalCol / max(totalWeight, 0.001), 1.0);
    }
  `)!,

ripple: Skia.RuntimeEffect.Make(`
uniform float iTime;
uniform vec3 iMainColor;
uniform vec2 iResolution;
uniform float iSpeed;

// 简单 hash，用来生成稳定随机
float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// 单个涟漪
float ripple(vec2 uv, vec2 center, float t, float freq, float speed) {
  float d = distance(uv, center);
  float wave = sin(d * freq - t * speed);
  // 距离衰减 + 压平，形成模糊感
  return wave * smoothstep(0.6, 0.0, d);
}

half4 main(vec2 fragCoord) {
  vec2 uv = fragCoord / max(iResolution, vec2(1.0));
  float t = iTime * iSpeed;

  // ===== 累积涟漪 =====
  float r = 0.0;

  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    vec2 seed = vec2(fi, fi * 1.37);

    // 随时间缓慢漂移的波源
    vec2 center = vec2(
      0.5 + 0.3 * sin(t * 0.1 + hash21(seed)),
      0.5 + 0.3 * cos(t * 0.1 + hash21(seed + 1.23))
    );

    r += ripple(
      uv,
      center,
      t + fi * 10.0,
      18.0 + fi * 4.0,   // 频率差异
      1.0 + fi * 0.3
    );
  }

  // 归一化
  r /= 4.0;

  // ===== 模糊 / 柔化 =====
  float rippleMask = smoothstep(-0.3, 0.3, r);

  // ===== 颜色处理 =====
  vec3 colorDir = normalize(iMainColor + 0.0001);

  // 基础水色（稍暗）
  vec3 baseColor = iMainColor * 0.75;

  // 同色系高光（非常克制）
  vec3 highlightColor = iMainColor + colorDir * 0.2;

  // 根据涟漪混合
  vec3 color = mix(baseColor, highlightColor, rippleMask * 0.4);

  // 轻微整体明暗呼吸
  color *= 0.9 + 0.1 * sin(t * 0.5);

  return half4(color, 1.0);
}
  `)!

};

export type AnimationStyle = keyof typeof Shaders;
export const AnimationStyles = Object.keys(Shaders) as AnimationStyle[];