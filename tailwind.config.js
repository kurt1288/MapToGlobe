module.exports = {
    purge: [
      './src/**/*.html',
      './src/**/*.vue',
      './src/**/*.jsx',
    ],
    theme: {},
    variants: {
      opacity: ['responsive', 'hover', 'focus', 'disabled'],
    },
    plugins: [
      require('@tailwindcss/ui'),
    ]
  }