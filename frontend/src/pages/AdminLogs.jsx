import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axiosClient from '../api/axiosClient';

function AdminLogs() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [logs, setLogs] = useState([])
    const [error, setError] = useState('')

    const fetchLogs = async() => {
        try{
            const res = await axiosClient.get('/logs');
            setLogs(res.data.logs);
        } catch (err){
            setError(err.response?.data?.message || 'Failed to fetch logs.');
        }
    };

    useEffect(() => {
        if(!localStorage.getItem('token') || user?.role !== 'admin'){
            navigate('/dashboard');
        }
        else{
            try{
                fetchLogs();
            } catch (err){
                setError(err.response?.data?.message || "An error fetching logs.");
            }
        }
    }, [])

    return(
        <div>
            <h2>System Audit Logs</h2>
            <button
                type ="button"
                onClick={() => navigate('/dashboard')}>Back to Dashboard
            </button>

            {error && <p style={{color: 'red'}}>{error}</p>}

            <table border="1" cellPadding="8" style={{marginTop: '16px', width: '100%'}}>
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>Action</th>
                        <th>Performed By</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log._id}>
                            <td>{new Date(log.createdAt).toLocaleString()}</td>
                            <td>{log.action}</td>
                            <td>{log.performedBy}</td>
                            <td>{log.details}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminLogs;