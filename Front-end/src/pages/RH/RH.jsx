import { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import KpiModule from '../../components/ui/KpiModule';
import useKpiData from '../../hooks/useKpiData';
import useApi from '../../hooks/useApi';
import Modal from '../../components/ui/Modal';
import { Card } from '../../components/Card/card';

const RH = () => {
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const { data: kpi } = useKpiData('hr');
    const { data: employees, loading, postData } = useApi('employees');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const success = await postData({ name: formData.get('name'), status: formData.get('status') });
        if (success) {
            addNotification({ title: 'Empleado Registrado', text: 'Colaborador añadido exitosamente.', type: 'success' });
            setIsModalOpen(false);
        }
    };

    if (loading) return <div className="p-5 text-center">Cargando personal...</div>;

    // --- CLIENT ROLE VIEW ---
    if (user?.role === 'client') {
        return (
            <div className="container-fluid p-0 hr-page">
                <div className="info-section mb-5">
                    <h2 className="display-6 fw-bold text-gradient">Centro de Ayuda y Soporte</h2>
                    <p className="text-muted fs-5 m-0">Accede a recursos, contacta a tu ejecutivo y consulta manuales de usuario.</p>
                </div>
                
                {/* SOPORTE DIRECTO */}
                <div className="row g-4 mb-5">
                    <div className="col-12 col-md-4">
                        <Card className="h-100 hover-lift text-center" bodyClassName="p-4 d-flex flex-column align-items-center">
                            <div className="bg-primary bg-gradient text-white w-16 h-16 rounded-circle d-flex align-items-center justify-content-center shadow mb-3"><i className="fas fa-user-tie fs-3"></i></div>
                            <h5 className="fw-bold mb-1">Laura Sánchez</h5>
                            <p className="small text-muted mb-3">Tu Ejecutiva de Cuenta VIP</p>
                            <div className="d-grid gap-2 w-100">
                                <a href="mailto:lsanchez@duitech.com" className="btn btn-light rounded-pill small fw-bold"><i className="fas fa-envelope me-2"></i>Email</a>
                                <button className="btn btn-success rounded-pill small fw-bold"><i className="fab fa-whatsapp me-2"></i>WhatsApp</button>
                            </div>
                        </Card>
                    </div>
                    <div className="col-12 col-md-4">
                        <Card className="h-100 hover-lift text-center" bodyClassName="p-4 d-flex flex-column align-items-center">
                            <div className="bg-info bg-gradient text-white w-16 h-16 rounded-circle d-flex align-items-center justify-content-center shadow mb-3"><i className="fas fa-headset fs-3"></i></div>
                            <h5 className="fw-bold mb-1">Soporte Técnico 24/7</h5>
                            <p className="small text-muted mb-3">Asistencia en plataforma y APIs</p>
                            <div className="d-grid gap-2 w-100">
                                <button className="btn btn-primary rounded-pill small fw-bold" onClick={() => addNotification({title: 'Ticket Abierto', text: 'Un asesor se contactará pronto.', type: 'info'})}><i className="fas fa-ticket-alt me-2"></i>Levantar Ticket</button>
                                <a href="tel:01800DUITECH" className="btn btn-light rounded-pill small fw-bold"><i className="fas fa-phone-alt me-2"></i>Llamar</a>
                            </div>
                        </Card>
                    </div>
                    <div className="col-12 col-md-4">
                        <Card className="h-100 hover-lift text-center" bodyClassName="p-4 d-flex flex-column align-items-center">
                            <div className="bg-warning bg-gradient text-white w-16 h-16 rounded-circle d-flex align-items-center justify-content-center shadow mb-3"><i className="fas fa-book fs-3"></i></div>
                            <h5 className="fw-bold mb-1">Base de Conocimientos</h5>
                            <p className="small text-muted mb-3">Guías, tutoriales y videos</p>
                            <div className="d-grid gap-2 w-100">
                                <button className="btn btn-light rounded-pill small fw-bold"><i className="fas fa-external-link-alt me-2"></i>Ir al Portal</button>
                                <button className="btn btn-outline-warning rounded-pill small fw-bold border-2"><i className="fas fa-video me-2"></i>Tutoriales</button>
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="row g-4 mb-5">
                    {/* ESTADO DE SERVICIOS */}
                    <div className="col-12 col-lg-5">
                        <Card title={<><i className="fas fa-server text-primary me-2"></i>Estado de Servicios Digitales</>} className="h-100">
                            <div className="d-flex flex-column gap-3">
                                {[{ name: 'Plataforma ERP', status: 'Operativo', color: 'success' }, { name: 'Módulo de Facturación', status: 'Operativo', color: 'success' }, { name: 'APIs de Sincronización', status: 'Mantenimiento', color: 'warning' }, { name: 'Pasarela de Pagos', status: 'Operativo', color: 'success' }].map((s, i) => (
                                    <div key={i} className="d-flex align-items-center justify-content-between p-3 bg-light rounded-4 border border-white border-opacity-50">
                                        <div className="d-flex align-items-center gap-2">
                                            <div className={`rounded-circle bg-${s.color}`} style={{width:'8px', height:'8px'}}></div>
                                            <span className="fw-bold small">{s.name}</span>
                                        </div>
                                        <span className={`badge bg-${s.color}-subtle text-${s.color} border border-${s.color}-subtle rounded-pill px-3`}>{s.status}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 p-3 bg-primary bg-opacity-10 border border-primary border-opacity-10 rounded-4">
                                <p className="x-small text-primary fw-bold mb-0">Mantenimiento programado: 15 Mar (2:00 AM - 4:00 AM)</p>
                            </div>
                        </Card>
                    </div>
                    {/* FAQ ENHANCED */}
                    <div className="col-12 col-lg-7">
                        <Card title={<><i className="fas fa-question-circle text-warning me-2"></i>Preguntas Frecuentes</>} className="h-100">
                            <div className="accordion accordion-flush" id="faqAccordion">
                                {[
                                    { q: '¿Cómo descargo mi reporte de inventario?', a: 'Ve a Inventario > Reporte y selecciona el formato PDF o Excel.' },
                                    { q: '¿Cuál es mi límite de crédito actual?', a: 'Puedes consultarlo en la sección de Finanzas > Línea de Crédito.' },
                                    { q: '¿Cómo añado un nuevo usuario a mi cuenta?', a: 'Solicítalo directamente a tu ejecutiva de cuenta Laura Sánchez.' },
                                    { q: '¿Qué hacer si una factura sale con errores?', a: 'Utiliza el botón de "Refacturar" en el detalle de la factura en Finanzas.' }
                                ].map((item, idx) => (
                                    <div key={idx} className="accordion-item border-0 border-bottom border-light mb-1">
                                        <h2 className="accordion-header"><button className="accordion-button collapsed bg-transparent fw-bold small text-dark rounded-3 px-0 py-3 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target={`#faq${idx}`}>{item.q}</button></h2>
                                        <div id={`faq${idx}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion"><div className="accordion-body small text-muted pt-0 px-0 pb-3">{item.a}</div></div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="row g-4">
                    {/* DESCARGAS */}
                    <div className="col-12 col-lg-8">
                        <Card title={<><i className="fas fa-cloud-download-alt text-info me-2"></i>Descargas y Documentación</>} className="h-100">
                             <div className="row g-3">
                                {[
                                    { title: 'Contrato de Servicios 2026', type: 'PDF', val: '2.1 MB', color: 'danger', icon: 'fa-file-pdf' },
                                    { title: 'Manual de Configuración API', type: 'DOCX', val: '4.5 MB', color: 'primary', icon: 'fa-file-word' },
                                    { title: 'Guía Rápida - Facturación', type: 'PDF', val: '1.2 MB', color: 'danger', icon: 'fa-file-pdf' },
                                    { title: 'Plantilla de Carga Masiva', type: 'XLSX', val: '0.8 MB', color: 'success', icon: 'fa-file-excel' }
                                ].map((doc, i) => (
                                    <div key={i} className="col-md-6">
                                        <div className="border rounded-4 p-3 hover-lift bg-white shadow-sm h-100 d-flex gap-3 align-items-center" style={{cursor:'pointer'}}>
                                            <div className={`bg-${doc.color}-subtle text-${doc.color} p-3 rounded-4`}><i className={`fas ${doc.icon} fs-4`}></i></div>
                                            <div className="min-w-0">
                                                <h6 className="fw-bold mb-1 text-truncate">{doc.title}</h6>
                                                <span className="badge bg-light text-dark border rounded-pill x-small">{doc.type} • {doc.val}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                    {/* CHAT ASISTENTE */}
                    <div className="col-12 col-lg-4">
                        <Card title={<><i className="fas fa-robot text-primary me-2"></i>Dui Asistente AI</>} className="h-100" extra={<span className="badge bg-success rounded-pill x-small">Online</span>}>
                            <div className="d-flex flex-column h-100">
                                <div className="bg-light rounded-4 p-3 mb-3 flex-grow-1" style={{minHeight:'180px'}}>
                                    <div className="d-flex gap-2 mb-3">
                                        <div className="bg-primary text-white p-2 rounded-circle flex-shrink-0" style={{width:'30px',height:'30px',display:'flex',justifyContent:'center',alignItems:'center'}}><i className="fas fa-robot x-small"></i></div>
                                        <div className="bg-white p-3 rounded-4 shadow-sm small text-dark">¿En qué puedo ayudarte hoy con tu ERP?</div>
                                    </div>
                                </div>
                                <div className="input-group">
                                    <input type="text" className="form-control rounded-pill border-0 bg-light px-4 small" placeholder="Escribe tu duda..."/>
                                    <button className="btn btn-primary rounded-circle ms-2 shadow-sm" style={{width:'40px',height:'40px'}}><i className="fas fa-paper-plane small"></i></button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    // --- SELLER ROLE VIEW ---
    if (user?.role === 'seller') {
        return (
            <div className="container-fluid p-0 hr-page">
                <div className="info-section mb-5">
                    <h2 className="display-6 fw-bold text-gradient">Mi Panel de Desempeño</h2>
                    <p className="text-muted fs-5 m-0">Monitorea tus metas, comisiones y capacitación en ventas.</p>
                </div>

                {/* METRICAS PERSONALES */}
                <div className="row g-4 mb-5">
                    {[
                        { title: 'Ventas del Mes', val: '$124,500', sub: '92% de la meta', icon: 'fa-trophy', color: 'border-primary', trend: '+12%' },
                        { title: 'Comisiones Pend.', val: '$8,420', sub: 'Por dispersar el día 15', icon: 'fa-hand-holding-usd', color: 'border-success', trend: 'OK' },
                        { title: 'Clientes VIP', val: '8', sub: 'Cuentas gestionadas', icon: 'fa-crown', color: 'border-warning', trend: '+1' },
                        { title: 'Ranking Equipo', val: '#3', sub: 'De 12 vendedores', icon: 'fa-medal', color: 'border-info', trend: '↑' }
                    ].map((card, i) => (
                        <div key={i} className="col-6 col-xl-3">
                            <div className={`card border-0 shadow-sm rounded-4 border-start border-4 ${card.color} h-100`}>
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="bg-light rounded-3 p-2"><i className={`fas ${card.icon} text-primary`}></i></div>
                                        <span className="badge bg-primary-subtle text-primary rounded-pill x-small">{card.trend}</span>
                                    </div>
                                    <div className="h4 fw-extrabold text-dark mb-1">{card.val}</div>
                                    <div className="small fw-bold text-muted text-uppercase" style={{fontSize:'10px'}}>{card.title}</div>
                                    <div className="x-small text-muted">{card.sub}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* PROGRESO DE METAS QUINCENALES */}
                <div className="row g-4 mb-5">
                    <div className="col-12 col-lg-7">
                        <Card title={<><i className="fas fa-chart-line text-primary me-2"></i>Cumplimiento de Objetivos Q1-Mar</>}>
                            <div className="d-grid gap-4 mt-2">
                                {[
                                    { label: 'Cuota de Ventas Hardware', current: 95000, target: 120000, color: 'bg-primary' },
                                    { label: 'Cierre de Servicios/Soporte', current: 28000, target: 30000, color: 'bg-success' },
                                    { label: 'Nuevos Clientes (Leads)', current: 4, target: 8, color: 'bg-warning' },
                                    { label: 'Retención de Cuentas', current: 100, target: 100, color: 'bg-info' }
                                ].map((goal, i) => {
                                    const pct = Math.round((goal.current / goal.target) * 100);
                                    return (
                                        <div key={i}>
                                            <div className="d-flex justify-content-between small fw-bold mb-1">
                                                <span>{goal.label}</span>
                                                <span className="text-muted">{pct}% (${goal.current.toLocaleString()}/${goal.target.toLocaleString()})</span>
                                            </div>
                                            <div className="progress rounded-pill shadow-sm" style={{height:'10px'}}><div className={`progress-bar ${goal.color}`} style={{width: `${pct}%`, transition:'width 1.5s'}}></div></div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-4 p-4 rounded-4 bg-primary bg-opacity-10 border border-primary border-opacity-10 text-center">
                                <h6 className="fw-bold text-primary mb-1">🔥 ¡Estás a solo $25k de tu Bono de Rendimiento!</h6>
                                <p className="x-small text-primary opacity-75 mb-0">Mantén el ritmo, faltan 5 días para el cierre.</p>
                            </div>
                        </Card>
                    </div>

                    {/* ACADEMIA DEL VENDEDOR */}
                    <div className="col-12 col-lg-5">
                        <Card title={<><i className="fas fa-university text-warning me-2"></i>Vendedor Pro: Academy Items</>} extra={<span className="badge bg-warning text-dark rounded-pill x-small">Level 4</span>}>
                            <div className="d-grid gap-3">
                                {[
                                    { title: 'Técnicas de Cierre 2026', type: 'Módulo', duration: '45 min', status: 'Completado', color: 'success' },
                                    { title: 'Manejo de Objeciones CRM', type: 'Video', duration: '12 min', status: 'Pendiente', color: 'secondary' },
                                    { title: 'Nuevos Productos Apple Q2', type: 'Webinar', duration: 'Hoy 4PM', status: 'Inscrito', color: 'info' },
                                    { title: 'Negociación B2B Avanzada', type: 'Certificación', duration: '6 hrs', status: 'En Curso', color: 'primary' }
                                ].map((item, i) => (
                                    <div key={i} className="p-3 bg-light rounded-4 hover-lift d-flex align-items-center gap-3">
                                        <div className={`bg-${item.color}-subtle text-${item.color} p-2 rounded-circle`}><i className="fas fa-play x-small"></i></div>
                                        <div className="flex-grow-1 min-w-0">
                                            <div className="fw-bold small text-truncate">{item.title}</div>
                                            <div className="x-small text-muted">{item.type} • {item.duration}</div>
                                        </div>
                                        <span className={`badge bg-${item.color}-subtle text-${item.color} border border-${item.color}-subtle rounded-pill x-small fw-bold`}>{item.status}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="btn btn-outline-warning w-100 mt-4 rounded-pill fw-bold small py-2"><i className="fas fa-graduation-cap me-2"></i>Ver Todo Mi Progreso</button>
                        </Card>
                    </div>
                </div>

                {/* RANKING Y RECONOCIMIENTOS */}
                <div className="row g-4">
                    <div className="col-12">
                        <Card title={<><i className="fas fa-fire-alt text-danger me-2"></i>Top Sellers del Mes (Hall of Fame)</>}>
                            <div className="row g-4 text-center mt-2">
                                {[
                                    { name: 'María López', sales: '$245k', pos: '1', color: 'bg-warning', emoji: '🥇' },
                                    { name: 'Carlos Ruiz', sales: '$180k', pos: '2', color: 'bg-secondary', emoji: '🥈' },
                                    { name: 'Tú', sales: '$124k', pos: '3', color: 'bg-info', emoji: '🥉' },
                                    { name: 'Ana García', sales: '$98k', pos: '4', color: 'bg-light', emoji: '' }
                                ].map((s, i) => (
                                    <div key={i} className="col-6 col-md-3">
                                        <div className={`p-4 rounded-4 border ${s.name==='Tú'?'border-primary shadow-sm active-seller':'border-light'} hover-lift h-100`}>
                                            <div className="position-relative mb-3 d-inline-block">
                                                <img src={`https://ui-avatars.com/api/?name=${s.name.replace(' ','+')}&background=random&size=60`} className="rounded-circle border border-4 border-white shadow-sm" width="60" alt="av"/>
                                                {s.emoji && <div className="position-absolute top-0 end-0 bg-white rounded-circle shadow-sm" style={{width:'22px',height:'22px',fontSize:'12px',display:'flex',justifyContent:'center',alignItems:'center'}}>{s.emoji}</div>}
                                            </div>
                                            <div className="fw-bold small">{s.name}</div>
                                            <div className="h5 fw-extrabold text-primary mb-1">{s.sales}</div>
                                            <div className="x-small text-muted fw-bold">Posición #{s.pos}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    // --- ADMIN ROLE VIEW (RECORDS AND MANAGEMENT) ---
    return (
        <div className="container-fluid p-0 hr-page">
            <div className="info-section mb-5">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h2 className="display-6 fw-bold text-gradient">Recursos Humanos</h2>
                        <p className="text-muted fs-5 m-0">Gestión integral de personal, nómina y capital humano.</p>
                    </div>
                    <div className="d-flex gap-2">
                        <button className="btn btn-outline-primary fw-bold px-4 rounded-pill" onClick={() => addNotification({ title: 'Reporte HR', text: 'Generando reporte de personal...', type: 'info' })}>
                            <i className="fas fa-download me-2"></i>Exportar
                        </button>
                        <button className="btn btn-primary fw-bold px-4 rounded-pill shadow-sm" onClick={() => setIsModalOpen(true)}>
                            <i className="fas fa-user-plus me-2"></i>Nuevo Empleado
                        </button>
                    </div>
                </div>
            </div>

            {/* KPI SUMMARY CARDS */}
            <div className="row g-4 mb-5">
                {[
                    { title: 'Total Empleados', val: (employees||[]).length || 21, sub: 'Activos en nómina', icon: 'fa-users', color: 'border-primary', trend: 'up' },
                    { title: 'Tasa Asistencia', val: '92%', sub: 'Promedio del mes', icon: 'fa-calendar-check', color: 'border-success', trend: 'up' },
                    { title: 'Vacantes Abiertas', val: '3', sub: 'Reclutamiento activo', icon: 'fa-user-tie', color: 'border-warning', trend: 'neutral' },
                    { title: 'Nómina Mensual', val: '$388K', sub: 'Gasto total de personal', icon: 'fa-money-bill-wave', color: 'border-info', trend: 'neutral' }
                ].map((card, i) => (
                    <div key={i} className="col-6 col-xl-3">
                        <div className={`card border-0 shadow-sm rounded-4 border-start border-4 ${card.color} h-100`}>
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="bg-light rounded-3 p-2"><i className={`fas ${card.icon} text-primary`}></i></div>
                                    <span className={`badge rounded-pill small ${card.trend==='up'?'bg-success-subtle text-success':card.trend==='down'?'bg-danger-subtle text-danger':'bg-secondary-subtle text-secondary'}`}>{card.trend==='up'?'↑ Bien':card.trend==='down'?'↓ Atención':'→ Estable'}</span>
                                </div>
                                <div className="h4 fw-extrabold text-dark mb-1">{card.val}</div>
                                <div className="small fw-bold text-muted text-uppercase" style={{fontSize:'10px'}}>{card.title}</div>
                                <div className="x-small text-muted">{card.sub}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* KPI MODULE */}
            <div className="row mb-5">
                <div className="col-12 col-xl-8 mx-auto">
                    <KpiModule title="Tasa de Rotación de Personal" value={kpi?.turnover || '--'} unit="%" description="Eficiencia del Capital Humano" formula="Rot. RRHH = (Bajas / Promedio Empleados) * 100" interpretation="Frecuencia con la que empleados abandonan la empresa." icon="fas fa-users-slash" color="purple"/>
                </div>
            </div>

            {/* EMPLOYEE TABLE */}
            <div className="row mt-2 mb-5">
                <div className="col-12">
                    <Card title={<><i className="fas fa-users text-primary me-2"></i>Listado de Personal Activo</>} noPadding>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr className="small text-muted text-uppercase tracking-wider">
                                        <th className="ps-4">Nombre Completo</th>
                                        <th>Departamento</th>
                                        <th>Fecha de Ingreso</th>
                                        <th>Rendimiento</th>
                                        <th>Estado</th>
                                        <th className="pe-4 text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(employees||[]).length === 0 && (
                                        <tr><td colSpan={6} className="p-5 text-center text-muted"><i className="fas fa-users-slash display-4 opacity-25 d-block mb-3"></i>Sin empleados registrados. Agrega el primero.</td></tr>
                                    )}
                                    {(employees || []).map((emp, idx) => (
                                        <tr key={emp.id || `emp-${idx}`}>
                                            <td className="ps-4">
                                                <div className="d-flex align-items-center gap-3">
                                                    <img src={`https://ui-avatars.com/api/?name=${(emp.name||'E').replace(' ','+')}&background=random&size=35`} className="rounded-circle" width="35" alt="av"/>
                                                    <span className="fw-bold">{emp.name || 'Empleado'}</span>
                                                </div>
                                            </td>
                                            <td><span className="badge bg-secondary-subtle text-secondary border rounded-pill px-3">{emp.department || 'General'}</span></td>
                                            <td className="text-muted small">{emp.hiredAt ? new Date(emp.hiredAt).toLocaleDateString() : '--/--/--'}</td>
                                            <td style={{minWidth:'150px'}}>
                                                <div className="d-flex align-items-center gap-2 mb-1">
                                                    <div className="flex-grow-1 bg-light rounded-pill overflow-hidden border" style={{height:'6px'}}><div className="bg-success h-100" style={{width:'85%'}}></div></div>
                                                    <span className="x-small fw-extrabold text-success">85%</span>
                                                </div>
                                            </td>
                                            <td><span className={`badge rounded-pill px-3 py-2 fw-bold border ${emp.status==='ACTIVE'?'bg-success-subtle text-success border-success-subtle':'bg-danger-subtle text-danger border-danger-subtle'}`} style={{fontSize:'10px'}}>{(emp.status||'INACTIVE').toUpperCase()}</span></td>
                                            <td className="pe-4 text-end">
                                                <div className="d-flex gap-2 justify-content-end">
                                                    <button className="btn btn-light btn-sm rounded-circle p-2 hover-lift" title="Ver perfil"><i className="fas fa-eye text-primary"></i></button>
                                                    <button className="btn btn-light btn-sm rounded-circle p-2 hover-lift" title="Nómina"><i className="fas fa-file-invoice-dollar text-success"></i></button>
                                                    <button className="btn btn-light btn-sm rounded-circle p-2 hover-lift" title="Editar"><i className="fas fa-edit text-info"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>

            {/* NEW EMPLOYEE MODAL */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Colaborador">
                <form onSubmit={handleAddEmployee} className="row g-4 p-2">
                    <div className="col-12"><label className="form-label fw-bold">Nombre Completo</label><input name="name" required className="form-control rounded-3" placeholder="Ej: Juan Perez"/></div>
                    <div className="col-12"><label className="form-label fw-bold">Estado Inicial</label><select name="status" className="form-select rounded-3"><option value="ACTIVE">Activo</option><option value="INACTIVE">Baja</option></select></div>
                    <div className="col-12 mt-4 text-end"><button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-light px-4 me-2 rounded-pill">Cancelar</button><button type="submit" className="btn btn-primary px-5 fw-bold rounded-pill shadow-sm">Guardar</button></div>
                </form>
            </Modal>

            {/* PIPELINE DE RECLUTAMIENTO */}
            <div className="card border-0 shadow-sm overflow-hidden mb-5">
                <div className="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold m-0 d-flex align-items-center gap-2"><i className="fas fa-user-tie text-success"></i> Pipeline de Reclutamiento Activo</h5>
                    <button className="btn btn-success btn-sm rounded-pill px-4 fw-bold" onClick={() => addNotification({ title: 'Vacante Publicada', text: 'Oferta enviada a portales.', type: 'success' })}><i className="fas fa-plus me-2"></i>Nueva Vacante</button>
                </div>
                <div className="card-body p-4">
                    <div className="row g-3">
                        {[{ stage: 'Aplicaciones', count: 34, color: '#6c757d', list: ['Roberto H.', 'Laura M.', '+32 más'] }, { stage: 'Filtro CV', count: 18, color: '#0dcaf0', list: ['Sandra P.', 'Diego A.', '+16 más'] }, { stage: 'Entrevista HR', count: 8, color: '#ffc107', list: ['Juan R.', 'Valeria T.', '+6 más'] }, { stage: 'Prueba Técnica', count: 4, color: '#fd7e14', list: ['Mónica L.', 'Óscar V.', '+2 más'] }, { stage: 'Oferta Enviada', count: 2, color: '#198754', list: ['Carla N.', 'Fernando G.'] }].map((s, i) => (
                            <div key={i} className="col-12 col-md-6 col-xl">
                                <div className="p-3 rounded-4 border h-100 hover-lift" style={{ borderLeft: `4px solid ${s.color}` }}>
                                    <div className="small fw-bold text-muted text-uppercase mb-2">{s.stage}</div>
                                    <div className="h4 fw-extrabold mb-1" style={{ color: s.color }}>{s.count}</div>
                                    <div className="x-small text-muted mb-3">candidatos</div>
                                    <div className="d-grid gap-1">{s.list.map((c, j) => <div key={j} className="x-small bg-light rounded-3 px-2 py-1 text-muted fw-bold"><i className="fas fa-user me-1 opacity-50"></i>{c}</div>)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* TRAINING + ATTENDANCE (ADMIN VIEW) */}
            <div className="row g-4 mb-5">
                <div className="col-12 col-lg-7">
                    <Card title={<><i className="fas fa-graduation-cap text-primary me-2"></i> Academia de Capacitación Interna</>} extra={<span className="badge bg-primary rounded-pill">4 Cursos Activos</span>}>
                        <div className="d-grid gap-3">
                            {[{ title: 'ERP System Mastery', instructor: 'Dpt. TI', enrolled: 12, progress: 78, color: 'bg-primary', icon: 'fa-laptop-code', status: 'En Curso' }, { title: 'Técnicas de Negociación Avanzadas', instructor: 'Gerencia Ventas', enrolled: 8, progress: 45, color: 'bg-success', icon: 'fa-handshake', status: 'En Curso' }, { title: 'Manejo de Inventario y Logística', instructor: 'Operaciones', enrolled: 6, progress: 100, color: 'bg-warning', icon: 'fa-boxes', status: 'Completado' }, { title: 'Seguridad de la Información (ISO 27001)', instructor: 'TI Externo', enrolled: 21, progress: 20, color: 'bg-danger', icon: 'fa-shield-alt', status: 'Iniciando' }].map((course, idx) => (
                                <div key={idx} className="p-3 bg-light rounded-4 hover-lift">
                                    <div className="d-flex align-items-center gap-3 mb-2">
                                        <div className={`${course.color} text-white p-2 rounded-3 flex-shrink-0`}><i className={`fas ${course.icon} small`}></i></div>
                                        <div className="flex-1 min-w-0"><div className="fw-bold small text-dark">{course.title}</div><div className="x-small text-muted">{course.instructor} · <span className="fw-bold">{course.enrolled} inscritos</span></div></div>
                                        <span className={`badge rounded-pill fw-bold x-small flex-shrink-0 ${course.progress === 100 ? 'bg-success text-white' : course.progress >= 50 ? 'bg-primary text-white' : 'bg-warning text-dark'}`}>{course.status}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2"><div className="progress flex-1 rounded-pill" style={{ height: '6px' }}><div className={`progress-bar ${course.color}`} style={{ width: `${course.progress}%`, transition: 'width 1s' }}></div></div><span className="x-small fw-extrabold text-muted">{course.progress}%</span></div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
                <div className="col-12 col-lg-5">
                    <Card title={<><i className="fas fa-calendar-check text-info me-2"></i> Asistencia del Mes</>} className="h-100" extra={<span className="badge bg-info rounded-pill">Mar 2026</span>}>
                        <div className="text-center mb-4">
                            <div className="position-relative d-inline-flex align-items-center justify-content-center" style={{ width: '120px', height: '120px' }}>
                                <svg width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" fill="none" stroke="#f0f0f0" strokeWidth="10"/><circle cx="60" cy="60" r="50" fill="none" stroke="#0d6efd" strokeWidth="10" strokeDasharray={`${2*Math.PI*50*0.92} ${2*Math.PI*50*0.08}`} strokeLinecap="round" transform="rotate(-90 60 60)"/></svg>
                                <div className="position-absolute text-center"><div className="h5 fw-extrabold text-primary m-0">92%</div><div className="x-small text-muted">Asistencia</div></div>
                            </div>
                        </div>
                        <div className="d-grid gap-2">
                            {[{ label: 'Empleados Puntuales', val: 19, icon: 'fa-check-circle', color: 'text-success' }, { label: 'Tardanzas Registradas', val: 3, icon: 'fa-clock', color: 'text-warning' }, { label: 'Faltas Justificadas', val: 2, icon: 'fa-file-medical', color: 'text-info' }, { label: 'Faltas Injustificadas', val: 0, icon: 'fa-times-circle', color: 'text-danger' }].map((item, idx) => (
                                <div key={idx} className="d-flex justify-content-between align-items-center p-2 bg-light rounded-3"><span className="small text-muted"><i className={`fas ${item.icon} me-2 ${item.color}`}></i>{item.label}</span><span className={`fw-extrabold small ${item.color}`}>{item.val}</span></div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* HISTORIAL DE NOMINA + ALERTAS (ADMIN VIEW) */}
            <div className="row g-4 mb-5">
                <div className="col-12 col-lg-8">
                    <Card title={<><i className="fas fa-money-check-alt text-warning me-2"></i> Historial de Dispersiones de Nómina</>} noPadding>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light"><tr className="small text-muted text-uppercase"><th className="ps-4">Período</th><th>Empleados</th><th>Total Bruto</th><th>Deducciones</th><th>Neto</th><th className="pe-4 text-end">Estado</th></tr></thead>
                                <tbody>
                                    {[{ period: 'Mar 2026 (1Q)', emp: 21, gross: 194250, deductions: 38850, net: 155400, status: 'Dispersada' }, { period: 'Feb 2026 (2Q)', emp: 21, gross: 194250, deductions: 37100, net: 157150, status: 'Dispersada' }, { period: 'Feb 2026 (1Q)', emp: 20, gross: 185000, deductions: 35150, net: 149850, status: 'Dispersada' }, { period: 'Ene 2026 (2Q)', emp: 20, gross: 185000, deductions: 36200, net: 148800, status: 'Dispersada' }, { period: 'Mar 2026 (2Q)', emp: 21, gross: 194250, deductions: 0, net: 0, status: 'Pendiente' }].map((row, idx) => (
                                        <tr key={idx}>
                                            <td className="ps-4 fw-bold small">{row.period}</td>
                                            <td className="small text-muted">{row.emp} personas</td>
                                            <td className="fw-bold small">${row.gross.toLocaleString()}</td>
                                            <td className="small text-danger">-${row.deductions.toLocaleString()}</td>
                                            <td className="fw-extrabold text-primary">{row.status === 'Pendiente' ? '—' : `$${row.net.toLocaleString()}`}</td>
                                            <td className="pe-4 text-end"><span className={`badge rounded-pill px-3 py-2 fw-bold border ${row.status === 'Dispersada' ? 'bg-success-subtle text-success border-success-subtle' : 'bg-warning-subtle text-warning border-warning-subtle'}`}>{row.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
                <div className="col-12 col-lg-4">
                    <Card title={<><i className="fas fa-bell text-danger me-2"></i> Alertas de RR.HH.</>} className="h-100">
                        <div className="d-grid gap-3">
                            {[{ icon: 'fa-birthday-cake', bg: 'text-danger bg-danger-subtle', title: 'Aniversarios esta semana', desc: 'Carlos R. — 5 años el Jue 13 Mar.', urgent: false }, { icon: 'fa-file-signature', bg: 'text-warning bg-warning-subtle', title: 'Contratos por Vencer', desc: '2 contratos expiran en 30 días.', urgent: true }, { icon: 'fa-user-clock', bg: 'text-info bg-info-subtle', title: 'Evaluaciones Pendientes', desc: '4 evaluaciones de desempeño Q1.', urgent: false }, { icon: 'fa-first-aid', bg: 'text-success bg-success-subtle', title: 'Certificados Médicos', desc: 'Sofía V. requiere renovación.', urgent: false }].map((a, idx) => (
                                <div key={idx} className={`d-flex align-items-start gap-3 p-3 bg-light rounded-4 hover-lift ${a.urgent ? 'border border-warning' : ''}`}>
                                    <div className={`${a.bg} rounded-3 p-2 flex-shrink-0`}><i className={`fas ${a.icon} small`}></i></div>
                                    <div className="flex-1"><div className="small fw-bold">{a.title}</div><div className="x-small text-muted">{a.desc}</div></div>
                                    {a.urgent && <span className="badge bg-warning text-dark x-small rounded-pill">Urgente</span>}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* KPIs AVANZADOS (ADMIN VIEW) */}
            <div className="card border-0 shadow-sm mb-5 rounded-4">
                <div className="card-header bg-white border-0 p-4"><h5 className="fw-bold m-0 d-flex align-items-center gap-2"><i className="fas fa-chart-bar text-primary"></i> KPIs de Capital Humano — Q1 2026</h5></div>
                <div className="card-body p-4">
                    <div className="row g-4 text-center">
                        {[{ metric: 'Costo por Contratación', val: '$8,400', icon: 'fa-dollar-sign', color: 'text-primary', trend: 'down', lbl: 'Atención' }, { metric: 'Tiempo de Adaptación (Onboarding)', val: '18 días', icon: 'fa-stopwatch', color: 'text-info', trend: 'up', lbl: 'Mejorando' }, { metric: 'Satisfacción Interna (eNPS)', val: '4.6/5', icon: 'fa-smile', color: 'text-success', trend: 'up', lbl: 'Mejorando' }, { metric: 'Rotación Voluntaria', val: '3.8%', icon: 'fa-door-open', color: 'text-warning', trend: 'right', lbl: 'Estable' }, { metric: 'Hrs de Capacitación', val: '420 hrs', icon: 'fa-book-open', color: 'text-danger', trend: 'up', lbl: 'Mejorando' }].map((kpi, idx) => (
                            <div key={idx} className="col-6 col-md-4 col-xl">
                                <div className="p-4 bg-light rounded-4 hover-lift h-100">
                                    <i className={`fas ${kpi.icon} fs-4 ${kpi.color} mb-2`}></i>
                                    <div className="h5 fw-extrabold text-dark m-0">{kpi.val}</div>
                                    <div className="x-small text-muted fw-bold text-uppercase mt-1">{kpi.metric}</div>
                                    <div className={`x-small fw-bold mt-2 ${kpi.trend === 'up' ? 'text-success' : kpi.trend === 'down' ? 'text-danger' : 'text-muted'}`}><i className={`fas fa-arrow-${kpi.trend} me-1`}></i>{kpi.lbl}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* DISTRIBUCIÓN POR DEPARTAMENTO & BIENESTAR (ADMIN VIEW) */}
            <div className="row g-4 mb-5">
                <div className="col-12 col-md-6">
                    <Card title={<><i className="fas fa-sitemap text-primary me-2"></i> Estructura Organizacional por Depto.</>}>
                        <div className="d-grid gap-3">
                            {[
                                { dept: 'Tecnología & IT', count: 8, pct: 38, color: 'bg-primary' },
                                { dept: 'Ventas & Marketing', count: 6, pct: 28, color: 'bg-success' },
                                { dept: 'Operaciones & Logística', count: 4, pct: 19, color: 'bg-warning' },
                                { dept: 'Administración & RRHH', count: 3, pct: 15, color: 'bg-info' }
                            ].map((d, i) => (
                                <div key={i}>
                                    <div className="d-flex justify-content-between x-small fw-bold mb-1">
                                        <span>{d.dept}</span>
                                        <span>{d.count} colaboradores ({d.pct}%)</span>
                                    </div>
                                    <div className="progress rounded-pill" style={{height:'8px'}}>
                                        <div className={`progress-bar ${d.color} progress-bar-striped`} style={{width: `${d.pct}%`}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
                <div className="col-12 col-md-6">
                    <Card title={<><i className="fas fa-heartbeat text-danger me-2"></i> Gestión de Beneficios & Clima</>} extra={<span className="badge bg-danger rounded-pill x-small">94% Cobertura</span>}>
                        <div className="row g-2">
                            {[
                                { b: 'Seguro Gastos Médicos Mayores', status: 'Activo', icon: 'fa-ambulance' },
                                { b: 'Plan de Retiro Corporativo', status: 'Activo', icon: 'fa-piggy-bank' },
                                { b: 'Bono Trimestral KPI', status: 'En revisión', icon: 'fa-coins' },
                                { b: 'Vales de Despensa (Card)', status: 'Activo', icon: 'fa-shopping-basket' },
                                { b: 'Membresía Wellness', status: 'Nuevo', icon: 'fa-dumbbell' },
                                { b: 'Home Office Flexible', status: 'Activo', icon: 'fa-home' }
                            ].map((ben, i) => (
                                <div key={i} className="col-6">
                                    <div className="p-2 border rounded-3 bg-light d-flex align-items-center gap-2">
                                        <i className={`fas ${ben.icon} x-small text-muted`}></i>
                                        <div className="flex-1 min-w-0">
                                            <div className="xx-small fw-bold text-truncate">{ben.b}</div>
                                            <div className={`xx-small ${ben.status==='Activo'?'text-success':'text-warning'} fw-bold`}>{ben.status}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* EVENTOS INTERNOS & RECONOCIMIENTO (ADMIN VIEW) */}
            <div className="row g-4 mb-5">
                <div className="col-12 col-lg-7">
                    <Card title={<><i className="fas fa-calendar-alt text-primary me-2"></i> Próximos Eventos & Milestones</>}>
                        <div className="timeline-hr px-2">
                            {[
                                { date: '15 Mar', event: 'Dispersión de Nómina 1Q', type: 'Finanzas', color: 'bg-success' },
                                { date: '18 Mar', event: 'Town Hall Trimestral', type: 'Corporativo', color: 'bg-primary' },
                                { date: '21 Mar', event: 'Integración Team Building', type: 'Cultura', color: 'bg-warning' },
                                { date: '25 Mar', event: 'Cierre de Evaluaciones Q1', type: 'HR Admin', color: 'bg-danger' }
                            ].map((ev, i) => (
                                <div key={i} className="d-flex gap-3 mb-3 border-start border-2 border-primary border-opacity-25 ps-3 position-relative">
                                    <div className={`position-absolute start-0 top-0 translate-middle-x rounded-circle ${ev.color}`} style={{width:'8px', height:'8px', marginLeft:'-1px', marginTop:'6px'}}></div>
                                    <div className="fw-extrabold small text-primary" style={{minWidth:'50px'}}>{ev.date}</div>
                                    <div>
                                        <div className="fw-bold small">{ev.event}</div>
                                        <div className="xx-small text-muted fw-bold text-uppercase">{ev.type}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-light btn-sm w-100 rounded-pill mt-2 fw-bold text-primary">Ver Calendario Completo</button>
                    </Card>
                </div>
                <div className="col-12 col-lg-5">
                    <Card title={<><i className="fas fa-crown text-warning me-2"></i> Employee Recognition Spotlight</>} className="bg-gradient-dark-blue text-white overflow-hidden position-relative border-0 shadow-lg">
                        <i className="fas fa-award position-absolute end-0 bottom-0 opacity-10 m-n3" style={{fontSize:'120px'}}></i>
                        <div className="text-center py-3">
                            <div className="position-relative d-inline-block mb-3">
                                <img src="https://ui-avatars.com/api/?name=Sandra+Perez&background=random&size=80" className="rounded-circle border border-4 border-accent shadow-lg" width="80" alt="emp"/>
                                <div className="position-absolute bottom-0 end-0 bg-accent text-dark rounded-circle shadow-sm" style={{width:'28px',height:'28px',display:'flex',justifyContent:'center',alignItems:'center'}}><i className="fas fa-star small"></i></div>
                            </div>
                            <h5 className="fw-bold mb-1">Sandra Pérez</h5>
                            <p className="small text-white-50 mb-3 text-uppercase tracking-widest">Seniors Sales Executive</p>
                            <div className="p-3 bg-white bg-opacity-10 rounded-4 border border-white border-opacity-10 text-start">
                                <div className="xx-small text-accent fw-bold text-uppercase mb-1">Logro Destacado</div>
                                <div className="small italic lh-sm">"Por superar la meta de ventas anual en tiempo récord y liderar la capacitación de los nuevos integrantes del equipo."</div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default RH;
