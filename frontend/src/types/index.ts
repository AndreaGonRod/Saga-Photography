/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// --- Enums ---

export enum MainStatus {
    IN_QUEUE = 'IN_QUEUE',
    READY_TO_EDIT = 'READY_TO_EDIT',
    IN_PROGRESS = 'IN_PROGRESS',
    PENDING_REVISION = 'PENDING_REVISION',
    DELIVERED = 'DELIVERED',
    FINISHED = 'FINISHED'
}

export enum TaskStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

// --- Types ---

export interface Client {
    id: number;
    name: string;
    lastName: string;
    phone: string;
    email: string;
    instagramAccounts: string[];
    notes?: string;
    photoshootCount?: number;
    eventCount?: number;
}

export interface Staff {
    id: number;
    name: string;
    lastName: string;
    phone: string;
    email: string;
    notes?: string;
    eventCount?: number;
}

export interface Offer {
    id: number;
    category: string;
    subCategory: string;
    details: string;
    price: number;
    defaultTurnAround: number;
}

export interface Photoshoot {
    id: number;
    title: string;
    date: string; // dd-MM-yyyy
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    eventDate?: string; // dd-MM-yyyy
    clients: Client[];
    offer?: Offer;
    finalPrice: number;
    status: MainStatus;
    dueDate: string; // dd-MM-yyyy
    customTurnAround?: number;
    commercialUsageAuthorized: boolean;
    folderPath?: string;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
    clientId?: number; // For form handling
    offerId?: number;  // For form handling
}

export interface Event extends Photoshoot {
    isFullDay: boolean;
    staff: Staff[];
    location: {
        ceremony: string;
        reception: string;
    };
    deposit?: {
        required: boolean;
        amount: number;
        paid: boolean;
    };
    additionalContact?: {
        name: string;
        phone: string;
    };
    timeline: {
        startTime: string; // HH:mm
        activity: string;
        address?: string;
        notes?: string;
    }[];
    staffId?: number; // For form handling
}

export interface Task {
    id: number;
    client: Client;
    photoshootId?: number;
    eventId?: number;
    dueDate: string; // dd-MM-yyyy
    itemList: {
        taskName: string;
        taskDescription?: string;
        status: TaskStatus;
    }[];
    createdAt?: string;
    updatedAt?: string;
}

export interface ScheduleEntry {
    id: number;
    title: string;
    start: string; // dd-MM-yyyy HH:mm
    end: string;   // dd-MM-yyyy HH:mm
    type: 'photoshoot' | 'event' | 'appointment' | 'deadline' | 'task';
    date?: string; // yyyy-MM-dd
    startTime?: string; // HH:mm
    endTime?: string; // HH:mm
    mainStatus?: string;
    taskStatus?: string;
}
