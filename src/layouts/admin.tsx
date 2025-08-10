import { Outlet, useLocation, useNavigate } from "react-router";
import { useAuthStore } from "../stores/auth";
import { useEffect, useState } from "react";
import { FaHome, FaUsers, FaBars, FaTimes, FaUserCircle, FaShoppingCart, FaTable, FaCalculator, FaCog, FaSignOutAlt, FaBell, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import pattern from '../assets/pattern.png';
import logo from '../assets/ut.png'


export default function AdminLayout() {
    const pathname = useLocation();
    const { isLogged, user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (!isLogged) {
            navigate("/");
        }
    }, [isLogged, navigate]);

    const menuItems = [
        { icon: <FaHome size={20} />, label: "Dashboard", path: "/app/dashboard" },
        { icon: <FaTable size={20} />, label: "Company", path: "/app/company" },
        { icon: <FaCalculator size={20} />, label: "Job Post", path: "/app/job" },
        { icon: <FaUsers size={20} />, label: "Candidate", path: "/app/candidate" },
        { icon: <FaCog size={20} />, label: "Devision", path: "/app/devision" },
    ];
    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="h-[100dvh] w-screen relative flex">
            {/* Background pattern with blur */}
            <div 
                style={{ 
                    backgroundImage: `url(${pattern})`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '1000px',
                    filter: 'blur(2px)'
                }}
                className="absolute inset-0 z-0"
            />

            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden bg-white/30">
                <div className="absolute -top-12 -left-12 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-100/20 rounded-full blur-3xl"></div>
            </div>

            {/* Main Layout Container */}
            <div className="flex w-full h-full relative z-10">
                {/* Sidebar */}
                <div className={`fixed lg:static lg:block ${isSidebarOpen ? 'block' : 'hidden'} z-30`}>
                    <div className="h-screen w-64 bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-r border-gray-200/50">
                        {/* Logo Section */}
                        <div className="flex items-center gap-3 p-6 border-b border-gray-200/50">
                            {/* <div className="w-8 h-8 bg-[#ffd401] rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-105">
                                <div className="w-4 h-4 bg-white rounded-sm"></div>
                            </div> */}
                            <img src={logo} alt="logo" className="w-8 h-8" />

                            <h1 className="text-xl font-bold text-black">UT Careers</h1>
                            <button 
                                className="lg:hidden ml-auto text-gray-600 hover:text-[#ffd401] p-1 rounded transition-colors"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>

                        {/* Navigation Menu */}
                        <nav className="p-4 space-y-2">
                            {menuItems.map((item, index) => (
                                <Link
                                    key={index}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                                        transition-all duration-300 ease-in-out
                                        relative overflow-hidden
                                        ${pathname.pathname === item.path 
                                            ? 'bg-black text-[#ffd401] shadow-[0_8px_16px_rgba(0,0,0,0.4)]' 
                                            : 'text-gray-700 hover:bg-[#ffd401]/10 hover:text-[#ffd401]'
                                        }
                                        before:content-[""]
                                        before:absolute 
                                        before:top-0
                                        before:left-0
                                        before:w-full
                                        before:h-full
                                        before:bg-gradient-to-r
                                        before:from-transparent
                                        before:via-[#ffd401]/40
                                        before:to-transparent
                                        before:-translate-x-full
                                        hover:before:translate-x-full
                                        before:transition-transform
                                        before:duration-500
                                        before:ease-in-out
                                        after:content-[""]
                                        after:absolute
                                        after:top-0
                                        after:left-0
                                        after:w-full
                                        after:h-full
                                        after:bg-gradient-to-r
                                        after:from-transparent
                                        after:via-white/60
                                        after:to-transparent
                                        after:-translate-x-full
                                        hover:after:translate-x-full
                                        after:transition-transform
                                        after:duration-300
                                        after:ease-in-out
                                        after:delay-100
                                    `}
                                >
                                    <span className={pathname.pathname === item.path ? 'text-[#ffd401]' : 'text-gray-600'}>
                                        {item.icon}
                                    </span>
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </nav>

                        {/* User Profile Section */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50 bg-white/50 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-105">
                                    <FaUserCircle size={24} className="text-[#ffd401]" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-black">{user?.name || 'Admin User'}</p>
                                    <p className="text-xs text-gray-600">Administrator</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 
                                    hover:bg-[#ffd401]/10 hover:text-[#ffd401] rounded-lg transition-all duration-300
                                    group"
                            >
                                <FaSignOutAlt size={16} className="transform group-hover:translate-x-1 transition-transform" />
                                <span className="transform group-hover:translate-x-1 transition-transform">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Overlay for mobile */}
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-20 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden bg-white/10 backdrop-blur-sm">
                    {/* Top Bar */}
                    <header className="bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-b border-gray-200/50">
                        <div className="flex items-center justify-between px-6 py-4">
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setIsSidebarOpen(true)}
                                    className="lg:hidden p-2 hover:bg-[#ffd401]/10 rounded-lg transition-colors"
                                >
                                    <FaBars size={20} className="text-black" />
                                </button>
                                <div>
                                    <h2 className="text-xl font-bold text-black">Dashboard</h2>
                                    <p className="text-sm text-gray-600">Welcome to UT Careers Admin Panel</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                {/* <div className="relative hidden md:block">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input 
                                        type="text" 
                                        placeholder="Search anything..."
                                        className="pl-10 pr-4 py-2 w-80 rounded-lg bg-gray-50/50 border border-gray-200 
                                            focus:outline-none focus:border-[#ffd401] focus:ring-1 focus:ring-[#ffd401] 
                                            transition-all placeholder:text-gray-400"
                                    />
                                </div> */}
                                
                                {/* <button className="p-2 hover:bg-[#ffd401]/10 rounded-lg transition-colors relative">
                                    <FaBell size={20} className="text-gray-700" />
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#ffd401] border-2 border-white rounded-full"></span>
                                </button> */}
                                
                                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-105">
                                    <FaUserCircle size={20} className="text-[#ffd401]" />
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content Area */}
                    <main className="flex-1 overflow-x-hidden overflow-y-auto">
                        <div className="p-6">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}