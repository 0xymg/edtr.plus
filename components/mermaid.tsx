import React, { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
})

interface MermaidProps {
  chart: string
}

export const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && chart) {
      const isDark = document.documentElement.classList.contains('dark')
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? 'dark' : 'default',
        securityLevel: 'loose',
      })

      // Use a unique ID for each chart
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
      
      try {
        mermaid.render(id, chart).then(({ svg }) => {
            if (ref.current) {
                ref.current.innerHTML = svg
            }
        })
      } catch (err) {
        console.error('Mermaid render error:', err)
      }
    }
  }, [chart])

  return <div key={chart} ref={ref} className="mermaid flex justify-center py-4 my-4" />
}
