"use client"

import React, { useEffect, useRef } from "react"
import abcjs from "abcjs"

interface AbcNotationProps {
    notation: string
}

export const AbcNotation: React.FC<AbcNotationProps> = ({ notation }) => {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (containerRef.current && notation) {
            try {
                abcjs.renderAbc(containerRef.current, notation, {
                    responsive: "resize",
                    staffwidth: 740,
                    paddingbottom: 15,
                    paddingtop: 15,
                    paddingright: 15,
                    paddingleft: 15,
                })
            } catch (error) {
                console.error("Error rendering ABC notation:", error)
            }
        }
    }, [notation])

    return (
        <div 
            className="abc-notation-container my-4 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-neutral-200/50"
            ref={containerRef}
        />
    )
}
