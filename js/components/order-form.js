// Komponen Order Form
Vue.component('order-form', {
    template: '#tpl-order-form',
    props: {
        stockData: {
            type: Array,
            required: true
        },
        upbjjList: {
            type: Array,
            required: true
        },
        kategoriList: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            order: {
                upbjj: '',
                kategori: '',
                items: [],
                total: 0
            },
            selectedItem: null,
            quantity: 1
        };
    },
    computed: {
        // Available items based on filters
        availableItems() {
            let items = this.stockData;

            if (this.order.upbjj) {
                items = items.filter(item => item.upbjj === this.order.upbjj);
            }

            if (this.order.kategori) {
                items = items.filter(item => item.kategori === this.order.kategori);
            }

            // Only show items with stock
            return items.filter(item => item.qty > 0);
        },

        // Available categories based on selected UPBJJ
        availableKategories() {
            if (!this.order.upbjj) return this.kategoriList;
            
            const categories = new Set();
            this.stockData
                .filter(item => item.upbjj === this.order.upbjj)
                .forEach(item => categories.add(item.kategori));
            return Array.from(categories);
        }
    },
    methods: {
        // Format currency
        formatCurrency(value) {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(value);
        },

        // Add item to order
        addItem() {
            if (!this.selectedItem || this.quantity < 1) {
                alert('Pilih item dan quantity yang valid!');
                return;
            }

            const item = this.stockData.find(i => i.kode === this.selectedItem);
            if (!item) return;

            const existingItem = this.order.items.find(i => i.kode === item.kode);
            
            if (existingItem) {
                existingItem.quantity += this.quantity;
                existingItem.subtotal = existingItem.quantity * item.harga;
            } else {
                this.order.items.push({
                    kode: item.kode,
                    judul: item.judul,
                    harga: item.harga,
                    quantity: this.quantity,
                    subtotal: item.harga * this.quantity
                });
            }

            this.calculateTotal();
            this.selectedItem = null;
            this.quantity = 1;
        },

        // Remove item from order
        removeItem(index) {
            this.order.items.splice(index, 1);
            this.calculateTotal();
        },

        // Calculate total order
        calculateTotal() {
            this.order.total = this.order.items.reduce((sum, item) => sum + item.subtotal, 0);
        },

        // Submit order
        submitOrder() {
            if (this.order.items.length === 0) {
                alert('Tambah minimal satu item ke pesanan!');
                return;
            }

            if (!this.order.upbjj) {
                alert('Pilih UPBJJ terlebih dahulu!');
                return;
            }

            // Simulate order submission
            alert('Pesanan berhasil dibuat! Total: ' + this.formatCurrency(this.order.total));
            this.resetOrder();
        },

        // Reset order
        resetOrder() {
            this.order = {
                upbjj: '',
                kategori: '',
                items: [],
                total: 0
            };
        }
    }
});