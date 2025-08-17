import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />

            <main className="flex-grow-1 container py-4">
                <Outlet />
            </main>

            <footer className="bg-dark text-light text-center py-3 mt-auto">
                <small>© {new Date().getFullYear()} Bookstore. All rights reserved.</small>
            </footer>
        </div>
    );
}
