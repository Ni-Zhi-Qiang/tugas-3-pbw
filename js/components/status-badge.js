export default {
  template: '#tpl-status-badge',
  props: ['qty', 'safety'],
  computed: {
    status() {
      if (this.qty === 0) return 'kosong';
      if (this.qty < this.safety) return 'menipis';
      return 'aman';
    },
    cssClass() {
      return this.status === 'aman' ? 'safe' : (this.status === 'menipis' ? 'warn' : 'empty');
    },
    label() {
      return this.status === 'aman' ? 'Aman' : (this.status === 'menipis' ? 'Menipis' : 'Kosong');
    }
  }
}
