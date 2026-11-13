import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axiosClient from '../api/axiosClient';
function AuthPage() {
    const navigate = useNavigate();
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const[email, setEmail] = useState('');
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const[error, setError] = useState('');
    const[successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try{
            if(isRegisterMode){
                await axiosClient.post('/auth/register', {username, email, password});
                setIsRegisterMode(false);
                setSuccessMessage('Registration successful.');
            }

            else if(isRegisterMode == false){
                const res = await axiosClient.post('/auth/login', {email, password});
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate('/dashboard');
            }

        } catch (err) {
            setError(err.response?.data?.message || "An error occurred.");
        }
    }

    return (
        <div>
            <h2> {isRegisterMode ? 'Create Account' : 'Sign In'}</h2>
                {error && <p style ={{color: 'red'}}>{error}</p>}
                {successMessage && <p style={{color: 'green'}}>{successMessage}</p>}

                <form onSubmit={handleSubmit}>
                    {isRegisterMode && (
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => 
setUsername(e.target.value)}                            required
                        />
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit">
                        {isRegisterMode ? 'Register' : 'Login'}
                    </button>
                </form>

                <button
                    type="button"
                    onClick={() =>{
                        setIsRegisterMode(!isRegisterMode);
                        setError('');
                        setSuccessMessage('');
                    }}
                >
                    {isRegisterMode ? 'Already have an account? Sign In': 'Need an account? Create one.'}
                </button>

        </div>
    )
}

export default AuthPage;