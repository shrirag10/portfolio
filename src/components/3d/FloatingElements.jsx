'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Icosahedron, Octahedron, Torus } from '@react-three/drei'
import * as THREE from 'three'

function FloatingShape({ position, geometry, color, speed = 1, rotationSpeed = 0.5 }) {
    const meshRef = useRef()

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.001 * rotationSpeed
            meshRef.current.rotation.y += 0.002 * rotationSpeed
        }
    })

    const material = useMemo(() => new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        metalness: 0.3,
        roughness: 0.7,
        transparent: true,
        opacity: 0.6,
    }), [color])

    return (
        <Float
            speed={speed}
            rotationIntensity={0.5}
            floatIntensity={1}
            floatingRange={[-0.5, 0.5]}
        >
            <mesh ref={meshRef} position={position} material={material}>
                {geometry}
            </mesh>
        </Float>
    )
}

export default function FloatingElements() {
    const shapes = useMemo(() => [
        // Left side shapes
        {
            position: [-8, 3, -5],
            geometry: <icosahedronGeometry args={[0.8, 0]} />,
            color: '#3b82f6',
            speed: 1.5,
            rotationSpeed: 0.3
        },
        {
            position: [-6, -2, -8],
            geometry: <octahedronGeometry args={[0.6, 0]} />,
            color: '#8b5cf6',
            speed: 2,
            rotationSpeed: 0.5
        },
        {
            position: [-4, 4, -10],
            geometry: <torusGeometry args={[0.5, 0.2, 16, 32]} />,
            color: '#60a5fa',
            speed: 1,
            rotationSpeed: 0.4
        },

        // Right side shapes
        {
            position: [7, 2, -6],
            geometry: <dodecahedronGeometry args={[0.7, 0]} />,
            color: '#a78bfa',
            speed: 1.8,
            rotationSpeed: 0.6
        },
        {
            position: [5, -3, -9],
            geometry: <icosahedronGeometry args={[0.5, 0]} />,
            color: '#3b82f6',
            speed: 1.2,
            rotationSpeed: 0.3
        },
        {
            position: [8, 4, -12],
            geometry: <octahedronGeometry args={[0.4, 0]} />,
            color: '#60a5fa',
            speed: 2.5,
            rotationSpeed: 0.7
        },

        // Center background shapes (further back)
        {
            position: [0, 5, -15],
            geometry: <torusGeometry args={[0.8, 0.3, 16, 32]} />,
            color: '#8b5cf6',
            speed: 0.8,
            rotationSpeed: 0.2
        },
        {
            position: [2, -4, -14],
            geometry: <dodecahedronGeometry args={[0.5, 0]} />,
            color: '#a78bfa',
            speed: 1.5,
            rotationSpeed: 0.4
        },
    ], [])

    return (
        <group>
            {shapes.map((shape, index) => (
                <FloatingShape
                    key={index}
                    position={shape.position}
                    geometry={shape.geometry}
                    color={shape.color}
                    speed={shape.speed}
                    rotationSpeed={shape.rotationSpeed}
                />
            ))}
        </group>
    )
}
