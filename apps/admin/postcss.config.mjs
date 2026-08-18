// postcss.config.mjs — ES Module format.
//
// WHY THIS MATTERS:
// The previous postcss.config.js used CommonJS (module.exports) while
// tailwind.config.ts is a TypeScript/ES Module file. In webpack's PostCSS
// workers, the CJS postcss config would resolve "tailwindcss" correctly
// BUT could intermittently fail to load tailwind.config.ts in a new worker
// process (no ts-node/jiti context). By using .mjs and pointing to the
// config explicitly, we guarantee deterministic CSS generation.

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
