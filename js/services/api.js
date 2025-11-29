// Data Service untuk handle akses data
const DataService = {
    // Load data dari JSON
    async loadData() {
        try {
            const response = await fetch('../data/dataBahanAjar.json');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error loading data:', error);
            return this.getDefaultData();
        }
    },

    // Default data fallback
    getDefaultData() {
        return {
            upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
            kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
            pengirimanList: [
                { kode: "REG", nama: "Reguler (3-5 hari)" },
                { kode: "EXP", nama: "Ekspres (1-2 hari)" }
            ],
            paket: [
                {
                    kode: "PAKET-UT-001",
                    nama: "PAKET IPS Dasar",
                    isi: ["EKMA4116", "EKMA4115"],
                    harga: 120000
                },
                {
                    kode: "PAKET-UT-002",
                    nama: "PAKET IPA Dasar",
                    isi: ["BIOL4201", "FISIP4001"],
                    harga: 140000
                }
            ],
            stok: [
                {
                    kode: "EKMA4116",
                    judul: "Pengantar Manajemen",
                    kategori: "MK Wajib",
                    upbjj: "Jakarta",
                    lokasiRak: "R1-A3",
                    harga: 65000,
                    qty: 28,
                    safety: 20,
                    catatanHTML: "<em>Edisi 2024, cetak ulang</em>"
                },
                {
                    kode: "EKMA4115",
                    judul: "Pengantar Akuntansi",
                    kategori: "MK Wajib",
                    upbjj: "Jakarta",
                    lokasiRak: "R1-A4",
                    harga: 60000,
                    qty: 7,
                    safety: 15,
                    catatanHTML: "<strong>Cover baru</strong>"
                },
                {
                    kode: "BIOL4201",
                    judul: "Biologi Umum (Praktikum)",
                    kategori: "Praktikum",
                    upbjj: "Surabaya",
                    lokasiRak: "R3-B2",
                    harga: 80000,
                    qty: 12,
                    safety: 10,
                    catatanHTML: "Butuh <u>pendingin</u> untuk kit basah"
                },
                {
                    kode: "FISIP4001",
                    judul: "Dasar-Dasar Sosiologi",
                    kategori: "MK Pilihan",
                    upbjj: "Makassar",
                    lokasiRak: "R2-C1",
                    harga: 55000,
                    qty: 2,
                    safety: 8,
                    catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder"
                }
            ],
            tracking: []
        };
    },

    // Generate nomor DO otomatis
    generateDONumber(lastNumber = null) {
        const now = new Date();
        const year = now.getFullYear();
        
        if (lastNumber) {
            const sequence = parseInt(lastNumber.split('-')[1]) + 1;
            return `DO${year}-${sequence.toString().padStart(3, '0')}`;
        }
        
        return `DO${year}-001`;
    },

    // Simulate API delay
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};