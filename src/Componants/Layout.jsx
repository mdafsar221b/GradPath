import { Outlet, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Layout = () => {
  const location = useLocation();

  return (
    <div>
      <nav className="semester-nav flex justify-center gap-4 my-6">
        {Array.from({ length: 6 }, (_, i) => (
          <NavLink
            key={i + 1}
            to={`/semester/${i + 1}`}
            className={({ isActive }) =>
              isActive
                ? "px-4 py-2 bg-blue-600 text-white rounded-xl shadow"
                : "px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-200"
            }
          >
            Semester {i + 1}
          </NavLink>
        ))}
      </nav>

      <main className="relative overflow-hidden px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
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
