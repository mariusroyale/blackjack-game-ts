import { Link, useLocation } from 'react-router-dom';
import '../../styles/modern/NavBar.css';

export default function NavBar() {
  const { pathname } = useLocation();

  return (
    <nav className="nav-bar">
      <ul>
        <li className={pathname === "/" ? "active" : ""}>
          <Link to="/">🎮 Play</Link>
        </li>
        <li className={pathname === "/leaderboards" ? "active" : ""}>
          <Link to="/leaderboards">🏆 Leaderboards</Link>
        </li>
      </ul>
    </nav>
  );
}