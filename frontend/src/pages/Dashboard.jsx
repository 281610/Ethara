import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LayoutDashboard, CheckCircle, Clock, AlertCircle, Briefcase } from 'lucide-react';
import { format, isPast, parseISO } from 'date-fns';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, done: 0, todo: 0, overdue: 0 });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/tasks', config);
        setTasks(data);
        
        let done = 0, todo = 0, overdue = 0;
        data.forEach(t => {
          if (t.status === 'Done') done++;
          else todo++;
          
          if (t.dueDate && isPast(parseISO(t.dueDate)) && t.status !== 'Done') {
            overdue++;
          }
        });
        setStats({ total: data.length, done, todo, overdue });
      } catch (err) {
        console.error(err);
      }
    };
    fetchTasks();
  }, [user]);

  const updateStatus = async (taskId, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/tasks/${taskId}/status`, { status }, config);
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status } : t));
      
      // Update stats roughly
      setStats(prev => ({
        ...prev,
        done: status === 'Done' ? prev.done + 1 : prev.done,
        todo: status !== 'Done' ? prev.todo + 1 : prev.todo
      }));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="container">
      <div className="dashboard-grid">
        <div className="sidebar glass-panel">
          <Link to="/" className="sidebar-item active"><LayoutDashboard size={18} /> Dashboard</Link>
          <Link to="/projects" className="sidebar-item"><Briefcase size={18} /> Projects</Link>
        </div>
        
        <div>
          <h2 className="mb-4">Dashboard Overview</h2>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="glass-panel text-center">
              <CheckCircle size={32} className="mb-4" style={{ color: 'var(--success)', margin: '0 auto' }} />
              <h3>{stats.done}</h3>
              <p>Completed Tasks</p>
            </div>
            <div className="glass-panel text-center">
              <Clock size={32} className="mb-4" style={{ color: 'var(--primary-color)', margin: '0 auto' }} />
              <h3>{stats.todo}</h3>
              <p>Pending Tasks</p>
            </div>
            <div className="glass-panel text-center">
              <AlertCircle size={32} className="mb-4" style={{ color: 'var(--danger)', margin: '0 auto' }} />
              <h3>{stats.overdue}</h3>
              <p>Overdue Tasks</p>
            </div>
          </div>
          
          <h3 className="mt-8 mb-4">Your Recent Tasks</h3>
          <div className="grid grid-cols-2 gap-4">
            {tasks.slice(0, 6).map(task => (
              <div key={task._id} className="glass-panel task-card">
                <div className="flex justify-between items-center mb-4">
                  <h4>{task.title}</h4>
                  <span className={`badge ${task.status === 'Done' ? 'badge-done' : task.status === 'In Progress' ? 'badge-progress' : 'badge-todo'}`}>
                    {task.status}
                  </span>
                </div>
                <p className="text-sm mb-4">{task.description}</p>
                <div className="flex justify-between items-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span>Project: {task.project?.name}</span>
                  {task.dueDate && <span>Due: {format(parseISO(task.dueDate), 'MMM dd, yyyy')}</span>}
                </div>
                
                <div className="mt-4 flex gap-2">
                  <select 
                    className="form-control" 
                    value={task.status} 
                    onChange={(e) => updateStatus(task._id, e.target.value)}
                    style={{ padding: '0.4rem', fontSize: '0.8rem' }}
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>
            ))}
            {tasks.length === 0 && <p>No tasks found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
