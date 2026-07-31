import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  MonitorSmartphone, 
  CalendarDays, 
  LogOut,
  Menu,
  Bell
} from 'lucide-react';

const AppLayout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Tableau de bord', path: '/', icon: LayoutDashboard },
    { name: 'Équipements', path: '/equipments', icon: MonitorSmartphone },
    { name: 'Réservations', path: '/reservations', icon: CalendarDays },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col shadow-sm z-10">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <MonitorSmartphone className="w-6 h-6 text-primary mr-2" />
          <span className="text-xl font-bold text-slate-800 tracking-tight">TechResa</span>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  isActive 
                    ? 'bg-indigo-50 text-primary shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center px-4 py-3 bg-slate-50 rounded-xl mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center font-bold mr-3">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{isAdmin() ? 'Administrateur' : 'Utilisateur'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Navbar (Mobile) */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 shadow-sm z-10 md:hidden">
          <div className="flex items-center">
            <button className="text-slate-500 focus:outline-none p-2 -ml-2 rounded-md hover:bg-slate-100">
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-lg font-bold text-slate-800 ml-2">TechResa</span>
          </div>
        </header>

        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
