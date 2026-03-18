import { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/Card/card';

const Docs = () => {
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const [openFaq, setOpenFaq] = useState(null);
    const [docSearch, setDocSearch] = useState('');

    const handleDownload = (e, filename) => {
        e.preventDefault();
        addNotification({ title: 'Descarga Iniciada', text: `Descargando "${filename}"...`, type: 'info' });
        setTimeout(() => {
            addNotification({ title: 'Descarga Completa', text: `"${filename}" guardado exitosamente.`, type: 'success' });
        }, 2000);
    };

    const isAdmin = user?.role === 'admin';
    const isSeller = user?.role === 'seller';

    // ─── DOCUMENT LIBRARIES ───────────────────────────────────────────────────
    const adminDocs = [
        { name: 'Arquitectura del Sistema.pdf', desc: 'Diagramas de red y servicios (v1.2)', size: '3.5MB', tag: 'Infraestructura' },
        { name: 'Esquema de Base de Datos.pdf', desc: 'Relaciones y diccionarios de datos', size: '1.2MB', tag: 'BD' },
        { name: 'Manual de Seguridad & Auditoría.pdf', desc: 'Políticas de acceso y logs', size: '1.5MB', tag: 'Seguridad' },
        { name: 'Guía de Backup & Recovery.pdf', desc: 'Procedimientos de desastre', size: '2.1MB', tag: 'Operaciones' },
        { name: 'Política de Control de Accesos RBAC.pdf', desc: 'Roles, permisos y jerarquías', size: '0.8MB', tag: 'Seguridad' },
        { name: 'API Gateway — Referencia Completa.pdf', desc: 'Todos los endpoints, headers y payloads', size: '4.2MB', tag: 'API' },
        { name: 'Guía de Integración ERP — SAP Connector.pdf', desc: 'Conectar DuiTech ERP con SAP', size: '2.9MB', tag: 'Integración' },
        { name: 'Plan de Continuidad de Negocio (BCP).pdf', desc: 'Protocolo ante fallas críticas', size: '1.7MB', tag: 'Operaciones' },
    ];

    const sellerDocs = [
        { name: 'Manual Maestro de Ventas (POS).pdf', desc: 'Uso avanzado de la terminal', size: '2.2MB', tag: 'POS' },
        { name: 'Estrategias de Cierre 2026.pdf', desc: 'Técnicas y promociones vigentes', size: '0.9MB', tag: 'Ventas' },
        { name: 'Guía de Manejo de Objeciones.pdf', desc: 'Respuestas pre-aprobadas', size: '1.1MB', tag: 'Ventas' },
        { name: 'Catálogo de Incentivos.pdf', desc: 'Bonos y metas trimestrales', size: '0.4MB', tag: 'Comisiones' },
        { name: 'Deck de Presentación Corporativa Q1 2026.pptx', desc: 'Slides actualizadas para clientes', size: '6.1MB', tag: 'Marketing' },
        { name: 'Guía de Onboarding de Nuevos Clientes.pdf', desc: 'Pasos para alta y activación de cuenta', size: '1.3MB', tag: 'Clientes' },
        { name: 'Script de Llamada en Frío (Cold Call).pdf', desc: 'Guiones aprobados por dirección', size: '0.5MB', tag: 'Ventas' },
        { name: 'Brochure DuiTech 2026 — Alta Resolución.pdf', desc: 'Imprimible para ferias y eventos', size: '8.4MB', tag: 'Marketing' },
    ];

    const clientDocs = [
        { name: 'Guía de Inicio Rápido.pdf', desc: 'Tour por el portal de cliente', size: '1.4MB', tag: 'Onboarding' },
        { name: 'Políticas de Garantía & Devolución.pdf', desc: 'Términos de servicio oficiales', size: '0.6MB', tag: 'Legal' },
        { name: 'Manual de Autogestión Financiera.pdf', desc: 'Cómo pagar y ver estados de cuenta', size: '1.1MB', tag: 'Finanzas' },
        { name: 'Ficha Técnica de Productos Gold.pdf', desc: 'Especificaciones completas', size: '3.3MB', tag: 'Catálogo' },
        { name: 'Tutorial: Cómo Solicitar una Cotización.pdf', desc: 'Paso a paso por el portal', size: '0.7MB', tag: 'Onboarding' },
        { name: 'Acuerdo de Nivel de Servicio (SLA).pdf', desc: 'Tiempos de respuesta garantizados', size: '0.5MB', tag: 'Legal' },
        { name: 'Reglamento de Puntos DuiPoints.pdf', desc: 'Cómo acumular y canjear', size: '0.3MB', tag: 'Beneficios' },
        { name: 'Lista de Precios Preferenciales Q1 2026.pdf', desc: 'Precios exclusivos para tu cuenta', size: '1.2MB', tag: 'Catálogo' },
    ];

    const currentDocs = isAdmin ? adminDocs : (isSeller ? sellerDocs : clientDocs);

    const filteredDocs = currentDocs.filter(d =>
        d.name.toLowerCase().includes(docSearch.toLowerCase()) ||
        d.tag.toLowerCase().includes(docSearch.toLowerCase())
    );

    // ─── FAQ DATA ─────────────────────────────────────────────────────────────
    const adminFaqs = [
        { q: '¿Cómo agrego un nuevo usuario al sistema?', a: 'Ve a Perfil → Gestión de Usuarios → "Invitar Usuario". Asigna el rol correspondiente (admin/seller/client) y envía la invitación por email.' },
        { q: '¿Cómo genero tokens de API para integraciones?', a: 'Accede a la sección "API & Webhooks" en el Panel de Administración. Selecciona "Generar Token", define el scope y tiempo de expiración.' },
        { q: '¿Dónde puedo ver los logs de auditoría?', a: 'En el menú Administración → Audit Trail. Filtra por usuario, fecha o tipo de acción. Los logs se retienen 90 días.' },
        { q: '¿Cómo conecto el ERP con un sistema externo (SAP/Odoo)?', a: 'Descarga la "Guía de Integración ERP" de la biblioteca. Utilizamos REST API + Webhooks. Consulta el endpoint /v1/integrations.' },
    ];

    const sellerFaqs = [
        { q: '¿Cómo aplico un descuento especial a un cliente?', a: 'En el módulo MySales → "Aplicar Descuento Autorizado". Los descuentos superiores al 15% requieren aprobación del gerente.' },
        { q: '¿Cuándo se liquidan mis comisiones?', a: 'Las comisiones validadas se liquidan el último día hábil de cada mes, directamente en tu cuenta bancaria registrada en RH.' },
        { q: '¿Cómo descargo la lista de precios actualizada?', a: 'Desde esta sección de Documentación o desde el módulo de Inventario → "Bajar Lista de Precios".' },
        { q: '¿Qué hago si un cliente reporta un producto defectuoso?', a: 'Genera un ticket desde el módulo de Soporte → "Nueva Incidencia" y selecciona la categoría "Garantía". El área técnica responde en 24h.' },
    ];

    const clientFaqs = [
        { q: '¿Cómo descargo mis facturas?', a: 'Ve a la sección Finanzas → "Mis Facturas". Puedes descargar en PDF o solicitar el envío por email a tu dirección registrada.' },
        { q: '¿Cómo solicito un aumento de línea de crédito?', a: 'En Finanzas → "Línea de Crédito" → "Solicitar Aumento". Tu ejecutivo recibirá la solicitud y te contactará en 48 hrs hábiles.' },
        { q: '¿Dónde veo el estado de mi pedido?', a: 'En la sección "Gestión de Órdenes" puedes ver el tracking completo de tus pedidos con su estado logístico en tiempo real.' },
        { q: '¿Cómo canjeo mis DuiPoints?', a: 'En el módulo de Perfil → "Mis Beneficios". Selecciona el producto o descuento a aplicar y confirma el canje.' },
    ];

    const currentFaqs = isAdmin ? adminFaqs : (isSeller ? sellerFaqs : clientFaqs);

    // ─── CHANGELOG ────────────────────────────────────────────────────────────
    const changelog = [
        { version: 'v2.3.0', date: 'Mar 2026', type: 'Feature', desc: 'Módulo de Flujo de Caja y Centro de Costos en Finanzas.' },
        { version: 'v2.2.1', date: 'Feb 2026', type: 'Fix', desc: 'Corrección de cálculo de comisiones para planes acelerados.' },
        { version: 'v2.2.0', date: 'Feb 2026', type: 'Feature', desc: 'Nuevo Dashboard Ejecutivo CRM y segmentación de cartera.' },
        { version: 'v2.1.0', date: 'Ene 2026', type: 'Improvement', desc: 'Glassmorphism UI redesign y rendimiento mejorado 40%.' },
    ];

    return (
        <div className="container-fluid p-0">
            {/* HEADER */}
            <div className="info-section mb-5">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <h2 className="display-6 fw-bold text-gradient">Documentación</h2>
                        <p className="text-muted fs-5 m-0">
                            {isAdmin ? 'Recursos técnicos, guías de seguridad y referencia de API.' :
                             isSeller ? 'Guías comerciales, material de marketing y herramientas de venta.' :
                             'Manuales de usuario, políticas y ayuda para clientes.'}
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <button className="btn btn-outline-primary rounded-pill px-4 fw-bold" onClick={() => addNotification({ title: 'Solicitud Enviada', text: 'Tu solicitud de documentación personalizada fue recibida.', type: 'success' })}>
                            <i className="fas fa-envelope me-2"></i>Solicitar Guía
                        </button>
                        {isAdmin && (
                            <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" onClick={() => addNotification({ title: 'Sincronizando', text: 'Actualizando biblioteca desde repositorio...', type: 'info' })}>
                                <i className="fas fa-cloud-download-alt me-2"></i>Sync Biblioteca
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* QUICK STATS */}
            <div className="row g-3 mb-5" data-aos="fade-up">
                {[
                    { label: 'Documentos Disponibles', val: currentDocs.length, icon: 'fa-file-alt', color: 'border-primary' },
                    { label: 'Videos Tutoriales', val: isAdmin ? 9 : isSeller ? 7 : 5, icon: 'fa-play-circle', color: 'border-info' },
                    { label: 'Última Actualización', val: 'Mar 2026', icon: 'fa-calendar-check', color: 'border-success' },
                    { label: 'Versión del Sistema', val: 'v2.3.0', icon: 'fa-code-branch', color: 'border-warning' },
                ].map((s, i) => (
                    <div key={i} className="col-6 col-md-3">
                        <div className={`card border-0 shadow-sm rounded-4 border-start border-4 ${s.color} h-100`}>
                            <div className="card-body p-3 d-flex align-items-center gap-3">
                                <div className="bg-light rounded-3 p-2"><i className={`fas ${s.icon} text-primary`}></i></div>
                                <div>
                                    <div className="fw-extrabold text-dark">{s.val}</div>
                                    <div className="x-small text-muted fw-bold text-uppercase">{s.label}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MAIN: DOCUMENT LIBRARY + RIGHT SIDEBAR */}
            <div className="row g-4 mb-5">
                <div className="col-12 col-lg-7" data-aos="fade-right">
                    <Card title={<><i className="fas fa-folder-open text-warning me-2"></i>Biblioteca de Documentos</>}
                        extra={
                            <div className="input-group input-group-sm" style={{ maxWidth: '200px' }}>
                                <span className="input-group-text bg-light border-0"><i className="fas fa-search text-muted"></i></span>
                                <input type="text" placeholder="Filtrar..." className="form-control border-0 bg-light rounded-end-3" value={docSearch} onChange={e => setDocSearch(e.target.value)} />
                            </div>
                        }
                    >
                        <div className="d-grid gap-3">
                            {filteredDocs.map((doc, idx) => (
                                <div key={idx} className="card border-0 bg-light rounded-4 hover-lift p-3 shadow-none border-start border-4 border-primary" data-aos="fade-up" data-aos-delay={idx * 50}>
                                    <a href="#" onClick={(e) => handleDownload(e, doc.name)} className="d-flex align-items-center gap-3 text-decoration-none w-100">
                                        <div className="bg-white p-2 rounded-circle text-danger shadow-sm flex-shrink-0">
                                            <i className={`fas ${doc.name.endsWith('.pptx') ? 'fa-file-powerpoint' : 'fa-file-pdf'}`}></i>
                                        </div>
                                        <div className="flex-grow-1 overflow-hidden">
                                            <div className="fw-bold text-dark small text-truncate">{doc.name}</div>
                                            <div className="x-small text-muted">{doc.desc} • {doc.size}</div>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <span className="badge bg-white text-dark border rounded-pill x-small">{doc.tag}</span>
                                            <div className="bg-primary-subtle text-primary p-2 rounded-circle x-small">
                                                <i className="fas fa-download"></i>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            ))}
                            {filteredDocs.length === 0 && (
                                <div className="text-center py-5 text-muted">
                                    <i className="fas fa-search fa-2x opacity-25 mb-3"></i>
                                    <div className="small fw-bold">No se encontraron documentos con ese filtro.</div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                <div className="col-12 col-lg-5" data-aos="fade-left">
                    <div className="d-grid gap-4">
                        {/* API & EXTERNAL RESOURCES */}
                        <Card title={<><i className="fas fa-code text-info me-2"></i>Recursos Externos & API</>}>
                            <div className="d-grid gap-3">
                                <div className="p-3 bg-light rounded-4">
                                    <span className="small d-block fw-bold text-muted text-uppercase mb-2 x-small">Swagger / OpenAPI UI</span>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <code className="text-primary fw-bold x-small">https://api.duitech.erp/v1/docs</code>
                                        <button className="btn btn-sm btn-link text-primary p-0 x-small fw-bold" onClick={() => addNotification({ title: 'API Docs', text: 'Abriendo Swagger UI en nueva pestaña...', type: 'info' })}>Ver <i className="fas fa-external-link-alt"></i></button>
                                    </div>
                                </div>

                                <div className="p-3 bg-light rounded-4">
                                    <span className="small d-block fw-bold text-muted text-uppercase mb-2 x-small">Sistema v2.3.0 Status</span>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="text-success fw-bold d-flex align-items-center gap-2 x-small">
                                            <span className="d-inline-block bg-success rounded-circle animate-pulse" style={{ width: '8px', height: '8px' }}></span>
                                            Todos los sistemas operativos
                                        </div>
                                        <span className="badge bg-white text-dark shadow-sm x-small border">99.9% Uptime</span>
                                    </div>
                                </div>

                                {isAdmin && (
                                    <div className="alert bg-dark text-white rounded-4 border-0 p-4 shadow-lg position-relative overflow-hidden">
                                        <i className="fas fa-terminal position-absolute end-0 bottom-0 display-4 opacity-10 m-3"></i>
                                        <h6 className="fw-bold text-accent mb-3"><i className="fas fa-key me-2"></i>Admin Cloud Shell</h6>
                                        <p className="x-small opacity-75 mb-3">Acceso seguro a la consola de administración en la nube.</p>
                                        <button className="btn btn-accent btn-sm w-100 rounded-pill fw-bold x-small shadow-sm" onClick={() => addNotification({ title: 'SSH', text: 'Conectando al servidor...', type: 'info' })}>Abrir Consola SSH</button>
                                    </div>
                                )}

                                {isSeller && (
                                    <div className="p-4 rounded-4 bg-primary-subtle border border-primary-subtle">
                                        <h6 className="fw-bold text-primary mb-2"><i className="fas fa-bullhorn me-2"></i>Material de Marketing</h6>
                                        <p className="x-small text-muted mb-3">Descarga assets aprobados para redes sociales, email y presentaciones.</p>
                                        <div className="d-grid gap-2">
                                            {['Kit de Logos (PNG/SVG)', 'Plantillas de Email HTML', 'Stories para Instagram'].map((asset, i) => (
                                                <button key={i} className="btn btn-light btn-sm rounded-pill fw-bold text-start border" onClick={() => addNotification({ title: 'Descarga', text: `Descargando ${asset}...`, type: 'info' })}>
                                                    <i className="fas fa-arrow-down text-primary me-2"></i>{asset}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {!isAdmin && !isSeller && (
                                    <div className="p-4 rounded-4 bg-success-subtle border border-success-subtle">
                                        <h6 className="fw-bold text-success mb-2"><i className="fas fa-headset me-2"></i>Centro de Ayuda Cliente</h6>
                                        <p className="x-small text-muted mb-3">Nuestro equipo está disponible Lunes-Viernes 8am-8pm.</p>
                                        <button className="btn btn-success btn-sm w-100 rounded-pill fw-bold" onClick={() => addNotification({ title: 'Soporte', text: 'Iniciando chat con un agente...', type: 'success' })}>Iniciar Chat de Soporte</button>
                                    </div>
                                )}

                                <div className="card border-0 bg-primary-subtle rounded-4 p-4">
                                    <h6 className="fw-bold text-primary mb-2"><i className="fas fa-lightbulb me-2"></i>¿No encuentras algo?</h6>
                                    <p className="x-small text-primary opacity-75 mb-3">Si necesitas una guía personalizada o entrenamiento, contacta a soporte.</p>
                                    <button className="btn btn-primary btn-sm rounded-pill fw-bold x-small" onClick={() => addNotification({ title: 'Soporte', text: 'Redirigiendo a tickets de soporte...', type: 'info' })}>Ir a Soporte</button>
                                </div>
                            </div>
                        </Card>

                        {/* INTEGRATION STATUS (Admin Only) */}
                        {isAdmin && (
                            <Card title={<><i className="fas fa-plug text-success me-2"></i>Estado de Integraciones</>}>
                                <div className="d-grid gap-3">
                                    {[
                                        { name: 'SAP ERP Connector', status: 'Activo', color: 'success', uptime: '100%' },
                                        { name: 'Stripe Payments API', status: 'Activo', color: 'success', uptime: '99.9%' },
                                        { name: 'Sendgrid Email Service', status: 'Activo', color: 'success', uptime: '99.8%' },
                                        { name: 'Google Analytics 4', status: 'Mantenimiento', color: 'warning', uptime: '98.2%' },
                                        { name: 'WhatsApp Business API', status: 'Inactivo', color: 'danger', uptime: '—' },
                                    ].map((int, i) => (
                                        <div key={i} className="d-flex justify-content-between align-items-center p-2 bg-light rounded-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <span className={`d-inline-block bg-${int.color} rounded-circle flex-shrink-0`} style={{ width: '8px', height: '8px' }}></span>
                                                <span className="small fw-bold">{int.name}</span>
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="x-small text-muted">{int.uptime}</span>
                                                <span className={`badge x-small rounded-pill bg-${int.color}-subtle text-${int.color} border border-${int.color}-subtle`}>{int.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* FAQ ACCORDION */}
            <div className="mb-5">
                <h5 className="fw-bold mb-4"><i className="fas fa-question-circle text-primary me-2"></i>Preguntas Frecuentes (FAQ)</h5>
                <div className="row g-3">
                    {currentFaqs.map((faq, i) => (
                        <div key={i} className="col-12 col-lg-6" data-aos="zoom-in" data-aos-delay={i * 100}>
                            <div className={`card border-0 rounded-4 shadow-sm overflow-hidden ${openFaq === i ? 'border border-primary' : ''}`}
                                style={{ cursor: 'pointer' }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                <div className="card-body p-3">
                                    <div className="d-flex justify-content-between align-items-start gap-2">
                                        <span className="fw-bold small">{faq.q}</span>
                                        <i className={`fas fa-chevron-${openFaq === i ? 'up' : 'down'} text-primary flex-shrink-0 mt-1`}></i>
                                    </div>
                                    {openFaq === i && (
                                        <div className="mt-3 pt-3 border-top x-small text-muted">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-12 col-xl-8">
                    {/* VIDEO TUTORIALS */}
                    <h5 className="fw-bold mb-4"><i className="fas fa-play-circle text-danger me-2"></i>Tutoriales en Video</h5>
                    <div className="row g-4" data-aos="fade-up">
                        {(isAdmin ? [
                            { title: 'Primeros Pasos ERP Admin', dur: '4:15m', badge: 'Onboarding' },
                            { title: 'Gestión de Usuarios y Roles', dur: '3:20m', badge: 'Seguridad' },
                            { title: 'Generación de Reportes PDF', dur: '2:45m', badge: 'Reportes' },
                            { title: 'Configurar Webhooks & API Keys', dur: '5:10m', badge: 'API' }
                        ] : isSeller ? [
                            { title: 'Primeros Pasos en POS', dur: '4:15m', badge: 'POS' },
                            { title: 'Optimización de Búsqueda', dur: '2:30m', badge: 'Inventario' },
                            { title: 'Cierre de Venta Consultiva', dur: '6:00m', badge: 'Ventas' },
                            { title: 'Revisión de Comisiones', dur: '3:10m', badge: 'Finanzas' }
                        ] : [
                            { title: 'Primeros Pasos: Tu Portal', dur: '3:00m', badge: 'Onboarding' },
                            { title: 'Descarga de Facturas', dur: '1:50m', badge: 'Finanzas' },
                            { title: 'Rastreo de Pedidos', dur: '2:30m', badge: 'Órdenes' },
                            { title: 'Canjear DuiPoints', dur: '2:10m', badge: 'Beneficios' }
                        ]).map((v, i) => (
                            <div key={i} className="col-12 col-md-6">
                                <div className="card border-0 bg-white shadow-sm rounded-4 overflow-hidden hover-lift">
                                    <div className="ratio ratio-16x9 bg-dark d-flex align-items-center justify-content-center position-relative overflow-hidden">
                                        <div className="position-absolute inset-0 d-flex align-items-center justify-content-center">
                                            <i className="fas fa-play-circle fa-2x text-white opacity-50"></i>
                                        </div>
                                        <span className="position-absolute bottom-0 end-0 m-2 badge bg-dark text-white x-small">{v.dur}</span>
                                        <span className="position-absolute top-0 start-0 m-2 badge bg-primary rounded-pill x-small">{v.badge}</span>
                                    </div>
                                    <div className="card-body p-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="fw-bold small text-truncate pe-2">{v.title}</span>
                                            <button className="btn btn-primary btn-sm rounded-pill fw-bold x-small px-3 flex-shrink-0" onClick={() => addNotification({ title: 'Video', text: `Abriendo "${v.title}"...`, type: 'info' })}>Ver</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-12 col-xl-4">
                    {/* SUPPORT TICKETS AREA - NEW CONTENT */}
                    <div className="d-flex justify-content-between align-items-end mb-4">
                        <h5 className="fw-bold mb-0"><i className="fas fa-life-ring text-warning me-2"></i>Soporte Directo</h5>
                    </div>
                    <Card className="h-100 border-warning border-start border-4 bg-light" data-aos="fade-left">
                        <div className="d-grid gap-3">
                            <div className="p-3 bg-white rounded-4 shadow-sm border border-light">
                                <h6 className="fw-bold mb-1 small text-dark">Ticket #4092</h6>
                                <p className="xx-small text-muted mb-2">Comisión de Venta V-3912 no reflejada en el corte.</p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="badge bg-warning-subtle text-warning border-warning-subtle x-small rounded-pill">En Revisión</span>
                                    <span className="xx-small text-muted fw-bold">Actualizado hace 2h</span>
                                </div>
                            </div>
                            <div className="p-3 bg-white rounded-4 shadow-sm border border-light opacity-75">
                                <h6 className="fw-bold mb-1 small text-dark">Ticket #4010</h6>
                                <p className="xx-small text-muted mb-2">Solicitud de descuento &gt; 15% para Mayorista MTY.</p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="badge bg-success-subtle text-success border-success-subtle x-small rounded-pill">Cerrado</span>
                                    <span className="xx-small text-muted fw-bold">Hace 3 días</span>
                                </div>
                            </div>
                            
                            <button className="btn btn-warning text-dark fw-bold rounded-pill w-100 shadow-sm mt-3" onClick={() => addNotification({title: 'Soporte', text: 'Abriendo formulario de nuevo ticket...', type: 'info'})}>
                                <i className="fas fa-plus me-2"></i>Nuevo Ticket
                            </button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* SELLER: CAMPAIGN CALENDAR */}
            {isSeller && (
                <div className="mb-5">
                    <h5 className="fw-bold mb-4"><i className="fas fa-calendar-alt text-primary me-2"></i>Calendario de Campañas Comerciales</h5>
                    <div className="row g-3" data-aos="fade-up">
                        {[
                            { name: 'Campaña "Back to Work" Q1', starts: '15 Mar', ends: '31 Mar', status: 'Activa', discount: '15% adicional' },
                            { name: 'Promo Servidores por Volumen', starts: '01 Abr', ends: '15 Abr', status: 'Próxima', discount: '$500 bono' },
                            { name: 'Hackathon DuiTech Partner', starts: '20 Abr', ends: '22 Abr', status: 'Próxima', discount: 'Evento presencial' },
                        ].map((c, i) => (
                            <div key={i} className="col-12 col-lg-4">
                                <div className="card border-0 shadow-sm rounded-4 h-100">
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between mb-3">
                                            <span className={`badge rounded-pill x-small ${c.status === 'Activa' ? 'bg-success' : 'bg-primary-subtle text-primary border'}`}>{c.status}</span>
                                            <span className="x-small text-muted">{c.starts} – {c.ends}</span>
                                        </div>
                                        <h6 className="fw-bold mb-2 small">{c.name}</h6>
                                        <div className="x-small text-primary fw-bold"><i className="fas fa-tag me-2"></i>{c.discount}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* CHANGELOG (Admin Only) */}
            {isAdmin && (
                <div className="mb-5">
                    <h5 className="fw-bold mb-4"><i className="fas fa-code-branch text-warning me-2"></i>Registro de Cambios (Changelog)</h5>
                    <div className="row g-3" data-aos="fade-up">
                        {changelog.map((log, i) => (
                            <div key={i} className="col-12">
                                <div className="card border-0 shadow-sm rounded-4">
                                    <div className="card-body p-4 d-flex align-items-center gap-4">
                                        <div className="text-center" style={{ minWidth: '80px' }}>
                                            <div className="fw-extrabold text-primary">{log.version}</div>
                                            <div className="x-small text-muted">{log.date}</div>
                                        </div>
                                        <div className="vr opacity-25"></div>
                                        <div className="flex-grow-1">
                                            <span className={`badge rounded-pill me-2 x-small ${log.type === 'Feature' ? 'bg-success' : log.type === 'Fix' ? 'bg-danger' : 'bg-info'}`}>{log.type}</span>
                                            <span className="small">{log.desc}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Docs;
