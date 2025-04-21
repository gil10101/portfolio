"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { gsap } from "gsap"

// Define cube data type
interface CubeData {
  mesh: THREE.Mesh;
  originalPosition: THREE.Vector3;
  normal: THREE.Vector3;
  angle: number;
  azimuth: number;
}

export default function FibonacciSphere() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const isRipplingRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      return mobile
    }
    
    const isMobileDevice = checkMobile()
    
    if (!canvasRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 2.5

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobileDevice, // Disable antialiasing on mobile for performance
      alpha: true,
      powerPreference: "high-performance"
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(isMobileDevice ? 1 : Math.min(window.devicePixelRatio, 2)) // Lower pixel ratio on mobile
    renderer.shadowMap.enabled = !isMobileDevice // Disable shadows on mobile for performance
    if (!isMobileDevice) {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
    }
    canvasRef.current.appendChild(renderer.domElement)

    // Add fixed positioning to canvas element for proper background rendering
    Object.assign(renderer.domElement.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      zIndex: '0',
      pointerEvents: 'none'
    })

    // Create parent object to hold all cubes
    const sphereGroup = new THREE.Group()
    scene.add(sphereGroup)

    // Add a core element to the sphere
    const coreGeometry = new THREE.IcosahedronGeometry(0.3, isMobileDevice ? 1 : 2) // Lower detail on mobile
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

    // Fibonacci sphere parameters
    // Reduce number of points on mobile for better performance
    const points = isMobileDevice ? 400 : 800
    const phi = Math.PI * (3 - Math.sqrt(5)) // Golden angle in radians
    const cubeSize = isMobileDevice ? 0.085 : 0.075 // Slightly larger cubes on mobile, but fewer of them

    // Update the colors array to use darker colors with more variation
    const colors = [
      new THREE.Color("#1a1a1a"), // Almost black
      new THREE.Color("#262626"), // Very dark gray
      new THREE.Color("#333333"), // Dark gray
      new THREE.Color("#404040"), // Medium dark gray
      new THREE.Color("#4d4d4d"), // Gray
      new THREE.Color("#595959"), // Medium gray
    ]

    // Create a shared geometry for all cubes
    const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
    
    // Material properties - simplified for mobile
    const materialProps = {
      metalness: isMobileDevice ? 0.3 : 0.5,
      roughness: isMobileDevice ? 0.6 : 0.4,
      reflectivity: isMobileDevice ? 0.5 : 0.8,
      clearcoat: isMobileDevice ? 0 : 0.3, // Disable clearcoat on mobile
      clearcoatRoughness: isMobileDevice ? 0 : 0.2,
    }

    // Store all cubes with their original properties
    const cubes: CubeData[] = []

    // Create cubes distributed in Fibonacci pattern
    for (let i = 0; i < points; i++) {
      const y = 1 - (i / (points - 1)) * 2 // y goes from 1 to -1
      const radius = Math.sqrt(1 - y * y) // Radius at y

      const theta = phi * i // Golden angle increment

      const x = Math.cos(theta) * radius
      const z = Math.sin(theta) * radius

      // Select color based on position (normalized to 0-1 range)
      const normalizedPosition = (y + 1) / 2 // Convert from -1,1 to 0,1
      const colorIndex = Math.floor(normalizedPosition * (colors.length - 1))

      // Create material - use MeshStandardMaterial on mobile for better performance
      const materialClass = isMobileDevice ? THREE.MeshStandardMaterial : THREE.MeshPhysicalMaterial
      const material = new materialClass({
        color: colors[colorIndex],
        ...materialProps
      })

      const cube = new THREE.Mesh(geometry, material)
      
      // Only set shadows on desktop for performance
      if (!isMobileDevice) {
        cube.castShadow = true
        cube.receiveShadow = true
      }

      // Position the cube on the sphere surface
      const surfacePoint = new THREE.Vector3(x, y, z)
      const surfaceNormal = surfacePoint.clone().normalize()

      // Calculate the distance from origin to cube vertex
      // For a unit cube, the distance from center to vertex is sqrt(3)/2
      const vertexOffset = (Math.sqrt(3) * cubeSize) / 2

      // Position the cube so that one vertex points outward
      // We need to move the cube inward by the vertex offset
      const scaleFactor = 1 - vertexOffset / surfacePoint.length()
      surfacePoint.multiplyScalar(scaleFactor)

      cube.position.copy(surfacePoint)

      // Calculate the normal vector (for a sphere, this is just the normalized position)
      const normal = new THREE.Vector3(x, y, z).normalize()

      // Rotate the cube so one vertex points outward along the normal
      // This requires a specific rotation to align a cube vertex with the normal
      // First, create a rotation that aligns one vertex with the y-axis
      const vertexDirection = new THREE.Vector3(1, 1, 1).normalize()
      const initialQuat = new THREE.Quaternion().setFromUnitVectors(vertexDirection, new THREE.Vector3(0, 1, 0))

      // Then rotate to align with the normal direction
      const finalQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal)

      // Combine the rotations
      cube.quaternion.copy(finalQuat).multiply(initialQuat)

      // Store the cube with its original properties
      cubes.push({
        mesh: cube,
        originalPosition: cube.position.clone(),
        normal: normal,
        // Store the angle from the y-axis (0 at north pole, PI at south pole)
        angle: Math.acos(y),
        // Store the angle around the y-axis (0 to 2*PI)
        azimuth: Math.atan2(z, x),
      })

      // Add to group
      sphereGroup.add(cube)
    }

    // Optimized lighting setup - simplified for mobile
    // Ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, isMobileDevice ? 0.3 : 0.2)
    scene.add(ambientLight)

    // Main directional light to create strong highlights
    const directionalLight = new THREE.DirectionalLight(0xffffff, isMobileDevice ? 1.0 : 1.2)
    directionalLight.position.set(2, 2, 2)
    if (!isMobileDevice) {
      directionalLight.castShadow = true
    }
    scene.add(directionalLight)

    // Secondary directional light from opposite side - only on desktop
    if (!isMobileDevice) {
      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight2.position.set(-2, 1, -1)
      scene.add(directionalLight2)

      // Spotlight to create focused gleam effect - only on desktop
      const spotLight = new THREE.SpotLight(0xffffff, 1.5, 10, Math.PI / 6, 0.5, 1)
      spotLight.position.set(0, 3, 3)
      spotLight.castShadow = true
      scene.add(spotLight)

      // Add a subtle rim light to highlight edges - only on desktop
      const rimLight = new THREE.DirectionalLight(0xffffff, 0.4)
      rimLight.position.set(0, 0, -5)
      scene.add(rimLight)
    }

    // Raycaster for mouse interaction
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    const target = new THREE.Vector2()

    // Ripple effect parameters - adjusted for more subtle effect
    const rippleParams = {
      duration: isMobileDevice ? 2.0 : 2.5,  // Slightly faster on mobile
      speed: isMobileDevice ? 1.0 : 0.9,     // Slightly faster on mobile
      maxDistance: Math.PI,
      amplitude: isMobileDevice ? 0.06 : 0.08, // Less amplitude on mobile
      width: 0.6              // Same width
    }

    // Function to create ripple effect
    const createRippleEffect = (originCube: THREE.Mesh) => {
      if (isRipplingRef.current) return
      isRipplingRef.current = true

      // Find the origin cube in our cubes array
      const originIndex = cubes.findIndex((cube) => cube.mesh === originCube)
      if (originIndex === -1) {
        isRipplingRef.current = false
        return
      }

      const originCubeData = cubes[originIndex]

      // Get the angle and azimuth of the origin cube
      const originAngle = originCubeData.angle
      const originAzimuth = originCubeData.azimuth

      // Create a timeline for the ripple animation
      const timeline = gsap.timeline({
        onComplete: () => {
          // Reset all cubes to their original positions
          gsap.to(
            cubes.map(cube => cube.mesh.position), 
            {
              x: (i) => cubes[i].originalPosition.x,
              y: (i) => cubes[i].originalPosition.y,
              z: (i) => cubes[i].originalPosition.z,
              duration: 0.3,
              ease: "power2.out",
            }
          )

          // Allow new ripples after the reset animation completes
          setTimeout(() => {
            isRipplingRef.current = false
          }, 300)
        },
      })

      // Create the ripple animation
      timeline.to(
        {},
        {
          duration: rippleParams.duration,
          onUpdate: function () {
            // Current progress of the animation (0 to 1)
            const progress = this.progress()

            // Current position of the ripple wave (0 to maxRippleDistance)
            const ripplePosition = progress * rippleParams.speed * rippleParams.maxDistance

            // Update each cube's position based on the ripple
            cubes.forEach((cube) => {
              // Calculate the angular distance from origin cube to this cube
              // This is a simplified approach using the difference in angles
              const dAngle = Math.abs(cube.angle - originAngle)
              const dAzimuth = Math.min(
                Math.abs(cube.azimuth - originAzimuth),
                2 * Math.PI - Math.abs(cube.azimuth - originAzimuth),
              )

              // Approximate the great circle distance
              // This is a simplified calculation that works well enough for visualization
              const distance = Math.sqrt(
                dAngle * dAngle + dAzimuth * dAzimuth * Math.sin(cube.angle) * Math.sin(originAngle),
              )

              // Calculate how much this cube should be displaced
              const distanceFromWave = Math.abs(distance - ripplePosition)

              // Only displace cubes that are within the ripple width
              if (distanceFromWave < rippleParams.width) {
                // Calculate displacement factor (1 at wave center, 0 at edges)
                const displacementFactor = 1 - distanceFromWave / rippleParams.width

                // Apply a sine curve to make the wave shape smoother
                const smoothFactor = Math.sin(displacementFactor * Math.PI)

                // Calculate the displacement amount with a gentler curve
                const displacement = rippleParams.amplitude * smoothFactor * Math.pow(displacementFactor, 0.7)

                // Displace the cube along its normal vector
                const newPosition = cube.originalPosition.clone().add(cube.normal.clone().multiplyScalar(displacement))

                // Update the cube position with a smoother transition
                cube.mesh.position.lerp(newPosition, 0.6)
              } else if (distance < ripplePosition - rippleParams.width) {
                // If the ripple has passed this cube, ensure it's back at its original position
                // Use a gentler approach to return to original position
                cube.mesh.position.lerp(cube.originalPosition, 0.2)
              }
            })
          },
        },
      )
    }

    // Function to trigger a ripple at a random position
    const triggerRandomRipple = () => {
      if (isRipplingRef.current) return

      // Select a random cube
      const randomIndex = Math.floor(Math.random() * cubes.length)
      createRippleEffect(cubes[randomIndex].mesh)
    }

    // Handle touch/mouse events
    const handlePointerMove = (event: MouseEvent | TouchEvent) => {
      // Get client X/Y from either mouse or touch event
      const clientX = 'touches' in event 
        ? event.touches[0].clientX 
        : (event as MouseEvent).clientX
      const clientY = 'touches' in event 
        ? event.touches[0].clientY 
        : (event as MouseEvent).clientY

      // Update mouse coordinates for raycasting
      mouse.x = (clientX / window.innerWidth) * 2 - 1
      mouse.y = -(clientY / window.innerHeight) * 2 + 1

      // Update target for camera movement
      target.x = mouse.x * 0.1
      target.y = mouse.y * 0.1

      // Move spotlight with pointer for dynamic gleam effect - desktop only
      if (!isMobileDevice && scene.children.find(child => child instanceof THREE.SpotLight)) {
        const spotLight = scene.children.find(child => child instanceof THREE.SpotLight) as THREE.SpotLight
        spotLight.position.x = mouse.x * 3
        spotLight.position.y = mouse.y * 3 + 3
      }
    }

    const handlePointerClick = (event: MouseEvent | TouchEvent) => {
      // Only proceed if no ripple is currently active
      if (isRipplingRef.current) return

      // Get client X/Y from either mouse or touch event
      const clientX = 'touches' in event 
        ? event.touches[0].clientX 
        : (event as MouseEvent).clientX
      const clientY = 'touches' in event 
        ? event.touches[0].clientY 
        : (event as MouseEvent).clientY

      // Update mouse coordinates for raycasting
      mouse.x = (clientX / window.innerWidth) * 2 - 1
      mouse.y = -(clientY / window.innerHeight) * 2 + 1

      // Update the raycaster with the mouse position
      raycaster.setFromCamera(mouse, camera)

      // Find intersections with cubes
      const intersects = raycaster.intersectObjects(cubes.map((cube) => cube.mesh))

      // If we intersected with a cube, create a ripple effect
      if (intersects.length > 0) {
        createRippleEffect(intersects[0].object as THREE.Mesh)
      } else {
        // If we didn't hit any cube, trigger a random ripple
        triggerRandomRipple()
      }
    }

    // Add both mouse and touch event listeners
    window.addEventListener("mousemove", handlePointerMove)
    window.addEventListener("click", handlePointerClick)
    window.addEventListener("touchmove", handlePointerMove)
    window.addEventListener("touchstart", handlePointerClick)

    // Trigger an initial ripple after a short delay
    setTimeout(triggerRandomRipple, 1500)

    // Set up automatic ripple triggering for demo purposes
    const autoRippleInterval = setInterval(() => {
      if (!isRipplingRef.current) {
        triggerRandomRipple()
      }
    }, isMobileDevice ? 8000 : 6000) // Trigger less frequently on mobile

    // GSAP animations - lighter on mobile
    gsap.to(sphereGroup.rotation, {
      duration: isMobileDevice ? 50 : 40, // Slower rotation on mobile to reduce CPU load
      y: Math.PI * 2,
      repeat: -1,
      ease: "none",
    })

    // Core pulsing animation
    gsap.to(coreLight, {
      intensity: isMobileDevice ? 1.3 : 1.5,
      duration: isMobileDevice ? 2.5 : 2,
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
        x: 1,
        y: 1,
        z: 1,
        ease: "elastic.out(1, 0.3)",
      },
    )

    // Handle window resize
    const handleResize = () => {
      const newIsMobile = checkMobile()
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(newIsMobile ? 1 : Math.min(window.devicePixelRatio, 2))
    }

    window.addEventListener("resize", handleResize)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      // Slow rotation - slower on mobile
      sphereGroup.rotation.x += isMobileDevice ? 0.0003 : 0.0005
      sphereGroup.rotation.y += isMobileDevice ? 0.0007 : 0.001

      // Batch rotation for all cubes to improve performance
      // Slower rotation on mobile
      const rotationSpeed = isMobileDevice ? 0.002 : 0.003
      cubes.forEach((cube) => {
        cube.mesh.rotation.x -= rotationSpeed
        cube.mesh.rotation.y -= rotationSpeed
      })

      // Smooth camera movement based on mouse
      camera.position.x += (target.x - camera.position.x) * 0.05
      camera.position.y += (target.y - camera.position.y) * 0.05
      camera.lookAt(scene.position)

      // Rotate the core slightly differently for visual interest
      core.rotation.x += isMobileDevice ? 0.001 : 0.002
      core.rotation.z += isMobileDevice ? 0.0005 : 0.001

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      clearInterval(autoRippleInterval)
      window.removeEventListener("mousemove", handlePointerMove)
      window.removeEventListener("click", handlePointerClick)
      window.removeEventListener("touchmove", handlePointerMove)
      window.removeEventListener("touchstart", handlePointerClick)
      window.removeEventListener("resize", handleResize)

      // Dispose of geometries and materials
      geometry.dispose()
      
      sphereGroup.traverse((object: THREE.Object3D) => {
        if (object instanceof THREE.Mesh) {
          if (object.material instanceof THREE.Material) {
            object.material.dispose()
          } else if (Array.isArray(object.material)) {
            object.material.forEach((material: THREE.Material) => material.dispose())
          }
        }
      })

      // Dispose of renderer
      renderer.dispose()
      
      canvasRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div className="canvas-container" ref={canvasRef}>
      <div className="instructions">
        <p>{isMobile ? "Tap" : "Click"} anywhere to create a ripple effect</p>
      </div>
    </div>
  )
}
