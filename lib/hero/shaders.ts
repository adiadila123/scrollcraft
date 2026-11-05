/* GLSL for the hero. Points fly from a scattered origin to their place on the face, glow on arrival and part around the pointer. */

export const pointVS = /* glsl */ `
uniform float uP; uniform float uTime; uniform float uScale; uniform float uFade;
uniform vec3 uMouse; uniform vec3 uMouseVel; uniform float uMouseAmt;
attribute vec3 aSeed; attribute vec3 aCol; attribute float aSize;
varying vec3 vCol; varying float vA;
void main() {
  vec3 s = aSeed;
  vec3 home = position;
  vec3 origin = vec3((s.x - 0.5) * 5.0 + home.x * 0.8, (s.y - 0.5) * 4.5 + home.y * 0.6, -1.2 - s.z * 4.5);
  float delay = 0.30 * s.y + 0.28 * clamp(length(home.xy) / 1.3, 0.0, 1.0);
  float a = clamp((uP - delay) / 0.42, 0.0, 1.0);
  float m = 1.0 - pow(1.0 - a, 3.0);
  vec3 p = mix(origin, home, m);
  float w = (1.0 - m) * m * 4.0;
  float ph = uTime * 1.2 + s.z * 6.2831;
  p += vec3(sin(ph + s.x * 9.0), cos(ph * 0.9 + s.y * 9.0), sin(ph * 0.7 + s.z * 9.0)) * 0.35 * w;
  p += vec3(sin(uTime * 0.9 + s.x * 40.0), cos(uTime * 0.8 + s.y * 40.0), sin(uTime * 0.7 + s.z * 40.0)) * 0.004 * m;
  vec2 dm = p.xy - uMouse.xy;
  float dd = length(dm);
  float f = exp(-dd * dd / (2.0 * 0.22 * 0.22)) * uMouseAmt * m;
  vec2 jit = vec2(sin(uTime * 3.0 + s.x * 50.0), cos(uTime * 2.6 + s.y * 50.0));
  p.xy += uMouseVel.xy * f * (0.8 + s.x * 0.8);
  p.xy += jit * f * 0.035;
  p.z += f * (0.12 + s.z * 0.25);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float v = clamp(max(aCol.r, max(aCol.g, aCol.b)) / 1.5, 0.0, 1.0);
  float osc = 0.5 + 0.5 * sin(uTime * (0.7 + s.x * 1.8) + s.y * 40.0);
  float breathe = mix(1.0, 0.3 + 0.7 * osc * osc, uFade);
  float arrive = a * (1.0 - a) * 4.0;
  vec3 col = mix(aCol, vec3(0.35, 0.8, 1.0) * (0.6 + v), (1.0 - m) * 0.75);
  col += vec3(0.4, 0.8, 1.0) * arrive * 0.7;
  col += vec3(0.25, 0.55, 0.9) * f * 0.8;
  float appear = 0.1 + 0.9 * smoothstep(0.0, 0.5, a);
  vCol = col;
  vA = (0.3 + 0.7 * v) * appear * breathe;
  float sz = aSize * (1.0 + arrive * 0.8) * (1.0 + f * 0.6);
  gl_PointSize = max(1.5, sz * uScale / (-mv.z));
}
`;

export const pointFS = /* glsl */ `
varying vec3 vCol; varying float vA;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float g = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vCol, vA * g * g * 1.6);
}
`;

export const dustVS = /* glsl */ `
uniform float uP; uniform float uTime; uniform float uScale;
attribute vec3 aSeed;
varying vec3 vCol; varying float vA;
void main() {
  float open = smoothstep(0.0, 0.4, uP);
  float life = fract(uTime * (0.05 + aSeed.y * 0.07) + aSeed.z);
  vec3 p = position;
  p.y += life * (1.2 + aSeed.x * 2.2);
  p.x += sin(uTime * 0.8 + aSeed.z * 20.0 + life * 5.0) * 0.12 * life + life * 0.3 * (aSeed.y - 0.3);
  p.z += (aSeed.x - 0.4) * life * 0.8;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  vCol = mix(vec3(0.2, 0.55, 1.0), vec3(0.6, 0.9, 1.0), aSeed.y);
  vA = open * sin(3.14159 * life) * (0.15 + 0.4 * aSeed.y);
  gl_PointSize = max(1.2, (0.02 + aSeed.x * 0.03) * uScale / (-mv.z));
}
`;
