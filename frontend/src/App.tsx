import React, { useState } from 'react';
import {
  Menu,
  X,
  Calendar,
  Type,
  Sparkles,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Types
import { MainStatus, Client, Staff, Offer } from './types';

// Components
import Sidebar from './components/layout/Sidebar';
import TimeDurationPicker from './components/ui/TimeDurationPicker';

// Views
import CalendarView from './components/views/CalendarView';
import ClientsView from './components/views/ClientsView';
import StaffView from './components/views/StaffView';
import OffersView from './components/views/OffersView';
import PhotoshootsView from './components/views/PhotoshootsView';
import TasksView from './components/views/TasksView';

// Hook
import { useAppLogic } from './hooks/useAppLogic';

const App = () => {
  const {
    activeTab, setActiveTab,
    isSidebarOpen, setIsSidebarOpen,
    clients, staff, offers, photoshoots, events, tasks, schedule,
    searchQueries, handleSearchClients, handleSearchStaff, handleSearchOffers, handleSearchPhotoshoots,
    selectedCategory, setSelectedCategory,
    isAddClientModalOpen, setIsAddClientModalOpen,
    isAddStaffModalOpen, setIsAddStaffModalOpen,
    isAddOfferModalOpen, setIsAddOfferModalOpen,
    isAddPhotoshootModalOpen, setIsAddPhotoshootModalOpen,
    isAddEventModalOpen, setIsAddEventModalOpen,
    isAddAppointmentModalOpen, setIsAddAppointmentModalOpen,
    editingClient, setEditingClient,
    editingStaff, setEditingStaff,
    editingOffer, setEditingOffer,
    editingPhotoshoot, setEditingPhotoshoot,
    editingEvent, setEditingEvent,
    fetchData,
    handleDeleteClient, handleDeleteStaff, handleDeleteOffer, handleDeletePhotoshoot, handleDeleteEvent,
    handleUpdateTaskStatus
  } = useAppLogic();

  // New item states
  const [newClient, setNewClient] = useState({ name: '', lastName: '', email: '', phone: '', instagramAccounts: '' });
  const [newStaff, setNewStaff] = useState({ name: '', lastName: '', email: '', phone: '', notes: '' });
  const [newOffer, setNewOffer] = useState({ category: '', subCategory: '', price: 0, defaultTurnAround: 30, details: '' });
  const [newPhotoshoot, setNewPhotoshoot] = useState({ title: '', date: '', startTime: '08:00', clientId: 0, offerId: 0, finalPrice: 0, dueDate: '' });
  const [newEvent, setNewEvent] = useState({ title: '', date: '', startTime: '08:00', endTime: '20:00', isFullDay: true, clients: [] as Client[], staff: [] as Staff[], location: { ceremony: '', reception: '' }, finalPrice: 0, status: MainStatus.IN_QUEUE, dueDate: '' });
  const [newAppointment, setNewAppointment] = useState({ title: '', date: format(new Date(), 'yyyy-MM-dd'), startTime: '10:00', duration: 60 });

  // Handlers for App.tsx (Form submissions)
  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const instagram = newClient.instagramAccounts.split(',').map(s => s.trim()).filter(Boolean);
    await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newClient, instagramAccounts: instagram })
    });
    setNewClient({ name: '', lastName: '', email: '', phone: '', instagramAccounts: '' });
    setIsAddClientModalOpen(false);
    fetchData();
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;
    await fetch(`/api/clients/${editingClient.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingClient)
    });
    setEditingClient(null);
    fetchData();
  };

  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    await fetch(`/api/staff/${editingStaff.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingStaff)
    });
    setEditingStaff(null);
    fetchData();
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStaff)
    });
    setNewStaff({ name: '', lastName: '', email: '', phone: '', notes: '' });
    setIsAddStaffModalOpen(false);
    fetchData();
  };

  const handleAddOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOffer)
    });
    setNewOffer({ category: '', subCategory: '', price: 0, defaultTurnAround: 30, details: '' });
    setIsAddOfferModalOpen(false);
    fetchData();
  };

  const handleUpdateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;
    await fetch(`/api/offers/${editingOffer.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingOffer)
    });
    setEditingOffer(null);
    fetchData();
  };

  const handleAddPhotoshoot = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedDate = format(parseISO(newPhotoshoot.date), 'dd-MM-yyyy');
    const formattedDueDate = format(parseISO(newPhotoshoot.dueDate), 'dd-MM-yyyy');
    await fetch('/api/photoshoots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newPhotoshoot, date: formattedDate, dueDate: formattedDueDate })
    });
    setIsAddPhotoshootModalOpen(false);
    fetchData();
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedDate = format(parseISO(newEvent.date), 'dd-MM-yyyy');
    const formattedDueDate = format(parseISO(newEvent.dueDate), 'dd-MM-yyyy');
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newEvent, date: formattedDate, dueDate: formattedDueDate })
    });
    setIsAddEventModalOpen(false);
    fetchData();
  };

  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedDate = format(parseISO(newAppointment.date), 'dd-MM-yyyy');
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newAppointment.title,
        date: formattedDate,
        startTime: newAppointment.startTime,
        duration: Number(newAppointment.duration)
      })
    });
    if (!res.ok) {
      console.error('Error al guardar la cita:', await res.text());
      return;
    }
    setNewAppointment({ title: '', date: format(new Date(), 'yyyy-MM-dd'), startTime: '10:00', duration: 60 });
    setIsAddAppointmentModalOpen(false);
    fetchData();
  };

  return (
    <div className="h-screen bg-zinc-50 flex font-sans text-zinc-900 overflow-hidden">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-zinc-100 flex items-center justify-between px-8 md:hidden">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 border-brand-gradient rounded-lg flex items-center justify-center shadow-sm">
              <Camera size={20} className="text-[#EE5905]" />
            </div>
            <h1 className="text-xl font-bold tracking-tight uppercase text-brand-gradient">Saga</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-zinc-500">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        <div className="flex-1 overflow-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === 'schedule' && (
                <CalendarView
                  schedule={schedule}
                  onAddAppointment={() => setIsAddAppointmentModalOpen(true)}
                  onRangeChange={(start, end) => fetchData(format(start, 'dd-MM-yyyy'), format(end, 'dd-MM-yyyy'))}
                />
              )}
              {activeTab === 'clients' && (
                <ClientsView
                  clients={clients}
                  searchQuery={searchQueries.clients}
                  onSearch={handleSearchClients}
                  onAddClient={() => setIsAddClientModalOpen(true)}
                  onEditClient={setEditingClient}
                  onDeleteClient={handleDeleteClient}
                />
              )}
              {activeTab === 'staff' && (
                <StaffView
                  staff={staff}
                  searchQuery={searchQueries.staff}
                  onSearch={handleSearchStaff}
                  onAddStaff={() => setIsAddStaffModalOpen(true)}
                  onEditStaff={setEditingStaff}
                  onDeleteStaff={handleDeleteStaff}
                />
              )}
              {activeTab === 'offers' && (
                <OffersView
                  offers={offers}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  searchQuery={searchQueries.offers}
                  onSearch={handleSearchOffers}
                  onAddOffer={() => setIsAddOfferModalOpen(true)}
                  onEditOffer={setEditingOffer}
                  onDeleteOffer={handleDeleteOffer}
                />
              )}
              {activeTab === 'photoshoots' && (
                <PhotoshootsView
                  photoshoots={photoshoots}
                  events={events}
                  searchQuery={searchQueries.photoshoots}
                  onSearch={handleSearchPhotoshoots}
                  onAddPhotoshoot={() => setIsAddPhotoshootModalOpen(true)}
                  onAddEvent={() => setIsAddEventModalOpen(true)}
                  onEditPhotoshoot={setEditingPhotoshoot}
                  onEditEvent={setEditingEvent}
                  onDeletePhotoshoot={handleDeletePhotoshoot}
                  onDeleteEvent={handleDeleteEvent}
                />
              )}
              {activeTab === 'tasks' && (
                <TasksView
                  tasks={tasks}
                  onUpdateStatus={handleUpdateTaskStatus}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {isAddAppointmentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddAppointmentModalOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden"
            >
              <div className="p-12 pb-8 flex justify-between items-start">
                <div>
                  <h3 className="text-4xl font-black tracking-tight text-[#EE5905] uppercase mb-1">Programar Cita</h3>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Ajuste técnico de agenda y parámetros.</p>
                </div>
                <button
                  onClick={() => setIsAddAppointmentModalOpen(false)}
                  className="w-10 h-10 bg-[#F8F9FA] rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddAppointment} className="px-12 pb-12 space-y-10">
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Type size={16} className="text-[#EE5905]" />
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Título</label>
                    </div>
                    <input
                      required
                      type="text"
                      placeholder="Referencia del servicio"
                      value={newAppointment.title}
                      onChange={e => setNewAppointment({ ...newAppointment, title: e.target.value })}
                      className="w-full px-6 py-4 bg-[#F8F9FA] border-none rounded-2xl focus:ring-2 focus:ring-[#EE5905] focus:bg-white transition-all text-zinc-900 font-bold placeholder:text-zinc-300"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-[#EE5905]" />
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Fecha</label>
                    </div>
                    <input
                      required
                      type="date"
                      value={newAppointment.date}
                      onChange={e => setNewAppointment({ ...newAppointment, date: e.target.value })}
                      className="w-full px-6 py-4 bg-[#F8F9FA] border-none rounded-2xl focus:ring-2 focus:ring-[#EE5905] focus:bg-white transition-all text-zinc-900 font-bold"
                    />
                  </div>
                </div>

                <TimeDurationPicker
                  startTime={newAppointment.startTime}
                  duration={newAppointment.duration}
                  onTimeChange={(time) => setNewAppointment({ ...newAppointment, startTime: time })}
                  onDurationChange={(dur) => setNewAppointment({ ...newAppointment, duration: dur })}
                />

                <div className="bg-white border border-zinc-100 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex items-center justify-between relative overflow-hidden">
                  <div className="flex items-center space-x-12">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">Inicio</span>
                      <span className="text-5xl font-black text-[#570B0D] tracking-tighter">
                        <span className="text-[#EE5905]">{newAppointment.startTime.split(':')[0]}</span>
                        :{newAppointment.startTime.split(':')[1]}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">Confirmación Técnica</span>
                      <span className="text-2xl font-black text-zinc-900 uppercase tracking-tight">
                        {newAppointment.date ? format(parseISO(newAppointment.date), "EEEE d 'de' MMMM", { locale: es }) : 'Seleccione Fecha'}
                      </span>
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-1">
                        Bloque de {Math.floor(newAppointment.duration / 60)}h {newAppointment.duration % 60 > 0 ? `${newAppointment.duration % 60}m` : ''}
                      </span>
                    </div>
                  </div>
                  <Sparkles size={48} className="text-[#F8F9FA] absolute right-8 top-1/2 -translate-y-1/2" />
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddAppointmentModalOpen(false)}
                    className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] hover:text-zinc-900 transition-colors"
                  >
                    Descartar
                  </button>
                  <button
                    type="submit"
                    className="text-[10px] font-black text-[#EE5905] uppercase tracking-[0.2em] hover:opacity-70 transition-opacity"
                  >
                    Confirmar Cita
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isAddClientModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddClientModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
                <h3 className="text-xl font-bold">Nuevo Cliente</h3>
                <button onClick={() => setIsAddClientModalOpen(false)} className="text-zinc-400 hover:text-zinc-900">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleAddClient} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Nombre</label>
                    <input
                      required
                      type="text"
                      value={newClient.name}
                      onChange={e => setNewClient({ ...newClient, name: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Apellidos</label>
                    <input
                      required
                      type="text"
                      value={newClient.lastName}
                      onChange={e => setNewClient({ ...newClient, lastName: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Correo Electrónico</label>
                  <input
                    required
                    type="email"
                    value={newClient.email}
                    onChange={e => setNewClient({ ...newClient, email: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Teléfono</label>
                  <input
                    type="tel"
                    value={newClient.phone}
                    onChange={e => setNewClient({ ...newClient, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Instagram (separados por coma)</label>
                  <input
                    type="text"
                    placeholder="usuario1, usuario2"
                    value={newClient.instagramAccounts}
                    onChange={e => setNewClient({ ...newClient, instagramAccounts: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full btn-interactive-gradient py-3 rounded-lg mt-4"
                >
                  <span className="font-bold text-brand-gradient">Crear Cliente</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {editingClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingClient(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
                <h3 className="text-xl font-bold">Editar Cliente</h3>
                <button onClick={() => setEditingClient(null)} className="text-zinc-400 hover:text-zinc-900">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleUpdateClient} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Nombre</label>
                    <input
                      required
                      type="text"
                      value={editingClient.name}
                      onChange={e => setEditingClient({ ...editingClient, name: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Apellidos</label>
                    <input
                      required
                      type="text"
                      value={editingClient.lastName}
                      onChange={e => setEditingClient({ ...editingClient, lastName: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Correo Electrónico</label>
                  <input
                    required
                    type="email"
                    value={editingClient.email}
                    onChange={e => setEditingClient({ ...editingClient, email: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Teléfono</label>
                  <input
                    type="tel"
                    value={editingClient.phone}
                    onChange={e => setEditingClient({ ...editingClient, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Instagram (separados por coma)</label>
                  <input
                    type="text"
                    placeholder="usuario1, usuario2"
                    value={Array.isArray(editingClient.instagramAccounts) ? editingClient.instagramAccounts.join(', ') : ''}
                    onChange={e => setEditingClient({ ...editingClient, instagramAccounts: e.target.value.split(',').map(s => s.trim()) })}
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full btn-interactive-gradient py-3 rounded-lg mt-4"
                >
                  <span className="font-bold text-brand-gradient">Guardar Cambios</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {editingStaff && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingStaff(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
                <h3 className="text-xl font-bold">Editar Trabajador</h3>
                <button onClick={() => setEditingStaff(null)} className="text-zinc-400 hover:text-zinc-900">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleUpdateStaff} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Nombre</label>
                    <input
                      required
                      type="text"
                      value={editingStaff.name}
                      onChange={e => setEditingStaff({ ...editingStaff, name: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Apellidos</label>
                    <input
                      required
                      type="text"
                      value={editingStaff.lastName}
                      onChange={e => setEditingStaff({ ...editingStaff, lastName: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Correo Electrónico</label>
                  <input
                    required
                    type="email"
                    value={editingStaff.email}
                    onChange={e => setEditingStaff({ ...editingStaff, email: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Teléfono</label>
                  <input
                    type="tel"
                    value={editingStaff.phone}
                    onChange={e => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Notas</label>
                  <textarea
                    value={editingStaff.notes}
                    onChange={e => setEditingStaff({ ...editingStaff, notes: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent min-h-[100px]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full btn-interactive-gradient py-3 rounded-lg mt-4"
                >
                  <span className="font-bold text-brand-gradient">Guardar Cambios</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {editingOffer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingOffer(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
                <h3 className="text-xl font-bold">Editar Servicio</h3>
                <button onClick={() => setEditingOffer(null)} className="text-zinc-400 hover:text-zinc-900">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleUpdateOffer} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Categoría</label>
                    <input
                      required
                      type="text"
                      value={editingOffer.category}
                      onChange={e => setEditingOffer({ ...editingOffer, category: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Subcategoría</label>
                    <input
                      type="text"
                      value={editingOffer.subCategory}
                      onChange={e => setEditingOffer({ ...editingOffer, subCategory: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Precio (€)</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={editingOffer.price}
                      onChange={e => setEditingOffer({ ...editingOffer, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Días de Entrega</label>
                    <input
                      required
                      type="number"
                      value={editingOffer.defaultTurnAround}
                      onChange={e => setEditingOffer({ ...editingOffer, defaultTurnAround: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Detalles</label>
                  <textarea
                    value={editingOffer.details}
                    onChange={e => setEditingOffer({ ...editingOffer, details: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent min-h-[100px]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full btn-interactive-gradient py-3 rounded-lg mt-4"
                >
                  <span className="font-bold text-brand-gradient">Guardar Cambios</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
