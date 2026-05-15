# GenSync CRM - Code Repository Guide

## Overview
GenSync CRM is a spreadsheet-based CRM application. The source code is stored in GitHub.

## Repository Locations

### Main Application Code
**Repository:** `spunkykiller/gensync-crm`  
**URL:** https://github.com/spunkykiller/gensync-crm  
**Clone URL:** https://github.com/spunkykiller/gensync-crm.git

### Website (Frontend/Hosting)
**Repository:** `spunkykiller/gensync-website`  
**URL:** https://github.com/spunkykiller/gensync-website  
**Website URL:** https://www.gensync.in  
**Admin Password:** 12

## Code Structure (gensync-crm)

```
GenSync CRM/
├── index.html          # Main HTML entry point
├── app.js            # Main application JavaScript
├── server.js         # Express server
├── data.js          # Data management
├── sheets.js        # Spreadsheet utilities
├── style.css       # Styles
├── seed-sheets.cjs  # Seed data for testing
├── vite.config.js   # Vite configuration
├── package.json   # Dependencies
├── docs/
│   └── SETUP.md   # Setup guide
└── screenshots/    # UI screenshots
```

## Deployment

### Development
```bash
npm install
npm run dev      # Start Vite dev server
npm run server   # Start Express server
```

### Production
```bash
npm run build    # Build for production
npm run preview  # Preview production build
```

## Git Commands

### Clone the repository
```bash
git clone https://github.com/spunkykiller/gensync-crm.git
cd gensync-crm
npm install
```

### Push changes
```bash
git add .
git commit -m "Your message"
git push origin main
```

## Related Repositories

- **gensync-website**: Frontend hosting at https://www.gensync.in
- **gensync-crm**: CRM application (this repo)

## Account
- **GitHub User:** spunkykiller
- **Email for commits:** spunkykiller@users.noreply.github.com