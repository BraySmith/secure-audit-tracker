import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import {useEffect} from 'react';

function DashPage() {
    const navigate =useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const fetchTasks = async() => {
        try{
            const res = await axiosClient.get('/tasks');
            setTasks(res.data.tasks);
        } catch (err){
            setError(err.response?.data?.message || 'Failed to load tasks.');
        }
    };

    useEffect(() => {
        if(!localStorage.getItem('token')){
            navigate('/');
            return;
        }
        fetchTasks();
    }, [])

    const handleCreateTask = async (e) =>{
        e.preventDefault();
        setError('');
        try{
            await axiosClient.post('/tasks', {title, description});
            setTitle('');
            setDescription('');
            await fetchTasks();
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating task.');
        }
    }

    const handleStatusChange = async (taskId, newStatus) => {
        setError('');
        try{
            await axiosClient.put(`/tasks/${taskId}`, {status: newStatus});
            await fetchTasks();
        } catch (err) {
            setError(err.response?.data?.message || 'Error changing status.');
        }
    }

    const handleDeleteTask = async (taskId) => {
        try{
            await axiosClient.delete(`/tasks/${taskId}`);
            await fetchTasks();
        } catch (err) {
            setError(err.response?.data?.message || 'Error deleting task.');
        }
    }

    const handleLogout = async() => {
        localStorage.clear();
        navigate('/');
    }

    return (
        <div>
            <h2>Welcome, {user?.username}.</h2>
                {user?.role === 'admin' && <button onClick={() => navigate('/admin')}>Audit Logs</button>}
                
                <button onClick={handleLogout}>Logout</button>
                
                {error && <p style={{color: 'red'}}>{error}</p>}

                <form onSubmit={handleCreateTask}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <button type="submit">Add Task</button>
                </form>

                <div>
                    {tasks.length === 0 ? (
                        <p>No tasks yet. Add one above!</p>
                    ) : (
                        tasks.map((task) => (
                            <div key={task._id}>
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>

                                <select
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(task._id, e.target.value)}>
                                        <option value="pending">Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>                                    
                                </select>

                                <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                            </div>
                        ))
                    )}
                </div>
        </div>
    )
}

export default DashPage;