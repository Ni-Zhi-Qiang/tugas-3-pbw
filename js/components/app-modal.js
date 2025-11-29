// Komponen Modal
Vue.component('app-modal', {
    template: '#tpl-app-modal',
    props: {
        title: {
            type: String,
            default: 'Modal Title'
        }
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },
        // Prevent modal close when clicking inside content
        stopPropagation(event) {
            event.stopPropagation();
        }
    },
    mounted() {
        // Close modal on Escape key
        document.addEventListener('keydown', this.handleEscape);
    },
    beforeDestroy() {
        document.removeEventListener('keydown', this.handleEscape);
    }
});