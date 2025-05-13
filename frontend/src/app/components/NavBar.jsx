import { Link, useLocation } from 'react-router-dom';
import '../../styles/NavBar.css';

export default function NavBar() {
  const { pathname } = useLocation();

  return (
    <nav className="retro-nav">
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