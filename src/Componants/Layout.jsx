import { Outlet, NavLink } from "react-router-dom";



const Layout = () => {
    return (
        <div>
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
        <main>
        <Outlet />
        </main>

        </div>

    );
};

export default Layout;
