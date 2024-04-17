import React from 'react';
import styles from './Header.module.css'; // Import CSS Module for styling

const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.websiteName}><div className={styles.websiteNamep1}>NBA</div>-<div className={styles.websiteNamep2}>lytics</div></h1>
      <nav>
        <ul className={styles.navList}>
          <li><a href="/">Home</a></li>
          {/* <li><a href="#">About</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">Contact</a></li> */}
        </ul>
      </nav>
    </header>
  );
}

export default Header;