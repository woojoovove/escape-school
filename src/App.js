import './App.css';
import { Route, Routes } from "react-router-dom";
import Login from "./pages/0Login";
import Register from "./pages/Register";
import Class from "./pages/1Class";
import Teacher from "./pages/2Teacher";
import Science from "./pages/3Science";
import Ghost from "./pages/4Ghost";
import Exit from "./pages/5Exit";
import Ending from "./pages/6Ending";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/1Class" element={<Class />} />
            <Route path="/2Teacher" element={<Teacher />} />
            <Route path="/3Science" element={<Science />} />
            <Route path="/4Ghost" element={<Ghost />} />
            <Route path="/5Exit" element={<Exit />} />
            <Route path="/6Ending" element={<Ending />} />
        </Routes>
    );
}

export default App;
