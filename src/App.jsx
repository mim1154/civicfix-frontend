import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import NewReport from "./pages/NewReport";
import EditReport from "./pages/EditReport";
import ForgotPassword from "./pages/ForgotPassword";
import RoleRoute from "./components/RoleRoute";

function App() {
    return (
        <BrowserRouter>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/reports/new" element={<ProtectedRoute><NewReport /></ProtectedRoute>} />
                <Route path="/reports/:reportId/edit" element={<ProtectedRoute><EditReport /></ProtectedRoute>} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/dashboard" element={<RoleRoute allowedRole="user"><Dashboard /></RoleRoute>}/>
                <Route path="/admin" element={<RoleRoute allowedRole="admin"><Dashboard /></RoleRoute>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;