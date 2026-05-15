(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))s(l);new MutationObserver(l=>{for(const o of l)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function a(l){const o={};return l.integrity&&(o.integrity=l.integrity),l.referrerPolicy&&(o.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?o.credentials="include":l.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(l){if(l.ep)return;l.ep=!0;const o=a(l);fetch(l.href,o)}})();const w="",O=[{id:"manish",name:"Manish Sampatrao",role:"Founder / Media Lead",color:"#6366f1"},{id:"mohit",name:"Mohit Sula",role:"Partner / Tech Lead",color:"#22c55e"},{id:"amulya",name:"Amulya",role:"Designer",color:"#f59e0b"},{id:"manikanta",name:"Manikanta",role:"Video Editor",color:"#ec4899"},{id:"manas",name:"Manas",role:"Cinematographer",color:"#8b5cf6"}],N=[{id:"tarini",label:"Tarini (Referral)",icon:"👤"},{id:"email",label:"Email",icon:"📧"},{id:"linkedin",label:"LinkedIn Post",icon:"💼"},{id:"instagram",label:"Instagram Post",icon:"📸"},{id:"linkedin_dm",label:"LinkedIn DM",icon:"💬"},{id:"loom",label:"Loom Video",icon:"🎥"}],Y=["HOT","WARM","COLD"],Z=["New","Contacted","Proposal","Negotiation","Won","Lost"],F=["Not Started","In Progress","Done"],z=["P0","P1","P2","P3"],ee=["Active","Paused","Done"],_=[{id:"contract",label:"Service Contract",icon:"📄"},{id:"brand",label:"Brand Guidelines",icon:"🎨"},{id:"product",label:"Product Data",icon:"📊"},{id:"assets",label:"Assets Folder",icon:"📁"},{id:"contact",label:"Contact Info",icon:"📇"}];let y=[],k=[],L=[],B=[];const d={init:async function(){await this.loadTasks(),this.initialized=!0,B.forEach(e=>e(this))},subscribe:function(e){B.push(e)},loadTasks:async function(){try{y=await(await fetch(`${w}/api/tasks`)).json()}catch(e){console.error("Failed to load tasks:",e)}},getTasks:function(){return y},getTask:function(e){return y.find(t=>t.id===e)},getTeamMember:function(e){return O.find(t=>t.id===e)},getSourceInfo:function(e){return N.find(t=>t.id===e)},getClientName:function(e){const t=k.find(a=>a.id===e);return t?t.name:"—"},addTask:async function(e){const a=await(await fetch(`${w}/api/tasks`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})).json();return y.push(a),a},updateTask:async function(e,t){const s=await(await fetch(`${w}/api/tasks/${e}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)})).json(),l=y.findIndex(o=>o.id===e);return l!==-1&&(y[l]=s),s},deleteTask:async function(e){await fetch(`${w}/api/tasks/${e}`,{method:"DELETE"}),y=y.filter(t=>t.id!==e)},getClients:function(){return k},getClient:function(e){return k.find(t=>t.id===e)},addClient:function(e){return e.id=Date.now().toString(36),k.push(e),e},updateClient:function(e,t){const a=k.findIndex(s=>s.id===e);a!==-1&&Object.assign(k[a],t)},deleteClient:function(e){k=k.filter(t=>t.id!==e)},getLeads:function(){return L},getLead:function(e){return L.find(t=>t.id===e)},addLead:function(e){return e.id=Date.now().toString(36),L.push(e),e},updateLead:function(e,t){const a=L.findIndex(s=>s.id===e);a!==-1&&Object.assign(L[a],t)},deleteLead:function(e){L=L.filter(t=>t.id!==e)},getSettings:function(){return{}},updateSettings:function(){}},i=e=>document.querySelector(e),v=e=>document.querySelectorAll(e);let I="dashboard",D="kanban",M="all",C="all",E="all";document.addEventListener("DOMContentLoaded",async()=>{await d.init(),fe(),ae(),se(),ge(),ne(),$(),b(),te()});function te(){function e(){const t=new Date,a={weekday:"short",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"};i("#header-time").textContent=t.toLocaleDateString("en-US",a)}e(),setInterval(e,3e4)}function ae(){v(".nav-item").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.tab;H(t)})})}function H(e){I=e,v(".nav-item").forEach(s=>s.classList.remove("active")),i(`.nav-item[data-tab="${e}"]`).classList.add("active"),v(".view").forEach(s=>s.classList.remove("active")),i(`#view-${e}`).classList.add("active");const t={dashboard:"Dashboard",tasks:"Tasks",pipeline:"Pipeline",clients:"Clients",settings:"Settings"};i("#page-title").textContent=t[e]||"Dashboard";const a={dashboard:"Add",tasks:"New Task",pipeline:"New Lead",clients:"New Client",settings:"Add"};i("#global-add-label").textContent=a[e]||"Add",i("#global-add-btn").style.display=e==="settings"?"none":"inline-flex",$(),i("#sidebar").classList.remove("open")}function $(){switch(I){case"dashboard":ie();break;case"tasks":X();break;case"pipeline":x();break;case"clients":A();break;case"settings":ve();break}}function b(){const t=d.getTasks().filter(s=>s.status!=="Done").length;i("#tasks-badge").textContent=t;const a=d.getLeads();i("#leads-badge").textContent=a.length}function se(){i("#global-add-btn").addEventListener("click",()=>{switch(I){case"tasks":S();break;case"pipeline":R();break;case"clients":U();break;default:S();break}})}function ne(){i("#mobile-menu-btn").addEventListener("click",()=>{i("#sidebar").classList.toggle("open")})}function ie(){le(),oe(),W(),ce(),de(),typeof drawAreaChart=="function"&&drawAreaChart()}function le(){const e=d.getClients(),t=d.getLeads(),a=d.getTasks(),s=e.filter(r=>r.status==="Active").length,l=t.filter(r=>r.temperature==="HOT").length,o=a.filter(r=>r.status!=="Done").length,n=new Date().toISOString().split("T")[0],c=a.filter(r=>r.status!=="Done"&&r.dueDate<n);if(c.length>0){let r=c.map(p=>"• "+p.name).join(" | ");r.length>60&&(r=r.substring(0,60)+"..."),i("#dashboard-alerts").innerHTML=`
      <div class="alert-banner">
        <div class="alert-icon">⚠️</div>
        <div class="alert-content">
          <div class="alert-title">${c.length} Overdue Task${c.length>1?"s":""}</div>
          <div class="alert-desc">${r}</div>
        </div>
        <button class="btn btn-ghost" style="border:1px solid rgba(255,255,255,0.3);" onclick="window.switchTab('tasks');">View Tasks</button>
      </div>
    `}else i("#dashboard-alerts").innerHTML="";const u=a.filter(r=>r.status!=="Done"&&(r.dueDate===n||r.priority==="Urgent"||r.priority==="High"));if(u.length>0){const r=u.map(p=>{const J=p.priority==="Urgent"?"urgent":p.priority==="High"?"high":"",Q=p.priority==="Urgent"?"🔴":p.priority==="High"?"🟠":"🕒";return`
        <div class="priority-item ${J}" onclick="window.switchTab('tasks'); window.openTaskModal('${p.id}')">
          <div style="font-size: 1.5rem;">${Q}</div>
          <div>
            <div class="pi-title">${p.name}</div>
            <div class="pi-sub">Due: ${T(p.dueDate)} • For: ${d.getClientName(p.clientId)}</div>
          </div>
        </div>
      `}).join("");i("#dashboard-priorities").innerHTML=`
      <div class="priorities-widget">
        <div class="priorities-header">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
          Quick Stats: Today's Priorities
        </div>
        <div class="priorities-grid">
           ${r}
        </div>
      </div>
    `}else i("#dashboard-priorities").innerHTML="";const g=`
    <div class="stat-card" data-accent="indigo">
      <div class="stat-label">Active Clients</div>
      <div class="stat-value">${s}</div>
      <div class="stat-sub">${e.length} total in roster</div>
    </div>
    <div class="stat-card" data-accent="cyan">
      <div class="stat-label">Open Leads</div>
      <div class="stat-value">${t.filter(r=>r.stage!=="Won"&&r.stage!=="Lost").length}</div>
      <div class="stat-sub">${t.length} total pipeline</div>
    </div>
    <div class="stat-card" data-accent="red">
      <div class="stat-label">Hot Leads</div>
      <div class="stat-value">${l}</div>
      <div class="stat-sub">Ready to close</div>
    </div>
    <div class="stat-card" data-accent="amber">
      <div class="stat-label">Pending Tasks</div>
      <div class="stat-value">${o}</div>
      <div class="stat-sub">${a.filter(r=>r.status==="Done").length} completed</div>
    </div>
  `;i("#dashboard-stats").innerHTML=g}function oe(){const e=d.getClients().filter(s=>s.status==="Active"),t=["linear-gradient(135deg, #6366f1, #a78bfa)","linear-gradient(135deg, #22c55e, #34d399)"],a=e.map((s,l)=>`
    <div class="client-mini-card" data-id="${s.id}">
      <div class="client-logo" style="background:${t[l%t.length]}">
        ${s.name.substring(0,2).toUpperCase()}
      </div>
      <div class="client-details">
        <h3>${s.name} <span class="status-dot active" style="display:inline-block;vertical-align:middle;margin-left:6px;"></span></h3>
        <p>📍 ${s.location} · ${s.services.split(",")[0]}</p>
      </div>
    </div>
  `).join("");i("#dashboard-clients").innerHTML=a||`<div class="empty-state">
    <svg class="empty-state-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
    <p>No active clients</p>
  </div>`,v(".client-mini-card").forEach(s=>{s.addEventListener("click",()=>H("clients"))})}function W(){let e=d.getLeads().filter(a=>a.stage!=="Won"&&a.stage!=="Lost");M!=="all"&&(e=e.filter(a=>a.temperature===M));const t=e.map(a=>{const s=d.getSourceInfo(a.source);return`
      <div class="glass-card">
        <div class="card-header">
          <div>
            <div class="card-title">${a.companyName}</div>
            <div class="source-tag" style="margin-top:4px;">
              <span class="source-icon">${s?s.icon:"📋"}</span>
              <span>${s?s.label:a.source}</span>
            </div>
          </div>
          <span class="temp-badge ${a.temperature.toLowerCase()}">
            <span class="temp-dot"></span> ${a.temperature}
          </span>
        </div>
        <div class="card-meta">
          <div class="card-meta-row">
            <span class="meta-icon">👤</span> ${a.contactPerson}
          </div>
          <div class="card-meta-row">
            <span class="meta-icon">📅</span> ${T(a.lastContact)}
          </div>
        </div>
        <div style="margin-top:12px;">
          <span class="stage-badge">${a.stage}</span>
        </div>
      </div>
    `}).join("");i("#dashboard-leads").innerHTML=t||`<div class="empty-state" style="grid-column:1/-1;">
    <svg class="empty-state-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
    <p>No leads matching filter</p>
  </div>`}function ce(){const e=d.getTasks().filter(s=>s.status!=="Done"),t=new Date().toISOString().split("T")[0],a=e.map(s=>{const l=d.getTeamMember(s.assignee),o=s.status==="In Progress"?"inprogress":"todo",n=s.dueDate<t;return`
      <div class="task-row">
        <div class="task-status-indicator ${o}"></div>
        <div class="task-info">
          <div class="task-name">${s.name}</div>
          <div class="task-client-name">${d.getClientName(s.clientId)}</div>
        </div>
        <div class="assignee-chip">
          <div class="chip-avatar" style="background:${l?l.color:"#6366f1"}">${l?l.name[0]:"?"}</div>
          ${l?l.name.split(" ")[0]:"Unassigned"}
        </div>
        <span class="priority-badge ${s.priority.toLowerCase()}">${s.priority}</span>
        <div class="task-due ${n?"overdue":""}">${n?"⚠ ":""}${T(s.dueDate)}</div>
      </div>
    `}).join("");i("#dashboard-tasks").innerHTML=a||'<div class="empty-state"><div class="empty-icon">🎉</div><p>All tasks done! Great work.</p></div>'}function de(){v("#dashboard-temp-filter .filter-pill").forEach(e=>{e.addEventListener("click",()=>{v("#dashboard-temp-filter .filter-pill").forEach(t=>t.classList.remove("active")),e.classList.add("active"),M=e.dataset.filter,W()})})}function X(){re(),D==="kanban"?(K(),i("#tasks-kanban").style.display="grid",i("#tasks-table").style.display="none"):(pe(),i("#tasks-kanban").style.display="none",i("#tasks-table").style.display="block")}function re(){v("#tasks-view-toggle .view-toggle-btn").forEach(e=>{e.classList.toggle("active",e.dataset.view===D),e.addEventListener("click",()=>{D=e.dataset.view,v("#tasks-view-toggle .view-toggle-btn").forEach(t=>t.classList.remove("active")),e.classList.add("active"),X()})})}function K(){const e=d.getTasks(),t=F.map(a=>{const s=e.filter(o=>o.status===a);a.toLowerCase().replace(/\s+/g,"");const l=s.map(o=>{const n=d.getTeamMember(o.assignee);return`
        <div class="kanban-card" draggable="true" data-task-id="${o.id}" data-priority="${o.priority}">
          <div class="kc-title">${o.name}</div>
          <div class="kc-footer">
            <span class="kc-client">${d.getClientName(o.clientId)}</span>
            <div style="display:flex;align-items:center;gap:6px;">
              <span class="priority-badge ${o.priority.toLowerCase()}">${o.priority}</span>
              <div class="assignee-chip">
                <div class="chip-avatar" style="background:${n?n.color:"#6366f1"}">${n?n.name[0]:"?"}</div>
                ${n?n.name.split(" ")[0]:"?"}
              </div>
            </div>
          </div>
          <div style="margin-top:8px;font-size:0.68rem;color:var(--text-muted);">Due: ${T(o.dueDate)}</div>
          <div class="card-actions" style="margin-top:10px;padding-top:10px;">
            <button class="btn btn-ghost btn-sm edit-task-btn" data-id="${o.id}">Edit</button>
            <button class="btn btn-danger btn-sm delete-task-btn" data-id="${o.id}">Delete</button>
          </div>
        </div>
      `}).join("");return`
      <div class="kanban-column" data-status="${a}">
        <div class="kanban-column-header">
          <span class="kanban-column-title">
            <span>${a==="To Do"?"📋":a==="In Progress"?"⚡":"✅"}</span>
            ${a}
          </span>
          <span class="kanban-column-count">${s.length}</span>
        </div>
        <div class="kanban-cards" data-status="${a}">
          ${l||'<div class="empty-state" style="padding:20px;"><p style="font-size:0.72rem;">Drop tasks here</p></div>'}
        </div>
      </div>
    `}).join("");i("#tasks-kanban").innerHTML=t,ue(),q()}function pe(){const t=d.getTasks().map(a=>{const s=d.getTeamMember(a.assignee),l=a.status==="Done"?"done":a.status==="In Progress"?"inprogress":"todo";return`
      <tr>
        <td style="font-weight:600;">${a.name}</td>
        <td>
          <div class="assignee-chip">
            <div class="chip-avatar" style="background:${s?s.color:"#6366f1"}">${s?s.name[0]:"?"}</div>
            ${s?s.name.split(" ")[0]:"Unassigned"}
          </div>
        </td>
        <td>${d.getClientName(a.clientId)}</td>
        <td><span class="priority-badge ${a.priority.toLowerCase()}">${a.priority}</span></td>
        <td style="font-variant-numeric:tabular-nums;">${T(a.dueDate)}</td>
        <td>
          <div style="display:flex;align-items:center;gap:6px;">
            <span class="task-status-indicator ${l}" style="width:8px;height:8px;"></span>
            ${a.status}
          </div>
        </td>
        <td>
          <div style="display:flex;gap:4px;">
            <button class="btn btn-ghost btn-sm edit-task-btn" data-id="${a.id}">Edit</button>
            <button class="btn btn-danger btn-sm delete-task-btn" data-id="${a.id}">Delete</button>
          </div>
        </td>
      </tr>
    `}).join("");i("#tasks-table-body").innerHTML=t||'<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">✅</div><p>No tasks yet. Add one to get started.</p></div></td></tr>',q()}function ue(){let e=null;v(".kanban-card[draggable]").forEach(t=>{t.addEventListener("dragstart",a=>{e=t.dataset.taskId,t.classList.add("dragging"),a.dataTransfer.effectAllowed="move"}),t.addEventListener("dragend",()=>{t.classList.remove("dragging"),v(".kanban-column").forEach(a=>a.classList.remove("drag-over"))})}),v(".kanban-cards").forEach(t=>{t.addEventListener("dragover",a=>{a.preventDefault(),a.dataTransfer.dropEffect="move",t.closest(".kanban-column").classList.add("drag-over")}),t.addEventListener("dragleave",a=>{t.contains(a.relatedTarget)||t.closest(".kanban-column").classList.remove("drag-over")}),t.addEventListener("drop",a=>{a.preventDefault();const s=t.dataset.status;e&&s&&(d.updateTask(e,{status:s}),K(),b(),f(`Task moved to ${s}`,"success"),typeof P=="function"&&P()),t.closest(".kanban-column").classList.remove("drag-over")})})}function q(){v(".edit-task-btn").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation(),S(e.dataset.id)})}),v(".delete-task-btn").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation(),d.deleteTask(e.dataset.id),$(),b(),f("Task deleted","info")})})}function x(){let e=d.getLeads();C!=="all"&&(e=e.filter(a=>a.stage===C)),E!=="all"&&(e=e.filter(a=>a.temperature===E));const t=e.map(a=>{const s=d.getSourceInfo(a.source);return`
      <div class="glass-card">
        <div class="card-header">
          <div>
            <div class="card-title">${a.companyName}</div>
            <div class="source-tag" style="margin-top:4px;">
              <span class="source-icon">${s?s.icon:"📋"}</span>
              <span>${s?s.label:a.source}</span>
            </div>
          </div>
          <span class="temp-badge ${a.temperature.toLowerCase()}">
            <span class="temp-dot"></span> ${a.temperature}
          </span>
        </div>
        <div class="card-meta">
          <div class="card-meta-row"><span class="meta-icon">👤</span> ${a.contactPerson}</div>
          <div class="card-meta-row"><span class="meta-icon">📅</span> Last: ${T(a.lastContact)}</div>
        </div>
        <div style="margin-top:12px;">
          <span class="stage-badge">${a.stage}</span>
        </div>
        <div class="card-actions">
          <button class="btn btn-ghost btn-sm edit-lead-btn" data-id="${a.id}">Edit</button>
          <button class="btn btn-danger btn-sm delete-lead-btn" data-id="${a.id}">Delete</button>
        </div>
      </div>
    `}).join("");i("#pipeline-cards").innerHTML=t||'<div class="empty-state" style="grid-column:1/-1;"><div class="empty-icon">🚀</div><p>No leads matching filters</p></div>',me(),v(".edit-lead-btn").forEach(a=>{a.addEventListener("click",()=>R(a.dataset.id))}),v(".delete-lead-btn").forEach(a=>{a.addEventListener("click",()=>{d.deleteLead(a.dataset.id),x(),b(),f("Lead removed","info")})})}function me(){v("#pipeline-stage-filter .filter-pill").forEach(e=>{e.classList.toggle("active",e.dataset.filter===C),e.addEventListener("click",()=>{C=e.dataset.filter,x()})}),v("#pipeline-temp-filter .filter-pill").forEach(e=>{e.classList.toggle("active",e.dataset.filter===E),e.addEventListener("click",()=>{E=e.dataset.filter,x()})})}function A(){const e=d.getClients(),t=["linear-gradient(135deg, #6366f1, #a78bfa)","linear-gradient(135deg, #22c55e, #34d399)","linear-gradient(135deg, #f59e0b, #fbbf24)","linear-gradient(135deg, #06b6d4, #22d3ee)"],a=e.map((s,l)=>{const o=_.map(n=>{const c=s.documents&&s.documents[n.id];return`
        <div class="doc-slot ${c?"has-link":""}" data-client="${s.id}" data-doc="${n.id}" title="${c?s.documents[n.id]:"Click to add link"}">
          <span class="doc-icon">${n.icon}</span>
          <span>${n.label}</span>
        </div>
      `}).join("");return`
      <div class="client-card-full">
        <div class="ccf-header">
          <div class="ccf-logo" style="background:${t[l%t.length]}">${s.name.substring(0,2).toUpperCase()}</div>
          <div class="ccf-info">
            <h3>${s.name} <span class="status-dot ${s.status.toLowerCase()}" style="display:inline-block;vertical-align:middle;margin-left:6px;"></span></h3>
            <p>${s.location} · ${s.status}</p>
          </div>
          <div style="margin-left:auto;display:flex;gap:6px;">
            <button class="btn btn-ghost btn-sm edit-client-btn" data-id="${s.id}">Edit</button>
            <button class="btn btn-danger btn-sm delete-client-btn" data-id="${s.id}">Delete</button>
          </div>
        </div>
        <div class="ccf-details">
          <div class="ccf-detail-item">
            <span class="detail-label">Contact Person</span>
            <span class="detail-value">${s.contactPerson}</span>
          </div>
          <div class="ccf-detail-item">
            <span class="detail-label">Services</span>
            <span class="detail-value">${s.services}</span>
          </div>
          <div class="ccf-detail-item">
            <span class="detail-label">Last Updated</span>
            <span class="detail-value">${T(s.lastUpdated)}</span>
          </div>
        </div>
        <div class="ccf-docs-title">Onboarding Documents</div>
        <div class="ccf-docs-grid">${o}</div>
      </div>
    `}).join("");i("#clients-list").innerHTML=a||'<div class="empty-state"><div class="empty-icon">🏢</div><p>No clients yet. Add your first client.</p></div>',v(".edit-client-btn").forEach(s=>{s.addEventListener("click",()=>U(s.dataset.id))}),v(".delete-client-btn").forEach(s=>{s.addEventListener("click",()=>{d.deleteClient(s.dataset.id),A(),b(),f("Client removed","info")})}),v(".doc-slot").forEach(s=>{s.addEventListener("click",()=>{var g,r;const l=s.dataset.client,o=s.dataset.doc,n=d.getClient(l),c=((g=n.documents)==null?void 0:g[o])||"",u=prompt(`Enter URL for ${(r=_.find(p=>p.id===o))==null?void 0:r.label}:`,c);if(u!==null){const p={...n.documents||{}};p[o]=u,d.updateClient(l,{documents:p}),A(),f("Document link updated","success")}})})}function ve(){const e=d.getSettings(),t=O.map(o=>`
    <div class="team-member-row">
      <div class="tm-avatar" style="background:${o.color}">${o.name[0]}</div>
      <div class="tm-info">
        <div class="tm-name">${o.name}</div>
        <div class="tm-role">${o.role}</div>
      </div>
    </div>
  `).join(""),a=N.map(o=>`
    <div class="source-list-item">
      <span class="sl-icon">${o.icon}</span>
      <span>${o.label}</span>
    </div>
  `).join(""),s=`
    <!-- Team Panel -->
    <div class="settings-panel">
      <h3>Team Members</h3>
      <p class="sp-desc">Your agency crew</p>
      ${t}
    </div>

    <!-- Lead Sources Panel -->
    <div class="settings-panel">
      <h3>Lead Sources</h3>
      <p class="sp-desc">Configured inbound channels</p>
      ${a}
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
          <input type="checkbox" id="crea-enabled" ${e.creaEnabled?"checked":""} />
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="form-group" style="margin-top:12px;">
        <label class="form-label">Morning Ping Time</label>
        <input type="time" class="form-input" id="crea-time" value="${e.creaMorningTime||"09:00"}" />
      </div>
      <div class="form-group">
        <label class="form-label">WhatsApp Number</label>
        <input type="text" class="form-input" id="crea-whatsapp" value="${e.whatsappNumber||""}" placeholder="+91 XXXXX XXXXX" />
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
  `;i("#settings-grid").innerHTML=s;const l=i("#theme-picker-container");if(l){const o=d.getSettings(),n=[{name:"Cyber Violet",h:260,s:89,l:66},{name:"Matrix Green",h:142,s:76,l:36},{name:"Sunset Orange",h:24,s:95,l:53},{name:"Ocean Blue",h:199,s:89,l:48},{name:"Rose Dark",h:334,s:86,l:60}];l.innerHTML=n.map(c=>`<div class="theme-color ${o.themeAccent&&o.themeAccent.h===c.h?"active":""}" style="background: hsl(${c.h}, ${c.s}%, ${c.l}%);" title="${c.name}"></div>`).join(""),v(".theme-color").forEach((c,u)=>{c.addEventListener("click",()=>{d.updateSettings({themeAccent:n[u]});const g=document.documentElement;g.style.setProperty("--accent-h",n[u].h),g.style.setProperty("--accent-s",`${n[u].s}%`),g.style.setProperty("--accent-l",`${n[u].l}%`),v(".theme-color").forEach(r=>r.classList.remove("active")),c.classList.add("active"),f(`Theme updated to ${n[u].name}`,"success")})})}i("#save-crea-btn").addEventListener("click",()=>{d.updateSettings({creaEnabled:i("#crea-enabled").checked,creaMorningTime:i("#crea-time").value,whatsappNumber:i("#crea-whatsapp").value}),f("CREA settings saved","success")}),i("#export-btn").addEventListener("click",()=>{const o=d.exportJSON(),n=new Blob([o],{type:"application/json"}),c=URL.createObjectURL(n),u=document.createElement("a");u.href=c,u.download=`gensync_crm_backup_${new Date().toISOString().split("T")[0]}.json`,u.click(),URL.revokeObjectURL(c),f("Data exported","success")}),i("#import-btn").addEventListener("click",()=>{i("#import-file").click()}),i("#import-file").addEventListener("change",o=>{const n=o.target.files[0];if(!n)return;const c=new FileReader;c.onload=()=>{d.importJSON(c.result)?($(),b(),f("Data imported successfully","success")):f("Import failed — invalid file","error")},c.readAsText(n)}),i("#reset-btn").addEventListener("click",()=>{confirm("Reset all data to defaults? This cannot be undone.")&&(d.resetToSeed(),$(),b(),f("Data reset to defaults","info"))})}function ge(){i("#modal-close").addEventListener("click",h),i("#modal-overlay").addEventListener("click",e=>{e.target===i("#modal-overlay")&&h()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&h()})}function j(e){i("#modal-title").textContent=e,i("#modal-overlay").classList.add("open")}function h(){i("#modal-overlay").classList.remove("open")}function S(e=null){const t=e?d.getTask(e):null,a=!!t;j(a?"Edit Task":"New Task");const s=d.getClients().map(c=>`<option value="${c.id}" ${t&&t.clientId===c.id?"selected":""}>${c.name}</option>`).join(""),l=O.map(c=>`<option value="${c.id}" ${t&&t.assignee===c.id?"selected":""}>${c.name}</option>`).join(""),o=F.map(c=>`<option value="${c}" ${t&&t.status===c?"selected":""}>${c}</option>`).join(""),n=z.map(c=>`<option value="${c}" ${t&&t.priority===c?"selected":""}>${c}</option>`).join("");i("#modal-body").innerHTML=`
    <div class="form-group">
      <label class="form-label">Task Name</label>
      <input type="text" class="form-input" id="task-name" value="${t?t.name:""}" placeholder="e.g. Website Redesign V2" />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Assignee</label>
        <select class="form-select" id="task-assignee">${l}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Client</label>
        <select class="form-select" id="task-client">${s}</select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Priority</label>
        <select class="form-select" id="task-priority">${n}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Status</label>
        <select class="form-select" id="task-status">${o}</select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Due Date</label>
      <input type="date" class="form-input" id="task-due" value="${t?t.dueDate:new Date().toISOString().split("T")[0]}" />
    </div>
  `,i("#modal-footer").innerHTML=`
    <button class="btn btn-ghost" id="modal-cancel">Cancel</button>
    <button class="btn btn-primary" id="modal-save">${a?"Update":"Create"} Task</button>
  `,i("#modal-cancel").addEventListener("click",h),i("#modal-save").addEventListener("click",()=>{const c=i("#task-name").value.trim();if(!c){f("Task name is required","error");return}const u={name:c,assignee:i("#task-assignee").value,clientId:i("#task-client").value,priority:i("#task-priority").value,status:i("#task-status").value,dueDate:i("#task-due").value};a?(d.updateTask(e,u),f("Task updated","success")):(d.addTask(u),f("Task created","success")),h(),$(),b()})}function R(e=null){const t=e?d.getLead(e):null,a=!!t;j(a?"Edit Lead":"New Lead");const s=N.map(n=>`<option value="${n.id}" ${t&&t.source===n.id?"selected":""}>${n.icon} ${n.label}</option>`).join(""),l=Y.map(n=>`<option value="${n}" ${t&&t.temperature===n?"selected":""}>${n}</option>`).join(""),o=Z.map(n=>`<option value="${n}" ${t&&t.stage===n?"selected":""}>${n}</option>`).join("");i("#modal-body").innerHTML=`
    <div class="form-group">
      <label class="form-label">Company Name</label>
      <input type="text" class="form-input" id="lead-company" value="${t?t.companyName:""}" placeholder="e.g. TechNova Solutions" />
    </div>
    <div class="form-group">
      <label class="form-label">Contact Person</label>
      <input type="text" class="form-input" id="lead-contact" value="${t?t.contactPerson:""}" placeholder="e.g. Arjun Mehta" />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Source</label>
        <select class="form-select" id="lead-source">${s}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Temperature</label>
        <select class="form-select" id="lead-temp">${l}</select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Stage</label>
        <select class="form-select" id="lead-stage">${o}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Last Contact</label>
        <input type="date" class="form-input" id="lead-date" value="${t?t.lastContact:new Date().toISOString().split("T")[0]}" />
      </div>
    </div>
  `,i("#modal-footer").innerHTML=`
    <button class="btn btn-ghost" id="modal-cancel">Cancel</button>
    <button class="btn btn-primary" id="modal-save">${a?"Update":"Create"} Lead</button>
  `,i("#modal-cancel").addEventListener("click",h),i("#modal-save").addEventListener("click",()=>{const n=i("#lead-company").value.trim();if(!n){f("Company name is required","error");return}const c={companyName:n,contactPerson:i("#lead-contact").value.trim(),source:i("#lead-source").value,temperature:i("#lead-temp").value,stage:i("#lead-stage").value,lastContact:i("#lead-date").value};a?(d.updateLead(e,c),f("Lead updated","success")):(d.addLead(c),f("Lead added to pipeline","success")),h(),$(),b()})}function U(e=null){const t=e?d.getClient(e):null,a=!!t;j(a?"Edit Client":"New Client");const s=ee.map(l=>`<option value="${l}" ${t&&t.status===l?"selected":""}>${l}</option>`).join("");i("#modal-body").innerHTML=`
    <div class="form-group">
      <label class="form-label">Client Name</label>
      <input type="text" class="form-input" id="client-name" value="${t?t.name:""}" placeholder="e.g. ConnectMe" />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Contact Person</label>
        <input type="text" class="form-input" id="client-contact" value="${t?t.contactPerson:""}" placeholder="e.g. CEO" />
      </div>
      <div class="form-group">
        <label class="form-label">Status</label>
        <select class="form-select" id="client-status">${s}</select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Location</label>
      <input type="text" class="form-input" id="client-location" value="${t?t.location:""}" placeholder="e.g. Dubai, UAE" />
    </div>
    <div class="form-group">
      <label class="form-label">Services Provided</label>
      <input type="text" class="form-input" id="client-services" value="${t?t.services:""}" placeholder="e.g. Website, SEO, Brochures" />
    </div>
  `,i("#modal-footer").innerHTML=`
    <button class="btn btn-ghost" id="modal-cancel">Cancel</button>
    <button class="btn btn-primary" id="modal-save">${a?"Update":"Create"} Client</button>
  `,i("#modal-cancel").addEventListener("click",h),i("#modal-save").addEventListener("click",()=>{const l=i("#client-name").value.trim();if(!l){f("Client name is required","error");return}const o={name:l,contactPerson:i("#client-contact").value.trim(),status:i("#client-status").value,location:i("#client-location").value.trim(),services:i("#client-services").value.trim(),lastUpdated:new Date().toISOString().split("T")[0],documents:t?t.documents:{contract:"",brand:"",product:"",assets:"",contact:""}};a?(d.updateClient(e,o),f("Client updated","success")):(d.addClient(o),f("Client added","success")),h(),$(),b()})}function f(e,t="info"){const a=i("#toast-container"),s=document.createElement("div");s.className=`toast ${t}`;const l={success:"✓",error:"✕",info:"ℹ"};s.innerHTML=`<span>${l[t]||"ℹ"}</span> ${e}`,a.appendChild(s),setTimeout(()=>{s.style.opacity="0",s.style.transform="translateX(40px)",s.style.transition="all 300ms ease",setTimeout(()=>s.remove(),300)},3e3)}function T(e){if(!e)return"—";try{return new Date(e+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}catch{return e}}let m=null;function V(){m||(m=new(window.AudioContext||window.webkitAudioContext)),m.state==="suspended"&&m.resume()}function P(){if(V(),!m)return;const e=m.createOscillator(),t=m.createGain();e.type="sine",e.frequency.setValueAtTime(800,m.currentTime),e.frequency.exponentialRampToValueAtTime(100,m.currentTime+.05),t.gain.setValueAtTime(1,m.currentTime),t.gain.exponentialRampToValueAtTime(.01,m.currentTime+.05),e.connect(t),t.connect(m.destination),e.start(),e.stop(m.currentTime+.05)}function G(){if(V(),!m)return;const e=m.createOscillator(),t=m.createGain();e.type="triangle",e.frequency.setValueAtTime(600,m.currentTime),e.frequency.exponentialRampToValueAtTime(1200,m.currentTime+.1),t.gain.setValueAtTime(.5,m.currentTime),t.gain.exponentialRampToValueAtTime(.01,m.currentTime+.8),e.connect(t),t.connect(m.destination),e.start(),e.stop(m.currentTime+.8)}window.playTick=P;window.playChime=G;function fe(){be(),he(),ye(),document.body.addEventListener("click",V,{once:!0});const e=d.updateLead.bind(d);d.updateLead=(t,a)=>{const s=d.getLead(t);e(t,a),a.stage==="Won"&&s&&s.stage!=="Won"&&G()}}function be(){const e=document.documentElement,t=d.getSettings();t.themeAccent&&(e.style.setProperty("--accent-h",t.themeAccent.h),e.style.setProperty("--accent-s",t.themeAccent.s+"%"),e.style.setProperty("--accent-l",t.themeAccent.l+"%"))}function he(){const e=i("#sidebar-collapse-btn");e&&e.addEventListener("click",()=>{i("#sidebar").classList.toggle("collapsed");const t=i("#sidebar").classList.contains("collapsed");e.innerHTML=`<span class="nav-icon">${t?"⇥":"⇤"}</span> <span>${t?"Expand":"Collapse"}</span>`})}function ye(){const e=i("#cmd-overlay"),t=i("#cmd-input"),a=i("#cmd-results"),s=()=>{e.classList.add("open"),t.value="",o(""),setTimeout(()=>t.focus(),50)},l=()=>e.classList.remove("open");document.addEventListener("keydown",n=>{(n.ctrlKey||n.metaKey)&&n.key.toLowerCase()==="k"&&(n.preventDefault(),s()),n.key==="Escape"&&l()}),e.addEventListener("click",n=>{n.target===e&&l()}),t.addEventListener("input",n=>{o(n.target.value.toLowerCase())});function o(n){if(!n){a.innerHTML='<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:0.9rem;">Type to search clients, leads, and tasks...</div>';return}let c="";const u="🏢",g="🚀",r="✅";d.getClients().filter(p=>p.name.toLowerCase().includes(n)).forEach(p=>{c+=`<div class="cmd-item" onclick="window.switchTab('clients'); window.openClientModal('`+p.id+`'); document.getElementById('cmd-overlay').classList.remove('open')"><div class="cmd-item-icon">`+u+'</div><div class="cmd-item-content"><div class="cmd-item-title">'+p.name+'</div><div class="cmd-item-sub">Client - '+p.status+"</div></div></div>"}),d.getLeads().filter(p=>p.companyName.toLowerCase().includes(n)||p.contactPerson.toLowerCase().includes(n)).forEach(p=>{c+=`<div class="cmd-item" onclick="window.switchTab('pipeline'); window.openLeadModal('`+p.id+`'); document.getElementById('cmd-overlay').classList.remove('open')"><div class="cmd-item-icon">`+g+'</div><div class="cmd-item-content"><div class="cmd-item-title">'+p.companyName+'</div><div class="cmd-item-sub">Lead - '+p.stage+"</div></div></div>"}),d.getTasks().filter(p=>p.name.toLowerCase().includes(n)).forEach(p=>{c+=`<div class="cmd-item" onclick="window.switchTab('tasks'); window.openTaskModal('`+p.id+`'); document.getElementById('cmd-overlay').classList.remove('open')"><div class="cmd-item-icon">`+r+'</div><div class="cmd-item-content"><div class="cmd-item-title">'+p.name+'</div><div class="cmd-item-sub">Task - '+p.status+"</div></div></div>"}),a.innerHTML=c||'<div style="padding:20px;text-align:center;color:var(--text-muted);">No results found.</div>'}}window.switchTab=H;window.openClientModal=U;window.openLeadModal=R;window.openTaskModal=S;window.drawAreaChart=function(){const e=i("#dashboard-chart");if(!e)return;const t=[20,35,28,45,60,50,85],a=Math.max(...t),s=e.clientWidth||800,l=180,o=s/(t.length-1),n=t.map((g,r)=>({x:r*o,y:l-g/a*l*.8-10}));let c=`M 0 ${n[0].y}`;for(let g=0;g<n.length-1;g++){const r=(n[g].x+n[g+1].x)/2,p=(n[g].y+n[g+1].y)/2;c+=` Q ${n[g].x} ${n[g].y}, ${r} ${p}`}c+=` T ${n[n.length-1].x} ${n[n.length-1].y}`;const u=c+` L ${s} ${l} L 0 ${l} Z`;e.innerHTML=`
    <svg viewBox="0 0 ${s} ${l}" preserveAspectRatio="none">
      <path class="chart-area" d="${u}"></path>
      <path class="chart-line" d="${c}"></path>
    </svg>
  `};
