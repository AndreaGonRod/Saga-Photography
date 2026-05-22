import React from 'react';

interface SidebarItemProps {
    icon: any;
    label: string;
    active: boolean;
    onClick: () => void;
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all sidebar-nav-item ${active ? 'active' : 'text-zinc-500'}`}
    >
        <Icon size={18} />
        <span className="font-semibold text-sm transition-all">{label}</span>
    </button>
);

export default SidebarItem;
