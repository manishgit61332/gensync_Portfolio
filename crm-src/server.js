import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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

function encodeBase64Url(buffer) {
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

let accessToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  
  if (accessToken && now < tokenExpiry - 300) {
    return accessToken;
  }
  
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: SERVICE_ACCOUNT.client_email,
    sub: SERVICE_ACCOUNT.client_email,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
    scope: 'https://www.googleapis.com/auth/spreadsheets'
  };
  
  const headerEncoded = encodeBase64Url(JSON.stringify(header));
  const payloadEncoded = encodeBase64Url(JSON.stringify(payload));
  const message = headerEncoded + '.' + payloadEncoded;
  
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(message);
  const signature = encodeBase64Url(sign.sign(SERVICE_ACCOUNT.private_key));
  
  const jwtAssertion = message + '.' + signature;
  
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwtAssertion
    })
  });
  
  const data = await response.json();
  if (data.error) {
    console.error('Token error:', data);
    throw new Error(data.error_description || data.error);
  }
  
  accessToken = data.access_token;
  tokenExpiry = now + data.expires_in;
  console.log('Access token obtained');
  return accessToken;
}

let cachedSheets = null;

async function getSheets() {
  if (!cachedSheets) {
    const { google } = await import('googleapis');
    const token = await getAccessToken();
    cachedSheets = google.sheets({ version: 'v4', auth: token });
  }
  return cachedSheets;
}

const SHEET_TEAM_MAP = {
  'mohit': 'MOHIT',
  'manish': 'MANISH',
  'manas': 'Manas'
};

const REVERSE_PRIORITY_MAP = { 'Urgent': 'P0', 'High': 'P1', 'Medium': 'P2', 'Low': 'P3' };

let cachedTasks = {};

async function loadAllTasks() {
  const tasks = {};
  for (const [memberId, sheetName] of Object.entries(SHEET_TEAM_MAP)) {
    try {
      const sheetsApi = await getSheets();
      const response = await sheetsApi.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A2:F100`
      });
      const values = response.data.values || [];
      tasks[memberId] = values
        .filter(row => row[0] && row[0].trim() !== '')
        .map(row => ({
          id: row[5] || '',
          name: row[0] || '',
          priority: REVERSE_PRIORITY_MAP[row[1]] || 'P2',
          status: row[2] || 'Not Started',
          dueDate: row[3] || '',
          notes: row[4] || ''
        }));
      console.log(`Loaded ${tasks[memberId].length} tasks from ${sheetName}`);
    } catch (e) {
      console.log(`Failed to load ${sheetName}:`, e.message);
      tasks[memberId] = [];
    }
  }
  cachedTasks = tasks;
  return tasks;
}

app.get('/api/tasks', async (req, res) => {
  await loadAllTasks();
  const allTasks = [];
  for (const [memberId, tasks] of Object.entries(cachedTasks)) {
    tasks.forEach(t => {
      allTasks.push({
        id: t.id,
        name: t.name,
        assignee: memberId,
        priority: t.priority,
        status: t.status,
        dueDate: t.dueDate,
        notes: t.notes,
        clientId: '',
        sheetName: SHEET_TEAM_MAP[memberId]
      });
    });
  }
  res.json(allTasks);
});

app.post('/api/tasks', async (req, res) => {
  const task = req.body;
  const sheetsApi = await getSheets();
  const taskId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const sheetName = SHEET_TEAM_MAP[task.assignee] || 'MOHIT';
  const newTask = {
    id: taskId,
    name: task.name,
    priority: task.priority || 'P2',
    status: task.status || 'Not Started',
    dueDate: task.dueDate || new Date().toISOString().split('T')[0],
    notes: task.notes || ''
  };
  await sheetsApi.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A:F`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [[newTask.name, newTask.priority, newTask.status, newTask.dueDate, newTask.notes, newTask.id]] }
  });
  await loadAllTasks();
  res.json({ ...newTask, assignee: task.assignee });
});

app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const sheetsApi = await getSheets();
  let taskSheet, taskRow, task;
  for (const [memberId, tasks] of Object.entries(cachedTasks)) {
    const idx = tasks.findIndex(t => t.id === id);
    if (idx !== -1) {
      task = tasks[idx];
      taskSheet = SHEET_TEAM_MAP[memberId];
      taskRow = idx + 2;
      break;
    }
  }
  if (!task) return res.status(404).json({ error: 'Task not found' });
  const updatedTask = { ...task, ...updates };
  await sheetsApi.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${taskSheet}!A${taskRow}:F${taskRow}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [[updatedTask.name, updatedTask.priority, updatedTask.status, updatedTask.dueDate, updatedTask.notes, updatedTask.id]] }
  });
  await loadAllTasks();
  res.json(updatedTask);
});

app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const sheetsApi = await getSheets();
  for (const [memberId, tasks] of Object.entries(cachedTasks)) {
    const idx = tasks.findIndex(t => t.id === id);
    if (idx !== -1) {
      const sheetName = SHEET_TEAM_MAP[memberId];
      await sheetsApi.spreadsheets.values.clear({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A${idx + 2}:F${idx + 2}`
      });
      await loadAllTasks();
      return res.json({ success: true });
    }
  }
  res.status(404).json({ error: 'Task not found' });
});

app.use(express.static(join(__dirname, '.')));

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  loadAllTasks();
});