# Webpack Template

A webpack 5 starter template with split development/production configurations, testing, linting, and formatting.

## Features

- Separate webpack configurations for development and production
- Development server with live reloading and source maps
- Production builds with CSS extraction and content hashing
- Jest testing with JSDOM environment
- Babel transpilation via @babel/preset-env
- ESLint 9 with flat configuration format
- Prettier code formatting
- Image asset handling (png, svg, jpg, jpeg, gif)
- CSS with modern-normalize baseline
- GitHub Pages deployment

## Project Structure

```
├── src/
│   ├── index.js
│   ├── template.html
│   └── styles/
│       └── styles.css
├── webpack.common.js
├── webpack.dev.js
├── webpack.prod.js
├── eslint.config.mjs
├── babel.config.js
├── jest.config.js
└── package.json
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at localhost:8080 |
| `npm run build` | Create production build in `dist/` |
| `npm run test` | Run Jest test suite |
| `npm run format` | Format code with Prettier |
| `npm run deploy` | Build and deploy to GitHub Pages |

## Configuration Details

**Development**
- CSS injected via style-loader for fast refresh
- Inline source maps for debugging
- HTML template file watching

**Production**
- CSS extracted to separate files with content hashing
- Output directory cleaned on each build
- Automatic HTML asset injection

## Usage

1. Clone or download this template
2. Run `npm install`
3. Run `npm run dev` to start developing
4. Run `npm run build` when ready for production

## License

ISC