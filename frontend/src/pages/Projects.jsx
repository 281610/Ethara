import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LayoutDashboard, Briefcase, Plus } from 'lucide-react';

export default function Projects() {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/projects', config);
        setProjects(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('/api/projects', { name, description }, config);
      setProjects([...projects, data]);
      setShowForm(false);
      setName('');
      setDescription('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating project');
    }
  };

  return (
    <div className="container">
      <div className="dashboard-grid">
        <div className="sidebar glass-panel">
          <Link to="/" className="sidebar-item"><LayoutDashboard size={18} /> Dashboard</Link>
          <Link to="/projects" className="sidebar-item active"><Briefcase size={18} /> Projects</Link>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2>Projects</h2>
            {user.role === 'Admin' && (
              <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                <Plus size={16} /> New Project
              </button>
            )}
          </div>
          
          {showForm && (
            <form onSubmit={handleCreate} className="glass-panel mb-4 animate-fade-in">
              <div className="form-group">
                <label className="form-label">Project Name</label>
                <input type="text" required className="form-control" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} rows="3"></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Create</button>
            </form>
          )}

          <div className="grid grid-cols-2 gap-4">
            {projects.map(project => (
              <Link to={`/projects/${project._id}`} key={project._id} className="glass-panel task-card">
                <h4>{project.name}</h4>
                <p className="mt-4 text-sm">{project.description}</p>
              </Link>
            ))}
            {projects.length === 0 && <p>No projects found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
