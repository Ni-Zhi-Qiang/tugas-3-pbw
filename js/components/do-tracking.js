// Komponen DO Tracking
Vue.component('do-tracking', {
    template: '#tpl-do-tracking',
    props: {
        trackingData: {
            type: Array,
            default: () => []
        },
        paketData: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            searchType: 'nomor',
            searchQuery: '',
            searchResults: [],
            newDO: {
                nomor: '',
                nim: '',
                nama: '',
                ekspedisi: 'JNE',
                paket: '',
                tanggalKirim: this.getCurrentDate(),
                total: 0,
                perjalanan: []
            },
            showProgressForm: false,
            newProgress: {
                waktu: this.getCurrentDateTime(),
                keterangan: ''
            }
        };
    },
    computed: {
        // Filter tracking data berdasarkan search
        filteredTracking() {
            if (!this.searchQuery) return this.trackingData;
            
            return this.trackingData.filter(item => {
                const doData = Object.values(item)[0];
                if (this.searchType === 'nomor') {
                    return Object.keys(item)[0].toLowerCase().includes(this.searchQuery.toLowerCase());
                } else {
                    return doData.nim.includes(this.searchQuery);
                }
            });
        },

        // Selected package details
        selectedPackage() {
            return this.paketData.find(p => p.kode === this.newDO.paket) || null;
        }
    },
    watch: {
        // Watch untuk auto-update total ketika paket berubah
        'newDO.paket'(newPaket) {
            const paket = this.paketData.find(p => p.kode === newPaket);
            if (paket) {
                this.newDO.total = paket.harga;
            }
        },

        // Watch untuk search live update
        searchQuery(newQuery) {
            if (newQuery) {
                this.performSearch();
            }
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

        // Format date
        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('id-ID', options);
        },

        // Get current date
        getCurrentDate() {
            return new Date().toISOString().split('T')[0];
        },

        // Get current datetime
        getCurrentDateTime() {
            const now = new Date();
            return now.toISOString().slice(0, 19).replace('T', ' ');
        },

        // Generate DO number
        generateDONumber() {
            const lastDO = this.trackingData[this.trackingData.length - 1];
            let lastNumber = '000';
            
            if (lastDO) {
                const lastKey = Object.keys(lastDO)[0];
                lastNumber = lastKey.split('-')[1];
            }
            
            const newNumber = (parseInt(lastNumber) + 1).toString().padStart(3, '0');
            return `DO2025-${newNumber}`;
        },

        // Perform search
        performSearch() {
            this.searchResults = this.filteredTracking;
        },

        // Clear search
        clearSearch() {
            this.searchQuery = '';
            this.searchResults = [];
        },

        // Add new DO
        addNewDO() {
            if (!this.validateDO()) return;

            this.newDO.nomor = this.generateDONumber();
            
            const doEntry = {
                [this.newDO.nomor]: { ...this.newDO }
            };

            this.$emit('add-tracking', doEntry);
            this.resetDOForm();
        },

        // Validate DO form
        validateDO() {
            if (!this.newDO.nim) {
                alert('NIM harus diisi!');
                return false;
            }
            if (!this.newDO.nama) {
                alert('Nama harus diisi!');
                return false;
            }
            if (!this.newDO.paket) {
                alert('Paket harus dipilih!');
                return false;
            }
            return true;
        },

        // Reset DO form
        resetDOForm() {
            this.newDO = {
                nomor: '',
                nim: '',
                nama: '',
                ekspedisi: 'JNE',
                paket: '',
                tanggalKirim: this.getCurrentDate(),
                total: 0,
                perjalanan: []
            };
        },

        // Add progress
        addProgress(doNumber) {
            if (!this.newProgress.keterangan) {
                alert('Keterangan progress harus diisi!');
                return;
            }

            this.$emit('add-progress', {
                doNumber,
                progress: { ...this.newProgress }
            });

            this.newProgress = {
                waktu: this.getCurrentDateTime(),
                keterangan: ''
            };
            this.showProgressForm = false;
        },

        // Handle keyboard events
        handleKeydown(event, action) {
            if (event.key === 'Enter') {
                event.preventDefault();
                if (action === 'search') this.performSearch();
                if (action === 'add-do') this.addNewDO();
            }
            if (event.key === 'Escape') {
                this.clearSearch();
            }
        }
    },
    mounted() {
        // Generate initial DO number
        this.newDO.nomor = this.generateDONumber();
    }
});