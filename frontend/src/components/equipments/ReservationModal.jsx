import React, { useState } from 'react';
import api from '../../services/api';
import { X, CalendarClock } from 'lucide-react';

const ReservationModal = ({ isOpen, onClose, equipment, onSuccess }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !equipment) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await api.post('/reservations', {
        equipment_id: equipment.id,
        start_date: `${startDate} 00:00:00`,
        end_date: `${endDate} 23:59:59`
      });
      onSuccess();
      onClose();
    } catch (err) {
      if (err.response?.status === 422) {
        setError(err.response.data.message || "Ces dates ne sont pas valides ou se chevauchent.");
      } else {
        setError("Impossible de créer la réservation.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-indigo-50">
          <div className="flex items-center text-indigo-800 font-semibold">
            <CalendarClock className="w-5 h-5 mr-2 text-indigo-600" />
            Réserver un équipement
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
          <p className="text-sm text-slate-500">Équipement sélectionné</p>
          <p className="font-semibold text-slate-800">{equipment.name} <span className="text-xs font-normal text-slate-400 ml-2">SN: {equipment.serial_number}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date de début</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date de fin</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              required
              min={startDate}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700"
            />
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
                <CalendarClock className="w-4 h-4 mr-2" />
              )}
              Confirmer la réservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;
