import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { Home, User, LogOut, Menu, X, Moon, Sun, Bell } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const { notifications, unreadCount, markAsRead, requestPermission } = useNotifications();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    React.useEffect(() => {
        if (user) requestPermission();
    }, [user, requestPermission]);

    // Don't show navbar on login/register pages
    if (['/login', '/register'].includes(location.pathname)) {
        return null;
    }

    return (
        <nav className="bg-white border-b border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] sticky top-0 z-50">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex flex-shrink-0 items-center gap-2 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
                                F
                            </div>
                            <span className="font-bold text-xl text-gray-900 tracking-tight hidden sm:block">
                                FeedApp
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    {user && (
                        <div className="hidden sm:flex sm:items-center sm:space-x-8">
                            <Link
                                to="/"
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${location.pathname === '/'
                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <Home className="w-5 h-5" />
                                <span>Home</span>
                            </Link>

                            <Link
                                to="/profile"
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${location.pathname === '/profile'
                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <User className="w-5 h-5" />
                                <span>Profile</span>
                            </Link>

                            <div className="w-px h-6 bg-gray-200 mx-2"></div>

                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={toggleTheme}
                                    className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                >
                                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                </button>

                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            setShowNotifications(!showNotifications);
                                            if (unreadCount > 0) markAsRead();
                                        }}
                                        className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer relative"
                                    >
                                        <Bell className="w-5 h-5" />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {showNotifications && (
                                        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2 origin-top-right animate-in fade-in zoom-in-95 duration-150 max-h-96 overflow-y-auto custom-scrollbar">
                                            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                                <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                            </div>
                                            {notifications.length === 0 ? (
                                                <p className="px-4 py-4 text-sm text-gray-500 text-center">No new notifications</p>
                                            ) : (
                                                notifications.map((notif, idx) => (
                                                    <div key={notif.id || idx} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-50 dark:border-gray-700 last:border-0 cursor-pointer" onClick={() => setShowNotifications(false)}>
                                                        <p className="text-sm text-gray-800 dark:text-gray-200">{notif.message}</p>
                                                        <span className="text-xs text-gray-500 mt-1 block">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.location.href = '/profile'}>
                                    <img
                                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                                    />
                                    <span className="text-sm font-medium text-gray-700">{user.name.split(' ')[0]}</span>
                                </div>

                                <button
                                    onClick={logout}
                                    className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors px-2 py-1 rounded"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        {user && (
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="block h-6 w-6" />
                                ) : (
                                    <Menu className="block h-6 w-6" />
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && user && (
                <div className="sm:hidden border-t border-gray-100 bg-white">
                    <div className="pt-2 pb-3 space-y-1 px-4">
                        <Link
                            to="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/'
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/profile"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/profile'
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            Profile
                        </Link>
                        <button
                            onClick={() => {
                                logout();
                                setIsMobileMenuOpen(false);
                            }}
                            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                        >
                            Log out
                        </button>
                    </div>
                    <div className="pt-4 pb-4 border-t border-gray-100">
                        <div className="flex items-center px-4">
                            <div className="flex-shrink-0">
                                <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                    alt=""
                                />
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium text-gray-800">{user.name}</div>
                                <div className="text-sm font-medium text-gray-500">{user.email}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
