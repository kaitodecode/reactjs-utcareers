import { FaUsers, FaBriefcase, FaChartLine, FaArrowUp, FaArrowDown, FaUserTie, FaFileAlt, FaBuilding } from 'react-icons/fa';

export default function DashboardPage() {
    // Sample data for job portal charts
    const jobPostingsData = [
        { month: 'Jan', value: 45 },
        { month: 'Feb', value: 62 },
        { month: 'Mar', value: 78 },
        { month: 'Apr', value: 85 },
        { month: 'May', value: 92 },
        { month: 'Jun', value: 88 }
    ];

    const applicationsData = [
        { month: 'Jan', applications: 320 },
        { month: 'Feb', applications: 445 },
        { month: 'Mar', applications: 580 },
        { month: 'Apr', applications: 720 },
        { month: 'May', applications: 890 },
        { month: 'Jun', applications: 1050 }
    ];

    return (
        <div className="min-h-screen p-6 space-y-6">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Job Portal Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's what's happening with your job portal today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Job Seekers Card */}
                <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Job Seekers</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">3,247</p>
                            <div className="flex items-center mt-2">
                                <FaArrowUp className="text-green-500 text-xs mr-1" />
                                <span className="text-green-500 text-sm font-medium">+18.2%</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                            <FaUsers className="text-white text-xl" />
                        </div>
                    </div>
                </div>

                {/* Active Job Postings Card */}
                <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Active Jobs</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">456</p>
                            <div className="flex items-center mt-2">
                                <FaArrowUp className="text-green-500 text-xs mr-1" />
                                <span className="text-green-500 text-sm font-medium">+12.8%</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-[#ffd401] to-yellow-600 rounded-xl flex items-center justify-center">
                            <FaBriefcase className="text-white text-xl" />
                        </div>
                    </div>
                </div>

                {/* Total Applications Card */}
                <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Applications</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">8,934</p>
                            <div className="flex items-center mt-2">
                                <FaArrowUp className="text-green-500 text-xs mr-1" />
                                <span className="text-green-500 text-sm font-medium">+25.4%</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                            <FaFileAlt className="text-white text-xl" />
                        </div>
                    </div>
                </div>

                {/* Companies Registered Card */}
                <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Companies</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">127</p>
                            <div className="flex items-center mt-2">
                                <FaArrowUp className="text-green-500 text-xs mr-1" />
                                <span className="text-green-500 text-sm font-medium">+8.7%</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                            <FaBuilding className="text-white text-xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Job Postings Chart Card */}
                <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Job Postings</h3>
                            <p className="text-gray-600 text-sm">Monthly job posting activity</p>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-[#ffd401] to-yellow-600 rounded-lg flex items-center justify-center">
                            <FaBriefcase className="text-white" />
                        </div>
                    </div>
                    
                    {/* Simple Bar Chart */}
                    <div className="space-y-4">
                        {jobPostingsData.map((item, index) => (
                            <div key={index} className="flex items-center space-x-4">
                                <span className="text-sm font-medium text-gray-600 w-8">{item.month}</span>
                                <div className="flex-1 bg-gray-200/50 rounded-full h-3 relative overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-[#ffd401] to-yellow-500 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${item.value}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-bold text-gray-800 w-8">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-white/20">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Average Growth</span>
                            <span className="font-bold text-green-600">+16.7%</span>
                        </div>
                    </div>
                </div>

                {/* Applications Growth Chart Card */}
                <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Applications Growth</h3>
                            <p className="text-gray-600 text-sm">Monthly application submissions</p>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                            <FaFileAlt className="text-white" />
                        </div>
                    </div>
                    
                    {/* Simple Line Chart Representation */}
                    <div className="h-52 mb-6 flex items-end justify-between px-4 border-b border-gray-200/30">
                        {applicationsData.map((item, index) => {
                            const height = Math.max((item.applications / 1050) * 160, 25); // Minimum 25px height
                            return (
                                <div key={index} className="flex flex-col items-center space-y-3 min-w-0 flex-1">
                                    <div className="flex flex-col items-center space-y-1">
                                        <span className="text-xs text-gray-500 font-medium whitespace-nowrap">{item.applications}</span>
                                        <div 
                                            className="w-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 ease-out hover:from-blue-600 hover:to-blue-500 hover:scale-105 mx-auto"
                                            style={{ height: `${height}px` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-600 font-medium whitespace-nowrap">{item.month}</span>
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="space-y-2">
                        {applicationsData.slice(-3).map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">{item.month} Applications</span>
                                <span className="font-bold text-gray-800">{item.applications}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-white/20">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Total Growth</span>
                            <span className="font-bold text-green-600">+228.1%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] transition-all duration-300">
                    <h4 className="font-bold text-gray-800 mb-2">Recent Activity</h4>
                    <p className="text-gray-600 text-sm">12 new applications in the last hour</p>
                </div>
                
                <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] transition-all duration-300">
                    <h4 className="font-bold text-gray-800 mb-2">Top Job Category</h4>
                    <p className="text-gray-600 text-sm">Software Development</p>
                </div>
                
                <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] transition-all duration-300">
                    <h4 className="font-bold text-gray-800 mb-2">Success Rate</h4>
                    <p className="text-gray-600 text-sm">73% application to interview rate</p>
                </div>
            </div>
        </div>
    );
}