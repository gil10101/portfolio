import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * STLPointCloudHero Component
 * 
 * A React component that renders an interactive 3D point cloud visualization 
 * from STL model data. This component implements a two-stage algorithm to 
 * create a sparse, hollow point cloud representation of 3D models with 
 * optimized visual distribution and performance.
 * 
 * Key Features:
 * - STL file parsing (both ASCII and binary formats)
 * - Intelligent point distribution with hollow interior effect
 * - Spatial optimization using hash-based collision detection
 * - Dynamic color mapping based on geometric properties
 * - Real-time 3D rendering with smooth animations
 */
const STLPointCloudHero = () => {
  // React refs for Three.js scene management
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const frameRef = useRef<number>(0);
  const initializedRef = useRef<boolean>(false);

  /** Point cloud rendering configuration */
  const POINT_COUNT = 150000; // Target number of points for optimal performance/quality balance
  const POINT_SIZE = 0.01;    // Point size in world units for visibility

  /**
   * STL File Parser
   * 
   * Parses STL files in both ASCII and binary formats, extracting vertex data
   * for subsequent point cloud generation.
   * 
   * @param buffer - ArrayBuffer containing STL file data
   * @returns Float32Array of vertex coordinates (x, y, z) for each triangle vertex
   */
  const parseSTL = (buffer: ArrayBuffer) => {
    const view = new DataView(buffer);
    const isASCII = buffer.byteLength < 80 || 
      String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer, 0, 5))) === 'solid';

    if (isASCII) {
      return parseASCIISTL(new TextDecoder().decode(buffer));
    } else {
      return parseBinarySTL(view);
    }
  };

  /**
   * ASCII STL Parser
   * 
   * Extracts vertex data from ASCII-formatted STL files by parsing
   * text-based vertex declarations.
   * 
   * @param data - String content of ASCII STL file
   * @returns Float32Array of vertex coordinates
   */
  const parseASCIISTL = (data: string) => {
    const vertices: number[] = [];
    const lines = data.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('vertex')) {
        const coords = line.split(/\s+/).slice(1).map(Number);
        vertices.push(...coords);
      }
    }
    
    return new Float32Array(vertices);
  };

  /**
   * Binary STL Parser
   * 
   * Extracts vertex data from binary STL files using DataView for
   * efficient parsing of packed binary data structures.
   * 
   * @param view - DataView for binary STL data
   * @returns Float32Array of vertex coordinates
   */
  const parseBinarySTL = (view: DataView) => {
    const triangles = view.getUint32(80, true);
    const vertices: number[] = [];
    
    let offset = 84;
    for (let i = 0; i < triangles; i++) {
      // Skip normal vector (12 bytes) - not needed for point cloud generation
      offset += 12;
      
      // Extract 3 vertices (9 float32 values)
      for (let j = 0; j < 9; j++) {
        vertices.push(view.getFloat32(offset, true));
        offset += 4;
      }
      
      // Skip attribute byte count (2 bytes)
      offset += 2;
    }
    
    return new Float32Array(vertices);
  };

  /**
   * Shape Boundary Analysis and Hollow Region Definition
   * 
   * ALGORITHM STAGE 1: Geometric Analysis and Boundary Definition
   * 
   * This function performs comprehensive geometric analysis of the input mesh
   * to establish surface boundaries and define hollow interior regions for
   * point cloud generation. The algorithm computes:
   * 
   * 1. Face area distribution for weighted sampling
   * 2. Bounding box calculation for spatial normalization
   * 3. Geometric center determination for hollow region placement
   * 4. Hollow radius calculation based on model dimensions
   * 
   * @param vertices - Float32Array containing triangle vertex data
   * @returns Comprehensive shape boundary data structure
   */
  const defineShapeBoundary = (vertices: Float32Array) => {
    // Triangle face collection and area computation
    const faces: THREE.Vector3[][] = [];
    const faceAreas: number[] = [];
    
    for (let i = 0; i < vertices.length; i += 9) {
      const v1 = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
      const v2 = new THREE.Vector3(vertices[i + 3], vertices[i + 4], vertices[i + 5]);
      const v3 = new THREE.Vector3(vertices[i + 6], vertices[i + 7], vertices[i + 8]);
      
      faces.push([v1, v2, v3]);
      
      // Surface area calculation using cross product for weighted sampling
      const edge1 = new THREE.Vector3().subVectors(v2, v1);
      const edge2 = new THREE.Vector3().subVectors(v3, v1);
      const area = edge1.cross(edge2).length() * 0.5;
      faceAreas.push(area);
    }
    
    // Total surface area calculation for density normalization
    const totalArea = faceAreas.reduce((sum, area) => sum + area, 0);
    
    // Axis-aligned bounding box computation
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    
    faces.forEach(([v1, v2, v3]) => {
      [v1, v2, v3].forEach(v => {
        minX = Math.min(minX, v.x); maxX = Math.max(maxX, v.x);
        minY = Math.min(minY, v.y); maxY = Math.max(maxY, v.y);
        minZ = Math.min(minZ, v.z); maxZ = Math.max(maxZ, v.z);
      });
    });
    
    const boundingBox = {
      min: new THREE.Vector3(minX, minY, minZ),
      max: new THREE.Vector3(maxX, maxY, maxZ),
      size: new THREE.Vector3(maxX - minX, maxY - minY, maxZ - minZ)
    };
    
    // Geometric center calculation and hollow region parameters
    const objectCenter = new THREE.Vector3(
      (minX + maxX) * 0.5,
      (minY + maxY) * 0.5,
      (minZ + maxZ) * 0.5
    );
    
    const objectSize = Math.max(maxX - minX, maxY - minY, maxZ - minZ);
    const hollowRadius = objectSize * 0.2; // 20% hollow factor for interior void
    
    console.log(`Boundary Analysis Complete: ${faces.length} faces, hollow radius: ${hollowRadius.toFixed(3)}`);
    
    return {
      faces,
      faceAreas,
      totalArea,
      boundingBox,
      objectCenter,
      hollowRadius
    };
  };

  /**
   * Intelligent Point Cloud Generation with Spatial Optimization
   * 
   * ALGORITHM STAGE 2: Point Distribution and Spatial Optimization
   * 
   * This function implements an advanced point distribution algorithm that:
   * 
   * 1. Calculates optimal point spacing based on surface area density
   * 2. Uses spatial hashing for O(1) collision detection
   * 3. Applies systematic grid sampling on triangle surfaces
   * 4. Enforces minimum distance constraints for uniform distribution
   * 5. Implements hollow region filtering for interior void effect
   * 6. Generates height-based color gradients for visual enhancement
   * 
   * @param shapeBoundary - Geometric analysis data from defineShapeBoundary
   * @param targetPointCount - Desired number of points in final point cloud
   * @returns Object containing point positions and color data
   */
  const generatePointsInShape = (shapeBoundary: ReturnType<typeof defineShapeBoundary>, targetPointCount: number) => {
    const { faces, faceAreas, totalArea, boundingBox, objectCenter, hollowRadius } = shapeBoundary;
    
    const points: number[] = [];
    const colors: number[] = [];
    
    // Adaptive spacing calculation based on surface area distribution
    const avgSpacing = Math.sqrt(totalArea / targetPointCount) * 0.8; // 20% tighter packing factor
    const minDistance = avgSpacing * 0.7; // Minimum inter-point distance constraint
    
    // Spatial hash table for efficient O(1) distance queries
    const cellSize = minDistance;
    const spatialHash = new Map<string, THREE.Vector3[]>();
    
    /**
     * Generates spatial hash key for 3D point coordinates
     * @param point - 3D point coordinate
     * @returns String hash key for spatial grid cell
     */
    const getHashKey = (point: THREE.Vector3): string => {
      const x = Math.floor(point.x / cellSize);
      const y = Math.floor(point.y / cellSize);
      const z = Math.floor(point.z / cellSize);
      return `${x},${y},${z}`;
    };
    
    /**
     * Adds point to spatial hash for collision detection
     * @param point - 3D point to add to spatial hash
     */
    const addToSpatialHash = (point: THREE.Vector3) => {
      const key = getHashKey(point);
      if (!spatialHash.has(key)) {
        spatialHash.set(key, []);
      }
      spatialHash.get(key)!.push(point);
    };
    
    /**
     * Validates minimum distance constraint using spatial hash lookup
     * @param newPoint - Candidate point for distance validation
     * @returns Boolean indicating if point satisfies distance constraints
     */
    const isValidDistance = (newPoint: THREE.Vector3): boolean => {
      const key = getHashKey(newPoint);
      
      // Check 3x3x3 neighborhood of spatial hash cells
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dz = -1; dz <= 1; dz++) {
            const x = Math.floor(newPoint.x / cellSize) + dx;
            const y = Math.floor(newPoint.y / cellSize) + dy;
            const z = Math.floor(newPoint.z / cellSize) + dz;
            const neighborKey = `${x},${y},${z}`;
            
            const neighbors = spatialHash.get(neighborKey);
            if (neighbors) {
              for (const neighbor of neighbors) {
                if (newPoint.distanceTo(neighbor) < minDistance) {
                  return false;
                }
              }
            }
          }
        }
      }
      return true;
    };
    
    /**
     * Validates point placement within hollow region constraints
     * @param point - 3D point to validate
     * @returns Boolean indicating if point is outside hollow interior
     */
    const isPointInValidRegion = (point: THREE.Vector3): boolean => {
      // Enforce hollow interior by excluding points within radius from center
      const distanceFromCenter = point.distanceTo(objectCenter);
      return distanceFromCenter > hollowRadius;
    };
    
    // Systematic surface sampling with area-weighted distribution
    const candidatePoints: Array<{point: THREE.Vector3, faceIndex: number}> = [];
    
    faces.forEach((face, faceIndex) => {
      const [v1, v2, v3] = face;
      const area = faceAreas[faceIndex];
      
      // Area-proportional sample density calculation
      const faceSamples = Math.max(1, Math.floor((area / totalArea) * targetPointCount * 3)); // 3x oversampling
      
      // Grid-based systematic sampling on triangle surface
      const samplesPerEdge = Math.ceil(Math.sqrt(faceSamples));
      
      for (let i = 0; i <= samplesPerEdge; i++) {
        for (let j = 0; j <= samplesPerEdge - i; j++) {
          if (candidatePoints.length >= targetPointCount * 5) break; // Prevent excessive candidates
          
          const u = i / samplesPerEdge;
          const v = j / samplesPerEdge;
          const w = 1 - u - v;
          
          if (w >= 0) { // Valid barycentric coordinate constraint
            // Barycentric interpolation for surface point generation
            const point = new THREE.Vector3()
              .addScaledVector(v1, u)
              .addScaledVector(v2, v)
              .addScaledVector(v3, w);
            
            candidatePoints.push({point, faceIndex});
          }
        }
      }
    });
    
    // Randomize candidate order for improved spatial distribution
    for (let i = candidatePoints.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidatePoints[i], candidatePoints[j]] = [candidatePoints[j], candidatePoints[i]];
    }
    
    // Multi-constraint point selection process
    const selectedPoints: THREE.Vector3[] = [];
    
    for (const candidate of candidatePoints) {
      if (selectedPoints.length >= targetPointCount) break;
      
      // Apply dual constraints: hollow region validation and spatial distribution
      if (isPointInValidRegion(candidate.point) && isValidDistance(candidate.point)) {
        selectedPoints.push(candidate.point);
        addToSpatialHash(candidate.point);
        
        // Add validated point to output arrays
        points.push(candidate.point.x, candidate.point.y, candidate.point.z);
        
        // Height-based color gradient generation with positional variation
        const heightFactor = (candidate.point.y - boundingBox.min.y) / boundingBox.size.y;
        const baseIntensity = 0.6 + heightFactor * 0.4;
        
        // Sinusoidal variation for natural appearance
        const positionVariation = (Math.sin(candidate.point.x * 10) + Math.cos(candidate.point.z * 10)) * 0.1;
        const intensity = Math.max(0.3, Math.min(1.0, baseIntensity + positionVariation));
        
        // RGB color mapping with blue-dominant palette
        const r = intensity * 0.9;
        const g = intensity * 1.0;
        const b = intensity * 1.2;
        
        colors.push(r, g, b);
      }
    }
    
    console.log(`Point Generation Complete: ${selectedPoints.length} points generated from ${targetPointCount} target`);
    
    return { points: new Float32Array(points), colors: new Float32Array(colors) };
  };

  /**
   * Primary Point Cloud Generation Pipeline
   * 
   * Orchestrates the two-stage point cloud generation algorithm by sequentially
   * executing geometric analysis and point distribution phases.
   * 
   * @param vertices - Triangle vertex data from STL parsing
   * @param targetPointCount - Target number of points for output cloud
   * @returns Complete point cloud data with positions and colors
   */
  const createSparsePointCloud = (vertices: Float32Array, targetPointCount: number) => {
    console.log('Stage 1: Executing geometric boundary analysis with hollow region definition...');
    const shapeBoundary = defineShapeBoundary(vertices);
    
    console.log('Stage 2: Generating optimized point distribution within defined constraints...');
    const pointCloudData = generatePointsInShape(shapeBoundary, targetPointCount);
    
    return pointCloudData;
  };

  /**
   * Three.js Scene Initialization
   * 
   * Configures the 3D rendering environment with optimized settings for
   * point cloud visualization including camera, renderer, and scene setup.
   * 
   * @returns Initialized Three.js scene components
   */
  const initScene = () => {
    if (!mountRef.current) return;

    // Scene configuration with dark background for optimal point cloud contrast
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a); // Near-black background for visual clarity
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    
    camera.position.set(0, 0, 5);
    
    sceneRef.current = scene;
    rendererRef.current = renderer;
    
    return { scene, camera, renderer };
  };

  /**
   * STL Model Loading and Point Cloud Generation
   * 
   * Asynchronously loads STL model data, processes it through the point cloud
   * generation pipeline, and creates the final Three.js point cloud object
   * with optimized material properties and geometric transformations.
   */
  const loadSTL = async () => {
    try {
      // Clean up any existing point cloud objects
      if (pointsRef.current && sceneRef.current) {
        sceneRef.current.remove(pointsRef.current);
        pointsRef.current.geometry.dispose();
        if (pointsRef.current.material instanceof THREE.Material) {
          pointsRef.current.material.dispose();
        }
        pointsRef.current = null;
      }

      const response = await fetch('/hero.stl');
      if (!response.ok) return;
      
      const buffer = await response.arrayBuffer();
      const vertices = parseSTL(buffer);
      
      // Execute point cloud generation pipeline
      const { points: pointCloudData, colors } = createSparsePointCloud(vertices, POINT_COUNT);
      
      // Three.js geometry construction with position and color attributes
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(pointCloudData, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      // Geometric normalization: centering and scaling
      geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      geometry.boundingBox!.getCenter(center);
      geometry.translate(-center.x, -center.y, -center.z);
      
      const size = geometry.boundingBox!.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 3 / maxDim;
      geometry.scale(scale, scale, scale);
      
      // Point cloud material with optimized rendering properties
      const material = new THREE.PointsMaterial({
        size: POINT_SIZE,
        vertexColors: true,      // Enable per-vertex color attributes
        sizeAttenuation: true,   // Size based on camera distance
        transparent: false,
        opacity: 1.0
      });
      
      const points = new THREE.Points(geometry, material);
      sceneRef.current?.add(points);
      pointsRef.current = points;
      
    } catch (err) {
      console.error('STL Loading Error:', err);
    }
  };

  /**
   * Animation Loop Management
   * 
   * Implements smooth rotation animation for the point cloud with
   * optimized frame rate and rendering performance.
   * 
   * @param camera - Three.js camera object
   * @param renderer - Three.js WebGL renderer
   */
  const animate = (camera: THREE.Camera, renderer: THREE.WebGLRenderer) => {
    const tick = () => {
      if (pointsRef.current) {
        // Smooth rotation with differential angular velocities for visual interest
        pointsRef.current.rotation.x += 0.003;
        pointsRef.current.rotation.y += 0.005;
      }
      
      renderer.render(sceneRef.current!, camera);
      frameRef.current = requestAnimationFrame(tick);
    };
    tick();
  };

  /**
   * Responsive Window Resize Handler
   * 
   * Maintains proper aspect ratio and rendering quality during
   * window size changes by updating camera and renderer parameters.
   */
  const handleResize = () => {
    if (!rendererRef.current || !sceneRef.current) return;
    
    const camera = sceneRef.current.children.find(child => child instanceof THREE.PerspectiveCamera) as THREE.PerspectiveCamera;
    if (camera) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }
    
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
  };

  // React lifecycle management with comprehensive cleanup
  useEffect(() => {
    if (!initializedRef.current) {
      // Cleanup any pre-existing scene objects
      if (sceneRef.current) {
        while (sceneRef.current.children.length > 0) {
          const child = sceneRef.current.children[0];
          if (child instanceof THREE.Points) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            }
          }
          sceneRef.current.remove(child);
        }
      }
      
      // Cleanup existing renderer resources
      if (rendererRef.current && mountRef.current) {
        try {
          mountRef.current.removeChild(rendererRef.current.domElement);
        } catch (e) {
          // DOM element may already be detached
        }
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
      
      const sceneData = initScene();
      if (sceneData) {
        loadSTL();
        animate(sceneData.camera, sceneData.renderer);
        
        window.addEventListener('resize', handleResize);
        
        initializedRef.current = true;
        
        return () => {
          window.removeEventListener('resize', handleResize);
          if (frameRef.current) {
            cancelAnimationFrame(frameRef.current);
          }
          
          // Comprehensive Three.js resource cleanup
          if (pointsRef.current) {
            if (sceneRef.current) {
              sceneRef.current.remove(pointsRef.current);
            }
            pointsRef.current.geometry.dispose();
            if (pointsRef.current.material instanceof THREE.Material) {
              pointsRef.current.material.dispose();
            }
            pointsRef.current = null;
          }
          
          if (sceneRef.current) {
            // Remove all scene objects to prevent memory leaks
            while (sceneRef.current.children.length > 0) {
              sceneRef.current.remove(sceneRef.current.children[0]);
            }
            sceneRef.current = null;
          }
          
          if (mountRef.current && rendererRef.current) {
            try {
              mountRef.current.removeChild(rendererRef.current.domElement);
            } catch (e) {
              // Element may already be removed from DOM
            }
          }
          rendererRef.current?.dispose();
          rendererRef.current = null;
          initializedRef.current = false;
        };
      }
    }
  }, []);

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Three.js Scene Container */}
      <div ref={mountRef} className="absolute inset-0" />
      
      {/* Text overlay with enhanced typography */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <p className="text-white text-lg" style={{ fontFamily: 'PPSupplyMono, monospace' }}>Gil Lu ... Be back soon</p>
      </div>
    </div>
  );
};

export default STLPointCloudHero;