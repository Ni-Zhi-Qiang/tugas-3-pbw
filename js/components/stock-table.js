// Komponen Stock Table - Komponen Utama
Vue.component('ba-stock-table', {
    template: '#tpl-stock-table',
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
            // Filter states
            selectedUPBJJ: '',
            selectedKategori: '',
            showLowStock: false,
            showOutOfStock: false,
            searchQuery: '',
            sortField: 'judul',
            sortDirection: 'asc',
            
            // UI states
            showTooltip: false,
            tooltipContent: '',
            tooltipPosition: { x: 0, y: 0 },
            editingStock: null,
            newStock: this.getEmptyStock()
        };
    },
    computed: {
        // Computed property untuk filtered dan sorted data
        filteredStock() {
            let filtered = this.stockData;

            // Filter berdasarkan UPBJJ
            if (this.selectedUPBJJ) {
                filtered = filtered.filter(item => item.upbjj === this.selectedUPBJJ);
            }

            // Filter berdasarkan Kategori
            if (this.selectedKategori) {
                filtered = filtered.filter(item => item.kategori === this.selectedKategori);
            }

            // Filter stok menipis
            if (this.showLowStock) {
                filtered = filtered.filter(item => item.qty > 0 && item.qty < item.safety);
            }

            // Filter stok kosong
            if (this.showOutOfStock) {
                filtered = filtered.filter(item => item.qty === 0);
            }

            // Search filter
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                filtered = filtered.filter(item => 
                    item.kode.toLowerCase().includes(query) ||
                    item.judul.toLowerCase().includes(query) ||
                    item.lokasiRak.toLowerCase().includes(query)
                );
            }

            // Sorting
            filtered.sort((a, b) => {
                let aVal = a[this.sortField];
                let bVal = b[this.sortField];

                if (typeof aVal === 'string') {
                    aVal = aVal.toLowerCase();
                    bVal = bVal.toLowerCase();
                }

                if (this.sortDirection === 'asc') {
                    return aVal > bVal ? 1 : -1;
                } else {
                    return aVal < bVal ? 1 : -1;
                }
            });

            return filtered;
        },

        // Available categories based on selected UPBJJ
        availableKategories() {
            if (!this.selectedUPBJJ) {
                return this.kategoriList;
            }
            const categories = new Set();
            this.stockData
                .filter(item => item.upbjj === this.selectedUPBJJ)
                .forEach(item => categories.add(item.kategori));
            return Array.from(categories);
        },

        // Statistics
        statistics() {
            const total = this.stockData.length;
            const aman = this.stockData.filter(item => item.qty >= item.safety).length;
            const menipis = this.stockData.filter(item => item.qty > 0 && item.qty < item.safety).length;
            const kosong = this.stockData.filter(item => item.qty === 0).length;

            return { total, aman, menipis, kosong };
        }
    },
    watch: {
        // Watcher untuk reset kategori ketika UPBJJ berubah
        selectedUPBJJ(newUPBJJ) {
            if (newUPBJJ && !this.availableKategories.includes(this.selectedKategori)) {
                this.selectedKategori = '';
            }
        },

        // Watcher untuk live search
        searchQuery(newQuery) {
            console.log('Search query changed:', newQuery);
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

        // Format quantity dengan satuan
        formatQuantity(qty) {
            return `${qty} buah`;
        },

        // Show tooltip
        showTooltipInfo(event, catatanHTML) {
            this.tooltipContent = catatanHTML;
            this.tooltipPosition = {
                x: event.clientX,
                y: event.clientY
            };
            this.showTooltip = true;
        },

        // Hide tooltip
        hideTooltip() {
            this.showTooltip = false;
        },

        // Sort handler
        sortBy(field) {
            if (this.sortField === field) {
                this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortField = field;
                this.sortDirection = 'asc';
            }
        },

        // Reset filters
        resetFilters() {
            this.selectedUPBJJ = '';
            this.selectedKategori = '';
            this.showLowStock = false;
            this.showOutOfStock = false;
            this.searchQuery = '';
        },

        // Get empty stock template
        getEmptyStock() {
            return {
                kode: '',
                judul: '',
                kategori: '',
                upbjj: '',
                lokasiRak: '',
                harga: 0,
                qty: 0,
                safety: 0,
                catatanHTML: ''
            };
        },

        // Edit stock
        editStock(stock) {
            this.editingStock = { ...stock };
        },

        // Save stock (update)
        saveStock() {
            if (this.editingStock) {
                this.$emit('edit-stock', this.editingStock);
                this.editingStock = null;
            }
        },

        // Cancel edit
        cancelEdit() {
            this.editingStock = null;
        },

        // Delete stock
        deleteStock(stock) {
            if (confirm(`Apakah Anda yakin ingin menghapus stok untuk ${stock.judul}?`)) {
                this.$emit('delete-stock', stock.kode);
            }
        },

        // Add new stock
        addNewStock() {
            if (this.newStock.kode && this.newStock.judul) {
                this.$emit('add-stock', { ...this.newStock });
                this.newStock = this.getEmptyStock();
            } else {
                alert('Kode dan Judul harus diisi!');
            }
        },

        // Handle keyboard events
        handleKeydown(event, action) {
            if (event.key === 'Enter') {
                event.preventDefault();
                if (action === 'save') this.saveStock();
                if (action === 'add') this.addNewStock();
            }
            if (event.key === 'Escape') {
                this.cancelEdit();
            }
        }
    }
});