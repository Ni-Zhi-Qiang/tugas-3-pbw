import statusBadge from './status-badge.js';
import orderForm from './order-form.js';
import appModal from './app-modal.js';

export default {
  template: '#tpl-stock-table',
  props: ['dataUrl'],
  components: { 'status-badge': statusBadge, 'order-form': orderForm, 'app-modal': appModal },
  data() {
    return {
      raw: null, // full JSON
      stok: [], // array
      upbjjList: [],
      kategoriList: [],
      filters: { upbjj: '', kategori: '', lowStock: false, zero: false, keyword: '' },
      sort: { by: '', dir: 'asc' },
      showModal: false,
      modalMode: 'create', // create | edit
      editItem: null,
      // watchers demonstration
      watcherLog1: 0,
      watcherLog2: 0
    }
  },
  async created() {
    const payload = await (await fetch(this.dataUrl)).json();
    this.raw = payload;
    this.stok = JSON.parse(JSON.stringify(payload.stok || []));
    this.upbjjList = payload.upbjjList || [];
    this.kategoriList = payload.kategoriList || [];
  },
  computed: {
    // emulate filters: currency & qty unit
    filtered() {
      let out = this.stok.slice();

      // keyword (title or code)
      if (this.filters.keyword) {
        const k = this.filters.keyword.toLowerCase();
        out = out.filter(o => o.judul.toLowerCase().includes(k) || o.kode.toLowerCase().includes(k));
      }
      if (this.filters.upbjj) {
        out = out.filter(o => o.upbjj === this.filters.upbjj);
      }
      if (this.filters.kategori) {
        out = out.filter(o => o.kategori === this.filters.kategori);
      }
      if (this.filters.lowStock) {
        out = out.filter(o => o.qty < o.safety);
      }
      if (this.filters.zero) {
        out = out.filter(o => o.qty === 0);
      }

      if (this.sort.by) {
        out.sort((a, b) => {
          let A = a[this.sort.by], B = b[this.sort.by];
          if (typeof A === 'string') A = A.toLowerCase(), B = B.toLowerCase();
          if (A < B) return this.sort.dir === 'asc' ? -1 : 1;
          if (A > B) return this.sort.dir === 'asc' ? 1 : -1;
          return 0;
        });
      }
      return out;
    },
    paketList() { return this.raw?.paket || [] }
  },
  methods: {
    fmtRp(v) { return 'Rp ' + Number(v).toLocaleString('id-ID') },
    fmtQty(v) { return `${v} buah` },
    resetFilters() { this.filters = { upbjj: '', kategori: '', lowStock: false, zero: false, keyword: '' } },
    setSort(by) {
      if (this.sort.by === by) this.sort.dir = this.sort.dir === 'asc' ? 'desc' : 'asc';
      else { this.sort.by = by; this.sort.dir = 'asc' }
    },
    openCreate() { this.modalMode = 'create'; this.editItem = null; this.showModal = true },
    openEdit(item) { this.modalMode = 'edit'; this.editItem = JSON.parse(JSON.stringify(item)); this.showModal = true },
    onSave(item) {
      if (this.modalMode === 'create') {
        this.stok.push(item);
      } else {
        const idx = this.stok.findIndex(s => s.kode === item.kode);
        if (idx >= 0) this.stok.splice(idx, 1, item);
      }
      this.showModal = false;
    },
    remove(item) {
      if (!confirm(`Hapus ${item.judul} (${item.kode})?`)) return;
      const idx = this.stok.findIndex(s => s.kode === item.kode);
      if (idx >= 0) this.stok.splice(idx, 1);
    }
  },
  watch: {
    'filters.upbjj'(n, o) {
      this.watcherLog1++;
      // Dependent filter: when upbjj set, narrow kategoriList to those present in stok
      if (n) {
        const cats = new Set(this.stok.filter(s => s.upbjj === n).map(s => s.kategori));
        this.kategoriList = Array.from(cats);
      } else {
        // restore full from raw
        this.kategoriList = this.raw?.kategoriList || [];
      }
    },
    'filters.lowStock'(n, o) {
      this.watcherLog2++;
      // example side-effect log — purely to show watcher used
      console.log('lowStock changed =>', n);
    }
  }
}
