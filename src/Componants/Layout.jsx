import { Outlet, NavLink } from 'react-router-dom';
import Header from './Header';
import About from './About';
import HeaderYT from './HeaderYT';
import YoutubeResources from './YoutubeResources';
import Footer from './Footer/Footer';


const Layout = () => {
  return (
    <div className="h-screen flex flex-col mb-6">
      <Header />
      <div className='max-w-4xl mt-4 mx-auto p-4 sm:p-8 flex items-center justify-center flex-col'>
        <About />
        <nav className="semester-nav">
          <NavLink to="/semester/1" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Semester 1</NavLink>
          <NavLink to="/semester/2" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Semester 2</NavLink>
          <NavLink to="/semester/3" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Semester 3</NavLink>
          <NavLink to="/semester/4" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Semester 4</NavLink>
          <NavLink to="/semester/5" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Semester 5</NavLink>
          <NavLink to="/semester/6" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Semester 6</NavLink>
        </nav>

        <main>
          <Outlet />
        </main>
        <div className='flex items-center justify-center flex-wrap gap-2 mt-1 sm:mt-2 flex-col'>
          <HeaderYT />
          <YoutubeResources />
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Layout;
