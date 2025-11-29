import { loadData } from './services/api.js';
import stockTable from './components/stock-table.js';
import doTracking from './components/do-tracking.js';
import statusBadge from './components/status-badge.js';
import orderForm from './components/order-form.js';
import appModal from './components/app-modal.js';

// helper to fetch templates/*.html and append to body as <template id="tpl-...">
async function loadTemplates() {
  const tplFiles = ['stock-table.html', 'do-tracking.html', 'order-form.html', 'status-badge.html', 'app-modal.html'];
  for (const f of tplFiles) {
    const res = await fetch('/templates/' + f);
    if (!res.ok) continue;
    const txt = await res.text();
    // append as fragment
    const div = document.createElement('div');
    div.innerHTML = txt;
    document.body.appendChild(div);
  }
}

(async () => {
  await loadTemplates();

  const app = Vue.createApp({
    data() { return { tab: 'stok' } },
  });

  // global "filters" via globalProperties
  app.config.globalProperties.$fmtRp = (v) => 'Rp ' + Number(v).toLocaleString('id-ID');
  app.config.globalProperties.$fmtQty = (v) => `${v} buah`;

  app.component('ba-stock-table', stockTable);
  app.component('do-tracking', doTracking);
  app.component('status-badge', statusBadge);
  app.component('order-form', orderForm);
  app.component('app-modal', appModal);

  app.mount('#app');
})();
