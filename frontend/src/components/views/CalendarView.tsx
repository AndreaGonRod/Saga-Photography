import React, { useState, useEffect } from 'react';
import {
    Plus,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
    eachDayOfInterval,
    startOfYear,
    isToday,
    parseISO,
    parse
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ScheduleEntry } from '../../types';

interface CalendarViewProps {
    schedule: ScheduleEntry[];
    onAddAppointment: () => void;
    onRangeChange: (start: Date, end: Date) => void;
}

const CalendarView = ({ schedule, onAddAppointment, onRangeChange }: CalendarViewProps) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'year' | 'month' | 'week' | 'day'>('month');

    useEffect(() => {
        let start, end;
        if (viewMode === 'month') {
            start = startOfMonth(currentDate);
            end = endOfMonth(currentDate);
        } else if (viewMode === 'week') {
            start = startOfWeek(currentDate, { weekStartsOn: 1 });
            end = endOfWeek(currentDate, { weekStartsOn: 1 });
        } else {
            start = currentDate;
            end = currentDate;
        }
        onRangeChange(start, end);
    }, [currentDate, viewMode]);

    const onDateClick = (day: Date) => {
        setCurrentDate(day);
        setViewMode('day');
    };

    const nextPeriod = () => {
        if (viewMode === 'year') setCurrentDate(addMonths(currentDate, 12));
        else if (viewMode === 'month') setCurrentDate(addMonths(currentDate, 1));
        else if (viewMode === 'week') setCurrentDate(addDays(currentDate, 7));
        else setCurrentDate(addDays(currentDate, 1));
    };

    const prevPeriod = () => {
        if (viewMode === 'year') setCurrentDate(subMonths(currentDate, 12));
        else if (viewMode === 'month') setCurrentDate(subMonths(currentDate, 1));
        else if (viewMode === 'week') setCurrentDate(addDays(currentDate, -7));
        else setCurrentDate(addDays(currentDate, -1));
    };

    const renderHeader = () => {
        return (
            <div className="space-y-6 mb-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Agenda</h1>
                    <button
                        onClick={onAddAppointment}
                        className="bg-zinc-900 text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 shadow-sm hover:bg-zinc-800 transition-all group"
                    >
                        <Plus size={18} />
                        <span className="text-sm font-medium">Nueva Cita</span>
                    </button>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <h2 className="text-xl font-semibold text-zinc-900 capitalize">
                            {format(currentDate, 'MMMM yyyy', { locale: es })}
                        </h2>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex bg-zinc-100 p-1 rounded-xl">
                            {[
                                { id: 'day', label: 'Hoy' },
                                { id: 'week', label: 'Semana' },
                                { id: 'month', label: 'Mes' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setViewMode(tab.id as any)}
                                    className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${viewMode === tab.id
                                        ? 'bg-white shadow-sm text-zinc-900'
                                        : 'text-zinc-500 hover:text-zinc-700'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center space-x-1">
                            <button onClick={prevPeriod} className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all">
                                <ChevronLeft size={20} />
                            </button>
                            <button onClick={nextPeriod} className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderDaysHeader = () => {
        const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        return (
            <div className="grid grid-cols-7 border-b border-zinc-100">
                {days.map((day, i) => (
                    <div key={i} className="text-center text-[11px] font-medium text-zinc-400 py-4">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderMonthView = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

        const rows = [];
        let days = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const formattedDate = format(day, 'd');
                const cloneDay = day;
                const dayEvents = schedule.filter(e => {
                    const entryDate = parse(e.start.split(' ')[0], 'dd-MM-yyyy', new Date());
                    return isSameDay(entryDate, cloneDay);
                });
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isTodayDate = isToday(day);

                days.push(
                    <div
                        key={day.toString()}
                        className={`min-h-[120px] p-3 border-r border-b border-zinc-100 transition-all cursor-pointer hover:bg-zinc-50/30 ${!isCurrentMonth ? 'text-zinc-300' : 'bg-white text-zinc-900'
                            } ${i === 0 ? 'border-l' : ''}`}
                        onClick={() => onDateClick(cloneDay)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-lg transition-all ${isTodayDate ? 'bg-zinc-900 text-white' : ''
                                }`}>
                                {formattedDate}
                            </span>
                        </div>
                        <div className="space-y-1">
                            {dayEvents.slice(0, 3).map((event, idx) => (
                                <div
                                    key={idx}
                                    className={`text-[10px] px-2 py-1 rounded-md truncate font-medium border ${event.type === 'photoshoot' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                        event.type === 'event' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                            event.type === 'appointment' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                                event.type === 'deadline' ? 'bg-red-50 text-red-700 border-red-100' :
                                                    event.type === 'task' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                        'bg-zinc-50 text-zinc-700 border-zinc-100'
                                        }`}
                                >
                                    {event.title}
                                </div>
                            ))}
                            {dayEvents.length > 3 && (
                                <div className="text-[9px] text-zinc-400 font-medium pl-1">
                                    + {dayEvents.length - 3}
                                </div>
                            )}
                        </div>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="bg-white rounded-xl border-t border-zinc-100 overflow-hidden shadow-sm">{rows}</div>;
    };

    const renderYearView = () => {
        const months = [];
        const yearStart = startOfYear(currentDate);
        for (let i = 0; i < 12; i++) {
            const monthDate = addMonths(yearStart, i);
            const monthStart = startOfMonth(monthDate);
            const monthEnd = endOfMonth(monthStart);
            const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
            const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

            const days = [];
            let day = startDate;
            while (day <= endDate) {
                days.push(day);
                day = addDays(day, 1);
            }

            months.push(
                <div key={i} className="p-4 bg-white rounded-xl border border-zinc-100 hover:shadow-md transition-all cursor-pointer" onClick={() => { setCurrentDate(monthDate); setViewMode('month'); }}>
                    <h3 className="text-sm font-bold mb-4 capitalize">{format(monthDate, 'MMMM', { locale: es })}</h3>
                    <div className="grid grid-cols-7 gap-1">
                        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => <div key={d} className="text-[8px] text-zinc-300 font-bold text-center">{d}</div>)}
                        {days.map((d, idx) => (
                            <div
                                key={idx}
                                className={`text-[10px] text-center py-1 rounded-md ${!isSameMonth(d, monthDate) ? 'text-zinc-100' :
                                    isToday(d) ? 'bg-black text-white' :
                                        schedule.some(e => isSameDay(parse(e.start.split(' ')[0], 'dd-MM-yyyy', new Date()), d)) ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-zinc-600'
                                    }`}
                            >
                                {format(d, 'd')}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">{months}</div>;
    };

    const renderDayView = () => {
        const dayEvents = schedule.filter(e => {
            const entryDate = parse(e.start.split(' ')[0], 'dd-MM-yyyy', new Date());
            return isSameDay(entryDate, currentDate);
        });
        return (
            <div className="bg-white rounded-2xl border border-zinc-100 p-8 shadow-sm min-h-[400px]">
                <div className="flex items-center space-x-4 mb-8">
                    <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex flex-col items-center justify-center text-white">
                        <span className="text-xs font-bold uppercase">{format(currentDate, 'MMM', { locale: es })}</span>
                        <span className="text-2xl font-black">{format(currentDate, 'd')}</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold capitalize">{format(currentDate, 'EEEE', { locale: es })}</h3>
                        <p className="text-zinc-500">{format(currentDate, 'PPP', { locale: es })}</p>
                    </div>
                </div>
                <div className="space-y-4">
                    {dayEvents.length > 0 ? dayEvents.map((event, idx) => (
                        <div key={idx} className="flex items-start space-x-4 p-4 rounded-xl border border-zinc-50 hover:bg-zinc-50 transition-colors">
                            <div className="text-sm font-mono text-zinc-400 pt-1 w-24">{event.start.split(' ')[1]}</div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <span className={`w-2 h-2 rounded-full ${event.type === 'photoshoot' ? 'bg-indigo-500' :
                                        event.type === 'event' ? 'bg-emerald-500' :
                                            event.type === 'appointment' ? 'bg-rose-500' :
                                                event.type === 'deadline' ? 'bg-red-500' :
                                                    'bg-amber-500'
                                        }`} />
                                    <h4 className="font-bold text-zinc-900">{event.title}</h4>
                                </div>
                                <p className="text-sm text-zinc-500 mt-1">Duración: {event.start.split(' ')[1]} - {event.end.split(' ')[1]}</p>
                            </div>
                        </div>
                    )) : (
                        <div className="py-12 text-center text-zinc-400">
                            No hay eventos programados para este día.
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderWeekView = () => {
        const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
        const days = eachDayOfInterval({ start: startDate, end: addDays(startDate, 6) });

        return (
            <div className="grid grid-cols-7 gap-4">
                {days.map((day, idx) => {
                    const dayEvents = schedule.filter(e => {
                        const entryDate = parse(e.start.split(' ')[0], 'dd-MM-yyyy', new Date());
                        return isSameDay(entryDate, day);
                    });
                    return (
                        <div key={idx} className={`bg-white rounded-2xl border border-zinc-100 p-4 shadow-sm min-h-[300px] ${isToday(day) ? 'ring-2 ring-black ring-offset-2' : ''}`}>
                            <div className="text-center mb-4">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{format(day, 'EEE', { locale: es })}</p>
                                <p className={`text-lg font-black mt-1 ${isToday(day) ? 'text-indigo-600' : ''}`}>{format(day, 'd')}</p>
                            </div>
                            <div className="space-y-2">
                                {dayEvents.map((event, eIdx) => (
                                    <div key={eIdx} className={`p-2 rounded-lg text-[10px] font-bold border ${event.type === 'photoshoot' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                        event.type === 'event' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                            event.type === 'appointment' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                                event.type === 'deadline' ? 'bg-red-50 text-red-700 border-red-100' :
                                                    'bg-amber-50 text-amber-700 border-amber-100'
                                        }`}>
                                        {event.start.split(' ')[1]} {event.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const dayEvents = schedule.filter(e => {
        const entryDate = parse(e.start.split(' ')[0], 'dd-MM-yyyy', new Date());
        return isSameDay(entryDate, currentDate);
    });

    return (
        <div className="h-full flex flex-col lg:flex-row gap-12">
            <div className="flex-1 flex flex-col min-h-0">
                {renderHeader()}
                <div className="flex-1 overflow-auto pr-4 custom-scrollbar">
                    {viewMode === 'month' && renderDaysHeader()}
                    {viewMode === 'year' && renderYearView()}
                    {viewMode === 'month' && renderMonthView()}
                    {viewMode === 'week' && renderWeekView()}
                    {viewMode === 'day' && renderDayView()}
                </div>
            </div>

            <div className="w-full lg:w-80">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-zinc-100 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-semibold text-zinc-900">Tareas de Hoy</h3>
                        <span className="bg-zinc-100 text-zinc-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {dayEvents.length}
                        </span>
                    </div>

                    <div className="flex-1 space-y-6 overflow-auto pr-2 custom-scrollbar">
                        <div className="space-y-4">
                            {dayEvents.length > 0 ? dayEvents.map((e, idx) => (
                                <div key={idx} className="flex items-start space-x-3 group cursor-pointer">
                                    <div className="mt-1 w-4 h-4 rounded border border-zinc-200 group-hover:border-zinc-900 transition-all flex items-center justify-center bg-white">
                                        <div className="w-2 h-2 rounded-sm bg-zinc-900 opacity-0 group-hover:opacity-10 transition-all" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors leading-tight">
                                            {e.title}
                                        </p>
                                        <p className="text-[10px] text-zinc-400 mt-1">{e.start.split(' ')[1]}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="py-8 text-center">
                                    <p className="text-xs text-zinc-400 italic">No hay tareas pendientes</p>
                                </div>
                            )}
                        </div>

                        <div className="pt-6 border-t border-zinc-50">
                            <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-4">Próximas</h4>
                            <p className="text-xs text-zinc-300 italic">Sin tareas próximas</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
