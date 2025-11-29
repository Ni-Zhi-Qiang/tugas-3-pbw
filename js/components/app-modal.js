export default {
  template: '#tpl-app-modal',
  props: ['show', 'title'],
  emits: ['close', 'save'],
  methods: {
    closeModal() { this.$emit('close') },
    saveAndClose(payload) { this.$emit('save', payload) }
  }
};
