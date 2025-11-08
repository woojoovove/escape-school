import './App.css';
import { Route, Routes, Navigate } from "react-router-dom";
import { useGame } from "./context/GameContext";
import Login from "./pages/0Login";
import Register from "./pages/Register";
import Class from "./pages/1Class";
import Teacher from "./pages/2Teacher";
import Science from "./pages/3Science";
import Ghost from "./pages/4Ghost";
import Exit from "./pages/5Exit";
import Ending from "./pages/6Ending";
import LoadPage from "./pages/LoadPage";

function ProtectedRoute({ children }) {
    const { isLoggedIn } = useGame();
    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }
    return children;
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/LoadPage" element={<ProtectedRoute><LoadPage /></ProtectedRoute>} />
            <Route path="/1Class" element={<ProtectedRoute><Class /></ProtectedRoute>} />
            <Route path="/2Teacher" element={<ProtectedRoute><Teacher /></ProtectedRoute>} />
            <Route path="/3Science" element={<ProtectedRoute><Science /></ProtectedRoute>} />
            <Route path="/4Ghost" element={<ProtectedRoute><Ghost /></ProtectedRoute>} />
            <Route path="/5Exit" element={<ProtectedRoute><Exit /></ProtectedRoute>} />
            <Route path="/6Ending" element={<ProtectedRoute><Ending /></ProtectedRoute>} />
        </Routes>
    );
}

export default App;
