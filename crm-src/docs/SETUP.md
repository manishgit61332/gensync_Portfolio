# GenSync CRM - Google Sheets Setup

## Environment

This project uses Google Sheets API to sync tasks. The credentials are stored directly in the code files for simplicity.

### Service Account
- **Email**: crea99@crea-488211.iam.gserviceaccount.com
- **Private Key**: Embedded in source files

### Spreadsheet
- **URL**: https://docs.google.com/spreadsheets/d/1piT_xHY4LBwb2LrdHmg2ZCDXjyUZ23tCb_-h8TAMvUU

## Sheets (Tabs) Used by CRM
- **MOHIT** - Mohit's tasks
- **MANISH** - Manish's tasks  
- **Manas** - Manas's tasks

## Column Format (All Sheets)
| Column | Header | Width |
|--------|--------|-------|
| A | Task | 280px |
| B | Priority | 60px |
| C | Status | 90px |
| D | Due Date | 80px |
| E | Notes | 200px |
| F | ID | 90px |

## Priority Codes
- **P0** - Critical (highest)
- **P1** - High
- **P2** - Medium
- **P3** - Low

## Status Values
- Not Started
- In Progress
- Done

## Running Scripts

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Opens at http://localhost:5176

### Apply Formatting to Sheets
```bash
node seed-sheets.cjs
```

### Apply Borders to All Sheets
```bash
node apply-borders.cjs
```

### Apply Row Height (29px)
```bash
node apply-row-height.cjs
```

## Key Files
- `seed-sheets.cjs` - Populates sheets with tasks
- `apply-borders.cjs` - Adds borders to all cells
- `apply-row-height.cjs` - Sets row height
- `data.js` - Google Sheets API integration
- `app.js` - CRM application logic
- `style.css` - UI styling

## Notes
- Service account credentials are embedded in the code for convenience
- All formatting (borders, row height) must be applied programmatically
- The CRM syncs bidirectionally with Google Sheets