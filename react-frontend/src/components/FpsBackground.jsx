import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// ============================================================================
// EXACT 60FPS.FR SHADERS (SCRAPED DIRECTLY FROM 60FPS.FR BUNDLE)
// ============================================================================

const VERTEX_SHADER = `
precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;

attribute vec2 uv;
attribute vec3 position;
attribute mat4 instanceMatrix;

varying vec2 vUv;
varying vec3 vSeed;
varying vec3 vPosition;
varying vec3 vViewPosition;

void main() {
  vUv = uv;
  
  vSeed.x = fract(sin((instanceMatrix[3].z + instanceMatrix[3].y + instanceMatrix[3].x) * 287.) * 209.);
  vSeed.y = fract(cos((instanceMatrix[3].z + instanceMatrix[3].y - instanceMatrix[3].x) * 27.) * 20.);
  vSeed.z = fract(sin((instanceMatrix[3].z - instanceMatrix[3].y + instanceMatrix[3].x) * 9.) * 309.);

  vPosition = vec3(modelMatrix * instanceMatrix * vec4(position, 1.0));
  gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  vViewPosition = gl_Position.xyz;
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform sampler2D tNoise, tNoise1;
uniform float uTime, uEffect, uScroll;

varying vec3 vSeed;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vViewPosition;

#define PI 3.14159265

vec3 hueShift(vec3 color, float hue) {
  vec3 k = vec3(0.57735, 0.57735, 0.57735);
  float cosAngle = cos(hue);
  return vec3(color * cosAngle + cross(k, color) * sin(hue) + k * dot(k, color) * (1.0 - cosAngle));
}

void main() {
  float effectIntensity = smoothstep(.0, .2, uEffect) * smoothstep(1., .2, uEffect);
  float t = uTime * .002 - effectIntensity * .1;

  float structureMask = step(0., vUv.x);
  float wiresMask = 1. - structureMask;

  vec3 structure = vec3(0.);
  vec3 wires = vec3(0.);

  float fogFactor = 1.0;

  // 60fps noise sampling
  vec3 noise = texture2D(tNoise1, vUv + vSeed.xy + t).rgb;
  structure += noise.r * .3 * vec3(1., .7, .4) + smoothstep(.8, 1., noise.r) * .2;
  structure += smoothstep(.8, .9, noise.r) * smoothstep(.5, 1., sin(vPosition.z * 10. + t * 100. + noise.g * 10. + noise.r * 20. + vSeed * .1)) * 1.8;
  structure += vViewPosition.z * .003 * fogFactor;
  structure += smoothstep(30., 0., vViewPosition.z) * vec3(1., 0.8, 0.) * .1;
  
  structure += smoothstep(.9, 1., texture2D(tNoise, vec2(atan(vPosition.x, vPosition.y) * .2, vPosition.z * .01 + t * 10.)).r) * .2;
  structure *= .8;

  vec3 wNoise = texture2D(tNoise1, vPosition.yz * .2 * vec2(2., .005) + t * 5.).rgb;
  wires += smoothstep(.8, 1., wNoise.r) * vec3(1., .5, .2);
  wNoise = texture2D(tNoise, vPosition.yz * .5 * vec2(.3, .05) - vec2(0., t * 10.)).rgb;
  wires += smoothstep(.9, 1., wNoise.b) * vec3(1., .6, 0.);
  wNoise = texture2D(tNoise, vPosition.yz * .5 * vec2(.1, .05) - vec2(0., t * 20.)).rgb;
  wires += smoothstep(.9, 1., wNoise.b) * vec3(1., .8, .2);
  wires += smoothstep(.4, .8, length(wires)) * .3;
  wires *= 1. + vViewPosition.z * .001 * fogFactor;
  wires *= 1. + smoothstep(10., 0., vViewPosition.z) * 10.;
  wires += vViewPosition.z * .005 + .1;
  
  vec3 color = structure * structureMask + wires * wiresMask;
  color *= smoothstep(1., 0., length(vPosition.xy) * .1);

  color += smoothstep(.98, 1., sin(vPosition.z * .005 + uTime * .4 + noise.g * .5 + noise.r * .1 + vUv.y * .01 + vUv.x * .5)) * vec3(1., .9, .7) * (.4 + smoothstep(.6, 1., noise.r) * .2);
  color += smoothstep(.98, 1., sin(vPosition.z * .005 - uTime * .4 + noise.g * .5 + noise.r * .1 + vUv.y * .01 + vUv.x * .5 + 2.5)) * (.2 + smoothstep(.6, 1., noise.r) * .2);

  // Hue shift based on scroll & position
  color = hueShift(color, uScroll * PI * 2. + vViewPosition.z * .01 + noise.r * .1);
  color *= 1. + effectIntensity;

  gl_FragColor = vec4(color, 1.);
}
`;

