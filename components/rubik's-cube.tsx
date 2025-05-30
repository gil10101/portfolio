"use client"

import type React from "react"

import { useRef, useState, useCallback, useMemo, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, RoundedBox } from "@react-three/drei"
import * as THREE from "three"

// Cube piece component with sleek black material and curved edges
function CubePiece({
  position,
  onClick,
  isBackground = false,
  isMobile = false,
}: {
  position: [number, number, number]
  onClick: (event: any) => void
  isBackground?: boolean
  isMobile?: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  return (
    <RoundedBox
      ref={meshRef}
      position={position}
      args={[0.95, 0.95, 0.95]}
      radius={0.1}
      smoothness={isBackground && isMobile ? 4 : 8} // Lower smoothness on mobile background
      onClick={isBackground ? undefined : onClick} // Disable clicks for background
    >
      <meshPhysicalMaterial
        color="#0a0a0a"
        metalness={isBackground && isMobile ? 0.05 : 0.1}
        roughness={isBackground && isMobile ? 0.5 : 0.3}
        clearcoat={isBackground && isMobile ? 0 : 0.3} // Disable clearcoat on mobile background
        clearcoatRoughness={isBackground && isMobile ? 0 : 0.2}
        reflectivity={isBackground && isMobile ? 0.3 : 0.6}
        envMapIntensity={isBackground && isMobile ? 0.2 : 0.5}
      />
    </RoundedBox>
  )
}

// Layer rotation group component
function LayerGroup({
  children,
  isRotating,
  rotationAxis,
  rotationAngle,
}: {
  children: React.ReactNode
  isRotating: boolean
  rotationAxis: [number, number, number]
  rotationAngle: number
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      if (isRotating) {
        const axis = new THREE.Vector3(...rotationAxis).normalize()
        groupRef.current.setRotationFromAxisAngle(axis, rotationAngle)
      } else {
        groupRef.current.rotation.set(0, 0, 0)
      }
    }
  })

  return <group ref={groupRef}>{children}</group>
}

