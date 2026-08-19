"use client";

import React, { useEffect, useRef } from 'react';

export default function HeroGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    let animationFrameId: number;

    const initGlobe = async () => {
      // Dynamically load Three.js & OrbitControls if not present
      if (!(window as any).THREE) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }

      if (!(window as any).THREE.OrbitControls) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }

      if (!isMounted || !containerRef.current) return;

      const THREE = (window as any).THREE;
      const container = containerRef.current;
      container.innerHTML = '';

      const width = window.innerWidth;
      const height = window.innerHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 0, 3.7);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enableZoom = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;

      // Deep Space Starfield Background
      const starGeo = new THREE.BufferGeometry();
      const starCount = 1800;
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount * 3; i += 3) {
        starPos[i] = (Math.random() - 0.5) * 80;
        starPos[i + 1] = (Math.random() - 0.5) * 80;
        starPos[i + 2] = (Math.random() - 0.5) * 80;
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({
        color: 0x93c5fd,
        size: 0.07,
        transparent: true,
        opacity: 0.6
      });
      const starField = new THREE.Points(starGeo, starMat);
      scene.add(starField);

      // Earth Group
      const earthGroup = new THREE.Group();
      scene.add(earthGroup);

      const globeRadius = 1.35;
      const sphereGeo = new THREE.SphereGeometry(globeRadius, 64, 64);

      // Create high-res canvas procedural texture for Earth
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#030816';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Lat/Lon Coordinate lines
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.lineWidth = 1.5;
        for (let x = 0; x < canvas.width; x += 64) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 64) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
        }

        // Night-lights and thermal clusters
        ctx.fillStyle = 'rgba(56, 189, 248, 0.55)';
        for (let i = 0; i < 4500; i++) {
          const px = Math.random() * canvas.width;
          const py = Math.random() * canvas.height;
          ctx.beginPath();
          ctx.arc(px, py, Math.random() * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const globeTexture = new THREE.CanvasTexture(canvas);
      const globeMat = new THREE.MeshPhongMaterial({
        map: globeTexture,
        shininess: 30,
        specular: new THREE.Color('#0284c7'),
        emissive: new THREE.Color('#010816')
      });
      const globeMesh = new THREE.Mesh(sphereGeo, globeMat);
      earthGroup.add(globeMesh);

      // Outer Geospatial Wireframe Mesh
      const wireframeMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.09
      });
      const wireframeMesh = new THREE.Mesh(new THREE.SphereGeometry(globeRadius + 0.018, 32, 32), wireframeMat);
      earthGroup.add(wireframeMesh);

      // Glowing Atmosphere Rim
      const atmosphereMat = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.68 - dot(vNormal, vec3(0, 0, 1.0)), 2.4);
            gl_FragColor = vec4(0.02, 0.55, 0.98, 1.0) * intensity;
          }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true
      });
      const atmosphereMesh = new THREE.Mesh(new THREE.SphereGeometry(globeRadius * 1.2, 48, 48), atmosphereMat);
      earthGroup.add(atmosphereMesh);

      // Hotspot Cluster Markers (Karachi, Phoenix, Riyadh, Abu Dhabi, Dubai)
      const latLonToVector3 = (lat: number, lon: number, radius: number) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        return new THREE.Vector3(
          -(radius * Math.sin(phi) * Math.cos(theta)),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        );
      };

      const nodes = [
        { lat: 24.8607, lon: 67.0011, color: 0xf43f5e },  // Karachi
        { lat: 33.4484, lon: -112.0740, color: 0xf59e0b }, // Phoenix
        { lat: 24.7136, lon: 46.6753, color: 0x06b6d4 },   // Riyadh
        { lat: 24.4539, lon: 54.3773, color: 0x10b981 },   // Abu Dhabi
        { lat: 25.2048, lon: 55.2708, color: 0x38bdf8 }    // Dubai
      ];

      const pulseRings: any[] = [];
      nodes.forEach((n) => {
        const pos = latLonToVector3(n.lat, n.lon, globeRadius + 0.025);

        const marker = new THREE.Mesh(
          new THREE.SphereGeometry(0.035, 16, 16),
          new THREE.MeshBasicMaterial({ color: n.color })
        );
        marker.position.copy(pos);
        earthGroup.add(marker);

        const ring = new THREE.Mesh(
          new THREE.RingGeometry(0.045, 0.075, 32),
          new THREE.MeshBasicMaterial({ color: n.color, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
        );
        ring.position.copy(pos);
        ring.lookAt(new THREE.Vector3(0, 0, 0));
        earthGroup.add(ring);
        pulseRings.push(ring);
      });

      // Lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.8));
      const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
      dirLight.position.set(6, 4, 6);
      scene.add(dirLight);

      const handleResize = () => {
        if (!camera) return;
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      // Render Loop
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        controls.update();

        const time = Date.now() * 0.003;
        pulseRings.forEach((r) => {
          const scale = 1 + Math.sin(time) * 0.25;
          r.scale.set(scale, scale, scale);
        });

        renderer.render(scene, camera);
      };
      animate();
    };

    initGlobe();

    return () => {
      isMounted = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-0 pointer-events-auto cursor-grab active:cursor-grabbing"
    />
  );
}
