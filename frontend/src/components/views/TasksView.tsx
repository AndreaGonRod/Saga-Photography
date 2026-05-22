import React from 'react';
import { CheckSquare, Clock, Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import Card from '../ui/Card';
import { Task, TaskStatus } from '../../types';

interface TasksViewProps {
    tasks: Task[];
    onUpdateStatus: (taskId: number, itemIdx: number, newStatus: TaskStatus) => void;
}

const TasksView = ({ tasks, onUpdateStatus }: TasksViewProps) => {
    return (
        <div className="h-full space-y-8 flex flex-col">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900">Tareas del Estudio</h2>
                    <p className="text-xs text-zinc-400 font-medium mt-1">Gestión de flujo de trabajo y entregas</p>
                </div>
                <div className="flex space-x-2">
                    <div className="bg-zinc-100 text-zinc-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {tasks.length} Proyectos
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
                    {tasks.map((task, idx) => (
                        <Card className="p-8 flex flex-col shadow-sm hover:shadow-md transition-all border-zinc-100">
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white shadow-lg">
                                        <CheckSquare size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-zinc-900">
                                            {task.client.name} {task.client.lastName}
                                        </h3>
                                        <div className="flex items-center space-x-2 text-zinc-400 mt-1">
                                            <CalendarIcon size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Entrega: {task.dueDate}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Progreso</span>
                                    <p className="text-lg font-black text-zinc-900">
                                        {Math.round((task.itemList.filter(i => i.status === TaskStatus.COMPLETED).length / task.itemList.length) * 100)}%
                                    </p>
                                </div>
                            </div>

                            <div className="flex-1 space-y-3">
                                {task.itemList.map((item, itemIdx) => (
                                    <div
                                        key={itemIdx}
                                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${item.status === TaskStatus.COMPLETED ? 'bg-zinc-50 border-transparent opacity-60' : 'bg-white border-zinc-100 hover:border-zinc-300'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <button
                                                onClick={() => onUpdateStatus(
                                                    task.id,
                                                    itemIdx,
                                                    item.status === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED
                                                )}
                                                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${item.status === TaskStatus.COMPLETED
                                                    ? 'bg-emerald-500 text-white shadow-emerald-200'
                                                    : 'border-2 border-zinc-100 hover:border-zinc-900 group'
                                                    }`}
                                            >
                                                {item.status === TaskStatus.COMPLETED && <div className="w-2 h-2 rounded-full bg-white" />}
                                            </button>
                                            <div>
                                                <p className={`text-sm font-bold ${item.status === TaskStatus.COMPLETED ? 'text-zinc-400 line-through' : 'text-zinc-900'}`}>
                                                    {item.taskName}
                                                </p>
                                                {item.taskDescription && (
                                                    <p className="text-[10px] text-zinc-400 font-medium">{item.taskDescription}</p>
                                                )}
                                            </div>
                                        </div>
                                        <select
                                            value={item.status}
                                            onChange={(e) => onUpdateStatus(task.id, itemIdx, e.target.value as TaskStatus)}
                                            className="bg-transparent text-[10px] font-black uppercase tracking-widest text-zinc-400 border-none focus:ring-0 cursor-pointer hover:text-zinc-900 transition-colors"
                                        >
                                            {Object.values(TaskStatus).map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-zinc-50 flex items-center justify-between">
                                <div className="flex items-center space-x-2 text-zinc-400">
                                    <Clock size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Última actualización: hace 2h</span>
                                </div>
                                <button className="flex items-center space-x-1 text-[10px] font-black text-brand uppercase tracking-widest hover:translate-x-1 transition-transform">
                                    <span>Detalles del Proyecto</span>
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        </Card>
                    ))}
                    {tasks.length === 0 && (
                        <div className="col-span-full py-20 text-center rounded-[2.5rem] border-2 border-dashed border-zinc-100">
                            <CheckSquare size={48} className="mx-auto text-zinc-100 mb-4" />
                            <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">No hay tareas activas</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TasksView;
