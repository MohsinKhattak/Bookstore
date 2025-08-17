import { Route, Routes } from 'react-router-dom';
import Home from 'pages/home/Home';
import Login from 'pages/auth/Login';
import Signup from 'pages/auth/Signup';
import BookDetails from 'pages/book-details/BookDetails';
import NotFound from 'pages/NotFound';
import MainLayout from 'layouts/MainLayout';
import Favorites from 'pages/favorite/Favorite';
import ProtectRoute from './ProtectedRoute';

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/book/:id" element={<BookDetails />} />
                <Route path="/favorites" element={<ProtectRoute redirectTo="/favorites"><Favorites /></ProtectRoute>} />
            </Route>

            <Route path="/login" element={<ProtectRoute redirectTo="/login"><Login /></ProtectRoute>} />
            <Route path="/signup" element={<ProtectRoute redirectTo="/signup"><Signup /></ProtectRoute>} />

            <Route path="/*" element={<NotFound />} />
        </Routes>
    );
}
