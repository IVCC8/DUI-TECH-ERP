import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import useLocalStorage from '../hooks/useLocalStorage';
import { Card } from '../components/Card/card';

const Profile = () => {
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const isClient = user?.role === 'client';
    const isAdmin = user?.role === 'admin';

    const [profile, setProfile] = useLocalStorage(`duitech_profile_${user?.role}`, {
        name: user?.name || 'Usuario',
        email: user?.email || (isClient ? "cliente@gmail.com" : "vendedor@duitech.com"),
        phone: isClient ? "+52 55 1234 5678" : "+1 800-DUI-TECH",
        address: isClient ? "Av. Reforma 222, CDMX" : "Oficina Central, Suite 400"
    });

    const [twoFactor, setTwoFactor] = useState(false);
    const [theme, setTheme] = useState('light');

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        addNotification({
            title: 'Perfil Actualizado',
            text: 'Tus cambios han sido guardados exitosamente.',
            type: 'success'
        });
    };

    const toggle2FA = () => {
        setTwoFactor(!twoFactor);
        addNotification({
            title: 'Seguridad',
            text: `Autenticación de 2 pasos ${!twoFactor ? 'activada' : 'desactivada'}.`,
            type: 'info'
        });
    };

    const displayInitial = (user?.name || 'U').charAt(0);

    return (
        <div className="container-fluid p-0">
            <div className="info-section mb-5" data-aos="fade-down">
                <h2 className="display-6 fw-bold text-gradient">Mi Perfil y Configuración</h2>
                <p className="text-muted fs-5">Gestiona tu información personal, seguridad y preferencias del sistema.</p>
            </div>

            <div className="row g-4 mb-5">
                {/* PROFILE CARD */}
                <div className="col-12 col-lg-4" data-aos="fade-right">
                    <div className="card border-0 shadow-lg overflow-hidden glass-card bg-white mb-4" style={{ borderRadius: '24px' }}>
                        <div className="p-5 text-center bg-primary bg-gradient position-relative">
                            <div className="position-absolute top-0 end-0 p-3 opacity-10 display-2"><i className="fas fa-id-card"></i></div>
                            <div className="avatar mx-auto mb-4 w-32 h-32 display-3 fw-bold shadow-xl bg-white text-primary d-flex align-items-center justify-content-center rounded-circle border border-6 border-white/20">
                                {displayInitial}
                            </div>
                            <h3 className="fw-extrabold text-white mb-2">{user?.name}</h3>
                            <span className="badge bg-white text-primary fw-bold px-3 py-1 rounded-pill small uppercase">
                                {isAdmin ? 'Director General' : isClient ? 'Cliente Platinum (VIP)' : 'Asesor Comercial'}
                            </span>
                        </div>
                        <div className="p-4 pt-5">
                            <div className="d-grid gap-3 mb-4">
                                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-4">
                                    <div className="text-primary"><i className="fas fa-envelope"></i></div>
                                    <div className="flex-grow-1 overflow-hidden">
                                        <div className="xx-small text-muted uppercase fw-bold">Email</div>
                                        <div className="small fw-bold text-dark text-truncate">{profile.email}</div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-4">
                                    <div className="text-primary"><i className="fas fa-phone"></i></div>
                                    <div className="flex-grow-1">
                                        <div className="xx-small text-muted uppercase fw-bold">Teléfono</div>
                                        <div className="small fw-bold text-dark">{profile.phone}</div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-4">
                                    <div className="text-primary"><i className="fas fa-shield-alt"></i></div>
                                    <div className="flex-grow-1">
                                        <div className="xx-small text-muted uppercase fw-bold">Seguridad</div>
                                        <div className="small fw-bold text-success">Cuenta Verificada</div>
                                    </div>
                                </div>
                            </div>
                            <button className="btn btn-outline-primary btn-sm w-100 rounded-pill fw-bold py-2 mb-2">Cargar Nueva Foto</button>
                        </div>
                    </div>

                    {/* NEW CONTENT TO FILL SPACE */}
                    <Card title="Completar Perfil" icon="fa-tasks" className="mb-4">
                        <div className="d-flex justify-content-between x-small mb-2 fw-bold">
                            <span>Progreso de la Cuenta</span>
                            <span className="text-primary">85%</span>
                        </div>
                        <div className="progress mb-3" style={{ height: '8px' }}>
                            <div className="progress-bar bg-primary progress-bar-striped progress-bar-animated" style={{ width: '85%' }}></div>
                        </div>
                        <p className="xx-small text-muted mb-0">Agrega tu fecha de nacimiento y dirección fiscal para alcanzar el 100%.</p>
                    </Card>

                    <Card title="Insignias y Roles" icon="fa-award">
                        <div className="d-flex gap-2 flex-wrap pb-2">
                            <span className="badge bg-warning-subtle text-warning border border-warning-subtle p-2 px-3 rounded-pill"><i className="fas fa-star me-1"></i> {isAdmin ? 'Agente Top' : isClient ? 'Usuario VIP' : 'Vendedor Elite'}</span>
                            <span className="badge bg-success-subtle text-success border border-success-subtle p-2 px-3 rounded-pill"><i className="fas fa-check-circle me-1"></i> Verificado</span>
                            <span className="badge bg-info-subtle text-info border border-info-subtle p-2 px-3 rounded-pill"><i className="fas fa-shield-alt me-1"></i> 2FA Activo</span>
                        </div>
                    </Card>
                </div>

                {/* SETTINGS SECTION */}
                <div className="col-12 col-lg-8" data-aos="fade-left">
                    <Card title="Detalles de la Cuenta" icon="fa-sliders-h" className="h-100">
                        <div className="row g-4 mb-5">
                            <div className="col-12 col-md-6">
                                <label className="form-label small fw-bold text-muted uppercase mb-2">Nombre Completo</label>
                                <input name="name" className="form-control form-control-lg border-2 rounded-4 bg-light" value={profile.name} onChange={handleChange} />
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label small fw-bold text-muted uppercase mb-2">Email de Notificaciones</label>
                                <input name="email" className="form-control form-control-lg border-2 rounded-4 bg-light" value={profile.email} onChange={handleChange} />
                            </div>
                            <div className="col-12">
                                <label className="form-label small fw-bold text-muted uppercase mb-2">Dirección del Centro de Operaciones</label>
                                <input name="address" className="form-control form-control-lg border-2 rounded-4 bg-light" value={profile.address} onChange={handleChange} />
                            </div>
                        </div>

                        <h6 className="fw-bold mb-4 text-primary border-bottom pb-2 x-small uppercase tracking-widest"><i className="fas fa-shield-virus me-2"></i> Seguridad & Privacidad</h6>
                        <div className="row g-4 mb-5">
                            <div className="col-12 col-md-6">
                                <div className="p-3 border rounded-4 d-flex align-items-center justify-content-between hover-bg-light transition-all">
                                    <div>
                                        <div className="fw-bold small">Autenticación (2FA)</div>
                                        <div className="xx-small text-muted">Protege tu cuenta con SMS o App</div>
                                    </div>
                                    <div className="form-check form-switch p-0">
                                        <input className="form-check-input ms-0" type="checkbox" checked={twoFactor} onChange={toggle2FA} style={{ width: '40px', height: '20px' }} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="p-3 border rounded-4 d-flex align-items-center justify-content-between hover-bg-light transition-all cursor-pointer">
                                    <div>
                                        <div className="fw-bold small">Cerrar Sesiones Activas</div>
                                        <div className="xx-small text-muted">2 sesiones abiertas en otros dispositivos</div>
                                    </div>
                                    <i className="fas fa-sign-out-alt text-danger"></i>
                                </div>
                            </div>
                        </div>

                        <h6 className="fw-bold mb-4 text-primary border-bottom pb-2 x-small uppercase tracking-widest"><i className="fas fa-palette me-2"></i> Preferencias de Interfaz</h6>
                        <div className="row g-3">
                            <div className="col-12">
                                <div className="d-flex gap-3">
                                    <button className={`btn flex-grow-1 rounded-4 border-2 py-3 ${theme === 'light' ? 'btn-primary shadow-sm' : 'btn-light'}`} onClick={() => setTheme('light')}>
                                        <i className="fas fa-sun mb-2 d-block display-6 opacity-25"></i>
                                        <span className="fw-bold x-small">Modo Claro</span>
                                    </button>
                                    <button className={`btn flex-grow-1 rounded-4 border-2 py-3 ${theme === 'dark' ? 'btn-dark shadow-sm' : 'btn-light'}`} onClick={() => setTheme('dark')}>
                                        <i className="fas fa-moon mb-2 d-block display-6 opacity-25"></i>
                                        <span className="fw-bold x-small">Modo Oscuro</span>
                                    </button>
                                    <button className="btn flex-grow-1 rounded-4 border-2 border-dashed py-3 btn-light opacity-50">
                                        <i className="fas fa-magic mb-2 d-block display-6 opacity-25"></i>
                                        <span className="fw-bold x-small">Auto Theme</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="text-end mt-5">
                             <button className="btn btn-primary btn-lg rounded-pill px-5 fw-extrabold shadow-sm" onClick={handleSave}>Guardar Todo</button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* LOGIN HISTORY */}
            <div className="card border-0 shadow-sm p-4 mt-2 mb-5" data-aos="fade-up">
                 <h5 className="fw-bold mb-4"><i className="fas fa-history text-muted me-2"></i> Historial de Accesos Recientes</h5>
                 <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr className="xx-small text-muted uppercase tracking-widest">
                                <th className="ps-4">Dispositivo / Ubicación</th>
                                <th>Fecha y Hora</th>
                                <th>IP Address</th>
                                <th className="pe-4 text-end">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { agent: 'Chrome - Windows 11 (CDMX)', time: 'Hace 10 minutos', ip: '187.12.33.11', status: 'Activo' },
                                { agent: 'Safari - iPhone 16 (MTY)', time: 'Hace 4 horas', ip: '187.12.33.15', status: 'Activo' },
                                { agent: 'Edge - MacOS (CDMX)', time: 'Marzo 08, 14:22', ip: '187.15.22.90', status: 'Cerrado' }
                            ].map((session, idx) => (
                                <tr key={idx} className="small">
                                    <td className="ps-4">
                                        <div className="fw-bold text-dark">{session.agent}</div>
                                        <div className="xx-small text-muted">Sesión de Navegador</div>
                                    </td>
                                    <td className="text-muted">{session.time}</td>
                                    <td><code>{session.ip}</code></td>
                                    <td className="pe-4 text-end">
                                        <span className={`badge rounded-pill ${session.status === 'Activo' ? 'bg-success-subtle text-success border-success-subtle' : 'bg-light text-muted border'} px-3 x-small`}>
                                            {session.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
    );
};

export default Profile;
