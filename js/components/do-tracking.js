export default {
  template: '#tpl-do-tracking',
  props: ['dataUrl'],
  data() {
    return {
      raw: null, tracking: [], paketList: [], upbjjList: [],
      query: '', results: [], newDo: { nim: '', nama: '', ekspedisi: 'REG', paket: '', tanggalKirim: '' }, paketDetail: null
    }
  },
  async created() {
    const payload = await (await fetch(this.dataUrl)).json();
    this.raw = payload;
    this.tracking = JSON.parse(JSON.stringify(payload.tracking || []));
    this.paketList = payload.paket || [];
    this.upbjjList = payload.upbjjList || [];
    window.addEventListener('keydown', this.onKey);
  },
  unmounted() { window.removeEventListener('keydown', this.onKey); },
  computed: {
    paketInfo() { return this.paketList.find(p => p.kode === this.newDo.paket) || null }
  },
  methods: {
    onKey(e) {
      if (e.key === 'Enter') { this.search() }
      if (e.key === 'Escape') { this.query = ''; this.results = [] }
    },
    search() {
      const q = this.query.trim();
      if (!q) return this.results = [];
      // search by DO number or nim
      this.results = this.tracking.filter(t => {
        const key = Object.keys(t)[0];
        const rec = t[key];
        return key.includes(q) || rec.nim.includes(q);
      });
    },
    genNextDO() {
      // find highest existing DOxxx from tracking keys
      const keys = this.tracking.map(t => Object.keys(t)[0]);
      const year = (new Date()).getFullYear();
      let maxSeq = 0;
      keys.forEach(k => {
        const m = k.match(/DO(\d{4})-(\d+)/);
        if (m && Number(m[1]) === year) maxSeq = Math.max(maxSeq, Number(m[2]));
      });
      const seq = String(maxSeq + 1).padStart(3, '0');
      return `DO${year}-${seq}`;
    },
    addDo() {
      if (!this.newDo.nim || !this.newDo.nama || !this.newDo.paket) { alert('lengkapi data'); return; }
      const kode = this.genNextDO();
      const tanggal = this.newDo.tanggalKirim || new Date().toISOString().slice(0, 10);
      const total = (this.paketInfo?.harga) || 0;
      const rec = {
        [kode]: {
          nim: this.newDo.nim, nama: this.newDo.nama, status: 'Dalam Perjalanan',
          ekspedisi: this.newDo.ekspedisi, tanggalKirim: tanggal, paket: this.newDo.paket, total: total, perjalanan: []
        }
      };
      this.tracking.push(rec);
      this.newDo = { nim: '', nama: '', ekspedisi: 'REG', paket: '', tanggalKirim: '' };
      this.paketDetail = null;
      this.search();
    },
    onPaketChange() {
      this.paketDetail = this.paketInfo;
    },
    addProgress(doKey, keterangan) {
      const rec = this.tracking.find(t => Object.keys(t)[0] === doKey);
      if (!rec) return;
      const key = Object.keys(rec)[0], obj = rec[key];
      obj.perjalanan.push({ waktu: (new Date()).toISOString().replace('T', ' ').slice(0, 19), keterangan });
    }
  }
}
