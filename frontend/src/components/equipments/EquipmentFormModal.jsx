import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { X, Save, Wrench } from 'lucide-react';

const EquipmentFormModal = ({ isOpen, onClose, equipment, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Ordinateur',
    serial_number: '',
    status: 'Disponible'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name,
        category: equipment.category,
        serial_number: equipment.serial_number,
        status: equipment.status
      });
    } else {
      setFormData({
        name: '',
        category: 'Ordinateur',
        serial_number: '',
        status: 'Disponible'
      });
    }
    setError('');
  }, [equipment, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (equipment) {
        await api.put(`/equipments/${equipment.id}`, formData);
      } else {
        await api.post('/equipments', formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur s'est produite.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center text-slate-800 font-semibold">
            <Wrench className="w-5 h-5 mr-2 text-indigo-600" />
            {equipment ? 'Modifier l\'équipement' : 'Ajouter un équipement'}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nom de l'équipement</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Ex: MacBook Pro M2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
            >
              <option value="Ordinateur">Ordinateur</option>
              <option value="Ecran">Écran</option>
              <option value="Vidéoprojecteur">Vidéoprojecteur</option>
              <option value="Tablette">Tablette</option>
              <option value="Accessoire">Accessoire</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Numéro de série</label>
            <input 
              type="text" 
              name="serial_number" 
              value={formData.serial_number} 
              onChange={handleChange} 
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Ex: SN-2026-XYZ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Statut</label>
            <select 
              name="status" 
              value={formData.status} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
            >
              <option value="Disponible">Disponible</option>
              <option value="Réservé">Réservé</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-4 py-2 flex items-center text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl font-medium transition-colors disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {equipment ? 'Mettre à jour' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentFormModal;
