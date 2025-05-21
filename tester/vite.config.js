import dynamicImport from 'vite-plugin-dynamic-import'
import vitePluginString from 'vite-plugin-string'

export default {
  plugins: [
    dynamicImport(),
    vitePluginString({
      include: '**/flags-optimized/*.svg',
    }),
  ],
}
