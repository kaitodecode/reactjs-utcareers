import React, { useState, useEffect } from 'react';
import { FaBriefcase, FaSearch, FaPlus, FaEye, FaEdit, FaTrash, FaBuilding, FaTag, FaImage, FaUpload, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { api } from '../../lib/axios/api';

interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  logo: string;
  location: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface JobCategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Job {
  id: string;
  companyId: string;
  title: string;
  thumbnail: string | null;
  status: 'active' | 'closed';
  createdAt: string;
  updatedAt: string;
  company: Company;
  jobCategories: JobCategory[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    data: Job[];
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

interface CompanyListResponse {
  success: boolean;
  message: string;
  data: Company[];
}

interface JobCategoryListResponse {
  success: boolean;
  message: string;
  data: JobCategory[];
}

type ModalMode = 'create' | 'edit';

export default function JobPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [selectedJobDetail, setSelectedJobDetail] = useState<Job | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    companyId: '',
    status: 'active' as 'active' | 'closed',
    selectedJobCategories: [] as string[],
    thumbnail: null as File | null
  });
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
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

  const loadJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/JobPosts?page=${currentPage}&per_page=5&search=${searchTerm}`);
      const data = response.data;

      if (data.success) {
        setJobs(data.data.data);
        setTotalPages(data.data.lastPage);
        setTotalItems(data.data.total);
      } else {
        setJobs([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
      setJobs([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const loadCompanies = async () => {
    try {
      const response = await api.get('/Companies/list');
      if (response.data.success) {
        setCompanies(response.data.data);
      }
    } catch (error) {
      console.error('Error loading companies:', error);
    }
  };

  const loadJobCategories = async () => {
    try {
      const response = await api.get('/JobCategories/list');
      if (response.data.success) {
        setJobCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error loading job categories:', error);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [currentPage, searchTerm]);

  useEffect(() => {
    loadCompanies();
    loadJobCategories();
  }, []);

  const handleCreate = () => {
    setModalMode('create');
    setFormData({
      title: '',
      companyId: '',
      status: 'active',
      selectedJobCategories: [],
      thumbnail: null
    });
    setThumbnailPreview(null);
    setEditingId(null);
    setShowModal(true);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, thumbnail: file });
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleViewDetail = (job: Job) => {
    setSelectedJobDetail(job);
    setShowDetailModal(true);
  };

  const handleEdit = (job: Job) => {
    setModalMode('edit');
    setFormData({
      title: job.title,
      companyId: job.companyId,
      status: job.status,
      selectedJobCategories: job.jobCategories.map(cat => cat.id),
      thumbnail: null
    });
    setThumbnailPreview(job.thumbnail);
    setEditingId(job.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus job ini?')) {
      try {
        await api.delete(`/JobPosts/${id}`);
        loadJobs();
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const handleJobCategoryToggle = (categoryId: string) => {
    const updatedCategories = formData.selectedJobCategories.includes(categoryId)
      ? formData.selectedJobCategories.filter(id => id !== categoryId)
      : [...formData.selectedJobCategories, categoryId];
    
    setFormData({ ...formData, selectedJobCategories: updatedCategories });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('companyId', formData.companyId);
      formDataToSend.append('status', formData.status);
      
      // Add job categories
      formData.selectedJobCategories.forEach((categoryId, index) => {
        formDataToSend.append(`jobCategoryIds[${index}]`, categoryId);
      });
      
      if (formData.thumbnail) {
        formDataToSend.append('thumbnail', formData.thumbnail);
      }

      if (modalMode === 'create') {
        await api.post('/JobPosts', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await api.put(`/JobPosts/${editingId}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      loadJobs();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving job:', error);
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
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Manajemen Job</h1>
          <p className="text-gray-600">Kelola data lowongan pekerjaan</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Job</p>
                <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
              </div>
              <div className="bg-[#ffd401]/20 p-3 rounded-xl">
                <FaBriefcase className="text-[#ffd401] text-xl" />
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
                  placeholder="Cari job berdasarkan judul atau perusahaan..."
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
              <FaPlus /> Tambah Job
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/10 border-b border-white/20">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Job</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Perusahaan</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Kategori</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-800">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ffd401]"></div>
                        <span className="ml-3 text-gray-600">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : jobs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Tidak ada job ditemukan
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job.id} className="border-b border-white/10 hover:bg-white/10 transition-all duration-300">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            {job.thumbnail ? (
                              <img 
                                src={job.thumbnail} 
                                alt={job.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FaBriefcase className="text-white text-lg" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">{job.title}</div>
                            <div className="text-sm text-gray-600">
                              {formatDate(job.createdAt)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                            {job.company.logo ? (
                              <img 
                                src={job.company.logo} 
                                alt={job.company.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FaBuilding className="text-gray-500 text-sm" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{job.company.name}</div>
                            <div className="text-sm text-gray-600">{job.company.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {job.jobCategories.slice(0, 2).map((category) => (
                            <span
                              key={category.id}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              <FaTag className="mr-1 text-xs" />
                              {category.name}
                            </span>
                          ))}
                          {job.jobCategories.length > 2 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{job.jobCategories.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          job.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {job.status === 'active' ? 'Aktif' : 'Tutup'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewDetail(job)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="Lihat Detail"
                          >
                            <FaEye className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleEdit(job)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-200"
                            title="Edit"
                          >
                            <FaEdit className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleDelete(job.id)}
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
          {!loading && jobs.length > 0 && safeTotalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/20">
              <div className="text-sm text-gray-600">
                Menampilkan {jobs.length} dari {totalItems} job
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
      {showDetailModal && selectedJobDetail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-sm border border-white/30 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Detail Job</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <FaTimesCircle className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                <div className="w-full h-80 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  {selectedJobDetail.thumbnail ? (
                    <img 
                      src={selectedJobDetail.thumbnail} 
                      alt={selectedJobDetail.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaBriefcase className="text-white text-2xl" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{selectedJobDetail.title}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedJobDetail.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedJobDetail.status === 'active' ? 'Aktif' : 'Tutup'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Perusahaan</label>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {selectedJobDetail.company.logo ? (
                        <img 
                          src={selectedJobDetail.company.logo} 
                          alt={selectedJobDetail.company.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaBuilding className="text-gray-500 text-sm" />
                      )}
                    </div>
                    <div className="text-gray-800">{selectedJobDetail.company.name}</div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                  <div className="text-gray-800">{selectedJobDetail.company.location}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="text-gray-800">{selectedJobDetail.company.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                  <div className="text-gray-800">{selectedJobDetail.company.phone}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <div className="text-gray-800">
                    {selectedJobDetail.company.website ? (
                      <a href={selectedJobDetail.company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {selectedJobDetail.company.website}
                      </a>
                    ) : (
                      'Tidak ada'
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dibuat</label>
                  <div className="text-gray-800">
                    {formatDate(selectedJobDetail.createdAt)}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Perusahaan</label>
                <div className="bg-white/30 rounded-xl p-4 text-gray-800">
                  {selectedJobDetail.company.description}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Job</label>
                <div className="flex flex-wrap gap-2">
                  {selectedJobDetail.jobCategories.map((category) => (
                    <span
                      key={category.id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      <FaTag className="mr-2 text-xs" />
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
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
                {modalMode === 'create' ? 'Tambah Job Baru' : 'Edit Job'}
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
                  Thumbnail
                </label>
                <div className="flex flex-col gap-4">
                  <div className="w-full h-80 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                    {thumbnailPreview ? (
                      <img 
                        src={thumbnailPreview} 
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaImage className="text-gray-400 text-2xl" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 border border-white/30 rounded-lg cursor-pointer hover:bg-white/70 transition-all duration-300"
                    >
                      <FaUpload className="text-sm" />
                      Pilih Thumbnail
                    </label>
                    <p className="text-sm text-gray-500 mt-1">Format: JPG, PNG. Maksimal 2MB</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Job *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffd401] focus:border-transparent transition-all duration-300"
                    placeholder="Masukkan judul job"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Perusahaan *
                  </label>
                  <select
                    value={formData.companyId}
                    onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffd401] focus:border-transparent transition-all duration-300"
                    required
                  >
                    <option value="">Pilih Perusahaan</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'closed' })}
                    className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffd401] focus:border-transparent transition-all duration-300"
                    required
                  >
                    <option value="active">Aktif</option>
                    <option value="closed">Tutup</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori Job *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-40 overflow-y-auto p-3 bg-white/30 rounded-xl">
                  {jobCategories.map((category) => (
                    <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.selectedJobCategories.includes(category.id)}
                        onChange={() => handleJobCategoryToggle(category.id)}
                        className="rounded border-gray-300 text-[#ffd401] focus:ring-[#ffd401]"
                      />
                      <span className="text-sm text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
                {formData.selectedJobCategories.length === 0 && (
                  <p className="text-sm text-red-500 mt-1">Pilih minimal satu kategori</p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={formData.selectedJobCategories.length === 0}
                  className="flex-1 bg-gradient-to-r from-[#ffd401] to-yellow-500 hover:from-yellow-500 hover:to-[#ffd401] text-black font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {modalMode === 'create' ? 'Buat Job' : 'Perbarui Job'}
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