const { google } = require('googleapis');
const { JWT } = require('google-auth-library');
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
    return { access_token: data.access_token, res: null };
  }
}

const jwtClient = new SheetsJWT({ email: SERVICE_ACCOUNT.client_email, key: SERVICE_ACCOUNT.private_key, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
const sheets = google.sheets({ version: 'v4', auth: jwtClient });

(async () => {
  console.log('Setting row height to 29 for ALL sheets...\n');
  
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const allSheets = meta.data.sheets;
  
  for (const sheet of allSheets) {
    const sheetName = sheet.properties.title;
    const sheetId = sheet.properties.sheetId;
    const rowCount = sheet.properties.gridProperties.rowCount || 100;
    
    try {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{
            updateDimensionProperties: {
              properties: { pixelSize: 29 },
              fields: 'pixelSize',
              range: { sheetId: sheetId, dimension: 'ROWS', startIndex: 0, endIndex: rowCount }
            }
          }]
        }
      });
      console.log('✓', sheetName);
    } catch (e) {
      console.log('✗', sheetName + ':', e.message);
    }
  }
  
  console.log('\n✅ Done! Row height set to 29 for all sheets.');
})();