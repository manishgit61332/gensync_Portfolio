// ═══════════════════════════════════════════════════════════════
// GenSync CRM — Application Logic
// ═══════════════════════════════════════════════════════════════

import {
  store,
  LEAD_SOURCES, TEMPERATURES, PIPELINE_STAGES,
  TASK_STATUSES, TASK_PRIORITIES, CLIENT_STATUSES,
  TEAM_MEMBERS, DOC_TYPES,
} from './data.js';

// ── DOM References ───────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ── State ────────────────────────────────────────────────────
let currentTab = 'dashboard';
let tasksViewMode = 'kanban';
let dashboardTempFilter = 'all';
let pipelineStageFilter = 'all';
let pipelineTempFilter = 'all';

// ═══════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', async () => {
  await store.init();
  initPremiumFeatures();
  initNavigation();
  initHeader();
  initModals();
  initMobileMenu();
  renderCurrentView();
  updateBadges();
  startClock();
});

// ── Clock ────────────────────────────────────────────────────
function startClock() {
  function tick() {
    const now = new Date();
    const opts = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    $('#header-time').textContent = now.toLocaleDateString('en-US', opts);
  }
  tick();
  setInterval(tick, 30000);
}

// ═══════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════

function initNavigation() {
  $$('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      switchTab(tab);
    });
  });
}

function switchTab(tab) {
  currentTab = tab;

  // Update nav
  $$('.nav-item').forEach(n => n.classList.remove('active'));
  $(`.nav-item[data-tab="${tab}"]`).classList.add('active');

  // Update views
  $$('.view').forEach(v => v.classList.remove('active'));
  $(`#view-${tab}`).classList.add('active');

  // Update header title
  const titles = {
    dashboard: 'Dashboard',
    tasks: 'Tasks',
    pipeline: 'Pipeline',
    clients: 'Clients',
    settings: 'Settings',
  };
  $('#page-title').textContent = titles[tab] || 'Dashboard';

  // Update add button label
  const labels = {
    dashboard: 'Add',
    tasks: 'New Task',
    pipeline: 'New Lead',
    clients: 'New Client',
    settings: 'Add',
  };
  $('#global-add-label').textContent = labels[tab] || 'Add';
  $('#global-add-btn').style.display = (tab === 'settings') ? 'none' : 'inline-flex';

  renderCurrentView();

  // Close mobile sidebar
  $('#sidebar').classList.remove('open');
}

function renderCurrentView() {
  switch (currentTab) {
    case 'dashboard': renderDashboard(); break;
    case 'tasks':     renderTasks(); break;
    case 'pipeline':  renderPipeline(); break;
    case 'clients':   renderClients(); break;
    case 'settings':  renderSettings(); break;
  }
}

function updateBadges() {
  const tasks = store.getTasks();
  const pending = tasks.filter(t => t.status !== 'Done').length;
  $('#tasks-badge').textContent = pending;

  const leads = store.getLeads();
  $('#leads-badge').textContent = leads.length;
}

function initHeader() {
  $('#global-add-btn').addEventListener('click', () => {
    switch (currentTab) {
      case 'tasks':    openTaskModal(); break;
      case 'pipeline': openLeadModal(); break;
      case 'clients':  openClientModal(); break;
      default:         openTaskModal(); break;
    }
  });
}

