/* Renders the app shell (sidebar + topbar) based on body data attributes.
   <body data-role="owner|brand|orm|admin" data-active="dashboard" data-title="..." data-subtitle="...">
*/

// Resolve paths from the actual project root using this script's URL.
const ROOT_URL = (() => {
  const script = document.currentScript || document.querySelector('script[src*="assets/shell.js"]');
  return new URL('../', script ? script.src : window.location.href);
})();
const R = (p) => new URL(String(p).replace(/^(\.\.\/|\.\/|\/)+/, ''), ROOT_URL).href;

const ROLE_KEY = 'briskSelectedRole';
const ROLE_ALIASES = {
  owner: 'owner',
  'tenant-owner': 'owner',
  insight: 'insight',
  'insight-analyst': 'insight',
  orm: 'orm-manager',
  'orm-manager': 'orm-manager',
  viewer: 'viewer',
};

function resolveRole() {
  if (typeof window === 'undefined') return 'owner';
  const params = new URLSearchParams(window.location.search);
  const queryRole = params.get('role');
  const storedRole = window.localStorage.getItem(ROLE_KEY);
  const bodyRole = document.body.dataset.role;
  const selectedRole = ROLE_ALIASES[queryRole] || ROLE_ALIASES[storedRole] || ROLE_ALIASES[bodyRole] || 'owner';
  if (selectedRole && selectedRole !== storedRole) {
    window.localStorage.setItem(ROLE_KEY, selectedRole);
  }
  return selectedRole;
}

const SELECTED_ROLE = resolveRole();
if (SELECTED_ROLE && SELECTED_ROLE !== document.body.dataset.role) {
  document.body.dataset.role = SELECTED_ROLE;
}

