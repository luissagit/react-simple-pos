import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      plugins: [react()],
      define: {
        global: {},
        'process.env': {},
      },
      resolve: {
        alias: {
          '@jshop/pages': path.resolve(__dirname, './src/pages'),
          '@jshop/core': path.resolve(__dirname, './src/core'),
          '@jshop': path.resolve(__dirname, './src/'),
        },
      },
    };
  }
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@jshop/pages': path.resolve(__dirname, './src/pages'),
        '@jshop/core': path.resolve(__dirname, './src/core'),
        '@jshop': path.resolve(__dirname, './src/'),
      },
    },
  };
});
