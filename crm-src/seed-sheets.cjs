const { JWT } = require('google-auth-library');
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');

const SPREADSHEET_ID = '1piT_xHY4LBwb2LrdHmg2ZCDXjyUZ23tCb_-h8TAMvUU';

const SERVICE_ACCOUNT = {
  private_key: `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCyeaurNNmnvn1o
chlVmhkIxIeIzLzTosI6JStL/ZM/tbXhvaLn3EnO4qPzSmH+HoHFzBBJZKWU8Um0
lRwpp6vbDr3xc0lpAqDRXBNLnuqP+BXiMUM+3/SSrcDNXz5eUVykgt/3ycApP1x5
81luv6EPZyDGCn6eFeU5Q5X05mPPrOJEEHE/zEh0CoVzieiLISfyeqCpIEqK+Tnn
QPx5KxnEJpfuvjyWTdLRn4yM4KJ9lj5wYRzzWCs4UB2IfUBPB/qHS3gzN863sU/u
X/zuFu+bCl2+yCM5nvJpvvvmTf/1EdQPzfMYUORLDrjoraF4xMPH7RWz0exV5u86
BJW/SVnHAgMBAAECggEATobpSSGuWLegTynQytDMDgcGyWKn/Ihi5BmBlORj+wa1
GbeKK3FKCly/HWdPeXOrzr9MNTazAjcuImXvJ8bN/0rbuRZsKOeOob9dAAtSknjq
DAV33HzGjBkmOVacRvyOghXRfKGIyr1Fr6SqZ2eqcnACRBDPCDiDDHCX1NLf/LoM
+JZtsAggTOlNpaOtWV8+xdxbBecapdL2Ew3QgMrjYMndgJ4eDbWJ3qNV6Fbsavz5
ptGyuiIm+y6nLCpyLnTnoUBsxLly+bnMoVBifDAGQ4u+O6FE/qCIG4hqHQbjJPNO
BHXoBg45V35Jg5gUoROBJ5Y/oAoJK/1kCOu/AVjJ4QKBgQDdNLzaet33HAcRrCh8
DZ4+m1AqU0wf5DDBCi2nVBNsFYKuSaX1qdeqWVVMzBGr0j8T59MAskgQ5D6+24Hr
3shYWwQdnvtKy5JrXbMj3V4PSmik8/aabpXL8RXKiRrqMYIBiuuKBce+0XSsV/98
NHpCXHPReKViWO+SOLC53eZrJwKBgQDOjE1gWizfjOcmGy98Rls2ZChYjCbcGsE1
+z+KMbD2qozBpBqXuTDLQ2FN/ehw42j8xPmt+Utu4idbezO6dK/Qfydje3gsYBhk
GaqLvgGa06AxPrKmvCJF1QSacaZfW+zxgndCGl5J/PIEIdV1ppYifLTm+YLiUInK
nlBUoOdAYQKBgQCE+QLdwyZTOYH2Wassh3Ms52hVSSVltmKoaFnxUFUsj/Gym4ss
FiESwgjI1ZN52jUY3i61KHax0ML3MDT1eUKt+miK9drRp3YpHHZnhNbaEjy9i/od
84QQyKf0zF5lkcU48C2PFtJwHrEoOO3X2CP2aGUm8oNYj2XUXEfAM2gj2QKBgCh4
Uxzi7lHrAMt1nitCedLBcypOY7rSvzK9hOil7d+W8Tdr2Q4LaiUZkbI/YtDjrgmA
6s8Mvpv+UenZzPvmqyA2GdijM5u2RHEwmjsBQr08Y/HiMAz9ZdW69Ejypb+femCj
yIw6MGlc12q52mJP/rDJMITlNKD1WNpLhL/gOw9hAoGBAKMoI6JmXePjEyfcF2Rb
L5ZBO2LwJ/0IJk+EFZSmaLvkp4e+aEwtqff9ocgQjY7A9ota5BNgkaLYRMQRKQop
F8WK1aBF57HkqlbhN21YKe0sSUO0b+knX4qGQ9mJl1z6ls75cmmY83ykIi3Gmwm0
+kBxvPDBeCkip0A7G0a4tx88
-----END PRIVATE KEY-----`,
  client_email: 'crea99@crea-488211.iam.gserviceaccount.com'
};

