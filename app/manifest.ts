import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'EDTR',
        short_name: 'EDTR',
        description: 'An online Notepad++ for quick notes.',
        start_url: '/',
        id: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'any',
        background_color: '#ffffff',
        theme_color: '#000000',
        file_handlers: [
            {
                action: '/',
                accept: {
                    'text/plain': ['.txt'],
                    'text/javascript': ['.js', '.jsx', '.mjs'],
                    'text/typescript': ['.ts', '.tsx'],
                    'text/x-python': ['.py'],
                    'text/css': ['.css'],
                    'text/html': ['.html', '.htm'],
                    'application/json': ['.json'],
                    'text/markdown': ['.md'],
                    'text/x-sh': ['.sh'],
                    'text/x-sql': ['.sql'],
                    'text/x-java-source': ['.java'],
                    'text/x-c': ['.c'],
                    'text/x-c++src': ['.cpp'],
                    'text/x-csharp': ['.cs'],
                    'text/x-go': ['.go'],
                    'text/x-rust': ['.rs'],
                    'text/x-php': ['.php'],
                    'text/x-ruby': ['.rb'],
                    'text/x-swift': ['.swift'],
                    'text/x-kotlin': ['.kt'],
                    'text/yaml': ['.yaml', '.yml'],
                    'text/xml': ['.xml'],
                },
            },
        ],
        icons: [
            {
                src: '/icon-light-32x32.png',
                sizes: '32x32',
                type: 'image/png',
            },
            {
                src: '/apple-icon.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/apple-icon.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/icon.svg',
                sizes: 'any',
                type: 'image/svg+xml',
                purpose: 'any',
            },
        ],
    }
}
