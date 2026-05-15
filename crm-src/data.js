const API_URL = '';

const TEAM_MEMBERS = [
  { id: 'manish', name: 'Manish Sampatrao', role: 'Founder / Media Lead', color: '#6366f1' },
  { id: 'mohit', name: 'Mohit Sula', role: 'Partner / Tech Lead', color: '#22c55e' },
  { id: 'amulya', name: 'Amulya', role: 'Designer', color: '#f59e0b' },
  { id: 'manikanta', name: 'Manikanta', role: 'Video Editor', color: '#ec4899' },
  { id: 'manas', name: 'Manas', role: 'Cinematographer', color: '#8b5cf6' },
];

const LEAD_SOURCES = [
  { id: 'tarini', label: 'Tarini (Referral)', icon: '👤' },
  { id: 'email', label: 'Email', icon: '📧' },
  { id: 'linkedin', label: 'LinkedIn Post', icon: '💼' },
  { id: 'instagram', label: 'Instagram Post', icon: '📸' },
  { id: 'linkedin_dm', label: 'LinkedIn DM', icon: '💬' },
  { id: 'loom', label: 'Loom Video', icon: '🎥' },
];

const TEMPERATURES = ['HOT', 'WARM', 'COLD'];
const PIPELINE_STAGES = ['New', 'Contacted', 'Proposal', 'Negotiation', 'Won', 'Lost'];
const TASK_STATUSES = ['Not Started', 'In Progress', 'Done'];
const TASK_PRIORITIES = ['P0', 'P1', 'P2', 'P3'];
const CLIENT_STATUSES = ['Active', 'Paused', 'Done'];
const DOC_TYPES = [
  { id: 'contract', label: 'Service Contract', icon: '📄' },
  { id: 'brand', label: 'Brand Guidelines', icon: '🎨' },
  { id: 'product', label: 'Product Data', icon: '📊' },
  { id: 'assets', label: 'Assets Folder', icon: '📁' },
  { id: 'contact', label: 'Contact Info', icon: '📇' },
];

let tasks = [];
let clients = [];
let leads = [];
let listeners = [];

const store = {
  init: async function() {
    await this.loadTasks();
    this.initialized = true;
    listeners.forEach(fn => fn(this));
  },

  subscribe: function(fn) {
    listeners.push(fn);
  },

  loadTasks: async function() {
    try {
      const res = await fetch(`${API_URL}/api/tasks`);
      tasks = await res.json();
    } catch (e) {
      console.error('Failed to load tasks:', e);
    }
  },

  getTasks: function() {
    return tasks;
  },

  getTask: function(id) {
    return tasks.find(t => t.id === id);
  },

  getTeamMember: function(id) {
    return TEAM_MEMBERS.find(m => m.id === id);
  },

  getSourceInfo: function(id) {
    return LEAD_SOURCES.find(s => s.id === id);
  },

  getClientName: function(id) {
    const c = clients.find(c => c.id === id);
    return c ? c.name : '—';
  },

  addTask: async function(task) {
    const res = await fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    const newTask = await res.json();
    tasks.push(newTask);
    return newTask;
  },

  updateTask: async function(id, updates) {
    const res = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const updated = await res.json();
    const idx = tasks.findIndex(t => t.id === id);
    if (idx !== -1) tasks[idx] = updated;
    return updated;
  },

  deleteTask: async function(id) {
    await fetch(`${API_URL}/api/tasks/${id}`, { method: 'DELETE' });
    tasks = tasks.filter(t => t.id !== id);
  },

  getClients: function() { return clients; },
  getClient: function(id) { return clients.find(c => c.id === id); },
  addClient: function(client) { client.id = Date.now().toString(36); clients.push(client); return client; },
  updateClient: function(id, updates) {
    const idx = clients.findIndex(c => c.id === id);
    if (idx !== -1) Object.assign(clients[idx], updates);
  },
  deleteClient: function(id) { clients = clients.filter(c => c.id !== id); },

  getLeads: function() { return leads; },
  getLead: function(id) { return leads.find(l => l.id === id); },
  addLead: function(lead) { lead.id = Date.now().toString(36); leads.push(lead); return lead; },
  updateLead: function(id, updates) {
    const idx = leads.findIndex(l => l.id === id);
    if (idx !== -1) Object.assign(leads[idx], updates);
  },
  deleteLead: function(id) { leads = leads.filter(l => l.id !== id); },

  getSettings: function() { return {}; },
  updateSettings: function() {}
};

export {
  store,
  LEAD_SOURCES, TEMPERATURES, PIPELINE_STAGES,
  TASK_STATUSES, TASK_PRIORITIES, CLIENT_STATUSES,
  TEAM_MEMBERS, DOC_TYPES
};