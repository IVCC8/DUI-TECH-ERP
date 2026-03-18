import { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { initialTickets } from '../context/mockData';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAuth } from '../context/AuthContext';
import { Card, StatCard } from '../components/Card/card';

const Support = () => {
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const [tickets, setTickets] = useLocalStorage('duitech_tickets', initialTickets);
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        priority: 'Media'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newTicket = {
            id: (Math.floor(Math.random() * 9000) + 1000).toString(),
            subject: formData.subject,
            client: user?.name || 'Usuario',
            date: 'Ahora',
            status: 'Abierto',
            priority: formData.priority
        };
        setTickets([newTicket, ...tickets]);
        setFormData({ subject: '', message: '', priority: 'Media' });
        addNotification({
            title: 'Ticket Creado',
            text: 'Tu solicitud ha sido enviada al equipo de soporte.',
            type: 'success'
        });
    };

    const isAdmin = user?.role === 'admin';
    const isSeller = user?.role === 'seller';
    const isClient = user?.role === 'client';

    return (
        <div className="container-fluid p-0">
            <div className="info-section mb-5" data-aos="fade-down">
                <h2 className="display-6 fw-bold text-gradient">Centro de Soporte</h2>
                <p className="text-muted fs-5">
                    {isAdmin ? 'Panel de Gestión de Incidentes y SLAs.' : 'Resuelve tus dudas o contacta con nuestro equipo técnico especializado.'}
                </p>
            </div>

            {/* ── ADMIN: SERVICE MANAGEMENT VIEW ─────────────────────── */}
            {isAdmin && (
                <div className="row g-4 mb-5" data-aos="fade-up">
                    <div className="col-12 col-md-3">
                        <StatCard title="Tickets Abiertos" value={tickets.filter(t => t.status === 'Abierto').length} icon="fa-envelope-open-text" trend="neutral" sub="Pendientes de asignar" />
                    </div>
                    <div className="col-12 col-md-3">
                        <StatCard title="Tiempo Resol." value="4.2h" icon="fa-clock" trend="up" sub="-15% vs mes pasado" />
                    </div>
                    <div className="col-12 col-md-3">
                        <StatCard title="SLA Cumplido" value="98.2%" icon="fa-check-double" trend="up" sub="Meta: 95%" />
                    </div>
                    <div className="col-12 col-md-3">
                        <StatCard title="Nivel Satisfacción" value="4.8/5" icon="fa-star" trend="neutral" sub="Basado en 120 reviews" />
                    </div>
                </div>
            )}

            <div className="row g-4">
                <div className="col-12 col-lg-5" data-aos="fade-right">
                    {/* FAQ SECTION (Enhanced) */}
                    <Card title="Base de Conocimientos" icon="fa-book-reader" className="h-100">
                        <div className="d-grid gap-3">
                            {[
                                { q: '¿Cómo reimprimir un ticket?', a: 'Ve a "Gestión Órdenes" -> "Ver Historial" y haz clic en el icono de impresora en la columna Acción.', icon: 'f-print' },
                                { q: 'Error de Conexión API', a: 'Verifica tu conexión local y reinicia la terminal de red. Si persiste, verifica el estado del servidor en la sección Docs.', icon: 'fa-wifi' },
                                { q: 'Actualización de Perfil', a: 'Puedes cambiar tu imagen y contraseña en la sección mi perfil accesible desde el avatar superior.', icon: 'fa-user-edit' }
                            ].map((faq, idx) => (
                                <div key={idx} className="p-3 bg-light rounded-4 hover-lift cursor-pointer border-start border-4 border-primary" onClick={() => addNotification({ title: 'Ayuda', text: faq.a, type: 'info' })}>
                                    <div className="fw-bold text-dark small mb-1">{faq.q}</div>
                                    <p className="xx-small text-muted mb-0">{faq.a.substring(0, 70)}...</p>
                                </div>
                            ))}
                            <button className="btn btn-outline-primary btn-sm rounded-pill mt-2">Explorar manuales completos</button>
                        </div>
                    </Card>

                    {/* SELLER: SALES LOGISTICS CARD */}
                    {isSeller && (
                        <div className="card border-0 shadow-lg mt-4 bg-gradient-dark-blue text-white overflow-hidden position-relative p-4" data-aos="zoom-in" data-aos-delay="200">
                            <div className="position-absolute top-0 end-0 p-3 opacity-10 display-3">
                                <i className="fas fa-shipping-fast"></i>
                            </div>
                            <h5 className="fw-bold mb-3">Soporte Logístico Vendedor</h5>
                            <div className="list-group list-group-flush bg-transparent">
                                <button className="list-group-item list-group-item-action bg-transparent text-white border-white/10 d-flex justify-content-between x-small" onClick={() => addNotification({ title: 'Alerta Logística', text: 'Se ha notificado al almacén sobre discrepancia de stock.', type: 'warning' })}>
                                    Discrepancia de Stock
                                    <i className="fas fa-chevron-right opacity-50"></i>
                                </button>
                                <button className="list-group-item list-group-item-action bg-transparent text-white border-white/10 d-flex justify-content-between x-small" onClick={() => addNotification({ title: 'Escalación', text: 'Enviando solicitud de cambio a Gerencia...', type: 'info' })}>
                                    Corrección en Orden Cerrada
                                    <i className="fas fa-chevron-right opacity-50"></i>
                                </button>
                                <button className="list-group-item list-group-item-action bg-transparent text-white border-0 d-flex justify-content-between x-small" onClick={() => addNotification({ title: 'Contacto', text: 'Llamando a soporte técnico externo...', type: 'info' })}>
                                    Falla en Terminal POS
                                    <i className="fas fa-chevron-right opacity-50"></i>
                                </button>
                            </div>
                        </div>
                    )}


                </div>

                <div className="col-12 col-lg-7" data-aos="fade-left">
                    <Card title={isAdmin ? 'Cola Global de Tickets' : 'Generar Nueva Solicitud'} icon={isAdmin ? 'fa-inbox' : 'fa-plus-circle'}>
                        {isAdmin ? (
                            <div className="d-grid gap-3">
                                <div className="p-3 bg-light rounded-4 d-flex align-items-center justify-content-between border-start border-4 border-danger">
                                    <div>
                                        <div className="fw-bold small">Problema con Sync de Inventario</div>
                                        <div className="xx-small text-muted">Vendedor: Carlos M. • Hace 15m</div>
                                    </div>
                                    <button className="btn btn-sm btn-dark rounded-pill x-small px-3">Atender</button>
                                </div>
                                <div className="p-3 bg-light rounded-4 d-flex align-items-center justify-content-between border-start border-4 border-warning">
                                    <div>
                                        <div className="fw-bold small">Error de Facturación Cliente Gold</div>
                                        <div className="xx-small text-muted">Cliente: MetaCorp • Hace 1h</div>
                                    </div>
                                    <button className="btn btn-sm btn-dark rounded-pill x-small px-3">Asignar</button>
                                </div>
                                <div className="text-center mt-3">
                                    <button className="btn btn-link btn-sm text-primary fw-bold">Ver consola avanzada de soporte <i className="fas fa-external-link-alt ms-1"></i></button>
                                </div>
                            </div>
                        ) : (
                            <form id="supportForm" className="row g-4" onSubmit={handleSubmit}>
                                <div className="col-12">
                                    <label className="form-label fw-bold small">Asunto de la consulta</label>
                                    <input 
                                        name="subject"
                                        className="form-control form-control-lg border-2 rounded-4" 
                                        placeholder="Ej: Falla en escáner de red" 
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required 
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-bold small">Categoría</label>
                                    <select className="form-select border-2 rounded-4">
                                        <option>Técnico / Hardware</option>
                                        <option>Software / ERP</option>
                                        <option>Facturación</option>
                                        <option>Logística</option>
                                    </select>
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-bold small">Prioridad</label>
                                    <select 
                                        name="priority"
                                        className="form-select border-2 rounded-4"
                                        value={formData.priority}
                                        onChange={handleInputChange}
                                    >
                                        <option value="Baja">Baja</option>
                                        <option value="Media">Media</option>
                                        <option value="Alta">Alta</option>
                                    </select>
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-bold small">Detalle del problema</label>
                                    <textarea 
                                        name="message"
                                        className="form-control border-2 rounded-4" 
                                        rows="4" 
                                        placeholder="Describe brevemente lo que ocurre..." 
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                    ></textarea>
                                </div>
                                <div className="col-12">
                                    <button type="submit" className="btn btn-primary btn-lg px-5 fw-bold shadow-sm rounded-pill">
                                        Enviar Ticket <i className="fas fa-paper-plane ms-2 small"></i>
                                    </button>
                                </div>
                            </form>
                        )}
                    </Card>

                    {/* NEW CONTENT TO BALANCE HEIGHT - ADDED FOR ALL ROLES */}
                    <div className="row g-4 mt-1">
                        <div className="col-12 col-md-6">
                            <Card title="Estado del Sistema" icon="fa-server" className="h-100 bg-light border-0 shadow-sm">
                                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                                    <span className="small fw-bold text-muted">API DuiTech</span>
                                    <span className="badge bg-success-subtle text-success rounded-pill x-small"><i className="fas fa-check-circle me-1"></i>Operacional</span>
                                </div>
                                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                                    <span className="small fw-bold text-muted">Pasarela de Pagos</span>
                                    <span className="badge bg-success-subtle text-success rounded-pill x-small"><i className="fas fa-check-circle me-1"></i>Operacional</span>
                                </div>
                                <div className="d-flex align-items-center justify-content-between">
                                    <span className="small fw-bold text-muted">Servidor de Correos</span>
                                    <span className="badge bg-warning-subtle text-warning rounded-pill x-small"><i className="fas fa-exclamation-triangle me-1"></i>Lento</span>
                                </div>
                            </Card>
                        </div>
                        <div className="col-12 col-md-6">
                            <Card title="Líneas Directas" icon="fa-phone-alt" className="h-100 bg-light border-0 shadow-sm">
                                <div className="d-flex align-items-center gap-3 mb-3 hover-lift cursor-pointer" onClick={() => addNotification({ title: 'Llamada', text: 'Iniciando llamada a Soporte Técnico ERP...', type: 'info' })}>
                                    <div className="bg-primary text-white rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '35px', height: '35px' }}>
                                        <i className="fas fa-laptop-code x-small"></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="fw-bold small text-dark">Soporte Técnico ERP</div>
                                        <div className="xx-small text-muted">+52 (55) 1234-5678 ext 1</div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-3 hover-lift cursor-pointer" onClick={() => addNotification({ title: 'Llamada', text: 'Iniciando llamada a Facturación y Pagos...', type: 'info' })}>
                                    <div className="bg-success text-white rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '35px', height: '35px' }}>
                                        <i className="fas fa-file-invoice-dollar x-small"></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="fw-bold small text-dark">Facturación y Pagos</div>
                                        <div className="xx-small text-muted">+52 (55) 1234-5678 ext 2</div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* FULL WIDTH TICKETS TABLE */}
            <div className="row mt-4 mb-5" data-aos="fade-up">
                <div className="col-12">
                    <div className="card border-0 shadow-sm p-4">
                        <h4 className="fw-bold mb-4 d-flex justify-content-between align-items-center">
                            <span><i className="fas fa-ticket-alt text-primary me-2"></i> {isAdmin ? 'Todos los Tickets (Consola)' : 'Mis Solicitudes'}</span>
                            <div className="d-flex gap-2">
                                <button className="btn btn-sm btn-light rounded-pill px-3 border"><i className="fas fa-filter me-1"></i> Filtrar</button>
                                <button className="btn btn-sm btn-primary rounded-pill px-3 shadow-sm"><i className="fas fa-download me-1"></i> Exportar</button>
                            </div>
                        </h4>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr className="small text-muted uppercase tracking-wider">
                                        <th className="ps-4">ID</th>
                                        <th>Asunto</th>
                                        {isAdmin && <th>Usuario / Role</th>}
                                        <th>Prioridad</th>
                                        <th>Estado</th>
                                        <th className="pe-4 text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(tickets || []).map((ticket, idx) => (
                                        <tr key={ticket.id || `tck-${idx}`} className="hover-bg-light">
                                            <td className="ps-4 fw-extrabold text-primary">#{ticket.id || '---'}</td>
                                            <td>
                                                <div className="fw-bold small">{ticket.subject || 'Sin asunto'}</div>
                                                <div className="xx-small text-muted">{ticket.date} • <i className="far fa-clock"></i> </div>
                                            </td>
                                            {isAdmin && (
                                                <td>
                                                    <div className="small fw-bold">{ticket.client || 'Juan Pérez'}</div>
                                                    <div className="xx-small badge bg-primary-subtle text-primary">Vendedor</div>
                                                </td>
                                            )}
                                            <td>
                                                <span className={`badge ${ticket.priority === 'Alta' ? 'bg-danger' : ticket.priority === 'Media' ? 'bg-warning text-dark' : 'bg-info'} rounded-pill x-small`}>
                                                    {ticket.priority || 'Media'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className={`badge ${ticket.status === 'Resuelto' ? 'bg-success' : 'bg-light text-dark border shadow-xs'} rounded-pill x-small`}>
                                                        {ticket.status || 'Abierto'}
                                                    </span>
                                                    {isClient && ticket.status === 'Abierto' && (
                                                        <div className="progress flex-grow-1" style={{ height: '4px', minWidth: '40px' }}>
                                                            <div className="progress-bar bg-primary progress-bar-striped progress-bar-animated" style={{ width: '45%' }}></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="pe-4 text-end">
                                                <button className="btn btn-sm btn-light text-primary hover-lift me-2" title="Ver Detalles"><i className="fas fa-eye"></i></button>
                                                {isAdmin && <button className="btn btn-sm btn-light text-success hover-lift" title="Resolver"><i className="fas fa-check"></i></button>}
                                            </td>
                                        </tr>
                                    ))}
                                    {tickets.length === 0 && (
                                        <tr>
                                            <td colSpan={isAdmin ? 6 : 5} className="text-center py-5 text-muted opacity-50">
                                                <i className="fas fa-inbox display-4 mb-3 d-block"></i>
                                                No hay incidentes registrados.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* FULL WIDTH CHAT VIP BLOCK (MOVED TO BOTTOM) */}
            {!isAdmin && (
                <div className="row mb-5" data-aos="zoom-in">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm p-4 bg-primary text-white shadow-lg overflow-hidden position-relative">
                            <div className="position-absolute align-items-center justify-content-center top-0 end-0 pt-4 pe-5 display-1 rotate-15 h-100 d-none d-md-flex" style={{ opacity: 0.1, zIndex: 0 }}>
                                <i className="fas fa-comments" style={{fontSize: '8rem'}}></i>
                            </div>
                            <div className="row align-items-center position-relative" style={{ zIndex: 1 }}>
                                <div className="col-12 col-md-8 mb-4 mb-md-0">
                                    <h3 className="fw-bold mb-2">Chat VIP Tech</h3>
                                    <p className="opacity-75 mb-0">Conéctate al instante con un experto en {isClient ? 'éxito del cliente' : 'soporte interno'} para resolver dudas en tiempo real sin salir del ERP.</p>
                                </div>
                                <div className="col-12 col-md-4 text-md-end">
                                    <div className="bg-white/10 rounded-4 p-3 mb-3 d-inline-block text-start w-100 text-md-center">
                                        <div className="d-flex align-items-center justify-content-md-center gap-2 mb-1">
                                            <span className="bg-success rounded-circle animate-pulse" style={{ width: '8px', height: '8px' }}></span>
                                            <span className="x-small fw-bold text-uppercase">Equipo Online</span>
                                        </div>
                                        <div className="small italic text-white-50">Espera estimada: 45s</div>
                                    </div>
                                    <button className="btn btn-light w-100 fw-bold text-primary rounded-pill hover-lift btn-lg">
                                        <i className="fas fa-comment-dots me-2"></i> Iniciar Chat Ahora
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Support;
