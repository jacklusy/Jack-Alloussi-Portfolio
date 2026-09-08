import { defineConfig, type Plugin } from 'vitest/config';
import path from 'node:path';

/**
 * Next's build turns `import img from './shot.png'` into a `StaticImageData`
 * object; plain Vite turns it into a URL string. The content schemas validate
 * the Next shape at import time, so the test run has to produce it too —
 * otherwise `projects` fails to parse here while building fine.
 *
 * The dimensions are a stub: the schema only requires numbers, and the real
 * ones come from the image itself at build time.
 */
function staticImageImports(): Plugin {
  return {
    name: 'static-image-imports',
    enforce: 'pre',
    load(id) {
      const file = id.split('?')[0] ?? '';
      if (!/\.(png|jpe?g|webp|avif|gif|svg)$/i.test(file)) return null;
      const data = { src: `/${path.basename(file)}`, width: 1200, height: 675 };
      return `export default ${JSON.stringify(data)};`;
    },
  };
}

export default defineConfig({
  plugins: [staticImageImports()],
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.{test,spec}.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
