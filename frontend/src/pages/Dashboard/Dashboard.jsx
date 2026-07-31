import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  MonitorSmartphone, 
  CheckCircle2, 
  CalendarClock, 
  Wrench,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, colorClass, bgColorClass }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-start space-x-4">
    <div className={`p-4 rounded-xl ${bgColorClass}`}>
      <Icon className={`w-7 h-7 ${colorClass}`} />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des stats", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'en_attente':
        return <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-medium border border-amber-200">En attente</span>;
      case 'approuvee':
        return <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium border border-green-200">Approuvée</span>;
      case 'restituee':
        return <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium border border-slate-200">Restituée</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
        <p className="text-slate-500 mt-1">
          Bonjour <span className="font-semibold text-slate-700">{user?.name}</span>, voici un aperçu de vos activités.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Disponibles" 
          value={stats?.equipments.available || 0} 
          icon={CheckCircle2} 
          colorClass="text-emerald-600"
          bgColorClass="bg-emerald-50"
        />
        <StatCard 
          title="Réservés" 
          value={stats?.equipments.reserved || 0} 
          icon={CalendarClock} 
          colorClass="text-indigo-600"
          bgColorClass="bg-indigo-50"
        />
        <StatCard 
          title="En maintenance" 
          value={stats?.equipments.maintenance || 0} 
          icon={Wrench} 
          colorClass="text-amber-600"
          bgColorClass="bg-amber-50"
        />
        <StatCard 
          title="Mes réservations" 
          value={stats?.my_reservations.count || 0} 
          icon={MonitorSmartphone} 
          colorClass="text-sky-600"
          bgColorClass="bg-sky-50"
        />
      </div>

      {/* Recent Reservations Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Mes réservations récentes</h2>
          <Link to="/reservations" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center">
            Voir tout <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          {stats?.my_reservations.recent && stats.my_reservations.recent.length > 0 ? (
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Équipement</th>
                  <th className="px-6 py-4">Date de début</th>
                  <th className="px-6 py-4">Date de retour</th>
                  <th className="px-6 py-4">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.my_reservations.recent.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {reservation.equipment?.name} 
                      <span className="block text-xs font-normal text-slate-500 mt-0.5">SN: {reservation.equipment?.serial_number}</span>
                    </td>
                    <td className="px-6 py-4 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-slate-400" />
                      {new Date(reservation.start_date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(reservation.end_date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(reservation.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarClock className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">Aucune réservation pour le moment</p>
              <Link to="/equipments" className="mt-4 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                Parcourir les équipements
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
