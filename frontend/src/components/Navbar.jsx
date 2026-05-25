import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)

  return (
    <header className={styles.navbar}>
      <div>
        <p className={styles.kicker}>Expense Tracker</p>
        <h1 className={styles.title}>Track spending without losing the thread.</h1>
      </div>

      <div className={styles.actions}>
        {user ? (
          <>
            <span className={styles.userChip}>{user.name}</span>
            <button className={styles.secondaryButton} onClick={logout}>Log out</button>
          </>
        ) : (
          <>
            <Link className={styles.secondaryButton} to="/login">Log in</Link>
            <Link className={styles.primaryButton} to="/register">Create account</Link>
          </>
        )}
      </div>
    </header>
  )
}