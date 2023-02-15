import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import './App.css';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Yoga from './components/Yoga';

const HOST = "http://localhost:5000";
//const HOST = "https://medicine-keeper-server.onrender.com";
export {HOST};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;