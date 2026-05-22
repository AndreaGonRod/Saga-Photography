import React from 'react';
import { motion } from 'motion/react';
import {
    Camera,
    Calendar,
    Users,
    Briefcase,
    Tag,
    CheckSquare
} from 'lucide-react';
import SidebarItem from '../ui/SidebarItem';

interface SidebarProps {
    isSidebarOpen: boolean;
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Sidebar = ({ isSidebarOpen, activeTab, setActiveTab }: SidebarProps) => {
    return (
        <motion.aside
            initial={false}
            animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
            className="bg-white border-r border-zinc-100 flex-shrink-0 overflow-hidden hidden md:flex flex-col"
        >
            <div className="p-8">
                <div className="flex items-center space-x-3 mb-10">
                    <div className="w-10 h-10 border-brand-gradient rounded-lg flex items-center justify-center shadow-sm">
                        <Camera size={20} className="text-[#EE5905]" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight uppercase text-brand-gradient">Saga Studio</h1>
                </div>

                <nav className="space-y-2">
                    <SidebarItem
                        icon={Calendar}
                        label="Agenda"
                        active={activeTab === 'schedule'}
                        onClick={() => setActiveTab('schedule')}
                    />
                    <SidebarItem
                        icon={Users}
                        label="Clientes"
                        active={activeTab === 'clients'}
                        onClick={() => setActiveTab('clients')}
                    />
                    <SidebarItem
                        icon={Briefcase}
                        label="Trabajadores"
                        active={activeTab === 'staff'}
                        onClick={() => setActiveTab('staff')}
                    />
                    <SidebarItem
                        icon={Tag}
                        label="Servicios"
                        active={activeTab === 'offers'}
                        onClick={() => setActiveTab('offers')}
                    />
                    <SidebarItem
                        icon={Camera}
                        label="Sesiones"
                        active={activeTab === 'photoshoots'}
                        onClick={() => setActiveTab('photoshoots')}
                    />
                    <SidebarItem
                        icon={CheckSquare}
                        label="Tareas"
                        active={activeTab === 'tasks'}
                        onClick={() => setActiveTab('tasks')}
                    />
                </nav>
            </div>

            <div className="mt-auto p-8 border-t border-zinc-100">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 overflow-hidden">
                        <img src="https://picsum.photos/seed/photographer/100/100" alt="Perfil" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                        <p className="text-sm font-bold">Alex Saga</p>
                        <p className="text-xs text-zinc-500">Fotógrafo Principal</p>
                    </div>
                </div>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
