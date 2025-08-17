import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from '../store/features/user/UserSlice';
import { authService } from "services/auth.service";
import { toast } from "react-toastify";


export default function Navbar() {
    const { currentUser } = useSelector((state: any) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleLogout = async () => {
        try {
            await authService.logout()
            dispatch(logout())
            navigate("/login")
        } catch (error: any) {
            toast.error("Some Error Occured")
        }
    }
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm px-4">
            <div className="container-fluid">

                <Link className="navbar-brand fw-bold text-primary" to="/">
                    Bookstore
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>


                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav gap-3">
                        {currentUser &&
                            <li className="nav-item">
                                <Link className="nav-link" to="/favorites">
                                    Favorite
                                </Link>
                            </li>}

                        {!currentUser ? (
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">
                                    Login
                                </Link>
                            </li>
                        ) : (<li className="nav-item">
                            <button onClick={handleLogout} className="nav-link"  >
                                Logout
                            </button>
                        </li>)

                        }
                    </ul>
                </div>
            </div>
        </nav>
    );
}