function initMobileMenu() {
  $('#mobile-menu-btn').addEventListener('click', () => {
    $('#sidebar').classList.toggle('open');
  });
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD VIEW
// ═══════════════════════════════════════════════════════════════

function renderDashboard() {
  renderDashboardStats();
  renderDashboardClients();
  renderDashboardLeads();
  renderDashboardTasks();
  initDashboardFilters();
  if (typeof drawAreaChart === 'function') drawAreaChart();
}

function renderDashboardStats() {
  const clients = store.getClients();
  const leads = store.getLeads();
  const tasks = store.getTasks();

  const activeClients = clients.filter(c => c.status === 'Active').length;
  const hotLeads = leads.filter(l => l.temperature === 'HOT').length;
  const pendingTasks = tasks.filter(t => t.status !== 'Done').length;
  const totalRevenue = '~$3,000'; // From plan context

  // ── 1. Overdue Alerts
  const today = new Date().toISOString().split('T')[0];
  const overdueTasks = tasks.filter(t => t.status !== 'Done' && t.dueDate < today);
  
  if (overdueTasks.length > 0) {
    let overdueHTML = overdueTasks.map(t => '• ' + t.name).join(' | ');
    if(overdueHTML.length > 60) overdueHTML = overdueHTML.substring(0, 60) + '...';
    
    $('#dashboard-alerts').innerHTML = `
      <div class="alert-banner">
        <div class="alert-icon">⚠️</div>
        <div class="alert-content">
          <div class="alert-title">${overdueTasks.length} Overdue Task${overdueTasks.length > 1 ? 's' : ''}</div>
          <div class="alert-desc">${overdueHTML}</div>
        </div>
        <button class="btn btn-ghost" style="border:1px solid rgba(255,255,255,0.3);" onclick="window.switchTab('tasks');">View Tasks</button>
      </div>
    `;
  } else {
    $('#dashboard-alerts').innerHTML = '';
  }

  // ── 2. Today's Priorities
  const priorityTasks = tasks.filter(t => t.status !== 'Done' && (t.dueDate === today || t.priority === 'Urgent' || t.priority === 'High'));
  
  if (priorityTasks.length > 0) {
    const priorityHTML = priorityTasks.map(t => {
      const cls = t.priority === 'Urgent' ? 'urgent' : (t.priority === 'High' ? 'high' : '');
      const icon = t.priority === 'Urgent' ? '🔴' : (t.priority === 'High' ? '🟠' : '🕒');
      return `
        <div class="priority-item ${cls}" onclick="window.switchTab('tasks'); window.openTaskModal('${t.id}')">
          <div style="font-size: 1.5rem;">${icon}</div>
          <div>
            <div class="pi-title">${t.name}</div>
            <div class="pi-sub">Due: ${formatDate(t.dueDate)} • For: ${store.getClientName(t.clientId)}</div>
          </div>
        </div>
      `;
    }).join('');
    
    $('#dashboard-priorities').innerHTML = `
      <div class="priorities-widget">
        <div class="priorities-header">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
          Quick Stats: Today's Priorities
        </div>
        <div class="priorities-grid">
           ${priorityHTML}
        </div>
      </div>
    `;
  } else {
    $('#dashboard-priorities').innerHTML = '';
  }

  // ── 3. KPI Stats Grid
  const html = `
    <div class="stat-card" data-accent="indigo">
      <div class="stat-label">Active Clients</div>
      <div class="stat-value">${activeClients}</div>
      <div class="stat-sub">${clients.length} total in roster</div>
    </div>
    <div class="stat-card" data-accent="cyan">
      <div class="stat-label">Open Leads</div>
      <div class="stat-value">${leads.filter(l => l.stage !== 'Won' && l.stage !== 'Lost').length}</div>
      <div class="stat-sub">${leads.length} total pipeline</div>
    </div>
    <div class="stat-card" data-accent="red">
      <div class="stat-label">Hot Leads</div>
      <div class="stat-value">${hotLeads}</div>
      <div class="stat-sub">Ready to close</div>
    </div>
    <div class="stat-card" data-accent="amber">
      <div class="stat-label">Pending Tasks</div>
      <div class="stat-value">${pendingTasks}</div>
      <div class="stat-sub">${tasks.filter(t => t.status === 'Done').length} completed</div>
    </div>
  `;
  $('#dashboard-stats').innerHTML = html;
}

function renderDashboardClients() {
  const clients = store.getClients().filter(c => c.status === 'Active');
  const colors = ['linear-gradient(135deg, #6366f1, #a78bfa)', 'linear-gradient(135deg, #22c55e, #34d399)'];

  const html = clients.map((c, i) => `
    <div class="client-mini-card" data-id="${c.id}">
      <div class="client-logo" style="background:${colors[i % colors.length]}">
        ${c.name.substring(0, 2).toUpperCase()}
      </div>
      <div class="client-details">
        <h3>${c.name} <span class="status-dot active" style="display:inline-block;vertical-align:middle;margin-left:6px;"></span></h3>
        <p>📍 ${c.location} · ${c.services.split(',')[0]}</p>
      </div>
    </div>
  `).join('');
  $('#dashboard-clients').innerHTML = html || `<div class="empty-state">
    <svg class="empty-state-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
    <p>No active clients</p>
  </div>`;

  // Click to navigate to clients tab
  $$('.client-mini-card').forEach(card => {
    card.addEventListener('click', () => switchTab('clients'));
  });
}

function renderDashboardLeads() {
  let leads = store.getLeads().filter(l => l.stage !== 'Won' && l.stage !== 'Lost');

  if (dashboardTempFilter !== 'all') {
    leads = leads.filter(l => l.temperature === dashboardTempFilter);
  }

  const html = leads.map(l => {
    const source = store.getSourceInfo(l.source);
    return `
      <div class="glass-card">
        <div class="card-header">
          <div>
            <div class="card-title">${l.companyName}</div>
            <div class="source-tag" style="margin-top:4px;">
              <span class="source-icon">${source ? source.icon : '📋'}</span>
              <span>${source ? source.label : l.source}</span>
            </div>
          </div>
          <span class="temp-badge ${l.temperature.toLowerCase()}">
            <span class="temp-dot"></span> ${l.temperature}
          </span>
        </div>
        <div class="card-meta">
          <div class="card-meta-row">
            <span class="meta-icon">👤</span> ${l.contactPerson}
          </div>
          <div class="card-meta-row">
            <span class="meta-icon">📅</span> ${formatDate(l.lastContact)}
          </div>
        </div>
        <div style="margin-top:12px;">
          <span class="stage-badge">${l.stage}</span>
        </div>
      </div>
    `;
  }).join('');
  $('#dashboard-leads').innerHTML = html || `<div class="empty-state" style="grid-column:1/-1;">
    <svg class="empty-state-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
    <p>No leads matching filter</p>
  </div>`;
}

function renderDashboardTasks() {
  const tasks = store.getTasks().filter(t => t.status !== 'Done');
  const today = new Date().toISOString().split('T')[0];

  const html = tasks.map(t => {
    const member = store.getTeamMember(t.assignee);
    const statusClass = t.status === 'In Progress' ? 'inprogress' : 'todo';
    const isOverdue = t.dueDate < today;

    return `
      <div class="task-row">
        <div class="task-status-indicator ${statusClass}"></div>
        <div class="task-info">
          <div class="task-name">${t.name}</div>
          <div class="task-client-name">${store.getClientName(t.clientId)}</div>
        </div>
        <div class="assignee-chip">
          <div class="chip-avatar" style="background:${member ? member.color : '#6366f1'}">${member ? member.name[0] : '?'}</div>
          ${member ? member.name.split(' ')[0] : 'Unassigned'}
        </div>
        <span class="priority-badge ${t.priority.toLowerCase()}">${t.priority}</span>
        <div class="task-due ${isOverdue ? 'overdue' : ''}">${isOverdue ? '⚠ ' : ''}${formatDate(t.dueDate)}</div>
      </div>
    `;
  }).join('');

  $('#dashboard-tasks').innerHTML = html || '<div class="empty-state"><div class="empty-icon">🎉</div><p>All tasks done! Great work.</p></div>';
}

function initDashboardFilters() {
  // Temperature filter on dashboard
  $$('#dashboard-temp-filter .filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      $$('#dashboard-temp-filter .filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      dashboardTempFilter = pill.dataset.filter;
      renderDashboardLeads();
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// TASKS VIEW
// ═══════════════════════════════════════════════════════════════

function renderTasks() {
  initTasksViewToggle();
  if (tasksViewMode === 'kanban') {
    renderKanban();
    $('#tasks-kanban').style.display = 'grid';
    $('#tasks-table').style.display = 'none';
  } else {
    renderTaskTable();
    $('#tasks-kanban').style.display = 'none';
    $('#tasks-table').style.display = 'block';
  }
}

function initTasksViewToggle() {
  $$('#tasks-view-toggle .view-toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === tasksViewMode);
    btn.addEventListener('click', () => {
      tasksViewMode = btn.dataset.view;
      $$('#tasks-view-toggle .view-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTasks();
    });
  });
}

function renderKanban() {
  const tasks = store.getTasks();
  const columns = TASK_STATUSES.map(status => {
    const columnTasks = tasks.filter(t => t.status === status);
    const statusSlug = status.toLowerCase().replace(/\s+/g, '');

    const cardsHtml = columnTasks.map(t => {
      const member = store.getTeamMember(t.assignee);
      return `
        <div class="kanban-card" draggable="true" data-task-id="${t.id}" data-priority="${t.priority}">
          <div class="kc-title">${t.name}</div>
          <div class="kc-footer">
            <span class="kc-client">${store.getClientName(t.clientId)}</span>
            <div style="display:flex;align-items:center;gap:6px;">
              <span class="priority-badge ${t.priority.toLowerCase()}">${t.priority}</span>
              <div class="assignee-chip">
                <div class="chip-avatar" style="background:${member ? member.color : '#6366f1'}">${member ? member.name[0] : '?'}</div>
                ${member ? member.name.split(' ')[0] : '?'}
              </div>
            </div>
          </div>
          <div style="margin-top:8px;font-size:0.68rem;color:var(--text-muted);">Due: ${formatDate(t.dueDate)}</div>
          <div class="card-actions" style="margin-top:10px;padding-top:10px;">
            <button class="btn btn-ghost btn-sm edit-task-btn" data-id="${t.id}">Edit</button>
            <button class="btn btn-danger btn-sm delete-task-btn" data-id="${t.id}">Delete</button>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="kanban-column" data-status="${status}">
        <div class="kanban-column-header">
          <span class="kanban-column-title">
            <span>${status === 'To Do' ? '📋' : status === 'In Progress' ? '⚡' : '✅'}</span>
            ${status}
          </span>
          <span class="kanban-column-count">${columnTasks.length}</span>
        </div>
        <div class="kanban-cards" data-status="${status}">
          ${cardsHtml || '<div class="empty-state" style="padding:20px;"><p style="font-size:0.72rem;">Drop tasks here</p></div>'}
        </div>
      </div>
    `;
  }).join('');

  $('#tasks-kanban').innerHTML = columns;
  initDragAndDrop();
  initTaskCardActions();
}

function renderTaskTable() {
  const tasks = store.getTasks();

  const html = tasks.map(t => {
    const member = store.getTeamMember(t.assignee);
    const statusClass = t.status === 'Done' ? 'done' : t.status === 'In Progress' ? 'inprogress' : 'todo';

    return `
      <tr>
        <td style="font-weight:600;">${t.name}</td>
        <td>
          <div class="assignee-chip">
            <div class="chip-avatar" style="background:${member ? member.color : '#6366f1'}">${member ? member.name[0] : '?'}</div>
            ${member ? member.name.split(' ')[0] : 'Unassigned'}
          </div>
        </td>
        <td>${store.getClientName(t.clientId)}</td>
        <td><span class="priority-badge ${t.priority.toLowerCase()}">${t.priority}</span></td>
        <td style="font-variant-numeric:tabular-nums;">${formatDate(t.dueDate)}</td>
        <td>
          <div style="display:flex;align-items:center;gap:6px;">
            <span class="task-status-indicator ${statusClass}" style="width:8px;height:8px;"></span>
            ${t.status}
          </div>
        </td>
        <td>
          <div style="display:flex;gap:4px;">
            <button class="btn btn-ghost btn-sm edit-task-btn" data-id="${t.id}">Edit</button>
            <button class="btn btn-danger btn-sm delete-task-btn" data-id="${t.id}">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  $('#tasks-table-body').innerHTML = html || '<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">✅</div><p>No tasks yet. Add one to get started.</p></div></td></tr>';
  initTaskCardActions();
}

// ── Drag & Drop ──────────────────────────────────────────────
function initDragAndDrop() {
  let draggedId = null;

  $$('.kanban-card[draggable]').forEach(card => {
    card.addEventListener('dragstart', (e) => {
      draggedId = card.dataset.taskId;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      $$('.kanban-column').forEach(c => c.classList.remove('drag-over'));
    });
  });

  $$('.kanban-cards').forEach(zone => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      zone.closest('.kanban-column').classList.add('drag-over');
    });
    zone.addEventListener('dragleave', (e) => {
      if (!zone.contains(e.relatedTarget)) {
        zone.closest('.kanban-column').classList.remove('drag-over');
      }
    });
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      const newStatus = zone.dataset.status;
      if (draggedId && newStatus) {
        store.updateTask(draggedId, { status: newStatus });
        renderKanban();
        updateBadges();
        showToast(`Task moved to ${newStatus}`, 'success');
        if (typeof playTick === 'function') playTick();
      }
      zone.closest('.kanban-column').classList.remove('drag-over');
    });
  });
}

function initTaskCardActions() {
  $$('.edit-task-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openTaskModal(btn.dataset.id);
    });
  });
  $$('.delete-task-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      store.deleteTask(btn.dataset.id);
      renderCurrentView();
      updateBadges();
      showToast('Task deleted', 'info');
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// PIPELINE VIEW
// ═══════════════════════════════════════════════════════════════

function renderPipeline() {
  let leads = store.getLeads();

  if (pipelineStageFilter !== 'all') {
    leads = leads.filter(l => l.stage === pipelineStageFilter);
  }
  if (pipelineTempFilter !== 'all') {
    leads = leads.filter(l => l.temperature === pipelineTempFilter);
  }

  const html = leads.map(l => {
    const source = store.getSourceInfo(l.source);
    return `
      <div class="glass-card">
        <div class="card-header">
          <div>
            <div class="card-title">${l.companyName}</div>
            <div class="source-tag" style="margin-top:4px;">
              <span class="source-icon">${source ? source.icon : '📋'}</span>
              <span>${source ? source.label : l.source}</span>
            </div>
          </div>
          <span class="temp-badge ${l.temperature.toLowerCase()}">
            <span class="temp-dot"></span> ${l.temperature}
          </span>
        </div>
        <div class="card-meta">
          <div class="card-meta-row"><span class="meta-icon">👤</span> ${l.contactPerson}</div>
          <div class="card-meta-row"><span class="meta-icon">📅</span> Last: ${formatDate(l.lastContact)}</div>
        </div>
        <div style="margin-top:12px;">
          <span class="stage-badge">${l.stage}</span>
        </div>
        <div class="card-actions">
          <button class="btn btn-ghost btn-sm edit-lead-btn" data-id="${l.id}">Edit</button>
          <button class="btn btn-danger btn-sm delete-lead-btn" data-id="${l.id}">Delete</button>
        </div>
      </div>
    `;
  }).join('');

  $('#pipeline-cards').innerHTML = html || '<div class="empty-state" style="grid-column:1/-1;"><div class="empty-icon">🚀</div><p>No leads matching filters</p></div>';

  // Pipeline filters
  initPipelineFilters();

  // Lead card actions
  $$('.edit-lead-btn').forEach(btn => {
    btn.addEventListener('click', () => openLeadModal(btn.dataset.id));
  });
  $$('.delete-lead-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      store.deleteLead(btn.dataset.id);
      renderPipeline();
      updateBadges();
      showToast('Lead removed', 'info');
    });
  });
}

function initPipelineFilters() {
  $$('#pipeline-stage-filter .filter-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.filter === pipelineStageFilter);
    pill.addEventListener('click', () => {
      pipelineStageFilter = pill.dataset.filter;
      renderPipeline();
    });
  });
  $$('#pipeline-temp-filter .filter-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.filter === pipelineTempFilter);
    pill.addEventListener('click', () => {
      pipelineTempFilter = pill.dataset.filter;
      renderPipeline();
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// CLIENTS VIEW
// ═══════════════════════════════════════════════════════════════

function renderClients() {
  const clients = store.getClients();
  const colors = ['linear-gradient(135deg, #6366f1, #a78bfa)', 'linear-gradient(135deg, #22c55e, #34d399)', 'linear-gradient(135deg, #f59e0b, #fbbf24)', 'linear-gradient(135deg, #06b6d4, #22d3ee)'];

  const html = clients.map((c, i) => {
    const docsHtml = DOC_TYPES.map(d => {
      const hasLink = c.documents && c.documents[d.id];
      return `
        <div class="doc-slot ${hasLink ? 'has-link' : ''}" data-client="${c.id}" data-doc="${d.id}" title="${hasLink ? c.documents[d.id] : 'Click to add link'}">
          <span class="doc-icon">${d.icon}</span>
          <span>${d.label}</span>
        </div>
      `;
    }).join('');

    return `
      <div class="client-card-full">
        <div class="ccf-header">
          <div class="ccf-logo" style="background:${colors[i % colors.length]}">${c.name.substring(0, 2).toUpperCase()}</div>
          <div class="ccf-info">
            <h3>${c.name} <span class="status-dot ${c.status.toLowerCase()}" style="display:inline-block;vertical-align:middle;margin-left:6px;"></span></h3>
            <p>${c.location} · ${c.status}</p>
          </div>
          <div style="margin-left:auto;display:flex;gap:6px;">
            <button class="btn btn-ghost btn-sm edit-client-btn" data-id="${c.id}">Edit</button>
            <button class="btn btn-danger btn-sm delete-client-btn" data-id="${c.id}">Delete</button>
          </div>
        </div>
        <div class="ccf-details">
          <div class="ccf-detail-item">
            <span class="detail-label">Contact Person</span>
            <span class="detail-value">${c.contactPerson}</span>
          </div>
          <div class="ccf-detail-item">
            <span class="detail-label">Services</span>
            <span class="detail-value">${c.services}</span>
          </div>
          <div class="ccf-detail-item">
            <span class="detail-label">Last Updated</span>
            <span class="detail-value">${formatDate(c.lastUpdated)}</span>
          </div>
        </div>
        <div class="ccf-docs-title">Onboarding Documents</div>
        <div class="ccf-docs-grid">${docsHtml}</div>
      </div>
    `;
  }).join('');

  $('#clients-list').innerHTML = html || '<div class="empty-state"><div class="empty-icon">🏢</div><p>No clients yet. Add your first client.</p></div>';

  // Client actions
  $$('.edit-client-btn').forEach(btn => {
    btn.addEventListener('click', () => openClientModal(btn.dataset.id));
  });
  $$('.delete-client-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      store.deleteClient(btn.dataset.id);
      renderClients();
      updateBadges();
      showToast('Client removed', 'info');
    });
  });

  // Doc slot click — prompt for URL
  $$('.doc-slot').forEach(slot => {
    slot.addEventListener('click', () => {
      const clientId = slot.dataset.client;
      const docId = slot.dataset.doc;
      const client = store.getClient(clientId);
      const currentUrl = client.documents?.[docId] || '';
      const url = prompt(`Enter URL for ${DOC_TYPES.find(d => d.id === docId)?.label}:`, currentUrl);
      if (url !== null) {
        const docs = { ...(client.documents || {}) };
        docs[docId] = url;
        store.updateClient(clientId, { documents: docs });
        renderClients();
        showToast('Document link updated', 'success');
      }
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// SETTINGS VIEW
// ═══════════════════════════════════════════════════════════════

function renderSettings() {
  const settings = store.getSettings();

  // Team Panel
  const teamHtml = TEAM_MEMBERS.map(m => `
    <div class="team-member-row">
      <div class="tm-avatar" style="background:${m.color}">${m.name[0]}</div>
      <div class="tm-info">
        <div class="tm-name">${m.name}</div>
        <div class="tm-role">${m.role}</div>
      </div>
    </div>
  `).join('');

  // Sources Panel
  const sourcesHtml = LEAD_SOURCES.map(s => `
    <div class="source-list-item">
      <span class="sl-icon">${s.icon}</span>
      <span>${s.label}</span>
    </div>
  `).join('');

  const html = `
    <!-- Team Panel -->
    <div class="settings-panel">
      <h3>Team Members</h3>
      <p class="sp-desc">Your agency crew</p>
      ${teamHtml}
    </div>

    <!-- Lead Sources Panel -->
    <div class="settings-panel">
      <h3>Lead Sources</h3>
      <p class="sp-desc">Configured inbound channels</p>
      ${sourcesHtml}
    </div>

    <!-- Theme Palette -->
    <div class="settings-panel">
      <h3>Interface Theme</h3>
      <p class="sp-desc">Select your agency's energy color</p>
      <div class="theme-picker" id="theme-picker-container"></div>
    </div>

    <!-- CREA Config -->
    <div class="settings-panel">
      <h3>CREA Configuration</h3>
      <p class="sp-desc">WhatsApp automation bot settings</p>
      <div class="toggle-row">
        <span class="toggle-label">Enable CREA Pings</span>
        <label class="toggle-switch">
          <input type="checkbox" id="crea-enabled" ${settings.creaEnabled ? 'checked' : ''} />
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="form-group" style="margin-top:12px;">
        <label class="form-label">Morning Ping Time</label>
        <input type="time" class="form-input" id="crea-time" value="${settings.creaMorningTime || '09:00'}" />
      </div>
      <div class="form-group">
        <label class="form-label">WhatsApp Number</label>
        <input type="text" class="form-input" id="crea-whatsapp" value="${settings.whatsappNumber || ''}" placeholder="+91 XXXXX XXXXX" />
      </div>
      <button class="btn btn-primary btn-sm" id="save-crea-btn" style="margin-top:4px;">Save CREA Settings</button>
    </div>

    <!-- Data Management -->
    <div class="settings-panel">
      <h3>Data Management</h3>
      <p class="sp-desc">Export, import, or reset your CRM data</p>
      <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px;">
        <button class="btn btn-ghost" id="export-btn">📤 Export JSON</button>
        <button class="btn btn-ghost" id="import-btn">📥 Import JSON</button>
        <button class="btn btn-danger" id="reset-btn">🗑️ Reset to Seed Data</button>
      </div>
      <input type="file" id="import-file" accept=".json" style="display:none;" />
    </div>
  `;

  $('#settings-grid').innerHTML = html;

  // Render Theme Picker
  const container = $('#theme-picker-container');
  if (container) {
    const settings = store.getSettings();
    const themes = [
      { name: 'Cyber Violet', h: 260, s: 89, l: 66 },
      { name: 'Matrix Green', h: 142, s: 76, l: 36 },
      { name: 'Sunset Orange', h: 24, s: 95, l: 53 },
      { name: 'Ocean Blue', h: 199, s: 89, l: 48 },
      { name: 'Rose Dark', h: 334, s: 86, l: 60 }
    ];
    container.innerHTML = themes.map(t => {
      const isCurrent = settings.themeAccent && settings.themeAccent.h === t.h;
      return `<div class="theme-color ${isCurrent ? 'active' : ''}" style="background: hsl(${t.h}, ${t.s}%, ${t.l}%);" title="${t.name}"></div>`;
    }).join('');
    
    $$('.theme-color').forEach((el, index) => {
      el.addEventListener('click', () => {
        store.updateSettings({ themeAccent: themes[index] });
        const root = document.documentElement;
        root.style.setProperty('--accent-h', themes[index].h);
        root.style.setProperty('--accent-s', `${themes[index].s}%`);
        root.style.setProperty('--accent-l', `${themes[index].l}%`);
        $$('.theme-color').forEach(e => e.classList.remove('active'));
        el.classList.add('active');
        showToast(`Theme updated to ${themes[index].name}`, 'success');
      });
    });
  }

  // Setup CREA event listeners
  $('#save-crea-btn').addEventListener('click', () => {
    store.updateSettings({
      creaEnabled: $('#crea-enabled').checked,
      creaMorningTime: $('#crea-time').value,
      whatsappNumber: $('#crea-whatsapp').value,
    });
    showToast('CREA settings saved', 'success');
  });

  $('#export-btn').addEventListener('click', () => {
    const json = store.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gensync_crm_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported', 'success');
  });

  $('#import-btn').addEventListener('click', () => {
    $('#import-file').click();
  });

  $('#import-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (store.importJSON(reader.result)) {
        renderCurrentView();
        updateBadges();
        showToast('Data imported successfully', 'success');
      } else {
        showToast('Import failed — invalid file', 'error');
      }
    };
    reader.readAsText(file);
  });

  $('#reset-btn').addEventListener('click', () => {
    if (confirm('Reset all data to defaults? This cannot be undone.')) {
      store.resetToSeed();
      renderCurrentView();
      updateBadges();
      showToast('Data reset to defaults', 'info');
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// MODALS
// ═══════════════════════════════════════════════════════════════

function initModals() {
  $('#modal-close').addEventListener('click', closeModal);
  $('#modal-overlay').addEventListener('click', (e) => {
    if (e.target === $('#modal-overlay')) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function openModal(title) {
  $('#modal-title').textContent = title;
  $('#modal-overlay').classList.add('open');
}

function closeModal() {
  $('#modal-overlay').classList.remove('open');
}

// ── Task Modal ───────────────────────────────────────────────
function openTaskModal(editId = null) {
  const task = editId ? store.getTask(editId) : null;
  const isEdit = !!task;

  openModal(isEdit ? 'Edit Task' : 'New Task');

  const clientOptions = store.getClients().map(c => `<option value="${c.id}" ${task && task.clientId === c.id ? 'selected' : ''}>${c.name}</option>`).join('');
  const assigneeOptions = TEAM_MEMBERS.map(m => `<option value="${m.id}" ${task && task.assignee === m.id ? 'selected' : ''}>${m.name}</option>`).join('');
  const statusOptions = TASK_STATUSES.map(s => `<option value="${s}" ${task && task.status === s ? 'selected' : ''}>${s}</option>`).join('');
  const priorityOptions = TASK_PRIORITIES.map(p => `<option value="${p}" ${task && task.priority === p ? 'selected' : ''}>${p}</option>`).join('');

  $('#modal-body').innerHTML = `
    <div class="form-group">
      <label class="form-label">Task Name</label>
      <input type="text" class="form-input" id="task-name" value="${task ? task.name : ''}" placeholder="e.g. Website Redesign V2" />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Assignee</label>
        <select class="form-select" id="task-assignee">${assigneeOptions}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Client</label>
        <select class="form-select" id="task-client">${clientOptions}</select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Priority</label>
        <select class="form-select" id="task-priority">${priorityOptions}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Status</label>
        <select class="form-select" id="task-status">${statusOptions}</select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Due Date</label>
      <input type="date" class="form-input" id="task-due" value="${task ? task.dueDate : new Date().toISOString().split('T')[0]}" />
    </div>
  `;

  $('#modal-footer').innerHTML = `
    <button class="btn btn-ghost" id="modal-cancel">Cancel</button>
    <button class="btn btn-primary" id="modal-save">${isEdit ? 'Update' : 'Create'} Task</button>
  `;

  $('#modal-cancel').addEventListener('click', closeModal);
  $('#modal-save').addEventListener('click', () => {
    const name = $('#task-name').value.trim();
    if (!name) { showToast('Task name is required', 'error'); return; }

    const data = {
      name,
      assignee: $('#task-assignee').value,
      clientId: $('#task-client').value,
      priority: $('#task-priority').value,
      status: $('#task-status').value,
      dueDate: $('#task-due').value,
    };

    if (isEdit) {
      store.updateTask(editId, data);
      showToast('Task updated', 'success');
    } else {
      store.addTask(data);
      showToast('Task created', 'success');
    }

    closeModal();
    renderCurrentView();
    updateBadges();
  });
}

// ── Lead Modal ───────────────────────────────────────────────
function openLeadModal(editId = null) {
  const lead = editId ? store.getLead(editId) : null;
  const isEdit = !!lead;

  openModal(isEdit ? 'Edit Lead' : 'New Lead');

  const sourceOptions = LEAD_SOURCES.map(s => `<option value="${s.id}" ${lead && lead.source === s.id ? 'selected' : ''}>${s.icon} ${s.label}</option>`).join('');
  const tempOptions = TEMPERATURES.map(t => `<option value="${t}" ${lead && lead.temperature === t ? 'selected' : ''}>${t}</option>`).join('');
  const stageOptions = PIPELINE_STAGES.map(s => `<option value="${s}" ${lead && lead.stage === s ? 'selected' : ''}>${s}</option>`).join('');

  $('#modal-body').innerHTML = `
    <div class="form-group">
      <label class="form-label">Company Name</label>
      <input type="text" class="form-input" id="lead-company" value="${lead ? lead.companyName : ''}" placeholder="e.g. TechNova Solutions" />
    </div>
    <div class="form-group">
      <label class="form-label">Contact Person</label>
      <input type="text" class="form-input" id="lead-contact" value="${lead ? lead.contactPerson : ''}" placeholder="e.g. Arjun Mehta" />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Source</label>
        <select class="form-select" id="lead-source">${sourceOptions}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Temperature</label>
        <select class="form-select" id="lead-temp">${tempOptions}</select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Stage</label>
        <select class="form-select" id="lead-stage">${stageOptions}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Last Contact</label>
        <input type="date" class="form-input" id="lead-date" value="${lead ? lead.lastContact : new Date().toISOString().split('T')[0]}" />
      </div>
    </div>
  `;

  $('#modal-footer').innerHTML = `
    <button class="btn btn-ghost" id="modal-cancel">Cancel</button>
    <button class="btn btn-primary" id="modal-save">${isEdit ? 'Update' : 'Create'} Lead</button>
  `;

  $('#modal-cancel').addEventListener('click', closeModal);
  $('#modal-save').addEventListener('click', () => {
    const companyName = $('#lead-company').value.trim();
    if (!companyName) { showToast('Company name is required', 'error'); return; }

    const data = {
      companyName,
      contactPerson: $('#lead-contact').value.trim(),
      source: $('#lead-source').value,
      temperature: $('#lead-temp').value,
      stage: $('#lead-stage').value,
      lastContact: $('#lead-date').value,
    };

    if (isEdit) {
      store.updateLead(editId, data);
      showToast('Lead updated', 'success');
    } else {
      store.addLead(data);
      showToast('Lead added to pipeline', 'success');
    }

    closeModal();
    renderCurrentView();
    updateBadges();
  });
}

// ── Client Modal ─────────────────────────────────────────────
function openClientModal(editId = null) {
  const client = editId ? store.getClient(editId) : null;
  const isEdit = !!client;

  openModal(isEdit ? 'Edit Client' : 'New Client');

  const statusOptions = CLIENT_STATUSES.map(s => `<option value="${s}" ${client && client.status === s ? 'selected' : ''}>${s}</option>`).join('');

  $('#modal-body').innerHTML = `
    <div class="form-group">
      <label class="form-label">Client Name</label>
      <input type="text" class="form-input" id="client-name" value="${client ? client.name : ''}" placeholder="e.g. ConnectMe" />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Contact Person</label>
        <input type="text" class="form-input" id="client-contact" value="${client ? client.contactPerson : ''}" placeholder="e.g. CEO" />
      </div>
      <div class="form-group">
        <label class="form-label">Status</label>
        <select class="form-select" id="client-status">${statusOptions}</select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Location</label>
      <input type="text" class="form-input" id="client-location" value="${client ? client.location : ''}" placeholder="e.g. Dubai, UAE" />
    </div>
    <div class="form-group">
      <label class="form-label">Services Provided</label>
      <input type="text" class="form-input" id="client-services" value="${client ? client.services : ''}" placeholder="e.g. Website, SEO, Brochures" />
    </div>
  `;

  $('#modal-footer').innerHTML = `
    <button class="btn btn-ghost" id="modal-cancel">Cancel</button>
    <button class="btn btn-primary" id="modal-save">${isEdit ? 'Update' : 'Create'} Client</button>
  `;

  $('#modal-cancel').addEventListener('click', closeModal);
  $('#modal-save').addEventListener('click', () => {
    const name = $('#client-name').value.trim();
    if (!name) { showToast('Client name is required', 'error'); return; }

    const data = {
      name,
      contactPerson: $('#client-contact').value.trim(),
      status: $('#client-status').value,
      location: $('#client-location').value.trim(),
      services: $('#client-services').value.trim(),
      lastUpdated: new Date().toISOString().split('T')[0],
      documents: client ? client.documents : { contract: '', brand: '', product: '', assets: '', contact: '' },
    };

    if (isEdit) {
      store.updateClient(editId, data);
      showToast('Client updated', 'success');
    } else {
      store.addClient(data);
      showToast('Client added', 'success');
    }

    closeModal();
    renderCurrentView();
    updateBadges();
  });
}

// ═══════════════════════════════════════════════════════════════
// TOASTS
// ═══════════════════════════════════════════════════════════════

function showToast(message, type = 'info') {
  const container = $('#toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span> ${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    toast.style.transition = 'all 300ms ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

// ═══════════════════════════════════════════════════════════════
// PREMIUM FEATURES (Themes, Audio, Cmd+K, Chart, Sidebar)
// ═══════════════════════════════════════════════════════════════

let audioCtx = null;
function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playTick() {
  initAudio();
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);
  gain.gain.setValueAtTime(1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.05);
}

function playChime() {
  initAudio();
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(600, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.8);
}

window.playTick = playTick; 
window.playChime = playChime;

function initPremiumFeatures() {
  initThemes();
  initSidebarCollapse();
  initCommandPalette();
  
  // Audio unlock hack
  document.body.addEventListener('click', initAudio, { once: true });
  
  // Override store.updateLead to play chime on Won
  const originalUpdateLead = store.updateLead.bind(store);
  store.updateLead = (id, updates) => {
    const oldLead = store.getLead(id);
    originalUpdateLead(id, updates);
    if (updates.stage === 'Won' && oldLead && oldLead.stage !== 'Won') {
      playChime();
    }
  };
}

function initThemes() {
  const root = document.documentElement;
  const settings = store.getSettings();
  
  if (settings.themeAccent) {
    root.style.setProperty('--accent-h', settings.themeAccent.h);
    root.style.setProperty('--accent-s', settings.themeAccent.s + '%');
    root.style.setProperty('--accent-l', settings.themeAccent.l + '%');
  }
}

function initSidebarCollapse() {
  const btn = $('#sidebar-collapse-btn');
  if(btn) {
    btn.addEventListener('click', () => {
      $('#sidebar').classList.toggle('collapsed');
      const isCollapsed = $('#sidebar').classList.contains('collapsed');
      btn.innerHTML = `<span class="nav-icon">${isCollapsed ? '⇥' : '⇤'}</span> <span>${isCollapsed ? 'Expand' : 'Collapse'}</span>`;
    });
  }
}

function initCommandPalette() {
  const overlay = $('#cmd-overlay');
  const input = $('#cmd-input');
  const results = $('#cmd-results');

  const openPalette = () => {
    overlay.classList.add('open');
    input.value = '';
    renderCmdResults('');
    // delay focus for transition
    setTimeout(() => input.focus(), 50);
  };
  const closePalette = () => overlay.classList.remove('open');

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openPalette();
    }
    if (e.key === 'Escape') closePalette();
  });

  overlay.addEventListener('click', (e) => {
    if(e.target === overlay) closePalette();
  });

  input.addEventListener('input', (e) => {
    renderCmdResults(e.target.value.toLowerCase());
  });

  function renderCmdResults(query) {
    if (!query) {
      results.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:0.9rem;">Type to search clients, leads, and tasks...</div>';
      return;
    }
    
    let html = '';
    
    const ICON_CLIENT = '\uD83C\uDFE2';
    const ICON_LEAD = '\uD83D\uDE80';
    const ICON_TASK = '\u2705';

    // Clients
    store.getClients().filter(c => c.name.toLowerCase().includes(query)).forEach(c => {
      html += '<div class="cmd-item" onclick="window.switchTab(\'clients\'); window.openClientModal(\'' + c.id + '\'); document.getElementById(\'cmd-overlay\').classList.remove(\'open\')">' +
        '<div class="cmd-item-icon">' + ICON_CLIENT + '</div>' +
        '<div class="cmd-item-content">' +
          '<div class="cmd-item-title">' + c.name + '</div><div class="cmd-item-sub">Client - ' + c.status + '</div>' +
        '</div>' +
      '</div>';
    });

    // Leads
    store.getLeads().filter(l => l.companyName.toLowerCase().includes(query) || l.contactPerson.toLowerCase().includes(query)).forEach(l => {
      html += '<div class="cmd-item" onclick="window.switchTab(\'pipeline\'); window.openLeadModal(\'' + l.id + '\'); document.getElementById(\'cmd-overlay\').classList.remove(\'open\')">' +
        '<div class="cmd-item-icon">' + ICON_LEAD + '</div>' +
        '<div class="cmd-item-content">' +
          '<div class="cmd-item-title">' + l.companyName + '</div><div class="cmd-item-sub">Lead - ' + l.stage + '</div>' +
        '</div>' +
      '</div>';
    });

    // Tasks
    store.getTasks().filter(t => t.name.toLowerCase().includes(query)).forEach(t => {
      html += '<div class="cmd-item" onclick="window.switchTab(\'tasks\'); window.openTaskModal(\'' + t.id + '\'); document.getElementById(\'cmd-overlay\').classList.remove(\'open\')">' +
        '<div class="cmd-item-icon">' + ICON_TASK + '</div>' +
        '<div class="cmd-item-content">' +
          '<div class="cmd-item-title">' + t.name + '</div><div class="cmd-item-sub">Task - ' + t.status + '</div>' +
        '</div>' +
      '</div>';
    });

    results.innerHTML = html || '<div style="padding:20px;text-align:center;color:var(--text-muted);">No results found.</div>';
  }
}

// Global expose
window.switchTab = switchTab;
window.openClientModal = openClientModal;
window.openLeadModal = openLeadModal;
window.openTaskModal = openTaskModal;

window.drawAreaChart = function() {
  const container = $('#dashboard-chart');
  if(!container) return;
  
  const data = [20, 35, 28, 45, 60, 50, 85];
  const max = Math.max(...data);
  const w = container.clientWidth || 800;
  const h = 180;
  
  const step = w / (data.length - 1);
  const points = data.map((val, i) => {
    return { x: i * step, y: h - (val / max) * h * 0.8 - 10 }; 
  });
  
  let d = `M 0 ${points[0].y}`;
  for(let i=0; i<points.length-1; i++) {
    const xc = (points[i].x + points[i+1].x) / 2;
    const yc = (points[i].y + points[i+1].y) / 2;
    d += ` Q ${points[i].x} ${points[i].y}, ${xc} ${yc}`;
  }
  d += ` T ${points[points.length-1].x} ${points[points.length-1].y}`;
  
  const dArea = d + ` L ${w} ${h} L 0 ${h} Z`;

  container.innerHTML = `
    <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
      <path class="chart-area" d="${dArea}"></path>
      <path class="chart-line" d="${d}"></path>
    </svg>
  `;
};
