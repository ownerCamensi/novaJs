/**
 * Default shaders used by BasicMaterial.
 * Includes: Phong lighting, fog, texture sampling.
 * Uniforms: modelMatrix, viewMatrix, projectionMatrix, normalMatrix,
 *           color, useTexture, map, time, fogNear, fogFar, fogColor
 * Lights (up to 4 point lights + 1 directional + ambient)
 */

export const defaultVertex = /* glsl */`#version 300 es
precision highp float;

// ── Attributes ──────────────────────────────────────────────
in vec3 position;
in vec3 normal;
in vec2 uv;

// ── Uniforms ────────────────────────────────────────────────
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

// ── Varyings ────────────────────────────────────────────────
out vec3 vWorldPosition;
out vec3 vNormal;
out vec2 vUV;
out vec3 vViewPosition;

void main() {
  // World-space position (for lighting)
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;

  // View-space position (for fog, specular)
  vec4 viewPos = viewMatrix * worldPos;
  vViewPosition = viewPos.xyz;

  // Transform normal into world space using the normal matrix
  // (handles non-uniform scale correctly)
  vNormal = normalize(normalMatrix * normal);

  vUV = uv;

  // THE critical line — perspective correct NDC position
  gl_Position = projectionMatrix * viewPos;
}
`;

export const defaultFragment = /* glsl */`#version 300 es
precision highp float;

// ── Varyings ────────────────────────────────────────────────
in vec3 vWorldPosition;
in vec3 vNormal;
in vec2 vUV;
in vec3 vViewPosition;

// ── Material ────────────────────────────────────────────────
uniform vec3  color;
uniform float opacity;
uniform bool  useTexture;
uniform sampler2D map;
uniform float time;
uniform float shininess;

// ── Ambient light ────────────────────────────────────────────
uniform vec3  ambientColor;
uniform float ambientIntensity;

// ── Directional light ────────────────────────────────────────
uniform vec3  dirLightDir;
uniform vec3  dirLightColor;
uniform float dirLightIntensity;

// ── Point lights (max 4) ─────────────────────────────────────
uniform vec3  pointLightPos[4];
uniform vec3  pointLightColor[4];
uniform float pointLightIntensity[4];
uniform int   numPointLights;

// ── Fog ─────────────────────────────────────────────────────
uniform bool  useFog;
uniform float fogNear;
uniform float fogFar;
uniform vec3  fogColor;

// ── Output ───────────────────────────────────────────────────
out vec4 fragColor;

void main() {
  // Base color — from texture or solid color
  vec4 baseColor = useTexture ? texture(map, vUV) : vec4(color, opacity);

  vec3 N = normalize(vNormal);                       // surface normal
  vec3 V = normalize(-vViewPosition);                // view direction (camera at origin in view space)

  // ── Ambient ──────────────────────────────────────────────
  vec3 ambient = ambientColor * ambientIntensity;

  // ── Directional light ────────────────────────────────────
  vec3 L = normalize(-dirLightDir);
  float diff = max(dot(N, L), 0.0);
  vec3 R = reflect(-L, N);
  float spec = pow(max(dot(V, R), 0.0), shininess);
  vec3 dirLight = dirLightColor * dirLightIntensity * (diff + spec * 0.3);

  // ── Point lights ─────────────────────────────────────────
  vec3 pointTotal = vec3(0.0);
  for (int i = 0; i < 4; i++) {
    if (i >= numPointLights) break;
    vec3 toLight = pointLightPos[i] - vWorldPosition;
    float dist = length(toLight);
    vec3 PL = normalize(toLight);
    float attenuation = 1.0 / (1.0 + 0.09 * dist + 0.032 * dist * dist);
    float pDiff = max(dot(N, PL), 0.0);
    vec3 PR = reflect(-PL, N);
    float pSpec = pow(max(dot(V, PR), 0.0), shininess);
    pointTotal += pointLightColor[i] * pointLightIntensity[i] * attenuation * (pDiff + pSpec * 0.2);
  }

  // ── Combine ──────────────────────────────────────────────
  vec3 lit = baseColor.rgb * (ambient + dirLight + pointTotal);

  // ── Fog ──────────────────────────────────────────────────
  if (useFog) {
    float depth = length(vViewPosition);
    float fogFactor = clamp((depth - fogNear) / (fogFar - fogNear), 0.0, 1.0);
    lit = mix(lit, fogColor, fogFactor);
  }

  fragColor = vec4(lit, baseColor.a * opacity);
}
`;
