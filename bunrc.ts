import dts from 'bun-plugin-dts'
import fastglob from 'fast-glob'

await Bun.build({
  format: 'esm',
  minify: true,
  splitting: true,
  target: 'node',
  outdir: './dist',
  plugins: [dts()],
  naming: '[dir]/[name].[ext]',
  entrypoints: fastglob.sync(['src/index.ts']),
})
