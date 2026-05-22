import React from 'react';
import { Clock } from 'lucide-react';

interface TimeDurationPickerProps {
    startTime: string;
    duration: number;
    onTimeChange: (time: string) => void;
    onDurationChange: (duration: number) => void;
}

interface PickerItemProps {
    label: string;
    active: boolean;
    onClick: () => void;
    className?: string;
}

const PickerItem: React.FC<PickerItemProps> = ({ label, active, onClick, className = "" }) => (
    <button
        type="button"
        onClick={onClick}
        className={`relative h-10 flex items-center justify-center transition-all duration-200 ${className} ${active
            ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-2xl z-10'
            : 'text-zinc-400 hover:text-zinc-600'
            }`}
    >
        <span className={`text-sm font-bold ${active ? 'text-[#EE5905]' : ''}`}>{label}</span>
    </button>
);

const TimeDurationPicker: React.FC<TimeDurationPickerProps> = ({
    startTime,
    duration,
    onTimeChange,
    onDurationChange
}) => {
    const hours = ['8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'];
    const minutes = ['00', '15', '30', '45'];

    const durationHours = [0, 1, 2, 3];
    const durationMinutes = [0, 15, 30, 45];

    const [h, m] = startTime.split(':');
    const currentHour = h ? parseInt(h).toString() : '8';
    const currentMinute = m || '00';

    const currentDurationH = Math.floor(duration / 60);
    const currentDurationM = duration % 60;

    return (
        <div className="flex flex-col md:flex-row gap-6">
            {/* HORA DE INICIO */}
            <div className="flex-1">
                <div className="flex items-center space-x-2 mb-4">
                    <Clock size={16} className="text-[#EE5905]" />
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Hora de Inicio</span>
                </div>
                <div className="bg-[#F8F9FA] rounded-2xl p-6 flex">
                    <div className="flex-1">
                        <div className="text-center mb-4">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Hora</span>
                            <div className="h-px bg-zinc-200 mt-2 mx-4" />
                        </div>
                        <div className="grid grid-cols-3 gap-y-2">
                            {hours.map(hour => (
                                <PickerItem
                                    key={hour}
                                    label={hour}
                                    active={currentHour === hour}
                                    onClick={() => onTimeChange(`${hour.padStart(2, '0')}:${currentMinute}`)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="w-px bg-zinc-200 mx-4 self-stretch" />
                    <div className="w-20">
                        <div className="text-center mb-4">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Min</span>
                            <div className="h-px bg-zinc-200 mt-2 mx-2" />
                        </div>
                        <div className="flex flex-col gap-y-2">
                            {minutes.map(min => (
                                <PickerItem
                                    key={min}
                                    label={min}
                                    active={currentMinute === min}
                                    onClick={() => onTimeChange(`${currentHour.padStart(2, '0')}:${min}`)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* DURACIÓN */}
            <div className="w-full md:w-64">
                <div className="flex items-center space-x-2 mb-4">
                    <Clock size={16} className="text-[#EE5905]" />
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Duración</span>
                </div>
                <div className="bg-[#F8F9FA] rounded-2xl p-6 flex">
                    <div className="flex-1">
                        <div className="text-center mb-4">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Hora</span>
                            <div className="h-px bg-zinc-200 mt-2 mx-2" />
                        </div>
                        <div className="flex flex-col gap-y-2">
                            {durationHours.map(dh => (
                                <PickerItem
                                    key={dh}
                                    label={`${dh}h`}
                                    active={currentDurationH === dh}
                                    onClick={() => onDurationChange(dh * 60 + currentDurationM)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="w-px bg-zinc-200 mx-4 self-stretch" />
                    <div className="flex-1">
                        <div className="text-center mb-4">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Min</span>
                            <div className="h-px bg-zinc-200 mt-2 mx-2" />
                        </div>
                        <div className="flex flex-col gap-y-2">
                            {durationMinutes.map(dm => (
                                <PickerItem
                                    key={dm}
                                    label={`${dm}m`}
                                    active={currentDurationM === dm}
                                    onClick={() => onDurationChange(currentDurationH * 60 + dm)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimeDurationPicker;