const NAV = {
  owner: {
    sections: [
      { label: null, items: [
        { id:'dashboard', icon:'layout-dashboard', label:'Dashboard',   href:R('app/dashboard.html') },
        { id:'products',  icon:'package',          label:'Brand Portfolio',    href:R('brand/products.html') },
        { id:'timeline',  icon:'activity',         label:'Timeline',    href:R('brand/timeline.html') },
        { id:'competitors', icon:'swords',         label:'Competitors', href:R('brand/competitors.html') },
        { id:'inbox',     icon:'inbox',            label:'Inbox',       href:R('orm/inbox.html'), counter:3 },
        { id:'reports',   icon:'file-text',        label:'Reports',     href:R('brand/reports.html') },
      ]},
      { label:'Settings', items: [
        { id:'users',        icon:'users',     label:'Users & roles',  href:R('app/settings/users.html') },
        { id:'integrations', icon:'plug',      label:'Integrations',   href:R('app/settings/integrations.html') },
        { id:'billing',      icon:'credit-card',label:'Billing',       href:R('app/settings/billing.html') },
        { id:'usage',        icon:'gauge',     label:'Usage & quotas', href:R('app/settings/usage.html') },
        { id:'audit',        icon:'shield-check',label:'Audit log',    href:R('app/settings/audit.html') },
      ]},
    ],
    user: { name:'owner@demo.local', role:'tenant_admin', initials:'O', tenant:'Cafe marketing' }
  },
  brand: {
    sections: [
      { label:null, items: [
        { id:'dashboard', icon:'layout-dashboard', label:'Dashboard',  href:R('app/dashboard.html') },
        { id:'products',  icon:'package',          label:'Products',    href:R('brand/products.html') },
        { id:'timeline',  icon:'activity',         label:'Timeline',    href:R('brand/timeline.html') },
        { id:'competitors', icon:'swords',         label:'Competitors', href:R('brand/competitors.html') },
        { id:'inbox',     icon:'inbox',            label:'Inbox',       href:R('orm/inbox.html'), counter:3 },
        { id:'reports',   icon:'file-text',        label:'Reports',     href:R('brand/reports.html') },
      ]},
    ],
    user: { name:'Sarah Mitchell', role:'Insight Analyst', initials:'SM', tenant:'Starbucks Workspace' }
  },
  insight: {
    sections: [
      { label:null, items: [
        { id:'dashboard', icon:'layout-dashboard', label:'Dashboard',  href:R('app/dashboard.html') },
        { id:'products',  icon:'package',          label:'Products',    href:R('brand/products.html') },
        { id:'timeline',  icon:'activity',         label:'Timeline',    href:R('brand/timeline.html') },
        { id:'competitors', icon:'swords',         label:'Competitors', href:R('brand/competitors.html') },
        { id:'reports',   icon:'file-text',        label:'Reports',     href:R('brand/reports.html') },
      ]},
    ],
    user: { name:'Sarah Mitchell', role:'Insight Analyst', initials:'SM', tenant:'Starbucks Workspace' }
  },
  'orm-manager': {
    sections: [
      { label:null, items: [
        { id:'inbox',    icon:'inbox',         label:'Inbox',         href:R('orm/inbox.html'), counter:3 },
      ]},
    ],
    user: { name:'Priya Raman', role:'ORM Manager', initials:'PR', tenant:'Starbucks Workspace' }
  },
  viewer: {
    sections: [
      { label:null, items: [
        { id:'dashboard', icon:'layout-dashboard', label:'Dashboard',  href:R('app/dashboard.html') },
        { id:'products',  icon:'package',          label:'Products',    href:R('brand/products.html') },
        { id:'timeline',  icon:'activity',         label:'Timeline',    href:R('brand/timeline.html') },
        { id:'competitors', icon:'swords',         label:'Competitors', href:R('brand/competitors.html') },
        { id:'reports',   icon:'file-text',        label:'Reports',     href:R('brand/reports.html') },
      ]},
    ],
    user: { name:'Elena Marquez', role:'Viewer', initials:'EM', tenant:'Starbucks Workspace' }
  },
  orm: {
    sections: [
      { label:null, items: [
        { id:'inbox',    icon:'inbox',         label:'Inbox',         href:R('orm/inbox.html'), counter:3 },
        { id:'dashboard',icon:'layout-dashboard',label:'Dashboard',   href:R('app/dashboard.html') },
        { id:'reports',  icon:'file-text',     label:'Reports',       href:R('brand/reports.html') },
      ]},
    ],
    user: { name:'Priya Raman', role:'ORM Manager', initials:'PR', tenant:'Starbucks Workspace' }
  },
  admin: {
    sections: [
      { label:'Operations', items: [
        { id:'tenants',   icon:'building-2',  label:'Tenants',     href:R('admin/tenants.html') },
        { id:'licensing', icon:'key-round',   label:'Licensing',   href:R('admin/licensing.html') },
        { id:'usage',     icon:'gauge',       label:'Usage & margin', href:R('admin/usage.html') },
        { id:'providers', icon:'satellite-dish',label:'Providers', href:R('admin/providers.html') },
      ]},
    ],
    user: { name:'Sidharthan CR', role:'Super Admin', initials:'SC', tenant:'Sanrove Operations' }
  }
};

