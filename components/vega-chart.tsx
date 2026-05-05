"use client"

import React, { useMemo } from "react"
import { VegaEmbed } from "react-vega"

interface VegaChartProps {
    specString: string
}

export const VegaChart: React.FC<VegaChartProps> = ({ specString }) => {
    const spec = useMemo(() => {
        try {
            return JSON.parse(specString)
        } catch (e) {
            console.error("Invalid Vega-Lite JSON:", e)
            return null
        }
    }, [specString])

    if (!spec) {
        return (
            <div className="my-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                Invalid Vega-Lite specification. Please ensure it is valid JSON.
            </div>
        )
    }

    return (
        <div className="vega-chart-container my-4 overflow-x-auto rounded-lg bg-white p-4 shadow-sm ring-1 ring-neutral-200/50 flex justify-center">
            <VegaEmbed spec={spec} options={{ actions: false }} />
        </div>
    )
}
