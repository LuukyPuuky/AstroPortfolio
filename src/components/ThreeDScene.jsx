import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const ThreeDScene = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    let container = containerRef.current;
    let scene, camera, renderer, pokeball;

    // Initialize Three.js scene
    function init() {
      scene = new THREE.Scene();

      // Set up camera
      camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight, // Use container dimensions
        1,
        1000
      );
      camera.position.z = 50;

      // Renderer
      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(container.clientWidth, container.clientHeight); // Set renderer size to container
      container.appendChild(renderer.domElement);

      // Orbit Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;

      // Light setup
      const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(30, 20, 50);
      scene.add(directionalLight);

      // Create pokeball
      createPokeball();

      // Resize listener
      window.addEventListener("resize", onWindowResize, false);
    }

    // Create the Pokeball object
    function createPokeball() {
      const radius = 10;
      const segments = 32;

      const upperSphereGeometry = new THREE.SphereGeometry(
        radius,
        segments,
        segments,
        0,
        Math.PI * 2,
        0,
        Math.PI / 2
      );
      const upperMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
      const upperSphere = new THREE.Mesh(upperSphereGeometry, upperMaterial);
      scene.add(upperSphere);

      const lowerSphereGeometry = new THREE.SphereGeometry(
        radius,
        segments,
        segments,
        0,
        Math.PI * 2,
        Math.PI / 2,
        Math.PI / 2
      );
      const lowerMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const lowerSphere = new THREE.Mesh(lowerSphereGeometry, lowerMaterial);
      scene.add(lowerSphere);

      const bandGeometry = new THREE.CylinderGeometry(
        radius * 1.01,
        radius * 1.01,
        1,
        segments
      );
      const bandMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
      const band = new THREE.Mesh(bandGeometry, bandMaterial);
      band.rotation.y = Math.PI / 2;
      scene.add(band);

      const buttonGeometry = new THREE.SphereGeometry(2, segments, segments);
      const buttonMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
      });
      const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
      button.position.z = radius + 0.1;
      scene.add(button);
    }

    // Handle window resizing
    function onWindowResize() {
      if (container) {
        // Use container dimensions instead of window dimensions
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      }
    }

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    // Initialize scene
    init();

    // Start the animation loop
    animate();

    // Clean up on unmount
    return () => {
      window.removeEventListener("resize", onWindowResize);
      if (container && renderer) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100vw", height: "50vh", overflow: "hidden" }} // Responsive size set here
    />
  );
};

export default ThreeDScene;