class SheetsJWT extends JWT {
  async getAccessToken() {
    const now = Math.floor(Date.now() / 1000);
    const payload = { iss: this.email, sub: this.email, scope: 'https://www.googleapis.com/auth/spreadsheets', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 };
    const signed = jwt.sign(payload, this.key, { algorithm: 'RS256', header: { typ: 'JWT', alg: 'RS256' } });
    const response = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: signed }) });
    const data = await response.json();
    if (data.error) throw new Error(data.error_description || data.error);
    return { access_token: data.access_token, res: null };
  }
}

const jwtClient = new SheetsJWT({ email: SERVICE_ACCOUNT.client_email, key: SERVICE_ACCOUNT.private_key, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
const sheets = google.sheets({ version: 'v4', auth: jwtClient });

function generateTaskId(prefix) {
  const timestamp = Date.now().toString(36).slice(-4);
  const random = Math.random().toString(36).slice(2, 5);
  return `${prefix}-${timestamp}${random}`.toUpperCase();
}

const today = 'Apr 24';

const mohitTasks = [
  { name: 'LinkedIn Outreach', priority: 'P1', status: 'In Progress', notes: 'Pivot to LinkedIn DMs for company outreach' },
  { name: 'Tender X Hackathon Demo', priority: 'P1', status: 'In Progress', notes: 'Complete demo build - Deadline April 20' },
  { name: 'Deploy TenderOS v1.0', priority: 'P1', status: 'Not Started', notes: 'End-to-end deployment on Azure - Deadline April 23' },
  { name: 'Search Hackathons', priority: 'P2', status: 'Not Started', notes: '' },
  { name: 'IOT Sprintathon - 100 loom Videos', priority: 'P1', status: 'Not Started', notes: '' },
  { name: 'Gensync SEO', priority: 'P0', status: 'Not Started', notes: '' },
  { name: 'manish SEO', priority: 'P1', status: 'Not Started', notes: '' },
  { name: 'mohit linkedin', priority: 'P1', status: 'Not Started', notes: '' },
  { name: 'Uability company research', priority: 'P2', status: 'Not Started', notes: '' },
  { name: 'Openclaw WhatsApp outreach', priority: 'P2', status: 'Not Started', notes: '' },
  { name: 'Cueedit founder Ig research', priority: 'P1', status: 'Not Started', notes: '' },
  { name: 'Gensync labs page fix', priority: 'P2', status: 'Not Started', notes: '' },
  { name: 'Reaching out Radha Krishna', priority: 'P3', status: 'Not Started', notes: '' },
  { name: 'Geodo(Internal) manikanta', priority: 'P3', status: 'Not Started', notes: '' },
  { name: 'Followup Ganesh and Karthik', priority: 'P1', status: 'Not Started', notes: '' },
  { name: 'Strategy with other agencies', priority: 'P2', status: 'Not Started', notes: '' },
  { name: 'Tender OS', priority: 'P3', status: 'Not Started', notes: '' },
  { name: 'Analysis of Compute/Gemini/Crea/Azure', priority: 'P2', status: 'Not Started', notes: '' },
  { name: 'Outbound Kanyon evaluate', priority: 'P2', status: 'Not Started', notes: '' },
  { name: 'Post on x/linkedin about Ubuntu vs Windows', priority: 'P3', status: 'Not Started', notes: '' },
  { name: 'Subhajit Content Automation', priority: 'P2', status: 'Not Started', notes: '' },
  { name: 'Content Calendar Setup', priority: 'P2', status: 'Not Started', notes: '' },
  { name: '[DAILY] Record LOOMs for HVAC Prospects', priority: 'P1', status: 'In Progress', notes: 'Daily 10AM check-in' },
  { name: 'Fitness Protocol', priority: 'P3', status: 'In Progress', notes: 'Personal: Calorie tracking - Deadline May 1' },
];

const manishTasks = [
  { name: 'Survival Sprint PoW', priority: 'P0', status: 'In Progress', notes: '30s video edit for PrismML/Velt. Lock in $3k' },
  { name: 'QuadGen Deep Dive', priority: 'P1', status: 'In Progress', notes: 'Demo video for Saturday Night Sprint. Target $2k-$3k/mo' },
  { name: 'ProjectX AI Brand Film', priority: 'P1', status: 'In Progress', notes: 'Viral-worthy story for YC startup' },
  { name: 'VMO (Varun Mayya Outreach)', priority: 'P2', status: 'Not Started', notes: 'Remotion + HeyGen personalized video GTM' },
  { name: 'Subhajit Content Automation Upgrade', priority: 'P2', status: 'Not Started', notes: 'Scheduled April 21' },
  { name: 'Project Hail Mary (MVP)', priority: 'P1', status: 'In Progress', notes: 'Attribution/distribution/attention engine' },
  { name: 'Frame Fellowship Pitch', priority: 'P2', status: 'Not Started', notes: '$3k/10-Day Sprint for Akshyae Singh' },
  { name: 'TOBE Branding', priority: 'P2', status: 'Not Started', notes: "Suraj's startup branding" },
  { name: 'Stealth Dating App', priority: 'P3', status: 'Not Started', notes: 'Reddit launch strategy' },
];

const maniTasks = [
  { name: 'LinkedIn Connections', priority: 'P1', status: 'Not Started', notes: 'Completing by tonight' },
  { name: 'Getting used to AE', priority: 'P1', status: 'Not Started', notes: 'Learning After Effects' },
  { name: 'VSL Script for Content tracker', priority: 'P1', status: 'Not Started', notes: '' },
  { name: 'Geodo Connection', priority: 'P2', status: 'Not Started', notes: 'Setting up campaign tomorrow' },
  { name: 'Gensync labs page fix', priority: 'P2', status: 'Not Started', notes: '' },
  { name: 'HVAC Websites', priority: 'P2', status: 'Not Started', notes: '' },
  { name: 'Reaching out Radha Krishna', priority: 'P3', status: 'Not Started', notes: '' },
  { name: 'Tool for automating content', priority: 'P2', status: 'Not Started', notes: '' },
];

const manasTasks = [
  { name: 'ProjectX brand film', priority: 'P1', status: 'Not Started', notes: '' },
];

const tasksBySheet = [
  { name: 'MOHIT', prefix: 'MO', tasks: mohitTasks },
  { name: 'MANISH', prefix: 'MN', tasks: [...manishTasks, ...maniTasks] },
  { name: 'Manas', prefix: 'MS', tasks: manasTasks }
];

async function clearValidations(sheetId) {
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [{
        setDataValidation: {
          range: { sheetId: sheetId, startRowIndex: 0, endRowIndex: 1000, startColumnIndex: 0, endColumnIndex: 10 },
          rule: null
        }
      }]
    }
  });
}

