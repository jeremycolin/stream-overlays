uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;

attribute float aScale;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // modelPosition.y += sin(uTime + modelPosition.x * 100.0) * aScale * 0.2;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    
    float size = uSize * uPixelRatio * aScale;
    gl_Position = projectionPosition;
    // gl_PointSize = sin(uTime + size) * 200.0;
    gl_PointSize = size;
    gl_PointSize *= (1.0 / - viewPosition.z);
}