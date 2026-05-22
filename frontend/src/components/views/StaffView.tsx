import React from 'react';
import { Plus, Search, MoreVertical, X, Mail, Phone, Calendar, Briefcase, Info } from 'lucide-react';
import Card from '../ui/Card';
import { Staff } from '../../types';

interface StaffViewProps {
    staff: Staff[];
    searchQuery: string;
    onSearch: (query: string) => void;
    onAddStaff: () => void;
    onEditStaff: (member: Staff) => void;
    onDeleteStaff: (id: number) => void;
}

const StaffView = ({
    staff,
    searchQuery,
    onSearch,
    onAddStaff,
    onEditStaff,
    onDeleteStaff
}: StaffViewProps) => {
    return (
        <div className="h-full space-y-8 flex flex-col">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-zinc-900 tracking-tight uppercase">Trabajadores</h2>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-1">Gestión de equipo y colaboradores</p>
                </div>
                <button
                    onClick={onAddStaff}
                    className="btn-interactive-gradient px-6 py-3 rounded-2xl flex items-center space-x-2 group shadow-lg shadow-orange-500/10"
                >
                    <Plus size={18} className="text-[#EE5905]" />
                    <span className="font-bold text-brand-gradient">Nuevo Trabajador</span>
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar por nombre, correo o especialidad..."
                    value={searchQuery}
                    onChange={(e) => onSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-100 rounded-[1.5rem] focus:ring-2 focus:ring-[#EE5905] focus:border-transparent transition-all shadow-sm placeholder:text-zinc-300 font-medium"
                />
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar pb-8">
                {(staff || []).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {staff.map((member, idx) => (
                            <Card key={member?.id || idx} className="group relative overflow-hidden border-zinc-100 hover:border-orange-100 transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] flex flex-col">
                                {/* Header / Avatar */}
                                <div className="p-6 pb-4 flex items-start justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-white font-black text-xl shadow-lg relative overflow-hidden group-hover:scale-105 transition-transform">
                                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            {(member?.name?.[0] || 'T')}{(member?.lastName?.[0] || '')}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-zinc-900 truncate leading-tight">{member?.name} {member?.lastName}</h3>
                                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Team Member</span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-1">
                                        <button
                                            onClick={() => onEditStaff(member)}
                                            className="p-2 text-zinc-400 hover:text-zinc-900 rounded-xl hover:bg-zinc-50 transition-all"
                                        >
                                            <MoreVertical size={16} />
                                        </button>
                                        <button
                                            onClick={() => onDeleteStaff(member.id)}
                                            className="p-2 text-zinc-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-all"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Body / Info */}
                                <div className="px-6 py-4 space-y-4 border-t border-zinc-50 flex-1">
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-3 text-zinc-500">
                                            <Mail size={14} className="text-[#EE5905]" />
                                            <span className="text-xs font-semibold truncate">{member?.email}</span>
                                        </div>
                                        {member?.phone && (
                                            <div className="flex items-center space-x-3 text-zinc-500">
                                                <Phone size={14} className="text-[#EE5905]" />
                                                <span className="text-xs font-semibold">{member?.phone}</span>
                                            </div>
                                        )}
                                    </div>

                                </div>

                                {/* Footer / Stats */}
                                <div className="px-6 py-4 bg-zinc-50/50 flex items-center justify-between border-t border-zinc-100">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex flex-col">
                                            <div className="flex items-center space-x-1 text-[#EE5905]">
                                                <Calendar size={10} />
                                                <span className="text-[10px] font-black uppercase tracking-wider">Eventos</span>
                                            </div>
                                            <span className="text-lg font-black text-zinc-900">{(member as any).eventCount || 0}</span>
                                        </div>
                                    </div>

                                    <div className="px-3 py-1 bg-white border border-zinc-200 rounded-full flex items-center space-x-2 shadow-sm">
                                        <Briefcase size={10} className="text-[#EE5905]" />
                                        <span className="text-[10px] font-black text-zinc-900 uppercase">Activo</span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-zinc-400 bg-white rounded-[2rem] border border-dashed border-zinc-200">
                        <Briefcase size={48} className="mb-4 opacity-10" />
                        <p className="text-sm font-bold uppercase tracking-widest">No hay trabajadores</p>
                        <p className="text-xs mt-1">Añade colaboradores para empezar a asignar tareas</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffView;