// Color schemes for priority levels
const PRIORITY_COLORS = {
  'P0': { red: 0.957, green: 0.263, blue: 0.212, alpha: 0.15 },   // Red - Critical
  'P1': { red: 0.980, green: 0.573, blue: 0.247, alpha: 0.15 },   // Orange - High
  'P2': { red: 0.055, green: 0.788, blue: 0.969, alpha: 0.15 },   // Cyan - Medium  
  'P3': { red: 0.580, green: 0.639, blue: 0.722, alpha: 0.10 },   // Gray - Low
};

const STATUS_COLORS = {
  'Not Started': { red: 0.376, green: 0.412, blue: 0.478, alpha: 0.2 },
  'In Progress': { red: 0.545, green: 0.361, blue: 0.965, alpha: 0.2 },
  'Done': { red: 0.063, green: 0.725, blue: 0.506, alpha: 0.2 },
};

async function applyFormatting(sheetId, rowCount) {
  const requests = [];
  
  requests.push({
    updateSheetProperties: {
      properties: { sheetId: sheetId, gridProperties: { frozenRowCount: 1 } },
      fields: 'gridProperties.frozenRowCount'
    }
  });

  requests.push({
    repeatCell: {
      range: { sheetId: sheetId, startRowIndex: 0, endRowIndex: rowCount },
      cell: {
        userEnteredFormat: {
          borders: {
            top: { style: 'SOLID', color: { red: 0.12, green: 0.12, blue: 0.15 } },
            bottom: { style: 'SOLID', color: { red: 0.12, green: 0.12, blue: 0.15 } },
            left: { style: 'SOLID', color: { red: 0.12, green: 0.12, blue: 0.15 } },
            right: { style: 'SOLID', color: { red: 0.12, green: 0.12, blue: 0.15 } }
          }
        }
      },
      fields: 'userEnteredFormat.borders'
    }
  });

  requests.push({
    repeatCell: {
      range: { sheetId: sheetId, startRowIndex: 0, endRowIndex: 1 },
      cell: {
        userEnteredFormat: {
          backgroundColor: { red: 0.1, green: 0.1, blue: 0.18 },
          textFormat: { 
            bold: true, 
            foregroundColor: { red: 0.9, green: 0.9, blue: 0.95 },
            fontSize: 11
          }
        }
      },
      fields: 'userEnteredFormat.backgroundColor,userEnteredFormat.textFormat'
    }
  });

  requests.push({
    updateDimensionProperties: {
      properties: { pixelSize: 280 },
      fields: 'pixelSize',
      range: { sheetId: sheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 }
    }
  });

  requests.push({
    updateDimensionProperties: {
      properties: { pixelSize: 60 },
      fields: 'pixelSize',
      range: { sheetId: sheetId, dimension: 'COLUMNS', startIndex: 1, endIndex: 2 }
    }
  });

  requests.push({
    updateDimensionProperties: {
      properties: { pixelSize: 90 },
      fields: 'pixelSize',
      range: { sheetId: sheetId, dimension: 'COLUMNS', startIndex: 2, endIndex: 3 }
    }
  });

  requests.push({
    updateDimensionProperties: {
      properties: { pixelSize: 80 },
      fields: 'pixelSize',
      range: { sheetId: sheetId, dimension: 'COLUMNS', startIndex: 3, endIndex: 4 }
    }
  });

  requests.push({
    updateDimensionProperties: {
      properties: { pixelSize: 200 },
      fields: 'pixelSize',
      range: { sheetId: sheetId, dimension: 'COLUMNS', startIndex: 4, endIndex: 5 }
    }
  });

  requests.push({
    updateDimensionProperties: {
      properties: { pixelSize: 90 },
      fields: 'pixelSize',
      range: { sheetId: sheetId, dimension: 'COLUMNS', startIndex: 5, endIndex: 6 }
    }
  });

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: { requests }
  });
}