// Main Rubik's Cube component
function RubiksCube({ isBackground = false }: { isBackground?: boolean }) {
  const mainGroupRef = useRef<THREE.Group>(null)
  const [isRotating, setIsRotating] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [animationState, setAnimationState] = useState<{
    axis: "x" | "y" | "z"
    layer: number
    direction: number
    startTime: number
    duration: number
    progress: number
  } | null>(null)
  const lastAutoRotationRef = useRef(Date.now())
  const autoRotationIntervalRef = useRef(3000) // 3 seconds

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      return mobile
    }
    
    checkMobile()
    
    const handleResize = () => {
      checkMobile()
    }
    
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Initialize cube state
  const [cubeState, setCubeState] = useState(() => {
    const state = []
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          state.push({
            position: [(x - 1) * 1.0, (y - 1) * 1.0, (z - 1) * 1.0] as [number, number, number],
            gridPosition: [x, y, z] as [number, number, number],
            id: `${x}-${y}-${z}`,
          })
        }
      }
    }
    return state
  })

  // Get pieces for a specific layer
  const getLayerPieces = useCallback(
    (axis: "x" | "y" | "z", layer: number) => {
      return cubeState.filter((piece) => {
        const [x, y, z] = piece.gridPosition
        return axis === "x" ? x === layer : axis === "y" ? y === layer : z === layer
      })
    },
    [cubeState],
  )

  // Complete rotation and update state
  const completeRotation = useCallback(() => {
    if (!animationState) return

    setCubeState((prevState) => {
      const newState = [...prevState]
      const layerPieces = getLayerPieces(animationState.axis, animationState.layer)

      layerPieces.forEach((piece) => {
        const pieceIndex = newState.findIndex((p) => p.id === piece.id)
        if (pieceIndex !== -1) {
          const [x, y, z] = piece.gridPosition
          let newX = x,
            newY = y,
            newZ = z

          // Calculate new grid position after rotation
          if (animationState.axis === "x") {
            if (animationState.direction > 0) {
              newY = z
              newZ = 2 - y
            } else {
              newY = 2 - z
              newZ = y
            }
          } else if (animationState.axis === "y") {
            if (animationState.direction > 0) {
              newX = 2 - z
              newZ = x
            } else {
              newX = z
              newZ = 2 - x
            }
          } else if (animationState.axis === "z") {
            if (animationState.direction > 0) {
              newX = y
              newY = 2 - x
            } else {
              newX = 2 - y
              newY = x
            }
          }

          // Update position and grid position
          newState[pieceIndex] = {
            ...newState[pieceIndex],
            position: [(newX - 1) * 1.0, (newY - 1) * 1.0, (newZ - 1) * 1.0],
            gridPosition: [newX, newY, newZ],
          }
        }
      })

      return newState
    })

    setIsRotating(false)
    setAnimationState(null)
  }, [animationState, getLayerPieces])

  // Animation frame handler
  useFrame(() => {
    const currentTime = Date.now()

    // Rotate the entire cube slowly - slower on mobile background
    if (mainGroupRef.current) {
      const rotationSpeedY = isBackground && isMobile ? 0.003 : 0.005
      const rotationSpeedX = isBackground && isMobile ? 0.001 : 0.002
      mainGroupRef.current.rotation.y += rotationSpeedY
      mainGroupRef.current.rotation.x += rotationSpeedX
    }

    // Handle ongoing animation
    if (animationState && isRotating) {
      const elapsed = currentTime - animationState.startTime
      const progress = Math.min(elapsed / animationState.duration, 1)

      setAnimationState((prev) => (prev ? { ...prev, progress } : null))

      if (progress >= 1) {
        completeRotation()
      }
    }

    // Handle automatic rotations - less frequent on mobile background
    const autoRotationInterval = isBackground && isMobile ? 5000 : autoRotationIntervalRef.current
    if (!isRotating && currentTime - lastAutoRotationRef.current > autoRotationInterval) {
      const axes: ("x" | "y" | "z")[] = ["x", "y", "z"]
      const randomAxis = axes[Math.floor(Math.random() * axes.length)]
      const randomLayer = Math.floor(Math.random() * 3)
      const randomDirection = Math.random() > 0.5 ? 1 : -1

      rotateLayer(randomAxis, randomLayer, randomDirection)

      // Set next interval - longer on mobile background
      const baseInterval = isBackground && isMobile ? 4000 : 2500
      const randomInterval = isBackground && isMobile ? 2000 : 1500
      autoRotationIntervalRef.current = baseInterval + Math.random() * randomInterval
      lastAutoRotationRef.current = currentTime
    }
  })

  // Rotate a layer
  const rotateLayer = useCallback(
    (axis: "x" | "y" | "z", layer: number, direction: number) => {
      if (isRotating) return

      setIsRotating(true)
      setAnimationState({
        axis,
        layer,
        direction,
        startTime: Date.now(),
        duration: isBackground && isMobile ? 1500 : 1200, // Slower animation on mobile background
        progress: 0,
      })
    },
    [isRotating, isBackground, isMobile],
  )

  // Handle clicks - disable for background use
  const handlePieceClick = useCallback(
    (event: any, piece: any) => {
      if (isRotating || isBackground) return

      event.stopPropagation()
      const [x, y, z] = piece.gridPosition

      // Reset auto rotation timer when user interacts
      lastAutoRotationRef.current = Date.now()

      // Determine rotation based on click position
      const face = event.face
      const normal = event.face?.normal

      if (normal) {
        if (Math.abs(normal.z) > 0.5) {
          rotateLayer("z", z, normal.z > 0 ? 1 : -1)
        } else if (Math.abs(normal.x) > 0.5) {
          rotateLayer("x", x, normal.x > 0 ? 1 : -1)
        } else if (Math.abs(normal.y) > 0.5) {
          rotateLayer("y", y, normal.y > 0 ? 1 : -1)
        }
      } else {
        rotateLayer("y", y, 1)
      }
    },
    [isRotating, rotateLayer],
  )

  // Group pieces by layer for rendering
  const layerGroups = useMemo(() => {
    const groups: { [key: string]: any[] } = {}

    cubeState.forEach((piece) => {
      const [x, y, z] = piece.gridPosition
      const key = animationState
        ? animationState.axis === "x" && x === animationState.layer
          ? `rotating-x-${animationState.layer}`
          : animationState.axis === "y" && y === animationState.layer
            ? `rotating-y-${animationState.layer}`
            : animationState.axis === "z" && z === animationState.layer
              ? `rotating-z-${animationState.layer}`
              : "static"
        : "static"

      if (!groups[key]) groups[key] = []
      groups[key].push(piece)
    })

    return groups
  }, [cubeState, animationState])

  const currentRotationAngle = useMemo(() => {
    if (!animationState || !isRotating) return 0

    const progress = animationState.progress
    // Smooth easing function (ease-in-out quartic for more elegance)
    const eased =
      progress < 0.5 ? 8 * progress * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 4) / 2

    return (Math.PI / 2) * animationState.direction * eased
  }, [animationState, isRotating])

  return (
    <group ref={mainGroupRef}>
      {Object.entries(layerGroups).map(([key, pieces]) => {
        const isRotatingGroup = key.startsWith("rotating-")
        const rotationAxis: [number, number, number] = animationState
          ? animationState.axis === "x"
            ? [1, 0, 0]
            : animationState.axis === "y"
              ? [0, 1, 0]
              : [0, 0, 1]
          : [0, 1, 0]

        return (
          <LayerGroup
            key={key}
            isRotating={isRotatingGroup}
            rotationAxis={rotationAxis}
            rotationAngle={isRotatingGroup ? currentRotationAngle : 0}
          >
            {pieces.map((piece) => (
              <CubePiece 
                key={piece.id} 
                position={piece.position} 
                onClick={(event) => handlePieceClick(event, piece)}
                isBackground={isBackground}
                isMobile={isMobile}
              />
            ))}
          </LayerGroup>
        )
      })}
    </group>
  )
}