function renderShell() {
  const role  = document.body.dataset.role  || 'owner';
  const active= document.body.dataset.active|| '';
  const title = document.body.dataset.title || '';
  const sub   = document.body.dataset.subtitle || '';
  const cfg   = NAV[role];
  const isAdmin = role === 'admin';

  // Resolve relative paths
  const base = location.pathname.includes('/prototype-v2/') ? '' : '';

  const sidebar = `
    <aside id="bk-sidebar" class="hidden lg:flex fixed inset-y-0 left-0 w-60 flex-col border-r border-[color:var(--line)] bg-white z-30">
      <div class="px-4 h-14 flex items-center gap-2 border-b border-[color:var(--line)]">
        <div class="${isAdmin ? 'w-6 h-6 rounded-md bg-[color:var(--accent)] text-white flex items-center justify-center' : 'brisk-logo-mark'}">
          ${isAdmin ? '<i data-lucide="shield" class="!w-3.5 !h-3.5"></i>' : '<span>B</span>'}
        </div>
        <span class="wordmark">Brisk</span>
        ${isAdmin ? '<span class="pill pill-accent ml-auto">Admin</span>' : ''}
      </div>
      ${!isAdmin ? `
      <div class="px-3 pt-3">
        <div class="px-2 py-2 rounded-md border border-[color:var(--line)] bg-[color:var(--line-2)]">
          <div class="text-[10px] uppercase tracking-wider text-[color:var(--soft)] font-medium">Workspace</div>
          <div class="flex items-center justify-between mt-0.5">
            <div class="text-[13px] font-medium truncate">${cfg.user.tenant}</div>
            <i data-lucide="chevrons-up-down" class="!w-3.5 !h-3.5 text-[color:var(--soft)]"></i>
          </div>
        </div>
      </div>` : ''}
      <nav class="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        ${cfg.sections.map(sec => `
          ${sec.label ? `<div class="nav-section">${sec.label}</div>` : ''}
          <div class="space-y-0.5">
            ${sec.items.map(it => `
              <a href="${it.href}" class="nav-link ${it.id===active?'active':''}">
                <i data-lucide="${it.icon}"></i>
                <span>${it.label}</span>
                ${it.counter ? `<span class="nav-counter">${it.counter}</span>` : ''}
              </a>`).join('')}
          </div>
        `).join('')}
      </nav>
      <div class="px-3 py-3 border-t border-[color:var(--line)]">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-full bg-[color:var(--line-2)] text-[color:var(--ink)] flex items-center justify-center text-[11px] font-semibold">${cfg.user.initials}</div>
          <div class="min-w-0 flex-1">
            <div class="text-[12.5px] font-medium truncate">${cfg.user.name}</div>
            <div class="text-[11px] text-[color:var(--soft)] truncate">${cfg.user.role}</div>
          </div>
          <a href="${R('login.html')}" class="text-[color:var(--soft)] hover:text-[color:var(--ink)]" title="Sign out"><i data-lucide="log-out" class="!w-3.5 !h-3.5"></i></a>
        </div>
      </div>
    </aside>`;

  const topbar = `
    <header class="sticky top-0 z-20 bg-[color:var(--canvas)]/85 backdrop-blur border-b border-[color:var(--line)]">
      <div class="h-14 flex items-center px-5 gap-4">
        <button id="bk-menu" class="lg:hidden text-[color:var(--muted)]"><i data-lucide="menu" class="!w-5 !h-5"></i></button>
        <div class="min-w-0">
          <h1 class="text-[15px] font-semibold leading-tight truncate">${title}</h1>
          ${sub ? `<p class="text-[12px] text-[color:var(--muted)] truncate">${sub}</p>` : ''}
        </div>
        <div class="flex-1"></div>
        <form action="${R('orm/inbox.html')}" method="get" class="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 border border-[color:var(--line)] rounded-md text-[12px] bg-white w-72 focus-within:border-[color:var(--accent)] focus-within:ring-3 focus-within:ring-[color:var(--accent)]/10">
          <i data-lucide="search" class="!w-3.5 !h-3.5 text-[color:var(--soft)]"></i>
          <input name="q" type="search" placeholder="Search mentions, tags, alertsâ€¦" class="flex-1 bg-transparent outline-none text-[12.5px] text-[color:var(--ink)] placeholder:text-[color:var(--soft)]"/>
          <span class="kbd">âŒ˜K</span>
        </form>
        <a href="${R('orm/inbox.html')}" class="btn btn-ghost btn-sm relative" title="Notifications">
          <i data-lucide="bell" class="!w-4 !h-4"></i>
          <span class="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-[color:var(--neg)] rounded-full"></span>
        </a>
      </div>
    </header>`;

  // Inject
  const root = document.getElementById('bk-root') || document.body;
  document.body.insertAdjacentHTML('afterbegin', sidebar);
  // Wrap content
  const main = document.getElementById('bk-main');
  if (main) {
    main.classList.add('lg:ml-60','min-h-screen');
    main.insertAdjacentHTML('afterbegin', topbar);
  }

  // Mobile sidebar toggle
  document.addEventListener('click', e => {
    if (e.target.closest('#bk-menu')) {
      document.getElementById('bk-sidebar').classList.toggle('hidden');
    }
  });

  if (window.lucide) lucide.createIcons();
}

// run after DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderShell);
} else { renderShell(); }

