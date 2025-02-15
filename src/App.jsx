import { Outlet, Link } from 'react-router-dom';
import './App.css';
import Header from './Componants/Header';

function App() {
  return (
    <div className="App">
      <Header />
      <nav className="semester-nav">
        <Link to="/semester1" className="nav-link">Semester 1</Link>
        <Link to="/semester2" className="nav-link">Semester 2</Link>
        <Link to="/semester3" className="nav-link">Semester 3</Link>
        <Link to="/semester4" className="nav-link">Semester 4</Link>
        <Link to="/semester5" className="nav-link">Semester 5</Link>
        <Link to="/semester6" className="nav-link">Semester 6</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
