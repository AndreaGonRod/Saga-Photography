import React from 'react';
import { Plus, Search, MoreVertical, X, Tag, Briefcase, ChevronLeft, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { Offer } from '../../types';

interface OffersViewProps {
    offers: Offer[];
    selectedCategory: string | null;
    onSelectCategory: (category: string | null) => void;
    searchQuery: string;
    onSearch: (query: string) => void;
    onAddOffer: () => void;
    onEditOffer: (offer: Offer) => void;
    onDeleteOffer: (id: number) => void;
}

const OffersView = ({
    offers,
    selectedCategory,
    onSelectCategory,
    searchQuery,
    onSearch,
    onAddOffer,
    onEditOffer,
    onDeleteOffer
}: OffersViewProps) => {
    const categories = Array.from(new Set(offers.map(o => o.category))).filter(Boolean);
    const filteredOffers = (offers || []).filter(o =>
        (!selectedCategory || o.category === selectedCategory) &&
        (!searchQuery ||
            o.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (o.subCategory && o.subCategory.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (o.details && o.details.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    );

    return (
        <div className="h-full space-y-6 flex flex-col">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    {selectedCategory && (
                        <button
                            onClick={() => onSelectCategory(null)}
                            className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-500"
                        >
                            <ChevronLeft size={24} />
                        </button>
                    )}
                    <div>
                        <h2 className="text-2xl font-bold text-zinc-900">
                            {selectedCategory ? selectedCategory : 'Servicios y Ofertas'}
                        </h2>
                        {selectedCategory && (
                            <p className="text-xs text-zinc-400 font-medium">
                                Selecciona una oferta para gestionar
                            </p>
                        )}
                    </div>
                </div>
                <button
                    onClick={onAddOffer}
                    className="btn-interactive-gradient px-5 py-2.5 rounded-lg flex items-center space-x-2 group"
                >
                    <Plus size={18} className="text-[#EE5905]" />
                    <span className="font-bold text-brand-gradient">Añadir Servicio</span>
                </button>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar">
                {!selectedCategory ? (
                    // CATEGORY SELECTION
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                        {categories.map((cat) => (
                            <motion.button
                                key={cat}
                                whileHover={{ y: -5, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onSelectCategory(cat)}
                                className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all text-left flex flex-col justify-between group h-48 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Briefcase size={80} />
                                </div>
                                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#EE5905] mb-4">
                                    <Tag size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-zinc-900 mb-1">{cat}</h3>
                                    <p className="text-xs text-zinc-400 font-medium">
                                        {offers.filter(o => o.category === cat).length} servicios disponibles
                                    </p>
                                </div>
                            </motion.button>
                        ))}
                        {categories.length === 0 && (
                            <div className="col-span-full py-20 text-center">
                                <Tag size={48} className="mx-auto text-zinc-200 mb-4" />
                                <p className="text-zinc-400 font-medium">No hay servicios registrados</p>
                            </div>
                        )}
                    </div>
                ) : (
                    // SERVICE CARDS
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                <input
                                    type="text"
                                    placeholder={`Buscar en ${selectedCategory}...`}
                                    value={searchQuery}
                                    onChange={(e) => onSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#EE5905] focus:border-transparent transition-all shadow-sm"
                                />
                            </div>
                            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-4">
                                {filteredOffers.length} Ofertas de {selectedCategory}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                            {filteredOffers.map((offer, idx) => (
                                <motion.div
                                    key={offer?.id || idx}
                                    whileHover={{ y: -5 }}
                                    className="bg-white p-5 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all flex flex-col relative overflow-hidden group min-h-[220px]"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="space-y-2">
                                            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-zinc-100 text-zinc-500">
                                                {offer?.subCategory || 'General'}
                                            </span>
                                            <p className="text-sm italic font-medium text-zinc-600 leading-relaxed">
                                                {offer?.details || 'Sin detalles'}
                                            </p>
                                        </div>
                                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => onEditOffer(offer)}
                                                className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-[#EE5905] hover:bg-orange-50 rounded-full transition-all"
                                            >
                                                <MoreVertical size={18} />
                                            </button>
                                            <button
                                                onClick={() => offer && onDeleteOffer(offer.id)}
                                                className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 flex items-end justify-between border-t border-zinc-100/50">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Entrega</p>
                                            <div className="flex items-center text-zinc-600 space-x-1.5 font-bold text-sm">
                                                <Clock size={16} className="text-[#EE5905]" />
                                                <span>{offer?.defaultTurnAround} días</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 text-center">Precio</p>
                                            <span className="text-4xl font-black text-brand tracking-tighter text-center">
                                                {offer?.price}<span className="text-xl ml-0.5">€</span>
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {filteredOffers.length === 0 && (
                                <div className="col-span-full py-20 text-center rounded-[2.5rem] border-2 border-dashed border-zinc-100">
                                    <Search size={48} className="mx-auto text-zinc-100 mb-4" />
                                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">No se encontraron servicios</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OffersView;
