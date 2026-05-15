import { google } from 'googleapis';

const SPREADSHEET_ID = '1piT_xHY4LBwb2LrdHmg2ZCDXjyUZ23tCb_-h8TAMvUU';

const SERVICE_ACCOUNT = {
  type: 'service_account',
  project_id: 'crea-488211',
  private_key_id: '31486f91258828cbce1f233c410ae4259b07ea4a',
  private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCyeaurNNmnvn1o\nchlVmhkIxIeIzLzTosI6JStL/ZM/tbXhvaLn3EnO4qPzSmH+HoHFzBBJZKWU8Um0\nlRwpp6vbDr3xc0lpAqDRXBNLnuqP+BXiMUM+3/SSrcDNXz5eUVykgt/3ycApP1x5\n81luv6EPZyDGCn6eFeU5Q5X05mPPrOJEEHE/zEh0CoVzieiLISfyeqCpIEqK+Tnn\nQPx5KxnEJpfuvjyWTdLRn4yM4KJ9lj5wYRzzWCs4UB2IfUBPB/qHS3gzN863sU/u\nX/zuFu+bCl2+yCM5nvJpvvvmTf/1EdQPzfMYUORLDrjoraF4xMPH7RWz0exV5u86\nBJW/SVnHAgMBAAECggEATobpSSGuWLegTynQytDMDgcGyWKn/Ihi5BmBlORj+wa1\nGbeKK3FKCly/HWdPeXOrzr9MNTazAjcuImXvJ8bN/0rbuRZsKOeOob9dAAtSknjq\nDAV33HzGjBkmOVacRvyOghXRfKGIyr1Fr6SqZ2eqcnACRBDPCDiDDHCX1NLf/LoM\n+JZtsAggTOlNpaOtWV8+xdxbBecapdL2Ew3QgMrjYMndgJ4eDbWJ3qNV6Fbsavz5\nptGyuiIm+y6nLCpyLnTnoUBsxLly+bnMoVBifDAGQ4u+O6FE/qCIG4hqHQbjJPNO\nBHXoBg45V35Jg5gUoROBJ5Y/oAoJK/1kCOu/AVjJ4QKBgQDdNLzaet33HAcRrCh8\nDZ4+m1AqU0wf5DDBCi2nVBNsFYKuSaX1qdeqWVVMzBGr0j8T59MAskgQ5D6+24Hr\n3shYWwQdnvtKy5JrXbMj3V4PSmik8/aabpXL8RXKiRrqMYIBiuuKBce+0XSsV/98\nNHpCXHPReKViWO+SOLC53eZrJwKBgQDOjE1gWizfjOcmGy98Rls2ZChYjCbcGsE1\n+z+KMbD2qozBpBqXuTDLQ2FN/ehw42j8xPmt+Utu4idbezO6dK/Qfydje3gsYBhk\nGaqLvgGa06AxPrKmvCJF1QSacaZfW+zxgndCGl5J/PIEIdV1ppYifLTm+YLiUInK\nnlBUoOdAYQKBgQCE+QLdwyZTOYH2Wassh3Ms52hVSSVltmKoaFnxUFUsj/Gym4ss\nFiESwgjI1ZN52jUY3i61KHax0ML3MDT1eUKt+miK9drRp3YpHHZnhNbaEjy9i/od\n84QQyKf0zF5lkcU48C2PFtJwHrEoOO3X2CP2aGUm8oNYj2XUXEfAM2gj2QKBgCh4\nUxzi7lHrAMt1nitCedLBcypOY7rSvzK9hOil7d+W8Tdr2Q4LaiUZkbI/YtDjrgmA\n6s8Mvpv+UenZzPvmqyA2GdijM5u2RHEwmjsBQr08Y/HiMAz9ZdW69Ejypb+femCj\nyIw6MGlc12q52mJP/rDJMITlNKD1WNpLhL/gOw9hAoGBAKMoI6JmXePjEyfcF2Rb\nL5ZBO2LwJ/0IJk+EFZSmaLvkp4e+aEwtqff9ocgQjY7A9ota5BNgkaLYRMQRKQop\nF8WK1aBF57HkqlbhN21YKe0sSUO0b+knX4qGQ9mJl1z6ls75cmmY83ykIi3Gmwm0\n+kBxvPDBeCkip0A7G0a4tx88\n-----END PRIVATE KEY-----\n',
  client_email: 'crea99@crea-488211.iam.gserviceaccount.com',
  client_id: '106770361944829073197',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/crea99%40crea-488211.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com'
};

