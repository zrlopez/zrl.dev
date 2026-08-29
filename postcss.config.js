export default {
  plugins: {
    autoprefixer: {},
    '@csstools/postcss-global-data': {
      files: ['app/global.module.css'],
    },
    'postcss-custom-media': {},
  },
}
