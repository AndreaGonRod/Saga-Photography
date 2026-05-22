import React from 'react';
import { Plus, Search, MoreVertical, X, Camera, MapPin, Calendar as CalendarIcon, Clock, Users as UsersIcon, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import Card from '../ui/Card';
import { Photoshoot, Event, MainStatus } from '../../types';

interface PhotoshootsViewProps {
    photoshoots: Photoshoot[];
    events: Event[];
    searchQuery: string;
    onSearch: (query: string) => void;
    onAddPhotoshoot: () => void;
    onAddEvent: () => void;
    onEditPhotoshoot: (p: Photoshoot) => void;
    onEditEvent: (e: Event) => void;
    onDeletePhotoshoot: (id: number) => void;
    onDeleteEvent: (id: number) => void;
}

const PhotoshootsView = ({
    photoshoots,
    events,
    searchQuery,
    onSearch,
    onAddPhotoshoot,
    onAddEvent,
    onEditPhotoshoot,
    onEditEvent,
    onDeletePhotoshoot,
    onDeleteEvent
}: PhotoshootsViewProps) => {
    const allItems = [
        ...photoshoots.map(p => ({ ...p, itemType: 'photoshoot' })),
        ...events.map(e => ({ ...e, itemType: 'event' }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const filteredItems = allItems.filter(item =>
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.clients.some(c => `${c.name} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const getStatusColor = (status: MainStatus) => {
        switch (status) {
            case MainStatus.IN_QUEUE: return 'bg-zinc-100 text-zinc-500';
            case MainStatus.READY_TO_EDIT: return 'bg-amber-100 text-amber-700';
            case MainStatus.IN_PROGRESS: return 'bg-indigo-100 text-indigo-700';
            case MainStatus.PENDING_REVISION: return 'bg-rose-100 text-rose-700';
            case MainStatus.DELIVERED: return 'bg-emerald-100 text-emerald-700';
            case MainStatus.FINISHED: return 'bg-zinc-900 text-white';
            default: return 'bg-zinc-100 text-zinc-500';
        }
    };

    const getStatusLabel = (status: MainStatus) => {
        switch (status) {
            case MainStatus.IN_QUEUE: return 'En Cola';
            case MainStatus.READY_TO_EDIT: return 'Listo p/ Editar';
            case MainStatus.IN_PROGRESS: return 'En Proceso';
            case MainStatus.PENDING_REVISION: return 'Revisión';
            case MainStatus.DELIVERED: return 'Entregado';
            case MainStatus.FINISHED: return 'Finalizado';
            default: return status;
        }
    };

    return (
        <div className="h-full space-y-6 flex flex-col">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-zinc-900">Sesiones y Eventos</h2>
                <div className="flex space-x-3">
                    <button
                        onClick={onAddPhotoshoot}
                        className="bg-white border border-zinc-200 text-zinc-900 px-5 py-2.5 rounded-xl flex items-center space-x-2 shadow-sm hover:bg-zinc-50 transition-all font-semibold"
                    >
                        <Camera size={18} />
                        <span>Nueva Sesión</span>
                    </button>
                    <button
                        onClick={onAddEvent}
                        className="btn-interactive-gradient px-5 py-2.5 rounded-lg flex items-center space-x-2 group"
                    >
                        <Plus size={18} className="text-[#EE5905]" />
                        <span className="font-bold text-brand-gradient">Nuevo Evento</span>
                    </button>
                </div>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                    type="text"
                    placeholder="Buscar sesiones o eventos..."
                    value={searchQuery}
                    onChange={(e) => onSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#EE5905] focus:border-transparent transition-all shadow-sm"
                />
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                    {filteredItems.map((item, idx) => (
                        <motion.div
                            key={item?.id || idx}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all flex flex-col relative overflow-hidden group min-h-[300px]"
                        >
                            {/* HEADER IMAGE / COLOR */}
                            <div className={`h-24 ${item.itemType === 'event' ? 'bg-gradient-to-r from-orange-400 to-red-500' : 'bg-zinc-100'} relative`}>
                                <div className="absolute top-4 right-4 flex space-x-1">
                                    <button
                                        onClick={() => item.itemType === 'event' ? onEditEvent(item as unknown as Event) : onEditPhotoshoot(item as unknown as Photoshoot)}
                                        className="w-8 h-8 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-zinc-900 transition-all"
                                    >
                                        <MoreVertical size={16} />
                                    </button>
                                    <button
                                        onClick={() => item.itemType === 'event' ? onDeleteEvent(item.id) : onDeletePhotoshoot(item.id)}
                                        className="w-8 h-8 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-all"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                {item.itemType === 'event' && (
                                    <div className="absolute -bottom-4 left-6 px-4 py-1.5 bg-black rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                                        Evento Especial
                                    </div>
                                )}
                            </div>

                            <div className="p-6 pt-8 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-zinc-900 group-hover:text-brand transition-colors">{item.title}</h3>
                                        <div className="flex items-center space-x-2 mt-1 text-zinc-400">
                                            <CalendarIcon size={14} />
                                            <span className="text-xs font-bold">{item.date}</span>
                                            <span className="w-1 h-1 rounded-full bg-zinc-200" />
                                            <Clock size={14} />
                                            <span className="text-xs font-semibold">{item.startTime}</span>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(item.status as MainStatus)}`}>
                                        {getStatusLabel(item.status as MainStatus)}
                                    </span>
                                </div>

                                <div className="space-y-4 mb-6">
                                    {/* CLIENTS */}
                                    <div className="flex items-center space-x-3">
                                        <div className="flex -space-x-2">
                                            {item.clients.slice(0, 3).map((c, i) => (
                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-[10px] font-black text-zinc-500">
                                                    {c.name[0]}{c.lastName[0]}
                                                </div>
                                            ))}
                                            {item.clients.length > 3 && (
                                                <div className="w-8 h-8 rounded-full border-2 border-white bg-zinc-900 flex items-center justify-center text-[10px] font-black text-white">
                                                    +{item.clients.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm font-bold text-zinc-600 truncate">
                                            {item.clients.map(c => c.name).join(' & ')}
                                        </p>
                                    </div>

                                    {/* LOCATION (IF EVENT) */}
                                    {item.itemType === 'event' && (item as unknown as Event).location && (
                                        <div className="flex items-center space-x-2 text-zinc-500">
                                            <MapPin size={16} className="text-[#EE5905]" />
                                            <p className="text-xs truncate font-medium">{(item as unknown as Event).location.ceremony}</p>
                                        </div>
                                    )}

                                    {/* STAFF (IF EVENT) */}
                                    {item.itemType === 'event' && (item as unknown as Event).staff && (item as unknown as Event).staff.length > 0 && (
                                        <div className="flex items-center space-x-2 text-zinc-500">
                                            <UsersIcon size={16} />
                                            <p className="text-xs truncate font-medium">Equipo: {(item as unknown as Event).staff.map(s => s.name).join(', ')}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-auto pt-6 border-t border-zinc-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Cierre de Entrega</p>
                                        <p className="text-xs font-bold text-zinc-900">{item.dueDate}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Precio Final</p>
                                        <p className="text-lg font-black text-zinc-900">{item.finalPrice}€</p>
                                    </div>
                                </div>
                            </div>

                            <div className="h-1 w-0 bg-brand group-hover:w-full transition-all duration-500" />
                        </motion.div>
                    ))}
                    {filteredItems.length === 0 && (
                        <div className="col-span-full py-20 text-center rounded-[2.5rem] border-2 border-dashed border-zinc-100">
                            <Camera size={48} className="mx-auto text-zinc-100 mb-4" />
                            <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">No hay sesiones o eventos registrados</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PhotoshootsView;
