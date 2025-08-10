import React, { useState, useEffect } from 'react';
import { FaUser, FaSearch, FaPlus, FaEye, FaEdit, FaTrash, FaPhone, FaEnvelope, FaMapMarkerAlt, FaImage, FaUpload, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { api } from '../../lib/axios/api';

interface Candidate {
  id: string;
  photo: string | null;
  name: string;
  phone: string;
  email: string;
  address: string;
  description: string;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    data: Candidate[];
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

type ModalMode = 'create' | 'edit';

export default function CandidatePage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [selectedCandidateDetail, setSelectedCandidateDetail] = useState<Candidate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    description: '',
    password: '',
    photo: null as File | null
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const loadCandidates = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/Users?page=${currentPage}&per_page=5&search=${searchTerm}`);
      const data = response.data;

      if (data.success) {
        setCandidates(data.data.data);
        setTotalPages(data.data.lastPage);
        setTotalItems(data.data.total);
      } else {
        setCandidates([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error('Error loading candidates:', error);
      setCandidates([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, [currentPage, searchTerm]);

  const handleCreate = () => {
    setModalMode('create');
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      description: '',
      password: '',
      photo: null
    });
    setPhotoPreview(null);
    setEditingId(null);
    setShowModal(true);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleViewDetail = (candidate: Candidate) => {
    setSelectedCandidateDetail(candidate);
    setShowDetailModal(true);
  };

  const handleEdit = (candidate: Candidate) => {
    setModalMode('edit');
    setFormData({
      name: candidate.name,
      phone: candidate.phone,
      email: candidate.email,
      address: candidate.address,
      description: candidate.description,
      password: '',
      photo: null
    });
    setPhotoPreview(candidate.photo);
    setEditingId(candidate.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kandidat ini?')) {
      try {
        await api.delete(`/Users/${id}`);
        loadCandidates();
      } catch (error) {
        console.error('Error deleting candidate:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('password', formData.password);
      
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }

      if (modalMode === 'create') {
        await api.post('/Users', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await api.put(`/Users/${editingId}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      loadCandidates();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving candidate:', error);
    }
  };

  // Safe pagination calculation
  const safeTotalPages = Math.max(1, totalPages || 1);
  const paginationArray = Array.from({ length: safeTotalPages }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Manajemen Kandidat</h1>
          <p className="text-gray-600">Kelola data kandidat pelamar kerja</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Kandidat</p>
                <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
              </div>
              <div className="bg-[#ffd401]/20 p-3 rounded-xl">
                <FaUser className="text-[#ffd401] text-xl" />
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
                <FaCheckCircle className="text-green-500 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 mb-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari kandidat berdasarkan nama, email, atau telepon..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffd401] focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>
            <button
              onClick={handleCreate}
              className="bg-gradient-to-r from-[#ffd401] to-yellow-500 hover:from-yellow-500 hover:to-[#ffd401] text-black px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ml-4"
            >
              <FaPlus /> Tambah Kandidat
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/10 border-b border-white/20">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Kandidat</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Kontak</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-800">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ffd401]"></div>
                        <span className="ml-3 text-gray-600">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : candidates.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      Tidak ada kandidat ditemukan
                    </td>
                  </tr>
                ) : (
                  candidates.map((candidate) => (
                    <tr key={candidate.id} className="border-b border-white/10 hover:bg-white/10 transition-all duration-300">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            {candidate.photo ? (
                              <img 
                                src={candidate.photo} 
                                alt={candidate.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FaUser className="text-white text-lg" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">{candidate.name}</div>
                            <div className="text-sm text-gray-600 max-w-xs truncate">
                              {candidate.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaPhone className="text-xs" />
                            {candidate.phone}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaEnvelope className="text-xs" />
                            {candidate.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            candidate.verifiedAt 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {candidate.verifiedAt ? 'Terverifikasi' : 'Belum Verifikasi'}
                          </span>
                          <div className="text-xs text-gray-500">
                            {formatDate(candidate.createdAt)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewDetail(candidate)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="Lihat Detail"
                          >
                            <FaEye className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleEdit(candidate)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-200"
                            title="Edit"
                          >
                            <FaEdit className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleDelete(candidate.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Hapus"
                          >
                            <FaTrash className="text-sm" />
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
          {!loading && candidates.length > 0 && safeTotalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/20">
              <div className="text-sm text-gray-600">
                Menampilkan {candidates.length} dari {totalItems} kandidat
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
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedCandidateDetail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-sm border border-white/30 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Detail Kandidat</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <FaTrash className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  {selectedCandidateDetail.photo ? (
                    <img 
                      src={selectedCandidateDetail.photo} 
                      alt={selectedCandidateDetail.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUser className="text-white text-2xl" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{selectedCandidateDetail.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedCandidateDetail.verifiedAt 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {selectedCandidateDetail.verifiedAt ? 'Terverifikasi' : 'Belum Verifikasi'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="text-gray-800">{selectedCandidateDetail.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                  <div className="text-gray-800">{selectedCandidateDetail.phone}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dibuat</label>
                  <div className="text-gray-800">
                    {formatDate(selectedCandidateDetail.createdAt)}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                <div className="bg-white/30 rounded-xl p-4 text-gray-800">
                  {selectedCandidateDetail.address}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                <div className="bg-white/30 rounded-xl p-4 text-gray-800">
                  {selectedCandidateDetail.description}
                </div>
              </div>

              {selectedCandidateDetail.verifiedAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Verifikasi</label>
                  <div className="text-gray-800">
                    {formatDate(selectedCandidateDetail.verifiedAt)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-sm border border-white/30 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {modalMode === 'create' ? 'Tambah Kandidat Baru' : 'Edit Kandidat'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <FaTimesCircle className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto Profil
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    {photoPreview ? (
                      <img 
                        src={photoPreview} 
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser className="text-white text-2xl" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 border border-white/30 rounded-xl hover:bg-white/70 cursor-pointer transition-all duration-200"
                    >
                      <FaUpload className="text-sm" />
                      Pilih Foto
                    </label>
                    <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG. Maksimal 2MB</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffd401] focus:border-transparent transition-all duration-300"
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffd401] focus:border-transparent transition-all duration-300"
                    placeholder="Masukkan email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telepon *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffd401] focus:border-transparent transition-all duration-300"
                    placeholder="Masukkan nomor telepon"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password {modalMode === 'create' && '*'}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffd401] focus:border-transparent transition-all duration-300"
                    placeholder="Masukkan password"
                    required={modalMode === 'create'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat *
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffd401] focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Masukkan alamat lengkap"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffd401] focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Masukkan deskripsi atau pengalaman kerja"
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#ffd401] to-yellow-500 hover:from-yellow-500 hover:to-[#ffd401] text-black font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {modalMode === 'create' ? 'Buat Kandidat' : 'Perbarui Kandidat'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}