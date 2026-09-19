import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Global Defense Hubs
export const DEFENSE_HUBS = [
  { id: 'HUB_BLR', name: 'Bengaluru, India', lat: 12.97, lon: 77.59, role: 'Central Defense Depot & Prime OEM', color: '#d9ba84' },
  { id: 'HUB_FRA', name: 'Frankfurt, Germany', lat: 50.11, lon: 8.68, role: 'European Forward Logistics Hub', color: '#60a5fa' },
  { id: 'HUB_FTW', name: 'Fort Worth, USA', lat: 32.75, lon: -97.33, role: 'North American Defense Reserves', color: '#38bdf8' },
  { id: 'HUB_SGP', name: 'Singapore Port Hub', lat: 1.35, lon: 103.82, role: 'Indo-Pacific Maritime Buffer', color: '#10b981' },
  { id: 'HUB_CGO', name: 'Kolwezi, Congo', lat: -10.72, lon: 25.47, role: 'Rare Earth / Cobalt Extraction', color: '#a855f7' },
  { id: 'HUB_TWN', name: 'Hsinchu, Taiwan', lat: 24.81, lon: 120.96, role: 'GaN & Silicon Foundries', color: '#f59e0b' },
  { id: 'HUB_NAG', name: 'Nagoya, Japan', lat: 35.18, lon: 136.90, role: 'High-Temp Alloy & Optics', color: '#ec4899' },
  { id: 'HUB_UK',  name: 'Bristol, UK', lat: 51.45, lon: -2.58, role: 'Aerospace Propulsion Systems', color: '#64748b' }
];

// Strategic Maritime & Air Chokepoints
export const CHOKEPOINTS = [
  { id: 'CP_RED_SEA', name: 'Bab-el-Mandeb / Red Sea', lat: 12.58, lon: 43.33, status: 'HIGH RISK (+6.5d)', color: '#ef4444' },
  { id: 'CP_SUEZ', name: 'Suez Canal', lat: 30.58, lon: 32.57, status: 'CONGESTED (+3.5d)', color: '#f59e0b' },
  { id: 'CP_MALACCA', name: 'Strait of Malacca', lat: 4.15, lon: 100.12, status: 'ELEVATED TRAFFIC (+2.0d)', color: '#f59e0b' },
  { id: 'CP_PANAMA', name: 'Panama Canal', lat: 9.08, lon: -79.68, status: 'NORMAL DRAFT', color: '#10b981' }
];

