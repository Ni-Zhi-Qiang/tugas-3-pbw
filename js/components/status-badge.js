// Komponen Status Badge
Vue.component('status-badge', {
    template: '#tpl-status-badge',
    props: {
        qty: {
            type: Number,
            required: true
        },
        safety: {
            type: Number,
            required: true
        }
    },
    computed: {
        status() {
            if (this.qty === 0) {
                return {
                    text: 'Kosong',
                    class: 'status-kosong'
                };
            } else if (this.qty < this.safety) {
                return {
                    text: 'Menipis', 
                    class: 'status-menipis'
                };
            } else {
                return {
                    text: 'Aman',
                    class: 'status-aman'
                };
            }
        }
    }
});