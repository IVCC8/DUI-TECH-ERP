import { useState } from 'react';
import { customersData } from '../context/mockData';
import Modal from '../components/ui/Modal';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import useLocalStorage from '../hooks/useLocalStorage';
import { Card, StatCard } from '../components/Card/card';

const Customers = () => {
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    
    const role = user?.role || 'client';
    const isAdmin = role === 'admin';
    const isSeller = role === 'seller';
    const isClient = role === 'client';

    const [customers, setCustomers] = useLocalStorage('duitech_customers', customersData);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isCampaignOpen, setIsCampaignOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [activeSegment, setActiveSegment] = useState('all');

    // Filter logic: Sellers only see their assigned portfolio (mocked for demo)
    const filtered = (customers || []).filter(c =>
        (c.name||'').toLowerCase().includes(search.toLowerCase()) ||
        (c.email||'').toLowerCase().includes(search.toLowerCase())
    ).filter(c => {
        if (activeSegment === 'all') return true;
        return (c.type||'Regular') === activeSegment;
    });

    const handleAddCustomer = (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const customerId = fd.get('id');
        if (customerId) {
            setCustomers(customers.map(c => c.id === Number(customerId) ? { ...c, name: fd.get('name'), email: fd.get('email'), type: fd.get('type'), phone: fd.get('phone') } : c));
            addNotification({ title: 'Cliente Actualizado', text: `Datos de ${fd.get('name')} guardados.`, type: 'success' });
        } else {
            const nc = { 
                id: Date.now(), 
                name: fd.get('name'), 
                email: fd.get('email'), 
                type: fd.get('type'), 
                phone: fd.get('phone'), 
                total: 0, 
                lastBuy: '-', 
                status: 'Prospecto',
                assignedTo: isSeller ? user.name : 'Admin'
                };
            setCustomers([...customers, nc]);
            addNotification({ title: 'Cliente Registrado', text: `${nc.name} ha sido añadido a tu cartera.`, type: 'success' });
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`¿Eliminar al cliente ${name}?`)) {
            setCustomers(customers.filter(c => c.id !== id));
            addNotification({ title: 'Cliente Eliminado', text: 'Registro removido.', type: 'info' });
        }
    };

    return (
        <div className="container-fluid p-0">
            <div className="info-section mb-5">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <h2 className="display-6 fw-bold text-gradient">{isClient ? 'Mi Perfil de Socio' : isSeller ? 'Mi Cartera de Clientes' : 'Gestión CRM Central'}</h2>
                        <p className="text-muted fs-5 m-0">
                            {isClient ? 'Consulta tus beneficios, puntos y ejecutivo asignado.' 
                                : isSeller ? 'Administra tus prospectos, visitas y cierres de mes.' 
                                : 'Control total de segmentación, LTV y campañas globales.'}
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        {(isAdmin || isSeller) && (
                            <>
                                <button className="btn btn-outline-primary fw-bold px-4 rounded-pill shadow-sm" onClick={() => setIsCampaignOpen(true)}><i className="fas fa-paper-plane me-2"></i>Nueva Campaña</button>
                                <button className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 fw-bold shadow-sm rounded-pill" onClick={() => { setEditingCustomer(null); setIsModalOpen(true); }}><i className="fas fa-user-plus small"></i>{isSeller ? 'Agregar Prospecto' : 'Alta de Cliente'}</button>
                            </>
                        )}
                        {isClient && (
                            <button className="btn btn-warning fw-bold px-4 rounded-pill shadow-sm text-dark border-0" onClick={() => addNotification({title:'Puntos Canjeados', text:'Tus puntos han sido enviados a revisión.', type:'success'})}><i className="fas fa-gift me-2"></i>Canjear Puntos</button>
                        )}
                    </div>
                </div>
            </div>

            {/* SUMMARY STATS (Role Based) */}
            <div className="row g-4 mb-5">
                {isAdmin ? (
                    [
                        { title: 'Total Registrados', val: customers.length, sub: 'Base de datos activa', icon: 'fa-users', color: 'border-primary' },
                        { title: 'Clientes Activos', val: customers.filter(c=>c.status==='Activo'||c.status==='Corporativo').length, sub: 'Compra < 30 días', icon: 'fa-user-check', color: 'border-success' },
                        { title: 'LTV Promedio', val: `$${((customers.reduce((a,c)=>a+(c.total||0),0)/(customers.length||1))/1000).toFixed(1)}K`, sub: 'Valor acumulado', icon: 'fa-chart-line', color: 'border-info' },
                        { title: 'Clientes VIP', val: customers.filter(c=>c.type==='VIP'||c.type==='Corporativo').length, sub: 'Estatus Preferencial', icon: 'fa-crown', color: 'border-warning' }
                    ].map((c,i) => (
                        <div key={i} className="col-6 col-xl-3">
                            <div className={`card border-0 shadow-sm rounded-4 border-start border-4 ${c.color} h-100`}>
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3"><div className="bg-light rounded-3 p-2"><i className={`fas ${c.icon} text-primary`}></i></div></div>
                                    <div className="h4 fw-extrabold text-dark mb-1">{c.val}</div>
                                    <div className="small fw-bold text-muted text-uppercase" style={{fontSize:'10px'}}>{c.title}</div>
                                    <div className="x-small text-muted">{c.sub}</div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : isSeller ? (
                    // ... (isSeller stats)
                    [
                        { title: 'Mi Cartera', val: '18', sub: 'Clientes asignados', icon: 'fa-address-book', color: 'border-primary' },
                        { title: 'Prospectos Nuevos', val: '4', sub: 'Pendientes de contacto', icon: 'fa-user-plus', color: 'border-info' },
                        { title: 'Ventas del Mes', val: '$145K', sub: '85% de tu meta', icon: 'fa-bullseye', color: 'border-success' },
                        { title: 'Visitas Pendientes', val: '5', sub: 'En agenda esta semana', icon: 'fa-calendar-check', color: 'border-warning' }
                    ].map((c,i) => (
                        <div key={i} className="col-6 col-xl-3">
                            <div className={`card border-0 shadow-sm rounded-4 border-start border-4 ${c.color} h-100 shadow-hover`}>
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2"><i className={`fas ${c.icon} text-primary fs-4 opacity-50`}></i><span className="badge bg-light text-dark border rounded-pill x-small">Action</span></div>
                                    <div className="h4 fw-extrabold text-dark mb-0">{c.val}</div>
                                    <div className="small fw-bold text-muted text-uppercase mt-1" style={{fontSize:'10px'}}>{c.title}</div>
                                    <div className="x-small text-muted">{c.sub}</div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    [
                        { title: 'Mi Nivel Socio', val: 'Gold Member', sub: 'Beneficios VIP activos', icon: 'fa-medal', color: 'border-warning' },
                        { title: 'DuiPoints Totales', val: '4,850', sub: 'Equiv. a $485 MXN', icon: 'fa-gem', color: 'border-primary' },
                        { title: 'Ahorro Acumulado', val: '$1,240', sub: 'Por descuentos VIP', icon: 'fa-piggy-bank', color: 'border-success' },
                        { title: 'Última Interacción', val: '05 Mar', sub: 'Pedido entregado', icon: 'fa-history', color: 'border-info' }
                    ].map((c,i) => (
                        <div key={i} className="col-6 col-xl-3">
                            <div className={`card border-0 shadow-sm rounded-4 border-start border-4 ${c.color} h-100`}>
                                <div className="card-body p-4 text-center">
                                    <i className={`fas ${c.icon} text-primary fs-2 mb-2 opacity-25`}></i>
                                    <div className="h4 fw-extrabold text-primary mb-1">{c.val}</div>
                                    <div className="small fw-bold text-dark text-uppercase" style={{fontSize:'10px'}}>{c.title}</div>
                                    <div className="x-small text-muted">{c.sub}</div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* ADMIN - EXECUTIVE CRM DASHBOARD */}
            {isAdmin && (
                <div className="row g-4 mb-5">
                    <div className="col-12 col-xl-7">
                        <Card title={<><i className="fas fa-chart-area text-primary me-2"></i>Executive CRM Dashboard — LTV & Churn</>}>
                             <div className="p-4 bg-light rounded-4 overflow-hidden position-relative">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div><div className="h3 fw-extrabold text-primary m-0">$ 1.2M</div><div className="small text-muted fw-bold">Customer Lifetime Value (LTV) Total</div></div>
                                    <div className="text-end"><div className="h3 fw-extrabold text-success m-0">4.2%</div><div className="small text-muted fw-bold">Tasa de Churn Mensual</div></div>
                                </div>
                                <div className="d-flex align-items-end gap-1" style={{height:'120px'}}>
                                    {[30,50,45,70,85,90,75,95,80,60].map((h,i)=>(
                                        <div key={i} className="flex-grow-1 bg-primary rounded-top opacity-50" style={{height:`${h}%`}}></div>
                                    ))}
                                </div>
                             </div>
                        </Card>
                    </div>
                    <div className="col-12 col-xl-5">
                        <Card title={<><i className="fas fa-users-cog text-warning me-2"></i>Segmentación de Cartera Global</>}>
                             <div className="d-grid gap-3 py-2">
                                {[
                                    {label:'Corporativo', count:12, val:'$450K', color:'bg-primary', p:45},
                                    {label:'VIP / Strategic', count:8, val:'$380K', color:'bg-warning', p:35},
                                    {label:'Regular Asset', count:45, val:'$120K', color:'bg-info', p:20}
                                ].map((s,i)=>(
                                    <div key={i} className="p-3 bg-white border rounded-4 shadow-sm">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <div><span className={`badge ${s.color} me-2`}>{s.count}</span><span className="fw-bold small">{s.label}</span></div>
                                            <div className="fw-extrabold text-primary">{s.val}</div>
                                        </div>
                                        <div className="progress rounded-pill" style={{height:'6px'}}><div className={`progress-bar ${s.color}`} style={{width:`${s.p}%`}}></div></div>
                                    </div>
                                ))}
                             </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* SELLER - PIPELINE & VISIT PLANNER */}
            {isSeller && (
                <div className="row g-4 mb-5">
                    <div className="col-12 col-lg-8">
                        <Card title={<><i className="fas fa-funnel-dollar text-primary me-2"></i>Mi Pipeline — Etapas de Cierre</>} noPadding>
                            <div className="p-4 bg-light bg-opacity-50">
                                <div className="row g-3">
                                    {[{label:'Prospecto', count:8, color:'bg-secondary'},{label:'Propuesta', count:4, color:'bg-warning'},{label:'Negociación', count:3, color:'bg-info'},{label:'Cierre', count:2, color:'bg-success'}].map((p,i)=>(
                                        <div key={i} className="col-3">
                                            <div className="text-center">
                                                <div className="h3 fw-extrabold text-dark m-0">{p.count}</div>
                                                <div className="x-small fw-bold text-muted text-uppercase mb-2">{p.label}</div>
                                                <div className="progress rounded-pill" style={{height:'6px'}}><div className={`progress-bar ${p.color}`} style={{width:`${p.count * 10}%`}}></div></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table align-middle mb-0">
                                    <thead className="table-light"><tr className="x-small text-muted text-uppercase fw-bold"><th className="ps-4">Cliente</th><th>Monto Est.</th><th>Etapa</th><th>Acción</th></tr></thead>
                                    <tbody>
                                        {[{name:'Tech Solutions', amt:'$45,000', stage:'Negociación'},{name:'Global Corp', amt:'$12,000', stage:'Propuesta'},{name:'StartupXYZ', amt:'$8,500', stage:'Prospecto'}].map((p,i)=>(
                                            <tr key={i}>
                                                <td className="ps-4 fw-bold small">{p.name}</td>
                                                <td className="small text-primary fw-bold">{p.amt}</td>
                                                <td><span className={`badge rounded-pill x-small ${p.stage==='Negociación'?'bg-info':p.stage==='Propuesta'?'bg-warning':'bg-secondary'}`}>{p.stage}</span></td>
                                                <td><button className="btn btn-sm btn-light border rounded-pill x-small fw-bold" onClick={()=>addNotification({title:'CRM', text:'Llamada programada.', type:'info'})}>Anotar Gestión</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                    <div className="col-12 col-lg-4">
                        <Card title={<><i className="fas fa-calendar-alt text-warning me-2"></i>Agenda de Visitas</>} className="h-100">
                             <div className="d-grid gap-3">
                                {[
                                    {time:'10:00 AM', client:'Empresa Alpha', task:'Demo de Stock', done:true},
                                    {time:'02:30 PM', client:'G. Innovación', task:'Cierre Contrato', done:false},
                                    {time:'Mañana', client:'Tech Solutions', task:'Revisión Q3', done:false}
                                ].map((v,i)=>(
                                    <div key={i} className={`p-3 rounded-4 border-start border-4 ${v.done?'border-success bg-success-subtle opacity-75':'border-primary bg-light'} d-flex gap-3 align-items-center`}>
                                        <div className="text-center border-end pe-3" style={{minWidth:'70px'}}><div className="fw-extrabold small">{v.time}</div></div>
                                        <div><div className="fw-bold small">{v.client}</div><div className="x-small text-muted">{v.task}</div></div>
                                        {v.done && <i className="fas fa-check-circle text-success ms-auto"></i>}
                                    </div>
                                ))}
                            </div>
                            <button className="btn btn-primary btn-sm w-100 mt-4 rounded-pill fw-bold shadow-sm">Agendar Nueva Visita</button>
                        </Card>
                    </div>
                </div>
            )}

            {/* CLIENT - LOYALTY & SUPPORT */}
            {isClient && (
                <div className="row g-4 mb-5">
                    <div className="col-12 col-lg-7">
                        <Card title={<><i className="fas fa-gem text-primary me-2"></i>Mi Programa de Recompensas</>}>
                            <div className="p-4 bg-dark text-white rounded-4 shadow-lg mb-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div><div className="h2 fw-extrabold text-accent m-0">4,850 <span className="fs-5 fw-normal opacity-75">pts</span></div><div className="x-small text-white-50 fw-bold text-uppercase">Tus DuiPoints Totales</div></div>
                                    <div className="text-end"><span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-extrabold"><i className="fas fa-medal me-1"></i>GOLD TIER</span></div>
                                </div>
                                <div className="progress rounded-pill bg-white bg-opacity-10 mb-2" style={{height:'10px'}}><div className="progress-bar bg-accent" style={{width:'68%'}}></div></div>
                                <div className="d-flex justify-content-between x-small opacity-75"><span>Siguiente nivel: Platinum (5,000 pts)</span><span>Faltan 150 pts</span></div>
                            </div>
                            <h6 className="fw-bold mb-3 small text-muted text-uppercase">Beneficios de tu Nivel</h6>
                            <div className="row g-3">
                                {['10% Descuento Directo','Envíos Prioritarios Gratis','Asesor VIP 24/7','Acceso a Preventas'].map((b,i)=>(
                                    <div key={i} className="col-6"><div className="p-2 bg-light rounded-3 small fw-bold"><i className="fas fa-check-circle text-success me-2"></i>{b}</div></div>
                                ))}
                            </div>
                        </Card>
                    </div>
                    <div className="col-12 col-lg-5">
                        <Card title={<><i className="fas fa-user-tie text-info me-2"></i>Mi Ejecutivo de Cuenta</>} className="bg-primary text-white border-0 shadow-lg h-100">
                            <div className="text-center py-4">
                                <img src="https://ui-avatars.com/api/?name=Laura+Sanchez&background=white&color=0d6efd&size=80" className="rounded-circle shadow mb-3 border border-3 border-white border-opacity-25" alt="exec"/>
                                <h5 className="fw-bold mb-0">Laura Sánchez</h5>
                                <p className="small opacity-75">Key Account Manager</p>
                            </div>
                            <div className="bg-white bg-opacity-10 rounded-4 p-4 mt-auto">
                                <div className="d-grid gap-3">
                                    <div className="d-flex align-items-center gap-3"><i className="fas fa-envelope fs-5 opacity-75"></i><div className="small fw-bold">laura.s@duitech.mx</div></div>
                                    <div className="d-flex align-items-center gap-3"><i className="fas fa-phone-alt fs-5 opacity-75"></i><div className="small fw-bold">+52 55 9876 5432</div></div>
                                    <button className="btn btn-white btn-sm fw-bold w-100 mt-2 rounded-pill shadow-sm" onClick={()=>addNotification({title:'Chat', text:'Se ha enviado una alerta a Laura.', type:'info'})}>Solicitar Videollamada</button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* MAIN DIRECTORY (Already mostly implemented, making it role-aware) */}
            {(!isClient) && (
                <Card className="border-0 shadow-sm overflow-hidden mb-5" noPadding
                    title={<><i className="fas fa-address-book text-primary me-2 small"></i>{isSeller ? 'Mis Clientes Asignados' : 'Directorio Maestro CRM'}</>}
                    extra={<div className="d-flex gap-2">
                        {['all','Corporativo','VIP','Regular'].map(seg => <button key={seg} className={`btn btn-sm rounded-pill px-3 fw-bold ${activeSegment===seg?'btn-primary':'btn-light border'}`} onClick={()=>setActiveSegment(seg)}>{seg==='all' ? 'Ver Todos' : seg}</button>)}
                    </div>}
                >
                    <div className="p-4 border-bottom bg-light bg-opacity-10">
                        <div className="input-group input-group-lg shadow-sm rounded-pill overflow-hidden border">
                            <span className="input-group-text bg-white border-0 ps-4"><i className="fas fa-search text-muted"></i></span>
                            <input type="text" placeholder="Buscar por nombre, empresa o contacto..." className="form-control border-0 bg-white py-3 shadow-none" value={search} onChange={e => setSearch(e.target.value)}/>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr className="x-small text-muted text-uppercase fw-bold"><th className="ps-4">Cliente / Empresa</th><th>Contacto</th><th>Estatus Compras</th><th>LTV Total</th><th>Gestión</th><th className="text-end pe-4">Acciones</th></tr>
                            </thead>
                            <tbody>
                                {filtered.map((c, idx) => (
                                    <tr key={c.id || `cust-${idx}`}>
                                        <td className="ps-4">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="w-10 h-10 bg-primary bg-gradient text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{width:'36px', height:'36px'}}>{c.name?.charAt(0) || '?'}</div>
                                                <div><div className="fw-bold text-dark small">{c.name || 'Sin nombre'}</div><div className="x-small text-muted">{c.type || 'Regular'}</div></div>
                                            </div>
                                        </td>
                                        <td className="text-muted small">{c.email}</td>
                                        <td><span className={`badge rounded-pill px-3 py-2 fw-bold border ${c.status==='Activo'?'bg-success-subtle text-success border-success-subtle':'bg-warning-subtle text-warning border-warning-subtle'}`}>{c.status}</span></td>
                                        <td className="fw-extrabold text-primary">$ {(c.total || 0).toLocaleString()}</td>
                                        <td>
                                            <div className="progress rounded-pill bg-light" style={{height:'6px', width:'80px'}} title="Engagement Score">
                                                <div className="progress-bar bg-info" style={{width: (c.total > 15000 ? '95%' : '45%')}}></div>
                                            </div>
                                        </td>
                                        <td className="pe-4 text-end">
                                            <div className="d-flex justify-content-end gap-1">
                                                <button className="btn btn-light btn-sm rounded-pill border shadow-sm" onClick={() => { setSelectedCustomer(c); setIsHistoryOpen(true); }}><i className="fas fa-history text-success"></i></button>
                                                <button className="btn btn-light btn-sm rounded-pill border shadow-sm" onClick={() => { setEditingCustomer(c); setIsModalOpen(true); }}><i className="fas fa-edit text-primary"></i></button>
                                                {isAdmin && <button className="btn btn-light btn-sm rounded-pill border shadow-sm" onClick={() => handleDelete(c.id, c.name)}><i className="fas fa-trash text-danger"></i></button>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* MODALS */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCustomer ? "Editar Ficha de Cliente" : "Alta de Nuevo Prospecto"}>
                <form onSubmit={handleAddCustomer} className="row g-4 p-2">
                    <input type="hidden" name="id" value={editingCustomer?.id || ''}/>
                    <div className="col-12"><label className="form-label fw-bold small text-muted text-uppercase">Razón Social / Nombre</label><input name="name" required className="form-control rounded-3" defaultValue={editingCustomer?.name} placeholder="Ej: Tech Solutions S.A."/></div>
                    <div className="col-md-6"><label className="form-label fw-bold small text-muted text-uppercase">Email de Contacto</label><input name="email" type="email" required className="form-control rounded-3" defaultValue={editingCustomer?.email} placeholder="correo@empresa.com"/></div>
                    <div className="col-md-6"><label className="form-label fw-bold small text-muted text-uppercase">Teléfono</label><input name="phone" type="tel" className="form-control rounded-3" defaultValue={editingCustomer?.phone} placeholder="+52 55 ..."/></div>
                    <div className="col-12"><label className="form-label fw-bold small text-muted text-uppercase">Categoría de Cuenta</label><select name="type" className="form-select rounded-3" defaultValue={editingCustomer?.type||'Regular'}><option value="Regular">Cliente Regular</option><option value="VIP">Cliente VIP (Descuento)</option><option value="Corporativo">Empresa Certificada</option></select></div>
                    <div className="col-12 mt-4 text-end"><button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-light px-4 me-2 rounded-pill fw-bold">Cancelar</button><button type="submit" className="btn btn-primary px-5 fw-bold rounded-pill shadow-sm">Guardar Cambios</button></div>
                </form>
            </Modal>

            <Modal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} title={`Bitácora CRM: ${selectedCustomer?.name}`}>
                <div className="p-2">
                    <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded-4">
                        <div><span className="x-small text-muted d-block text-uppercase fw-bold">Clasificación</span><span className={`badge ${(selectedCustomer?.total||0)>10000?'bg-warning text-dark':'bg-info'} px-3 rounded-pill fw-bold`}>{(selectedCustomer?.total||0)>10000?'Cuenta Estratégica':'Regular Asset'}</span></div>
                        <div className="text-end"><span className="x-small text-muted d-block text-uppercase fw-bold">Health Score</span><span className="text-success fw-extrabold h5 m-0">94/100</span></div>
                    </div>
                    <h6 className="fw-bold mb-3 border-bottom pb-2 text-uppercase small text-muted"><i className="fas fa-stream me-2"></i>Historial de Gestiones</h6>
                    <div className="d-grid gap-3">
                        {[{ type: 'Llamada', desc: 'Confirmación de presupuesto Q3.', date: 'Hoy, 09:00', icon:'fa-phone' }, { type: 'Venta', desc: 'Cerró compra de 5 MacBooks.', date: '02 Mar 2026', icon:'fa-shopping-cart' }, { type: 'Soporte', desc: 'Resuelto bug en acceso al portal.', date: 'Feb 2026', icon:'fa-headset' }].map((item, i) => (
                            <div key={i} className="d-flex gap-3 position-relative">
                                <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{width:'32px', height:'32px', minWidth:'32px'}}><i className={`fas ${item.icon} x-small`}></i></div>
                                <div><div className="fw-bold small">{item.type}</div><div className="x-small text-muted">{item.desc}</div><div className="x-small text-primary fw-bold mt-1">{item.date}</div></div>
                                {i < 2 && <div className="position-absolute border-start" style={{height:'30px', left:'15px', top:'32px', borderStyle:'dashed !important'}}></div>}
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-3 bg-light rounded-4 border">
                        <label className="form-label x-small fw-bold text-uppercase text-muted mb-2">Añadir Actividad</label>
                        <div className="input-group"><input className="form-control form-control-sm border-0 bg-white" placeholder="Ej: Llamada de seguimiento..."/><button className="btn btn-primary btn-sm" onClick={()=>addNotification({title:'CRM',text:'Actividad registrada.',type:'success'})}><i className="fas fa-plus"></i></button></div>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isCampaignOpen} onClose={()=>setIsCampaignOpen(false)} title="Lanzar Campaña Directa">
                <form className="row g-4 p-2" onSubmit={e=>{e.preventDefault();addNotification({title:'Campaña Lanzada',text:'Tu campaña ha sido enviada exitosamente.',type:'success'});setIsCampaignOpen(false);}}>
                    <div className="col-12"><label className="form-label fw-bold small text-muted text-uppercase">Nombre del Proyecto</label><input required className="form-control rounded-3" placeholder="Ej: Oferta Reactivación Q2"/></div>
                    <div className="col-12"><label className="form-label fw-bold small text-muted text-uppercase">Segmento Meta</label><select className="form-select rounded-3"><option>Todos mis clientes</option><option>Solo Cuentas Estratégicas</option><option>Prospectos Fríos</option></select></div>
                    <div className="col-12"><label className="form-label fw-bold small text-muted text-uppercase">Cuerpo del Mensaje (Email/WhatsApp)</label><textarea className="form-control rounded-3" rows="3" placeholder="Hola, tenemos una oferta especial para ti..."></textarea></div>
                    <div className="col-12 mt-2 text-end"><button type="button" onClick={()=>setIsCampaignOpen(false)} className="btn btn-light px-4 me-2 rounded-pill fw-bold">Cancelar</button><button type="submit" className="btn btn-warning px-5 fw-bold rounded-pill shadow-sm text-dark"><i className="fas fa-paper-plane me-2"></i>Lanzar Campaña</button></div>
                </form>
            </Modal>
        </div>
    );
};

export default Customers;
