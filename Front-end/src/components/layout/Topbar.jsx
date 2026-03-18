import React from 'react';
import PropTypes from 'prop-types';
import './topbar.css';

const Topbar = ({ 
    user, 
    pageTitle, 
    toggleSidebar, 
    notificationsOpen, 
    setNotificationsOpen, 
    unreadCount 
}) => {
    return (
        <header className="topbar">
            <div className="topbar-left">
                <button 
                    id="menu-toggle" 
                    className="menu-button" 
                    onClick={toggleSidebar}
                    title="Alternar Menú"
                >
                    <i className="fas fa-bars"></i>
                </button>
                <div className="page-info">
                    <h2 className="page-title">{pageTitle}</h2>
                    <p className="welcome-msg">Hola, <span className="user-name">{user?.name}</span> • <span className="user-role">{user?.role}</span></p>
                </div>
            </div>

            <div className="topbar-center">
                <div className="search-wrapper">
                    <i className="fas fa-search search-icon"></i>
                    <input 
                        type="text" 
                        placeholder="Buscar en el ERP..." 
                        className="search-input"
                    />
                </div>
            </div>

            <div className="topbar-right">
                <div className="date-display-wrapper hidden md:flex">
                    <i className="far fa-calendar-alt"></i>
                    <span>{new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>

                <div className="notification-wrapper">
                    <button 
                        type="button"
                        className={`notification-btn ${notificationsOpen ? 'active' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setNotificationsOpen(!notificationsOpen);
                        }}
                    >
                        <i className={`fas fa-bell ${unreadCount > 0 && !notificationsOpen ? 'animate-bounce-subtle' : ''}`}></i>
                        {unreadCount > 0 && (
                            <span className="badge">{unreadCount}</span>
                        )}
                    </button>
                </div>

                <div className="user-status hidden sm:flex">
                    <div className="status-indicator online"></div>
                    <span className="account-type">Cuenta {user?.role === 'admin' ? 'Administrador' : 'estándar'}</span>
                </div>
            </div>
        </header>
    );
};

Topbar.propTypes = {
    user: PropTypes.object,
    pageTitle: PropTypes.string.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
    notificationsOpen: PropTypes.bool.isRequired,
    setNotificationsOpen: PropTypes.func.isRequired,
    unreadCount: PropTypes.number.isRequired
};

export default Topbar;
