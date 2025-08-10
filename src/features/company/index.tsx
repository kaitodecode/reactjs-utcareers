import { useState, useEffect } from 'react';
import { FaBuilding, FaPlus, FaEdit, FaTrash, FaEye, FaGlobe, FaPhone, FaEnvelope, FaMapMarkerAlt, FaSearch, FaFilter, FaImage, FaUpload } from 'react-icons/fa';
import { api } from '../../lib/axios/api';

interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  website: string | null;
  logo: string;
  location: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    data: Company[];
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

export default function CompanyPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    logo: null as File | null,
    location: '',
    description: ''
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCompanyDetail, setSelectedCompanyDetail] = useState<Company | null>(null);

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
    loadCompanies();
  }, [currentPage, searchTerm]);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/Companies?page=${currentPage}&per_page=10&search=${searchTerm}`);
      const data = response.data;

      if (data.success) {
        setCompanies(data.data.data);
        setTotalPages(data.data.lastPage);
        setTotalItems(data.data.total);
      } else {
        setCompanies([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error('Error loading companies:', error);
      setCompanies([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setSelectedCompany(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      website: '',
      logo: null,
      location: '',
      description: ''
    });
    setLogoPreview(null);
    setShowModal(true);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleViewDetail = (company: Company) => {
    setSelectedCompanyDetail(company);
    setShowDetailModal(true);
  };

  const handleEdit = (company: Company) => {
    setModalMode('edit');
    setSelectedCompany(company);
    setFormData({
      name: company.name,
      email: company.email,
      phone: company.phone,
      website: company.website || '',
      logo: null,
      location: company.location,
      description: company.description
    });
    setLogoPreview(company.logo);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus perusahaan ini?')) {
      try {
        await api.delete(`/Companies/${id}`);
        loadCompanies(); // Reload data
      } catch (error) {
        console.error('Error deleting company:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('website', formData.website);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('description', formData.description);
      
      if (formData.logo) {
        formDataToSend.append('logo', formData.logo);
      }
      
      if (modalMode === 'create') {
        await api.post('/Companies', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await api.put(`/Companies/${selectedCompany?.id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      loadCompanies(); // Reload data
      setShowModal(false);
    } catch (error) {
      console.error('Error saving company:', error);
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
              <FaBuilding className="text-[#ffd401]" />
              Company Management
            </h1>
            <p className="text-gray-600 mt-2">Manage companies and job postings</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-gradient-to-r from-[#ffd401] to-yellow-500 hover:from-yellow-500 hover:to-[#ffd401] text-black px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FaPlus /> Tambah Perusahaan
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Perusahaan</p>
              <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
            </div>
            <div className="bg-[#ffd401]/20 p-3 rounded-xl">
              <FaBuilding className="text-[#ffd401] text-xl" />
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
              placeholder="Cari perusahaan berdasarkan nama, email, atau lokasi..."
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Perusahaan</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Kontak</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Lokasi</th>
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
              ) : companies.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada perusahaan ditemukan
                  </td>
                </tr>
              ) : (
                companies.map((company) => (
                  <tr key={company.id} className="border-b border-white/10 hover:bg-white/10 transition-all duration-300">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {company.logo ? (
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-[#ffd401] to-yellow-500 rounded-lg flex items-center justify-center">
                            <FaBuilding className="text-black text-lg" />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-800">{company.name}</div>
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            {company.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaEnvelope className="text-xs" />
                          {company.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaPhone className="text-xs" />
                          {company.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaMapMarkerAlt className="text-xs" />
                        {company.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewDetail(company)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all duration-300"
                          title="Detail"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(company)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-300"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(company.id)}
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
        {!loading && companies.length > 0 && safeTotalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/20">
            <div className="text-sm text-gray-600">
              Menampilkan {companies.length} dari {totalItems} perusahaan
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
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Detail Perusahaan</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {selectedCompanyDetail && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  {selectedCompanyDetail.logo ? (
                    <img
                      src={selectedCompanyDetail.logo}
                      alt={selectedCompanyDetail.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-[#ffd401] to-yellow-500 rounded-xl flex items-center justify-center">
                      <FaBuilding className="text-black text-2xl" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{selectedCompanyDetail.name}</h3>
                    <p className="text-gray-600 flex items-center gap-1">
                      <FaMapMarkerAlt className="text-sm" />
                      {selectedCompanyDetail.location}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="flex items-center gap-2 text-gray-800">
                        <FaEnvelope className="text-sm" />
                        {selectedCompanyDetail.email}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                      <div className="flex items-center gap-2 text-gray-800">
                        <FaPhone className="text-sm" />
                        {selectedCompanyDetail.phone}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                      {selectedCompanyDetail.website ? (
                        <a
                          href={selectedCompanyDetail.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[#ffd401] hover:text-yellow-600 transition-colors"
                        >
                          <FaGlobe className="text-sm" />
                          {selectedCompanyDetail.website}
                        </a>
                      ) : (
                        <span className="text-gray-500">Tidak ada website</span>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dibuat</label>
                      <div className="text-gray-800">
                        {formatDate(selectedCompanyDetail.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                  <div className="bg-white/30 rounded-xl p-4 text-gray-800">
                    {selectedCompanyDetail.description}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all duration-300"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {modalMode === 'create' ? 'Add New Company' : 'Edit Company'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffd401] focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffd401] focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffd401] focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffd401] focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffd401] focus:border-transparent transition-all duration-300"
                    />
                    {logoPreview && (
                      <div className="flex items-center gap-3">
                        <img src={logoPreview} alt="Logo preview" className="w-16 h-16 rounded-lg object-cover" />
                        <span className="text-sm text-gray-600">Preview logo</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffd401] focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffd401] focus:border-transparent transition-all duration-300 resize-none"
                  required
                />
              </div>

              <div className="flex items-center gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-[#ffd401] to-yellow-500 hover:from-yellow-500 hover:to-[#ffd401] text-black px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Menyimpan...' : modalMode === 'create' ? 'Tambah Perusahaan' : 'Update Perusahaan'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all duration-300"
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