import { Outlet, NavLink } from 'react-router-dom';
import './App.css';
import Header from './Componants/Header';
import About from './Componants/About';
import YoutubeResources from './Componants/YoutubeResources';

function App() {
  return (
    <div className="h-screen flex flex-col mb-6">
      <Header />
      <div className='max-w-4xl mt-4 mx-auto p-4 sm:p-8 flex items-center justify-center flex-col'>

      <About/>

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
      <div className='flex items-center justify-center flex-wrap gap-2 flex-col'>
        
        <p className=' text-3xl font-bold'> YouTube Resources </p>
         <YoutubeResources/>
      </div>
      </div>
    </div>
  );
}

export default App;
