# PDF Editor Project

A modern web-based PDF editor with responsive design supporting mobile and desktop views.

## Features
- **Rotate Pages**: Rotate PDF pages left or right
- **Reorder Pages**: Move pages to different positions
- **Delete Pages**: Remove single or multiple pages
- **Add Watermarks**: Add customizable text watermarks with different styles
- **Merge PDFs**: Combine multiple PDF files into one
- **Responsive Design**: Works seamlessly on mobile and desktop devices

## Dependencies
- Angular 12
- [ng-Zorro](https://github.com/NG-ZORRO/ng-zorro-antd) - UI Framework 
- [TailWind CSS](https://tailwindcss.com/) - Functional CSS Library
- [PDF-LIB](https://pdf-lib.js.org/) - PDF manipulation library
- [ngx-extended-pdf-viewer](https://www.npmjs.com/package/ngx-extended-pdf-viewer) - PDF Viewer
- [NGXS](https://www.ngxs.io/) - State management

## Development

### Prerequisites
- Node.js 14.x or 16.x
- npm 6.x or higher

### Installation
```bash
npm install
```

### Running locally
```bash
npm start
```
The application will be available at `http://localhost:4200`

### Building for production
```bash
npm run build:prod
```

## Deployment

### Cloudflare Pages

This project is configured for Cloudflare Pages deployment.

#### Build Configuration
- **Build command**: 
  - Windows: `npm run build:cf`
  - Linux/Mac (Cloudflare Pages): `export NODE_OPTIONS=--openssl-legacy-provider && npm run build -- --configuration production`
- **Build output directory**: `dist`
- **Node Version**: 16 (or lower for compatibility)

**Note for Cloudflare Pages**: Since Cloudflare Pages uses Linux, the build command should use `export` instead of `set`.

#### Deployment Steps

1. **Connect to Cloudflare Pages**:
   - Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/pages)
   - Click "Create a project"
   - Connect your GitHub repository

2. **Build Settings**:
   - Framework preset: None (or Angular)
   - Build command: `npm run build:cf`
   - Build output directory: `dist`

3. **Environment Variables** (if needed):
   - `NODE_VERSION`: `16`

4. **Deploy**:
   - Cloudflare Pages will automatically deploy on every push to your main branch

#### Important Files
- `wrangler.toml` - Cloudflare Pages configuration
- `src/_redirects` - SPA routing configuration for Cloudflare Pages

### SPA Routing
The `_redirects` file ensures that client-side routing works correctly on Cloudflare Pages by redirecting all routes to `index.html`.

## Demo
<img src="https://raw.githubusercontent.com/dylansalim3/pdf-editor-web/master/demo/demo.jpg" alt="Demo Picture"/>

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License
MIT
