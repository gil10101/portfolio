"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { gsap } from "gsap"

export default function MobileFibonacciSphere() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const isRipplingRef = useRef(false)

  useEffect(() => {
    if (!canvasRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 3.2 // Move camera back slightly for better mobile view

    const renderer = new THREE.WebGLRenderer({
      antialias: false, // Disable antialiasing for performance
      alpha: true,
      powerPreference: "high-performance"
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(1) // Lower pixel ratio for performance
    canvasRef.current.appendChild(renderer.domElement)

    // Add fixed positioning to canvas element for proper background rendering
    Object.assign(renderer.domElement.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      zIndex: '0',
      pointerEvents: 'none' // Let clicks pass through to elements below
    })

    // Create parent object to hold all cubes
    const sphereGroup = new THREE.Group()
    // Scale down the whole sphere group for better mobile view
    sphereGroup.scale.set(0.85, 0.85, 0.85)
    scene.add(sphereGroup)

    // Add a core element to the sphere
    const coreGeometry = new THREE.IcosahedronGeometry(0.3, 1) // Lower detail for performance
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x111111,
    })
    const core = new THREE.Mesh(coreGeometry, coreMaterial)
    sphereGroup.add(core)

    // Add a subtle glow to the core
    const coreLight = new THREE.PointLight(0x444444, 1, 1)
    coreLight.position.set(0, 0, 0)
    sphereGroup.add(coreLight)

    // Fibonacci sphere parameters - reduced for mobile
    const points = 250 // Fewer points for better performance and scaling
    const phi = Math.PI * (3 - Math.sqrt(5)) // Golden angle in radians
    const cubeSize = 0.075 // Smaller cubes for better mobile scaling

    // Colors for cubes
    const colors = [
      new THREE.Color("#1a1a1a"),
      new THREE.Color("#262626"),
      new THREE.Color("#333333"),
      new THREE.Color("#404040"),
    ]

    // Create a shared geometry for all cubes
    const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
    
    // Material properties - simplified for mobile
    const materialProps = {
      metalness: 0.3,
      roughness: 0.6,
    }

    // Store all cubes
    const cubes: THREE.Mesh[] = []

    // Create cubes distributed in Fibonacci pattern
    for (let i = 0; i < points; i++) {
      const y = 1 - (i / (points - 1)) * 2 // y goes from 1 to -1
      const radius = Math.sqrt(1 - y * y) // Radius at y

      const theta = phi * i // Golden angle increment

      const x = Math.cos(theta) * radius
      const z = Math.sin(theta) * radius

      // Select color based on position
      const normalizedPosition = (y + 1) / 2 // Convert from -1,1 to 0,1
      const colorIndex = Math.floor(normalizedPosition * (colors.length - 1))

      // Create material - use MeshStandardMaterial for better performance
      const material = new THREE.MeshStandardMaterial({
        color: colors[colorIndex],
        ...materialProps
      })

      const cube = new THREE.Mesh(geometry, material)
      
      // Position the cube on the sphere surface
      cube.position.set(x, y, z)

      // Store the cube
      cubes.push(cube)

      // Add to group
      sphereGroup.add(cube)
    }

    // Optimized lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambientLight)

    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
    directionalLight.position.set(2, 2, 2)
    scene.add(directionalLight)

    // GSAP animations - light for performance
    gsap.to(sphereGroup.rotation, {
      duration: 50,
      y: Math.PI * 2,
      repeat: -1,
      ease: "none",
    })

    // Core pulsing animation
    gsap.to(coreLight, {
      intensity: 1.3,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    })

    // Initial animation
    gsap.fromTo(
      sphereGroup.scale,
      { x: 0, y: 0, z: 0 },
      {
        duration: 2,
        x: 0.85,
        y: 0.85,
        z: 0.85,
        ease: "elastic.out(1, 0.3)",
      },
    )

    // Handle window resize - adjust for mobile orientation changes
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      camera.aspect = width / height
      
      // Adjust camera position based on screen aspect ratio
      if (width < height) {
        // Portrait
        camera.position.z = 3.2
        sphereGroup.scale.set(0.85, 0.85, 0.85)
      } else {
        // Landscape
        camera.position.z = 2.8
        sphereGroup.scale.set(0.75, 0.75, 0.75)
      }
      
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener("resize", handleResize)
    // Initial sizing
    handleResize()

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      // Slow rotation
      sphereGroup.rotation.x += 0.0003
      sphereGroup.rotation.y += 0.0007

      // Batch rotation for all cubes to improve performance
      const rotationSpeed = 0.002
      cubes.forEach((cube) => {
        cube.rotation.x -= rotationSpeed
        cube.rotation.y -= rotationSpeed
      })

      // Rotate the core slightly differently
      core.rotation.x += 0.001
      core.rotation.z += 0.0005

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)

      // Dispose of geometries and materials
      geometry.dispose()
      
      sphereGroup.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.material instanceof THREE.Material) {
            object.material.dispose()
          }
          if (object.geometry) {
            object.geometry.dispose()
          }
        }
      })
      
      renderer.dispose()
      
      // Remove the canvas element
      if (canvasRef.current && canvasRef.current.contains(renderer.domElement)) {
        canvasRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={canvasRef} className="mobile-sphere-container" />
} 