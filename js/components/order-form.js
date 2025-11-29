export default {
  template: '#tpl-order-form',
  props: ['model', 'upbjjList', 'kategoriList', 'paketList'],
  emits: ['submit', 'cancel'],
  data() { return { local: JSON.parse(JSON.stringify(this.model || {})), errors: {} } },
  methods: {
    validate() {
      this.errors = {};
      if (!this.local.kode) this.errors.kode = 'Kode wajib';
      if (!this.local.judul) this.errors.judul = 'Judul wajib';
      if (typeof this.local.harga !== 'number' || isNaN(this.local.harga)) this.errors.harga = 'Harga harus angka';
      return Object.keys(this.errors).length === 0;
    },
    submitForm() {
      if (!this.validate()) return;
      this.$emit('submit', this.local);
    },
    onKeydown(e) {
      if (e.key === 'Enter') { this.submitForm() }
      if (e.key === 'Escape') { this.$emit('cancel') }
    }
  },
  mounted() {
    window.addEventListener('keydown', this.onKeydown);
  },
  unmounted() { window.removeEventListener('keydown', this.onKeydown); }
}
