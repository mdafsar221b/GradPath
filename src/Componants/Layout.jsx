import { Outlet, NavLink } from "react-router-dom";
import Header from "./Header";
import About from "./About";
import HeaderYT from "./HeaderYT";
import YoutubeResources from "./YoutubeResources";
import { useContext } from "react";
import ThemeContext from "../context/ThemeContext";

const Layout = () => {
  const { isDark } = useContext(ThemeContext);

  return (
    <div className={`h-screen flex flex-col mb-6 ${isDark ? "bg-black" : "bg-white"}`}>
      <Header />
      <div className="max-w-4xl mt-4 mx-auto p-4 sm:p-8 flex items-center justify-center flex-col">
        <About />
        <nav
          className={`relative flex p-3 items-center justify-between gap-3 rounded-2xl ${
            isDark ? "bg-black text-white" : "bg-white/90 text-black"
          } px-3 shadow-lg my-10`}
        >
          <NavLink
             to="/semester/1"
             className={`nav-link transition-colors duration-200 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700`}
 
           >
             Semester 1
          </NavLink>
          <NavLink
            to="/semester/2"
            className={`nav-link transition-colors duration-200 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700`}

          >
            Semester 2
          </NavLink>
          <NavLink
            to="/semester/3"
            className={`nav-link transition-colors duration-200 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700`}

          >
            Semester 3
          </NavLink>
          <NavLink
            to="/semester/4"
            className={`nav-link transition-colors duration-200 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700`}

          >
            Semester 4
          </NavLink>
          <NavLink
            to="/semester/5"
            className={`nav-link transition-colors duration-200 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700`}

          >
            Semester 5
          </NavLink>
          <NavLink
            to="/semester/6"
            className={`nav-link transition-colors duration-200 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700`}

          >
            Semester 6
          </NavLink>
        </nav>

        <main className={`${isDark ? "bg-black-900 text-white" : "bg-white text-black"}`}>
          <Outlet />
        </main>
        <div className="flex items-center justify-center flex-wrap gap-2 mt-1 sm:mt-2 flex-col">
          <HeaderYT />
          <YoutubeResources />
        </div>
      </div>
    </div>
  );
};

export default Layout;