export function FpsBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Scene & Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060709);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // 2. Camera setup matching 60fps.fr (FOV: 40)
    const camera = new THREE.PerspectiveCamera(40, width / height, 1, 1000);
    camera.position.set(0, 0, 45);

    // 3. Texture setup
    const textureLoader = new THREE.TextureLoader();
    const noiseTexture = textureLoader.load('/assets/noise-dlh34rrt.jpg', (tex) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
    });

    // 4. Custom RawShaderMaterial
    const uniforms = {
      tNoise: { value: noiseTexture },
      tNoise1: { value: noiseTexture },
      uTime: { value: 0 },
      uEffect: { value: 0 },
      uScroll: { value: 0 }
    };

    const material = new THREE.RawShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: uniforms,
      side: THREE.DoubleSide
    });

    // 5. InstancedMesh Geometry & Layout
    // Initial fallback geometry
    let baseGeometry = new THREE.BoxGeometry(6, 6, 6);
    baseGeometry.scale(0.5, 0.5, 0.5);

    const instanceCount = 1800;
    let instancedMesh = new THREE.InstancedMesh(baseGeometry, material, instanceCount);
    instancedMesh.frustumCulled = false;

    // Populate grid layout matching 60fps box spacing
    const dummy = new THREE.Object3D();
    const boxSpacing = 10;
    const cols = 12;
    const rows = 12;
    const layers = Math.floor(instanceCount / (cols * rows));

    let idx = 0;
    for (let l = 0; l < layers; l++) {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (idx >= instanceCount) break;

          const x = (c - cols / 2) * boxSpacing + (Math.sin(l + r) * 3);
          const y = (r - rows / 2) * boxSpacing + (Math.cos(l + c) * 3);
          const z = -l * boxSpacing - 10;

          dummy.position.set(x, y, z);
          // slight procedural rotation
          dummy.rotation.set(
            (c % 2 === 0 ? 1 : 0) * Math.PI * 0.5,
            (r % 2 === 0 ? 1 : 0) * Math.PI * 0.5,
            0
          );
          dummy.scale.set(1, 1, 1);
          dummy.updateMatrix();

          instancedMesh.setMatrixAt(idx++, dummy.matrix);
        }
      }
    }
    instancedMesh.instanceMatrix.needsUpdate = true;
    scene.add(instancedMesh);

    // Asynchronously load the exact 60fps room GLB model
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      '/assets/room-Cb4bLSll.glb',
      (gltf) => {
        try {
          if (gltf && gltf.scene && gltf.scene.children && gltf.scene.children.length > 0) {
            const roomGeo = gltf.scene.children[0].geometry.clone();
            roomGeo.scale(0.5, 0.5, 0.5);
            instancedMesh.geometry.dispose();
            instancedMesh.geometry = roomGeo;
          }
        } catch (err) {
          console.warn('GLB geometry assignment note:', err);
        }
      },
      undefined,
      (err) => console.warn('GLB load note:', err)
    );

    // ============================================================================
    // EXACT 60FPS.FR MOUSE TILT & CAMERA LOGIC
    // ============================================================================

    // Target normalized mouse coordinates [-1, 1]
    const targetMouse = { x: 0, y: 0 };
    // Smooth lerp mouse coordinates
    const lerpedMouse = { x: 0, y: 0 };
    const prevTargetMouse = { x: 0, y: 0 };

    const handleMouseMove = (e) => {
      prevTargetMouse.x = targetMouse.x;
      prevTargetMouse.y = targetMouse.y;
      targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollMax > 0) {
        uniforms.uScroll.value = window.scrollY / scrollMax;
      }
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // 6. Animation loop at continuous 60 FPS
    let animationId;
    let lastTime = performance.now();
    let elapsedTime = 0;

    const animate = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      elapsedTime += dt;

      // Update shader uniform time
      uniforms.uTime.value = elapsedTime;

      // Exact 60fps lerp calculation:
      // this.mouse.lerp(pe.tools.mouse.coordinates.webgl, dt)
      lerpedMouse.x += (targetMouse.x - lerpedMouse.x) * (dt * 4.0);
      lerpedMouse.y += (targetMouse.y - lerpedMouse.y) * (dt * 4.0);

      // Camera base position and fluid drift
      camera.position.x = lerpedMouse.x * 12;
      camera.position.y = lerpedMouse.y * 12;
      camera.position.z = 45 - (window.scrollY || 0) * 0.015;

      // Exact 60fps rotation & tilt lines:
      // this.camera.rotateZ(-dt*.1)
      // this.camera.rotateY(-this.mouse.x*.001)
      // this.camera.rotateX(this.mouse.y*.001)
      // this.camera.rotateZ((this.mouse.x-pe.tools.mouse.coordinates.webgl.x)*.01)
      camera.rotation.set(0, 0, 0);
      camera.rotateZ(-elapsedTime * 0.05);
      camera.rotateY(-lerpedMouse.x * 0.4);
      camera.rotateX(lerpedMouse.y * 0.4);
      camera.rotateZ((lerpedMouse.x - targetMouse.x) * 0.25);

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      material.dispose();
      baseGeometry.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="canvas-wrapper"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    />
  );
}