// Minimalist controls component
function Controls() {
  return (
    <div className="absolute top-6 left-6 z-10 bg-black/40 backdrop-blur-sm rounded-lg p-5 text-white border border-gray-800">
      <h3 className="font-light text-lg mb-3 text-gray-200">Sleek Rubik's Cube</h3>
      <div className="text-xs space-y-1.5 text-gray-400 font-light">
        <p>• Cube rotates continuously</p>
        <p>• Layer rotations every 2.5-4s</p>
        <p>• Click any face to interact</p>
        <p>• Drag to rotate view</p>
        <p>• Scroll to zoom</p>
      </div>
    </div>
  )
}

export default function Component({ isBackground = false }: { isBackground?: boolean }) {
  return (
    <div 
      className={isBackground ? "w-full h-screen" : "w-full h-screen bg-black"}
      style={isBackground ? { pointerEvents: 'none' } : {}}
    >
      {!isBackground && <Controls />}
      <Canvas 
        camera={{ position: [7, 7, 7], fov: 50 }} 
        gl={{ 
          antialias: !isBackground, // Disable antialiasing for background use on mobile
          alpha: isBackground, // Enable transparency for background use
          powerPreference: isBackground ? "default" : "high-performance"
        }}
        shadows={!isBackground} // Enable shadows for non-background use
      >
        {/* Enhanced sophisticated lighting setup */}
        {/* Base ambient light for overall illumination */}
        <ambientLight intensity={0.4} color="#f0f0f0" />
        
        {/* Main key light - warm directional light */}
        <directionalLight
          position={[10, 12, 8]}
          intensity={1.8}
          color="#ffffff"
          castShadow={!isBackground}
          shadow-mapSize-width={isBackground ? 1024 : 4096}
          shadow-mapSize-height={isBackground ? 1024 : 4096}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
          shadow-camera-left={-15}
          shadow-camera-right={15}
          shadow-camera-top={15}
          shadow-camera-bottom={-15}
          shadow-bias={-0.0001}
        />
        
        {/* Fill light - cooler tone from opposite side */}
        <directionalLight 
          position={[-8, 6, -6]} 
          intensity={0.6} 
          color="#e6f3ff" 
          castShadow={!isBackground}
          shadow-mapSize-width={isBackground ? 512 : 2048}
          shadow-mapSize-height={isBackground ? 512 : 2048}
        />
        
        {/* Rim light from behind for edge definition */}
        <directionalLight 
          position={[-4, 8, -10]} 
          intensity={0.8} 
          color="#fff5e6" 
        />
        
        {/* Top key light for dramatic shadows */}
        <directionalLight 
          position={[2, 15, 4]} 
          intensity={0.8} 
          color="#ffffff"
          castShadow={!isBackground}
          shadow-mapSize-width={isBackground ? 512 : 2048}
          shadow-mapSize-height={isBackground ? 512 : 2048}
        />
        
        {/* Point lights for local illumination */}
        <pointLight 
          position={[6, 10, 6]} 
          intensity={0.8} 
          color="#ffffff" 
          distance={20}
          decay={1.5}
        />
        <pointLight 
          position={[-6, 8, -6]} 
          intensity={0.7} 
          color="#e6f3ff" 
          distance={18}
          decay={1.8}
        />
        
        {/* Dramatic spot light from above */}
        <spotLight 
          position={[0, 18, 0]} 
          angle={0.6} 
          penumbra={0.7} 
          intensity={0.9} 
          color="#ffffff" 
          distance={25}
          decay={1.2}
          castShadow={!isBackground}
          shadow-mapSize-width={isBackground ? 1024 : 2048}
          shadow-mapSize-height={isBackground ? 1024 : 2048}
        />
        
        {/* Accent spot light for additional visual interest */}
        <spotLight 
          position={[12, 8, 12]} 
          angle={0.4} 
          penumbra={0.9} 
          intensity={0.6} 
          color="#fff9e6" 
          distance={20}
          decay={1.5}
        />

        {/* Enhanced environment for better reflections */}
        <Environment 
          preset="studio" 
          environmentIntensity={isBackground ? 0.3 : 0.6}
          environmentRotation={[0, Math.PI / 4, 0]}
        />

        {/* Rubik's Cube */}
        <RubiksCube isBackground={isBackground} />

        {/* Camera controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={!isBackground} // Disable zoom for background use
          enableRotate={!isBackground} // Disable manual rotation for background use
          minDistance={4}
          maxDistance={20}
          autoRotate={false}
          rotateSpeed={0.3}
          zoomSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}
