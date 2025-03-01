import { Outlet, NavLink, Navigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Layout = () => {
    const location = useLocation(); // Track route changes

    return (
        <div>
            {/* Navigation for Semesters */}
            <nav className="semester-nav">
                {Array.from({ length: 6 }, (_, i) => (
                    <NavLink
                      key={i + 1}
                      to={`/semester/${i + 1}`}
                      className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                      }
                    >
                      Semester {i + 1}
                    </NavLink>
                ))}
            </nav>

            {/* Default redirect to Semester 1 */}
            <Navigate to="/semester/1" replace />

            {/* Animated Outlet */}
            <main className="relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname} // Ensures animation runs on route change
                        initial={{ opacity: 0, x: 50 }} // Slide in from right
                        animate={{ opacity: 1, x: 0 }} // Appear smoothly
                        exit={{ opacity: 0, x: -50 }} // Slide out to left
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Layout;