const PRIORITY_MAP = {
  'P0': 'Urgent',
  'P1': 'High',
  'P2': 'Medium',
  'P3': 'Low'
};

const REVERSE_PRIORITY_MAP = {
  'Urgent': 'P0',
  'High': 'P1',
  'Medium': 'P2',
  'Low': 'P3'
};

const SHEETS = {
  mohit: 'Mohit',
  mani: 'Mani',
  manas: 'Manas',
  manish: 'Manish'
};

let auth;
let sheets;

function getAuth() {
  if (!auth) {
    auth = new google.auth.GoogleAuth({
      credentials: SERVICE_ACCOUNT,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
  }
  return auth;
}

function getSheets() {
  if (!sheets) {
    sheets = google.sheets({ version: 'v4', auth: getAuth() });
  }
  return sheets;
}

export async function getSheetData(sheetName) {
  const sheetsApi = getSheets();
  const range = `${sheetName}!A:F`;
  
  try {
    const response = await sheetsApi.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: range
    });
    
    const values = response.data.values || [];
    if (values.length < 2) return [];
    
    const headers = values[0];
    const tasks = [];
    
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      if (row[0]) {
        tasks.push({
          id: row[0] || '',
          name: row[1] || '',
          priority: row[2] || 'P2',
          status: row[3] || 'Not Started',
          dueDate: row[4] || '',
          notes: row[5] || ''
        });
      }
    }
    
    return tasks;
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return [];
  }
}

export async function updateTask(sheetName, rowIndex, updates) {
  const sheetsApi = getSheets();
  const range = `${sheetName}!A${rowIndex}:F${rowIndex}`;
  
  const row = [
    updates.id || '',
    updates.name || '',
    updates.priority || 'P2',
    updates.status || 'Not Started',
    updates.dueDate || '',
    updates.notes || ''
  ];
  
  try {
    await sheetsApi.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [row] }
    });
    return true;
  } catch (error) {
    console.error('Error updating task:', error);
    return false;
  }
}

export async function addTask(sheetName, task) {
  const sheetsApi = getSheets();
  const range = `${sheetName}!A:F`;
  
  const row = [
    task.id || Date.now().toString(),
    task.name || '',
    task.priority || 'P2',
    task.status || 'Not Started',
    task.dueDate || '',
    task.notes || ''
  ];
  
  try {
    await sheetsApi.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [row] }
    });
    return true;
  } catch (error) {
    console.error('Error adding task:', error);
    return false;
  }
}

export async function deleteTask(sheetName, rowIndex) {
  const sheetsApi = getSheets();
  
  try {
    await sheetsApi.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [{
          deleteDimension: {
            range: {
              sheetTitle: sheetName,
              dimension: 'ROWS',
              startIndex: rowIndex - 1,
              endIndex: rowIndex
            }
          }
        }]
      }
    });
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
}

export async function getAllTasks() {
  const allTasks = [];
  const teamMembers = ['mohit', 'mani', 'manas', 'manish'];
  
  for (const member of teamMembers) {
    const sheetName = SHEETS[member];
    if (sheetName) {
      const tasks = await getSheetData(sheetName);
      tasks.forEach(task => {
        allTasks.push({
          ...task,
          assignee: member,
          sheetName: sheetName
        });
      });
    }
  }
  
  return allTasks;
}

export function getTaskRowIndex(tasks, taskId) {
  return tasks.findIndex(t => t.id === taskId) + 2;
}

export { SHEETS, PRIORITY_MAP, REVERSE_PRIORITY_MAP };