async function seed() {
  console.log('🔄 Fixing spreadsheet...\n');
  
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const sheetMap = {};
  meta.data.sheets?.forEach(s => {
    sheetMap[s.properties.title] = s.properties.sheetId;
  });
  
  const sheetsList = ['MOHIT', 'MANISH', 'Manas'];
  
  for (const sheetInfo of tasksBySheet) {
    const sheetName = sheetInfo.name;
    const sheetId = sheetMap[sheetName];
    const { prefix, tasks } = sheetInfo;
    
    // Clear all data validations first
    if (sheetId !== undefined) {
      try {
        await clearValidations(sheetId);
        console.log(`Cleared validations from ${sheetName}`);
      } catch (e) {
        console.log(`Validation clear error ${sheetName}:`, e.message);
      }
    }
    
    // Clear sheet
    try {
      await sheets.spreadsheets.values.clear({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A1:Z1000`
      });
    } catch (e) {}
    
    // Create header + data with new ID format
    const header = [['Task', 'Priority', 'Status', 'Due Date', 'Notes', 'ID']];
    const values = tasks.map((t, i) => [
      t.name,
      t.priority,
      t.status,
      today,
      t.notes,
      generateTaskId(prefix)  // ID at the end
    ]);
    
    const allValues = [...header, ...values];
    
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1:F${allValues.length}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: allValues }
    });
    
    // Bold header + apply formatting
    if (sheetId !== undefined) {
      try {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SPREADSHEET_ID,
          requestBody: {
            requests: [{
              repeatCell: {
                range: { sheetId: sheetId, startRowIndex: 0, endRowIndex: 1 },
                cell: { userEnteredFormat: { textFormat: { bold: true } } },
                fields: 'userEnteredFormat.textFormat.bold'
              }
            }, {
              updateSheetProperties: {
                properties: { sheetId: sheetId, gridProperties: { frozenRowCount: 1 } },
                fields: 'gridProperties.frozenRowCount'
              }
            }]
          }
        });
        // Apply cell formatting
        await applyFormatting(sheetId, allValues.length);
      } catch (e) {
        console.log(`Format error ${sheetName}:`, e.message);
      }
    }
    
    console.log(`✓ ${sheetName}: ${tasks.length} tasks with new IDs`);
  }
  
  // Delete Mani sheet if it exists
  const maniSheetId = sheetMap['Mani'];
  if (maniSheetId !== undefined) {
    try {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{
            deleteSheet: { sheetId: maniSheetId }
          }]
        }
      });
      console.log('🗑️ Deleted Mani sheet');
    } catch (e) {
      console.log('Delete error:', e.message);
    }
  }
  
  console.log('\n✅ Done!');
  console.log('\n📋 NEW FORMAT:');
  console.log('ID: MO-XXXX (Mohit), MN-XXXX (Manish), MA-XXXX (Mani), MS-XXXX (Manas)');
  console.log('Priority: P0, P1, P2, P3');
  console.log('Status: Not Started, In Progress, Done');
}

seed();