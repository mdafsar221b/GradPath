import { Outlet, NavLink } from 'react-router-dom';
import './App.css';
import Header from './Componants/Header';
import About from './Componants/About';

function App() {
  return (
    <div className="border-1 flex items-center justify-center flex-col ">
      <Header />
      <About/>

      <nav className="semester-nav">
        <NavLink to="/semester1" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Semester 1</NavLink>
        <NavLink to="/semester2" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Semester 2</NavLink>
        <NavLink to="/semester3" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Semester 3</NavLink>
        <NavLink to="/semester4" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Semester 4</NavLink>
        <NavLink to="/semester5" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Semester 5</NavLink>
        <NavLink to="/semester6" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Semester 6</NavLink>
      </nav>
      <main className='main'>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
