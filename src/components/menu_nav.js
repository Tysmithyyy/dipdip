'use client';

// components/MenuNav.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser, clearCurrentUser } from '../utils/auth';
import styles from '../styles/menu_nav.module.css';

const MenuNav = () => {
  const router = useRouter();
  const currentUser = getCurrentUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    clearCurrentUser();
    router.push('/login');
    setMenuOpen(false);
  };

  return (
    <div className={`${styles.menuNav} ${menuOpen && styles.open}`}>
      <div className={`${styles.hamburgerMenu} ${menuOpen && styles.open}`} onClick={handleToggleMenu}>
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
      </div>
      <nav className={`${styles.nav} ${menuOpen && styles.open}`}>
        <div className={styles.logo}>
          <Link href="/">Recipe App</Link>
        </div>
        <div className={styles.menu}>
          <Link href="/">Home</Link>
          <Link href="/group/create">Create Group</Link>
          {currentUser && (
            <Link href="/group/view">View Matches</Link>
          )}
        </div>
        <div className={styles.userActions}>
          {currentUser ? (
            <button onClick={handleLogout}>Log Out</button>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default MenuNav;