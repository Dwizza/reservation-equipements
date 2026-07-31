import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  CalendarClock, 
  Check, 
  X, 
  RefreshCcw, 
  Trash2,
  Filter
} from 'lucide-react';

const ReservationsList = () => {
  const { isAdmin } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchReservations();
  }, [statusFilter]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      let url = '/reservations';
      if (statusFilter) {
        url += `?status=${statusFilter}`;
      }
      const response = await api.get(url);
      setReservations(response.data.data);
    } catch (error) {
      console.error("Erreur de récupération des réservations", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/reservations/${id}`, { status: newStatus });
      fetchReservations();
    } catch (error) {
      alert(error.response?.data?.message || "Erreur lors de la mise à jour.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment annuler cette réservation ?")) {
      try {
        await api.delete(`/reservations/${id}`);
        fetchReservations();
      } catch (error) {
        alert("Erreur lors de l'annulation.");
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'En attente':
        return <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-medium border border-amber-200">En attente</span>;
      case 'Approuvée':
        return <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium border border-green-200">Approuvée</span>;
      case 'Rejetée':
        return <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium border border-red-200">Rejetée</span>;
      case 'Restituée':
        return <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium border border-slate-200">Restituée</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isAdmin() ? 'Gestion des Réservations' : 'Mes Réservations'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isAdmin() ? 'Supervisez et gérez toutes les demandes de matériel.' : 'Consultez l\'historique et l\'état de vos réservations.'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center">
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-slate-400" />
          </div>
          <select
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 outline-none appearance-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="En attente">En attente</option>
            <option value="Approuvée">Approuvée</option>
            <option value="Rejetée">Rejetée</option>
            <option value="Restituée">Restituée</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : reservations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                <tr>
                  {isAdmin() && <th className="px-6 py-4">Utilisateur</th>}
                  <th className="px-6 py-4">Équipement</th>
                  <th className="px-6 py-4">Période</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {isAdmin() && (
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{reservation.user?.name}</div>
                        <div className="text-xs text-slate-500">{reservation.user?.email}</div>
                      </td>
                    )}
                    
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{reservation.equipment?.name}</div>
                      <div className="text-xs text-slate-500">SN: {reservation.equipment?.serial_number}</div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center text-slate-700 whitespace-nowrap">
                        <CalendarClock className="w-4 h-4 mr-2 text-slate-400" />
                        {new Date(reservation.start_date).toLocaleDateString('fr-FR')} 
                        <span className="mx-2 text-slate-300">→</span> 
                        {new Date(reservation.end_date).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      {getStatusBadge(reservation.status)}
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        
                        {/* Admin Actions */}
                        {isAdmin() && reservation.status === 'En attente' && (
                          <>
                            <button 
                              onClick={() => updateStatus(reservation.id, 'Approuvée')}
                              className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors"
                              title="Approuver"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => updateStatus(reservation.id, 'Rejetée')}
                              className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                              title="Rejeter"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {isAdmin() && reservation.status === 'Approuvée' && (
                          <button 
                            onClick={() => updateStatus(reservation.id, 'Restituée')}
                            className="flex items-center px-3 py-1.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors text-xs"
                          >
                            <RefreshCcw className="w-3.5 h-3.5 mr-1.5" />
                            Marquer restitué
                          </button>
                        )}

                        {/* User Actions */}
                        {!isAdmin() && reservation.status === 'En attente' && (
                          <button 
                            onClick={() => handleDelete(reservation.id)}
                            className="flex items-center px-3 py-1.5 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors text-xs"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                            Annuler
                          </button>
                        )}

                        {/* No actions state */}
                        {(reservation.status === 'Rejetée' || reservation.status === 'Restituée') && (
                          <span className="text-xs text-slate-400 italic">Terminée</span>
                        )}
                        {!isAdmin() && reservation.status === 'Approuvée' && (
                          <span className="text-xs text-green-600 font-medium">En cours</span>
                        )}

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarClock className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">Aucune réservation</h3>
            <p className="text-slate-500 mt-2">Aucune réservation ne correspond à ce critère.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationsList;
