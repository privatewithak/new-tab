/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';


export default defineConfig({
  plugins: [react({
    babel: {
      plugins: [['babel-plugin-react-compiler']]
    }
  }), tailwindcss(), viteStaticCopy({
      targets: [
        {
          src: 'manifest.json',
          dest: '.'
        }
      ]
    })],


});