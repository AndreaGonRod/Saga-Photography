import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { api } from '../services/api';
import {
    Client,
    Staff,
    Offer,
    Photoshoot,
    Event,
    Task,
    ScheduleEntry,
    MainStatus,
    TaskStatus
} from '../types';

export const useAppLogic = () => {
    const [activeTab, setActiveTab] = useState('schedule');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const [clients, setClients] = useState<Client[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [photoshoots, setPhotoshoots] = useState<Photoshoot[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);

    const [searchQueries, setSearchQueries] = useState({
        clients: '',
        staff: '',
        offers: '',
        photoshoots: ''
    });

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Modals state
    const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
    const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
    const [isAddOfferModalOpen, setIsAddOfferModalOpen] = useState(false);
    const [isAddPhotoshootModalOpen, setIsAddPhotoshootModalOpen] = useState(false);
    const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
    const [isAddAppointmentModalOpen, setIsAddAppointmentModalOpen] = useState(false);

    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
    const [editingPhotoshoot, setEditingPhotoshoot] = useState<Photoshoot | null>(null);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);

    const fetchData = useCallback(async (start?: string, end?: string) => {
        try {
            const [c, s, o, p, e, t, sch] = await Promise.all([
                api.clients.getAll(),
                api.staff.getAll(),
                api.offers.getAll(),
                api.photoshoots.getAll(),
                api.events.getAll(),
                api.tasks.getAll(),
                api.schedule.get(start, end)
            ]);
            setClients(c);
            setStaff(s);
            setOffers(o);
            setPhotoshoots(p);
            setEvents(e);
            setTasks(t);
            setSchedule(sch);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSearchClients = async (q: string) => {
        setSearchQueries(prev => ({ ...prev, clients: q }));
        if (q.length > 2) {
            const results = await api.clients.search(q);
            setClients(results);
        } else if (q.length === 0) {
            fetchData();
        }
    };

    const handleSearchStaff = async (q: string) => {
        setSearchQueries(prev => ({ ...prev, staff: q }));
        if (q.length > 2) {
            const results = await api.staff.search(q);
            setStaff(results);
        } else if (q.length === 0) {
            fetchData();
        }
    };

    const handleSearchOffers = async (q: string) => {
        setSearchQueries(prev => ({ ...prev, offers: q }));
        if (q.length > 2) {
            const results = await api.offers.search(q);
            setOffers(results);
        } else if (q.length === 0) {
            fetchData();
        }
    };

    const handleSearchPhotoshoots = async (q: string) => {
        setSearchQueries(prev => ({ ...prev, photoshoots: q }));
        if (q.length > 2) {
            const results = await api.photoshoots.search(q);
            setPhotoshoots(results);
        } else if (q.length === 0) {
            fetchData();
        }
    };

    const handleDeleteClient = async (id: number) => {
        if (window.confirm('¿Eliminar cliente?')) {
            await api.clients.delete(id);
            fetchData();
        }
    };

    const handleDeleteStaff = async (id: number) => {
        if (window.confirm('¿Eliminar trabajador?')) {
            await api.staff.delete(id);
            fetchData();
        }
    };

    const handleDeleteOffer = async (id: number) => {
        if (window.confirm('¿Eliminar servicio?')) {
            await api.offers.delete(id);
            fetchData();
        }
    };

    const handleDeletePhotoshoot = async (id: number) => {
        if (window.confirm('¿Eliminar sesión?')) {
            await api.photoshoots.delete(id);
            fetchData();
        }
    };

    const handleDeleteEvent = async (id: number) => {
        if (window.confirm('¿Eliminar evento?')) {
            await api.events.delete(id);
            fetchData();
        }
    };

    const handleUpdateTaskStatus = async (taskId: number, itemIdx: number, newStatus: TaskStatus) => {
        // Note: Implicitly uses current tasks state and updates locally for reactivity
        // A real app would call an API here
        const newTasks = tasks.map(t => {
            if (t.id === taskId) {
                const newItemList = [...t.itemList];
                newItemList[itemIdx] = { ...newItemList[itemIdx], status: newStatus };
                return { ...t, itemList: newItemList };
            }
            return t;
        });
        setTasks(newTasks);
    };

    return {
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
    };
};
