// Root Vue Instance
document.addEventListener('DOMContentLoaded', function() {
    new Vue({
        el: '#app',
        data: {
            // Tab management
            currentTab: 'stok',
            tabs: [
                { id: 'stok', name: 'Stok Bahan Ajar' },
                { id: 'tracking', name: 'Tracking DO' },
                { id: 'order', name: 'Pemesanan' }
            ],
            
            // Data from JSON
            upbjjList: [],
            kategoriList: [],
            pengirimanList: [],
            paketData: [],
            stockData: [],
            trackingData: [],
            
            // UI states
            showAddForm: false,
            showOrderForm: false,
            isLoading: true
        },
        computed: {
            // Statistics for dashboard
            stockStatistics() {
                const total = this.stockData.length;
                const aman = this.stockData.filter(item => item.qty >= item.safety).length;
                const menipis = this.stockData.filter(item => item.qty > 0 && item.qty < item.safety).length;
                const kosong = this.stockData.filter(item => item.qty === 0).length;
                
                return { total, aman, menipis, kosong };
            }
        },
        watch: {
            // Watch for tab changes
            currentTab(newTab) {
                console.log('Tab changed to:', newTab);
            },
            
            // Watch for stock data changes
            stockData: {
                handler(newStock) {
                    console.log('Stock data updated:', newStock.length, 'items');
                    this.checkLowStock();
                },
                deep: true
            }
        },
        methods: {
            // Load initial data
            async loadInitialData() {
                try {
                    this.isLoading = true;
                    const data = await DataService.loadData();
                    
                    this.upbjjList = data.upbjjList;
                    this.kategoriList = data.kategoriList;
                    this.pengirimanList = data.pengirimanList;
                    this.paketData = data.paket;
                    this.stockData = data.stok;
                    this.trackingData = data.tracking;
                    
                } catch (error) {
                    console.error('Error loading initial data:', error);
                    alert('Error loading data. Using default data.');
                } finally {
                    this.isLoading = false;
                }
            },
            
            // Handle stock edits
            handleEditStock(updatedStock) {
                const index = this.stockData.findIndex(item => item.kode === updatedStock.kode);
                if (index !== -1) {
                    this.stockData.splice(index, 1, updatedStock);
                    alert('Stok berhasil diperbarui!');
                }
            },
            
            // Handle stock deletion
            handleDeleteStock(stockKode) {
                const index = this.stockData.findIndex(item => item.kode === stockKode);
                if (index !== -1) {
                    this.stockData.splice(index, 1);
                    alert('Stok berhasil dihapus!');
                }
            },
            
            // Handle new stock addition
            handleAddStock(newStock) {
                // Check if stock code already exists
                const exists = this.stockData.some(item => item.kode === newStock.kode);
                if (exists) {
                    alert('Kode stok sudah ada!');
                    return;
                }
                
                this.stockData.push(newStock);
                alert('Stok baru berhasil ditambahkan!');
            },
            
            // Handle new tracking addition
            handleAddTracking(newTracking) {
                this.trackingData.push(newTracking);
                alert('Data tracking berhasil ditambahkan!');
            },
            
            // Check for low stock items
            checkLowStock() {
                const lowStockItems = this.stockData.filter(item => 
                    item.qty > 0 && item.qty < item.safety
                );
                
                const outOfStockItems = this.stockData.filter(item => item.qty === 0);
                
                if (lowStockItems.length > 0 || outOfStockItems.length > 0) {
                    let message = '';
                    if (outOfStockItems.length > 0) {
                        message += `⚠️ ${outOfStockItems.length} item stok kosong\n`;
                    }
                    if (lowStockItems.length > 0) {
                        message += `⚠️ ${lowStockItems.length} item stok menipis`;
                    }
                    
                    // Show notification (could be enhanced with toast notification)
                    if (message) {
                        console.log('Stock Alert:', message);
                    }
                }
            },
            
            // Format currency helper
            formatCurrency(value) {
                return new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                }).format(value);
            }
        },
        created() {
            this.loadInitialData();
        },
        mounted() {
            console.log('Vue app mounted successfully');
        }
    });
});