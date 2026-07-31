import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, 
  Plus, 
  MonitorSmartphone, 
  Edit, 
  Trash2, 
  CalendarClock,
  Filter
} from 'lucide-react';
import EquipmentFormModal from '../../components/equipments/EquipmentFormModal';
import ReservationModal from '../../components/equipments/ReservationModal';

const EquipmentsList = () => {
  const { isAdmin } = useAuth();
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isResOpen, setIsResOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  // Filters state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchEquipments();
  }, [category]); // Refetch when category changes

  const fetchEquipments = async () => {
    setLoading(true);
    try {
      // Backend EquipmentController::index accepts search & category
      let url = '/equipments';
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await api.get(url);
      setEquipments(response.data.data); // data.data because of Laravel Resource collection + pagination
    } catch (error) {
      console.error("Erreur de récupération des équipements", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEquipments();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet équipement ?")) {
      try {
        await api.delete(`/equipments/${id}`);
        fetchEquipments();
      } catch (error) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  const openFormModal = (equipment = null) => {
    setSelectedEquipment(equipment);
    setIsFormOpen(true);
  };

  const openResModal = (equipment) => {
    if (equipment.status === 'Maintenance') {
      alert("Cet équipement est en maintenance et ne peut pas être réservé.");
      return;
    }
    setSelectedEquipment(equipment);
    setIsResOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Disponible': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Réservé': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Maintenance': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Équipements</h1>
          <p className="text-slate-500 text-sm mt-1">Gérez et réservez le matériel informatique.</p>
        </div>
        {isAdmin() && (
          <button 
            onClick={() => openFormModal()}
            className="flex items-center px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5 mr-2" />
            Ajouter un équipement
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 outline-none"
            placeholder="Rechercher par nom ou numéro de série..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="hidden"></button>
        </form>

        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-slate-400" />
          </div>
          <select
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 outline-none appearance-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            <option value="Ordinateur">Ordinateur</option>
            <option value="Ecran">Écran</option>
            <option value="Vidéoprojecteur">Vidéoprojecteur</option>
            <option value="Tablette">Tablette</option>
            <option value="Accessoire">Accessoire</option>
          </select>
        </div>
      </div>

      {/* Grid of Equipments */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : equipments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {equipments.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
              
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <MonitorSmartphone className="w-6 h-6" />
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{item.name}</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">{item.category}</p>
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-sm">
                  <span className="text-slate-400">N° de série:</span>
                  <span className="font-mono font-medium text-slate-700">{item.serial_number}</span>
                </div>
              </div>

              <div className="px-3 pb-3 pt-0 flex gap-2">
                <button 
                  onClick={() => openResModal(item)}
                  disabled={item.status === 'Maintenance'}
                  className="flex-1 flex items-center justify-center py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CalendarClock className="w-4 h-4 mr-1.5" />
                  Réserver
                </button>

                {isAdmin() && (
                  <>
                    <button 
                      onClick={() => openFormModal(item)}
                      className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
          <MonitorSmartphone className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700">Aucun équipement trouvé</h3>
          <p className="text-slate-500 mt-2">Essayez de modifier vos filtres de recherche.</p>
        </div>
      )}

      {/* Modals */}
      <EquipmentFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        equipment={selectedEquipment} 
        onSuccess={fetchEquipments}
      />
      
      <ReservationModal 
        isOpen={isResOpen} 
        onClose={() => setIsResOpen(false)} 
        equipment={selectedEquipment} 
        onSuccess={() => {
          fetchEquipments();
          alert("Réservation créée avec succès ! Elle est en attente d'approbation.");
        }}
      />
    </div>
  );
};

export default EquipmentsList;
