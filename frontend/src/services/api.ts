import { Client, Staff, Offer, Photoshoot, Event, Task, ScheduleEntry } from '../types';

const API_BASE = '/api';

export const api = {
    // Clients
    clients: {
        getAll: () => fetch(`${API_BASE}/clients`).then(res => res.json() as Promise<Client[]>),
        search: (query: string) => fetch(`${API_BASE}/clients/search?searchFullName=${encodeURIComponent(query)}`).then(res => res.json() as Promise<Client[]>),
        create: (data: any) => fetch(`${API_BASE}/clients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }),
        update: (id: number, data: Client) => fetch(`${API_BASE}/clients/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }),
        delete: (id: number) => fetch(`${API_BASE}/clients/${id}`, { method: 'DELETE' }),
    },

    // Staff
    staff: {
        getAll: () => fetch(`${API_BASE}/staff`).then(res => res.json() as Promise<Staff[]>),
        search: (query: string) => fetch(`${API_BASE}/staff/search?searchFullName=${encodeURIComponent(query)}`).then(res => res.json() as Promise<Staff[]>),
        create: (data: any) => fetch(`${API_BASE}/staff`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }),
        update: (id: number, data: Staff) => fetch(`${API_BASE}/staff/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }),
        delete: (id: number) => fetch(`${API_BASE}/staff/${id}`, { method: 'DELETE' }),
    },

    // Offers
    offers: {
        getAll: () => fetch(`${API_BASE}/offers`).then(res => res.json() as Promise<Offer[]>),
        search: (query: string) => fetch(`${API_BASE}/offers/search?category=${encodeURIComponent(query)}`).then(res => res.json() as Promise<Offer[]>),
        create: (data: any) => fetch(`${API_BASE}/offers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }),
        update: (id: number, data: Offer) => fetch(`${API_BASE}/offers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }),
        delete: (id: number) => fetch(`${API_BASE}/offers/${id}`, { method: 'DELETE' }),
    },

    // Photoshoots
    photoshoots: {
        getAll: () => fetch(`${API_BASE}/photoshoots`).then(res => res.json() as Promise<Photoshoot[]>),
        search: (query: string) => fetch(`${API_BASE}/photoshoots/search?title=${encodeURIComponent(query)}`).then(res => res.json() as Promise<Photoshoot[]>),
        create: (data: any) => fetch(`${API_BASE}/photoshoots`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }),
        update: (id: number, data: Photoshoot) => fetch(`${API_BASE}/photoshoots/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }),
        delete: (id: number) => fetch(`${API_BASE}/photoshoots/${id}`, { method: 'DELETE' }),
    },

    // Events
    events: {
        getAll: () => fetch(`${API_BASE}/events`).then(res => res.json() as Promise<Event[]>),
        create: (data: any) => fetch(`${API_BASE}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }),
        update: (id: number, data: Event) => fetch(`${API_BASE}/events/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }),
        delete: (id: number) => fetch(`${API_BASE}/events/${id}`, { method: 'DELETE' }),
    },

    // Tasks
    tasks: {
        getAll: () => fetch(`${API_BASE}/tasks`).then(res => res.json() as Promise<Task[]>),
    },

    // Schedule
    schedule: {
        get: (start?: string, end?: string) => {
            const url = start && end
                ? `${API_BASE}/schedule?start=${start}&end=${end}`
                : `${API_BASE}/schedule`;
            return fetch(url).then(res => res.json());
        },
        createAppointment: (data: any) => fetch(`${API_BASE}/appointments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }),
    }
};
