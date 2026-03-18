import { useAuth } from '../../context/AuthContext';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import './sidebar.css';

const Sidebar = ({ isOpen, setOpen, isCollapsed }) => {
    const { user, logout } = useAuth();
    const role = user?.role;

    const closeSidebar = () => {
        if (window.innerWidth < 768) {
            setOpen(false);
        }
    };

    const allLinks = [
        { to: "/dashboard", icon: <i className="fas fa-chart-line"></i>, label: "Dashboard", roles: ['admin', 'seller', 'client'], id: 'nav-dashboard' },
        { to: "/rh", icon: <i className="fas fa-users"></i>, label: "Recursos Humanos", roles: ['admin', 'seller', 'client'], id: 'nav-rh' },
        { to: "/inventory", icon: <i className="fas fa-boxes"></i>, label: "Inventario", roles: ['admin'], id: 'nav-inventory' },
        { to: "/my-sales", icon: <i className="fas fa-cash-register"></i>, label: "Mis Ventas", roles: ['seller'], id: 'nav-my-sales' },
        { to: "/orders", icon: <i className="fas fa-truck-loading"></i>, label: "Gestion Ordenes", roles: ['admin'], id: 'nav-orders' },
        { to: "/customers", icon: <i className="fas fa-users"></i>, label: "Clientes (CRM)", roles: ['admin', 'seller'], id: 'nav-customers' },
        { to: "/finance", icon: <i className="fas fa-file-invoice-dollar"></i>, label: "Finanzas", roles: ['admin'], id: 'nav-finance' },
        { to: "/docs", icon: <i className="fas fa-book"></i>, label: "Documentacion", roles: ['admin'], id: 'nav-docs' },
        { to: "/catalog", icon: <i className="fas fa-store"></i>, label: "Catalogo", roles: ['client'], id: 'nav-catalog' },
        { to: "/client-orders", icon: <i className="fas fa-shopping-bag"></i>, label: "Mis Compras", roles: ['client'], id: 'nav-client-orders' },
        { to: "/account-statement", icon: <i className="fas fa-file-invoice-dollar"></i>, label: "Estado de Cuenta", roles: ['client'], id: 'nav-account-statement' },
        { to: "/profile", icon: <i className="fas fa-user-circle"></i>, label: "Mi Perfil", roles: ['seller', 'client'], id: 'nav-profile' },
        { to: "/support", icon: <i className="fas fa-headset"></i>, label: "Ayuda y Soporte", roles: ['seller', 'client'], id: 'nav-support' },
    ];

    const links = allLinks.filter(link => link.roles.includes(role));

    return (
        <nav 
            className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''} fixed md:relative z-30 h-full transition-all duration-300`} 
            id="sidebar"
        >
            <div className={`brand flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-6'}`}>
                {!isCollapsed && (
                    <div className="flex items-center gap-2">
                        <i className="fas fa-microchip"></i> 
                        <span className="font-bold">Dui Tech ERP</span>
                    </div>
                )}
                {isCollapsed && <i className="fas fa-microchip text-xl"></i>}
            </div>

            <ul className="nav-links mt-4">
                {links.map((link) => (
                    <li key={link.to} id={link.id} className="p-0">
                        <NavLink 
                            to={link.to} 
                            onClick={closeSidebar}
                            className={({ isActive }) => 
                                `flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-[10px] px-6'} w-full h-full py-3 transition-all ${isActive ? 'active' : ''}`
                            }
                            title={isCollapsed ? link.label : ''}
                        >
                            <span className={`${isCollapsed ? 'text-xl' : ''}`}>{link.icon}</span>
                            {!isCollapsed && <span>{link.label}</span>}
                        </NavLink>
                    </li>
                ))}
            </ul>

            <div className={`user-profile ${isCollapsed ? 'flex-col items-center justify-center px-0 py-4 gap-4' : 'px-6'}`}>
                <div className="avatar">
                    {user?.name?.charAt(0)}
                </div>
                {!isCollapsed && (
                    <div className="flex-grow min-w-0">
                        <div className="truncate font-medium">{user?.name}</div>
                        <small className="text-white/60 truncate block">{user?.title}</small>
                    </div>
                )}
                <button onClick={logout} className="logout-btn flex items-center justify-center w-full p-2 hover:text-accent transition-colors" title="Salir">
                    <i className="fas fa-sign-out-alt"></i>
                </button>
            </div>
        </nav>
    );
};

Sidebar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    isCollapsed: PropTypes.bool.isRequired,
};

export default Sidebar;
