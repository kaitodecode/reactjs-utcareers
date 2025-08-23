import { useState, useEffect } from 'react';
import { FaLayerGroup, FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter, FaTag } from 'react-icons/fa';
import { api } from '../../lib/axios/api';

interface Division {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    data: Division[];
    currentPage: number;
    from: number;
    lastPage: number;
    path: string;
    perPage: number;
    to: number;
    total: number;
    firstPageUrl: string;
    lastPageUrl: string;
    nextPageUrl: string | null;
    prevPageUrl: string | null;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
  };
}

export default function DevisionPage() {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedDivision, setSelectedDivision] = useState<Division | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    name: ''
  });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDivisionDetail, setSelectedDivisionDetail] = useState<Division | null>(null);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    loadDivisions();
  }, [currentPage, searchTerm]);

  const loadDivisions = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/JobCategories?page=${currentPage}&per_page=10&search=${searchTerm}`);
      const data = response.data;

      if (data.success) {
        setDivisions(data.data.data);
        setTotalPages(data.data.lastPage);
        setTotalItems(data.data.total);
      } else {
        setDivisions([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error('Error loading divisions:', error);
      setDivisions([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setSelectedDivision(null);
    setFormData({
      name: ''
    });
    setShowModal(true);
  };

  const handleViewDetail = (division: Division) => {
    setSelectedDivisionDetail(division);
    setShowDetailModal(true);
  };

  const handleEdit = (division: Division) => {
    setModalMode('edit');
    setSelectedDivision(division);
    setFormData({
      name: division.name
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus divisi ini?')) {
      try {
        await api.delete(`/JobCategories/${id}`);
        loadDivisions(); // Reload data
      } catch (error) {
        console.error('Error deleting division:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (modalMode === 'create') {
        await api.post('/JobCategories', formData);
      } else {
        await api.put(`/JobCategories/${selectedDivision?.id}`, formData);
      }
      
      loadDivisions(); // Reload data
      setShowModal(false);
    } catch (error) {
      console.error('Error saving division:', error);
    } finally {
      setLoading(false);
    }
  };

  // Safe pagination calculation
  const safeTotalPages = Math.max(1, totalPages || 1);
  const paginationArray = Array.from({ length: safeTotalPages }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <FaLayerGroup className="text-[#ffd401]" />
              Division Management
            </h1>
            <p className="text-gray-600 mt-2">Manage job categories and divisions</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-gradient-to-r from-[#ffd401] to-yellow-500 hover:from-yellow-500 hover:to-[#ffd401] text-black px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FaPlus /> Tambah Divisi
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Divisi</p>
              <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
            </div>
            <div className="bg-[#ffd401]/20 p-3 rounded-xl">
              <FaLayerGroup className="text-[#ffd401] text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Halaman Saat Ini</p>
              <p className="text-2xl font-bold text-gray-800">{currentPage}</p>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-xl">
              <FaSearch className="text-blue-500 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Halaman</p>
              <p className="text-2xl font-bold text-gray-800">{safeTotalPages}</p>
            </div>
            <div className="bg-green-500/20 p-3 rounded-xl">
              <FaFilter className="text-green-500 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 mb-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
        <div className="flex-1">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari divisi berdasarkan nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffd401] focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/10 border-b border-white/20">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Nama Divisi</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Dibuat</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-800">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ffd401]"></div>
                      <span className="ml-3 text-gray-600">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : divisions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada divisi ditemukan
                  </td>
                </tr>
              ) : (
                divisions.map((division) => (
                  <tr key={division.id} className="border-b border-white/10 hover:bg-white/10 transition-all duration-300">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#ffd401] to-yellow-500 rounded-lg flex items-center justify-center">
                          <FaTag className="text-black text-sm" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{division.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {formatDate(division.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewDetail(division)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all duration-300"
                          title="Detail"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(division)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-300"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(division.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-300"
                          title="Hapus"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && divisions.length > 0 && safeTotalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/20">
            <div className="text-sm text-gray-600">
              Menampilkan {divisions.length} dari {totalItems} divisi
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm bg-white/50 border border-white/30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/70 transition-all duration-300"
              >
                Sebelumnya
              </button>
              
              {paginationArray.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm rounded-lg transition-all duration-300 ${
                    currentPage === page
                      ? 'bg-[#ffd401] text-black font-semibold'
                      : 'bg-white/50 border border-white/30 hover:bg-white/70'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(Math.min(safeTotalPages, currentPage + 1))}
                disabled={currentPage === safeTotalPages}
                className="px-3 py-2 text-sm bg-white/50 border border-white/30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/70 transition-all duration-300"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white backdrop-blur-xl border border-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Detail Divisi</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {selectedDivisionDetail && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#ffd401] to-yellow-500 rounded-xl flex items-center justify-center">
                    <FaTag className="text-black text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{selectedDivisionDetail.name}</h3>
                    <p className="text-gray-600">Kategori Pekerjaan</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Divisi</label>
                    <div className="text-gray-800 font-semibold">{selectedDivisionDetail.name}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dibuat</label>
                    <div className="text-gray-800">
                      {formatDate(selectedDivisionDetail.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white backdrop-blur-xl border border-white rounded-2xl p-8 w-full max-w-md shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {modalMode === 'create' ? 'Tambah Divisi' : 'Edit Divisi'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Divisi *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffd401] focus:border-transparent transition-all duration-300"
                  placeholder="Masukkan nama divisi"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#ffd401] to-yellow-500 hover:from-yellow-500 hover:to-[#ffd401] text-black rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : modalMode === 'create' ? 'Buat Divisi' : 'Update Divisi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}