export function latLongToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export function LogisticGlobe({ activeRouteId, onSelectRoute, activeChokepointId }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 600;
    let height = container.clientHeight || 450;

    // Scene & Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 8, 38);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const GLOBE_RADIUS = 12;

    // 1. Base Dark Tactical Sphere
    const sphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 48, 48);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x07090e,
      wireframe: false
    });
    const baseSphere = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(baseSphere);

    // 2. Wireframe / Latitude-Longitude Grid
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x1f242e,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const wireSphere = new THREE.Mesh(sphereGeo, wireMat);
    globeGroup.add(wireSphere);

    // 3. Glowing Atmospheric Rim (Gold Haze)
    const glowGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.03, 32, 32);
    const glowMat = new THREE.ShaderMaterial({
      uniforms: {
        c: { type: "f", value: 0.2 },
        p: { type: "f", value: 4.5 },
        glowColor: { type: "c", value: new THREE.Color(0xd9ba84) },
        viewVector: { type: "v3", value: camera.position }
      },
      vertexShader: `
        uniform vec3 viewVector;
        uniform float c;
        uniform float p;
        varying float intensity;
        void main() {
          vec3 vNormal = normalize(normalMatrix * normal);
          vec3 vNormel = normalize(normalMatrix * viewVector);
          intensity = pow(c - dot(vNormal, vNormel), p);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
          vec3 glow = glowColor * intensity;
          gl_FragColor = vec4(glow, intensity * 0.4);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    const atmosphere = new THREE.Mesh(glowGeo, glowMat);
    globeGroup.add(atmosphere);

    // 4. Plotted Defense Hubs
    DEFENSE_HUBS.forEach(hub => {
      const pos = latLongToVector3(hub.lat, hub.lon, GLOBE_RADIUS);
      
      // Node Dot
      const hubGeo = new THREE.SphereGeometry(0.35, 16, 16);
      const hubMat = new THREE.MeshBasicMaterial({ color: hub.color });
      const hubMesh = new THREE.Mesh(hubGeo, hubMat);
      hubMesh.position.copy(pos);
      globeGroup.add(hubMesh);

      // Outer Radar Ring
      const ringGeo = new THREE.RingGeometry(0.45, 0.65, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: hub.color, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos.clone().multiplyScalar(1.01));
      ringMesh.lookAt(pos.clone().multiplyScalar(2));
      globeGroup.add(ringMesh);
    });

    // 5. Plotted Chokepoints
    CHOKEPOINTS.forEach(cp => {
      const pos = latLongToVector3(cp.lat, cp.lon, GLOBE_RADIUS);
      const cpGeo = new THREE.RingGeometry(0.4, 0.75, 16);
      const cpMat = new THREE.MeshBasicMaterial({
        color: cp.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const cpMesh = new THREE.Mesh(cpGeo, cpMat);
      cpMesh.position.copy(pos.clone().multiplyScalar(1.02));
      cpMesh.lookAt(pos.clone().multiplyScalar(2));
      globeGroup.add(cpMesh);
    });

    // 6. 3D Curved Shipping Corridors (Bezier Arcs)
    const routes = [
      { from: 'HUB_BLR', to: 'HUB_FRA', color: 0xd9ba84 },
      { from: 'HUB_CGO', to: 'HUB_SGP', color: 0xef4444 }, // Bab-el-Mandeb affected
      { from: 'HUB_TWN', to: 'HUB_BLR', color: 0xf59e0b },
      { from: 'HUB_NAG', to: 'HUB_BLR', color: 0x10b981 },
      { from: 'HUB_UK',  to: 'HUB_FRA', color: 0x60a5fa },
      { from: 'HUB_FTW', to: 'HUB_BLR', color: 0x38bdf8 }
    ];

    routes.forEach(rt => {
      const fromHub = DEFENSE_HUBS.find(h => h.id === rt.from);
      const toHub = DEFENSE_HUBS.find(h => h.id === rt.to);
      if (!fromHub || !toHub) return;

      const p1 = latLongToVector3(fromHub.lat, fromHub.lon, GLOBE_RADIUS);
      const p2 = latLongToVector3(toHub.lat, toHub.lon, GLOBE_RADIUS);

      // Calculate midpoint elevated into 3D orbit
      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      const dist = p1.distanceTo(p2);
      mid.normalize().multiplyScalar(GLOBE_RADIUS + dist * 0.28);

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(40);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: rt.color,
        transparent: true,
        opacity: 0.75,
        linewidth: 2
      });
      const line = new THREE.Line(lineGeo, lineMat);
      globeGroup.add(line);
    });

    // Mouse Interaction (Click & Drag Rotation)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Initial globe orientation focused on Indian Ocean / Eurasia
    globeGroup.rotation.y = 1.2;
    globeGroup.rotation.x = 0.25;

    // Animation Loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Slow procedural rotation when not dragging
      if (!isDragging) {
        globeGroup.rotation.y += 0.0018;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      if (container.contains(dom)) {
        container.removeChild(dom);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '480px', 
        position: 'relative', 
        cursor: 'grab', 
        overflow: 'hidden',
        background: 'radial-gradient(circle at center, rgba(16, 20, 29, 0.85) 0%, rgba(6, 7, 9, 0.98) 100%)',
        border: '1px solid var(--glass-border)'
      }}
    >
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        background: 'rgba(6, 7, 9, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '8px 14px',
        fontSize: '0.78rem',
        color: '#94a3b8',
        zIndex: 5,
        pointerEvents: 'none'
      }}>
        <div><strong style={{ color: 'var(--primary-gold)' }}>3D TACTICAL DEFENSE GLOBE</strong></div>
        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Drag to rotate &bull; Real-time maritime & air corridors</div>
      </div>
    </div>
  );
}
