'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export function ARSceneViewer({ objects = [] }: { objects?: any[] }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const mount = mountRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(800, 600);

    // Add some default objects for demo
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    if (mount) {
      mount.appendChild(renderer.domElement);
    }

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    setIsLoading(false);

    return () => {
      if (mount && renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className='w-full h-full relative'>
      <div ref={mountRef} className='w-full h-full' />
      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-900/50'>
          <div className='text-white'>Loading 3D Engine...</div>
        </div>
      )}
    </div>
  );
}
