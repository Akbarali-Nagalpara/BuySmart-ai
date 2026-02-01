import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

export function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points;
    geometricShapes: THREE.Group;
    animationId: number;
    materials: THREE.Material[];
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup with fog for depth
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(isDark ? 0x020617 : 0xffffff, 0.015);
    
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    containerRef.current.appendChild(renderer.domElement);

    // Create geometric shapes group (removed particles for cleaner look)
    const geometricShapes = new THREE.Group();
    const materials: THREE.Material[] = [];

    // Icosahedron with holographic material
    const icoGeometry = new THREE.IcosahedronGeometry(8, 0);
    const icoMaterial = new THREE.MeshStandardMaterial({
      color: isDark ? 0x6366f1 : 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
      emissive: isDark ? 0x4f46e5 : 0x7c3aed,
      emissiveIntensity: 0.3,
    });
    materials.push(icoMaterial);
    const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
    icosahedron.position.set(-20, 10, -20);
    geometricShapes.add(icosahedron);

    // Torus Knot
    const torusKnotGeometry = new THREE.TorusKnotGeometry(6, 2, 100, 16);
    const torusKnotMaterial = new THREE.MeshStandardMaterial({
      color: isDark ? 0x8b5cf6 : 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
      emissive: isDark ? 0x7c3aed : 0x4f46e5,
      emissiveIntensity: 0.2,
    });
    materials.push(torusKnotMaterial);
    const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
    torusKnot.position.set(20, -10, -30);
    geometricShapes.add(torusKnot);

    // Octahedron
    const octaGeometry = new THREE.OctahedronGeometry(6);
    const octaMaterial = new THREE.MeshStandardMaterial({
      color: isDark ? 0x06b6d4 : 0x14b8a6,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
      emissive: isDark ? 0x0891b2 : 0x0d9488,
      emissiveIntensity: 0.25,
    });
    materials.push(octaMaterial);
    const octahedron = new THREE.Mesh(octaGeometry, octaMaterial);
    octahedron.position.set(0, 15, -25);
    geometricShapes.add(octahedron);

    // Dodecahedron
    const dodecaGeometry = new THREE.DodecahedronGeometry(5);
    const dodecaMaterial = new THREE.MeshStandardMaterial({
      color: isDark ? 0xf59e0b : 0xfbbf24,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
      emissive: isDark ? 0xd97706 : 0xf59e0b,
      emissiveIntensity: 0.2,
    });
    materials.push(dodecaMaterial);
    const dodecahedron = new THREE.Mesh(dodecaGeometry, dodecaMaterial);
    dodecahedron.position.set(-15, -15, -35);
    geometricShapes.add(dodecahedron);

    scene.add(geometricShapes);

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(isDark ? 0x1e293b : 0xffffff, isDark ? 0.3 : 0.6);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(isDark ? 0x6366f1 : 0x8b5cf6, isDark ? 0.8 : 0.5);
    mainLight.position.set(10, 10, 10);
    scene.add(mainLight);

    const backLight = new THREE.DirectionalLight(isDark ? 0x8b5cf6 : 0x6366f1, isDark ? 0.6 : 0.4);
    backLight.position.set(-10, -10, -10);
    scene.add(backLight);

    const rimLight = new THREE.PointLight(isDark ? 0x06b6d4 : 0x14b8a6, 1, 100);
    rimLight.position.set(0, 0, 30);
    scene.add(rimLight);

    // Mouse movement interaction
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Store references for cleanup (before animation starts)
    sceneRef.current = {
      scene,
      camera,
      renderer,
      particles: null as any, // Not using particles anymore
      geometricShapes,
      animationId: 0,
      materials,
    };

    // Animation loop with smooth transitions
    const clock = new THREE.Clock();
    let animationFrameId = 0;
    let scrollY = 0;

    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = () => {
      if (!sceneRef.current) return;

      const elapsedTime = clock.getElapsedTime();
      const scrollProgress = scrollY * 0.0005;

      // Animate geometric shapes with smooth, subtle patterns
      geometricShapes.children.forEach((shape, index) => {
        const mesh = shape as THREE.Mesh;
        const speed = 0.15 + index * 0.05;
        const floatSpeed = 0.3 + index * 0.1;
        
        mesh.rotation.x = elapsedTime * speed;
        mesh.rotation.y = elapsedTime * (speed * 0.7);
        mesh.rotation.z = elapsedTime * (speed * 0.5);
        
        // Gentle floating patterns
        const originalY = [10, -10, 15, -15][index];
        mesh.position.y = originalY + Math.sin(elapsedTime * floatSpeed + index) * 2;
      });

      // Subtle parallax effect based on scroll
      geometricShapes.rotation.y = scrollProgress * 0.5;

      // Camera movement based on mouse with easing
      const targetX = mouseX * 8;
      const targetY = mouseY * 8;
      camera.position.x += (targetX - camera.position.x) * 0.03;
      camera.position.y += (targetY - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
      sceneRef.current.animationId = animationFrameId;
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        
        // Dispose geometries and materials
        sceneRef.current.geometricShapes.children.forEach((child) => {
          const mesh = child as THREE.Mesh;
          mesh.geometry.dispose();
          if (mesh.material) (mesh.material as THREE.Material).dispose();
        });

        sceneRef.current.materials.forEach((material) => material.dispose());
        
        renderer.dispose();
        
        if (containerRef.current && renderer.domElement) {
          containerRef.current.removeChild(renderer.domElement);
        }
      }
    };
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none -z-10"
      style={{ zIndex: 0 }}
    />
  );
}
