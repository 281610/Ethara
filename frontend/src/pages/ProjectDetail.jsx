import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { ArrowLeft, Plus } from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`/api/tasks/project/${id}`, config);
        setTasks(data);
        
        const usersData = await axios.get('/api/auth/users');
        setUsers(usersData.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTasks();
  }, [id, user]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('/api/tasks', { 
        title, description, project: id, assignedTo, dueDate 
      }, config);
      
      const assignedUser = users.find(u => u._id === assignedTo);
      setTasks([...tasks, { ...data, assignedTo: assignedUser }]);
      setShowForm(false);
      setTitle('');
      setDescription('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating task');
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/tasks/${taskId}/status`, { status }, config);
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status } : t));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <Link to="/projects" className="btn btn-outline mb-4" style={{ display: 'inline-flex' }}>
        <ArrowLeft size={16} /> Back to Projects
      </Link>
      
      <div className="flex justify-between items-center mb-8">
        <h2>Project Tasks</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> Add Task
        </button>
      </div>
      
      {showForm && (
        <form onSubmit={handleCreateTask} className="glass-panel mb-8 animate-fade-in">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Task Title</label>
              <input type="text" required className="form-control" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input type="date" className="form-control" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} rows="2"></textarea>
          </div>
          <div className="form-group">
            <label className="form-label">Assign To</label>
            <select className="form-control" value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
              <option value="">Unassigned</option>
              {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Create Task</button>
        </form>
      )}

      <div className="grid grid-cols-3 gap-4">
        {tasks.map(task => (
          <div key={task._id} className="glass-panel task-card">
            <div className="flex justify-between items-center mb-4">
              <h4>{task.title}</h4>
              <span className={`badge ${task.status === 'Done' ? 'badge-done' : task.status === 'In Progress' ? 'badge-progress' : 'badge-todo'}`}>
                {task.status}
              </span>
            </div>
            <p className="text-sm mb-4">{task.description}</p>
            <div className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              Assignee: {task.assignedTo ? task.assignedTo.name : 'Unassigned'}
            </div>
            
            <select 
              className="form-control" 
              value={task.status} 
              onChange={(e) => updateStatus(task._id, e.target.value)}
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
        ))}
        {tasks.length === 0 && <p>No tasks found in this project.</p>}
      </div>
    </div>
  );
}
