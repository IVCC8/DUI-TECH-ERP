import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import useApi from '../hooks/useApi';
import useLocalStorage from '../hooks/useLocalStorage';
import { initialOrders } from '../context/mockData';
import Modal from '../components/ui/Modal';
import { Card } from '../components/Card/card';

const statusFlow = ['Pendiente', 'Confirmada', 'En Tránsito', 'Enviada', 'Entregada'];
const statusColor = { 
    Pendiente: 'bg-secondary-subtle text-secondary border-secondary-subtle', 
    Confirmada: 'bg-primary-subtle text-primary border-primary-subtle', 
    'En Tránsito': 'bg-info-subtle text-info border-info-subtle', 
    Enviada: 'bg-warning-subtle text-warning border-warning-subtle', 
    Entregada: 'bg-success-subtle text-success border-success-subtle', 
    Cancelada: 'bg-danger-subtle text-danger border-danger-subtle' 
};

const Orders = () => {
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const role = user?.role || 'client';
    const isAdmin = role === 'admin';
    const isSeller = role === 'seller';
    const isClient = role === 'client';

    const { data: apiOrders, loading } = useApi('orders');
    const [orders, setOrders] = useLocalStorage('duitech_orders', initialOrders);
    const allOrders = (apiOrders && apiOrders.length > 0) ? apiOrders : (orders || []);
    
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);

    // Filter logic based on role
    const filtered = allOrders.filter(o => {
        const matchesSearch = (o.client||'').toLowerCase().includes(search.toLowerCase()) || (o.id||'').toLowerCase().includes(search.toLowerCase());
        const matchesStatus = (filterStatus === '' || o.status === filterStatus);
        
        if (isClient) {
            // Clients only see their own orders (mocked to "Empresa XYZ" or similar if they are the client)
            // For now, we show all linked to their common mock name or just all for demo
            return matchesSearch && matchesStatus; 
        }
        if (isSeller) {
            // Sellers see all but with extra commission info
            return matchesSearch && matchesStatus;
        }
        return matchesSearch && matchesStatus;
    });

    const handleStatusChange = (orderId, newStatus) => {
        setOrders(prev => (prev||[]).map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        addNotification({ title: 'Estado Actualizado', text: `Orden #${orderId} → ${newStatus}`, type: 'success' });
    };

    const handleCreateOrder = (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const newOrder = { 
            id: `ORD-${Date.now().toString().slice(-4)}`, 
            client: fd.get('client'), 
            status: 'Pendiente', 
            total: parseFloat(fd.get('total')||0), 
            date: new Date().toLocaleDateString(), 
            items: [],
            commission: parseFloat(fd.get('total')||0) * 0.03
        };
        setOrders(prev => [newOrder, ...(prev||[])]);
        addNotification({ title: 'Orden Creada', text: `Orden para ${newOrder.client} generada.`, type: 'success' });
        setIsNewOrderOpen(false);
    };

    if (loading) return <div className="p-5 text-center text-primary fw-bold"><i className="fas fa-spinner fa-spin me-2"></i>Cargando registro de órdenes...</div>;

    return (
        <div className="container-fluid p-0">
            <div className="info-section mb-5">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <h2 className="display-6 fw-bold text-gradient">{isClient ? 'Mis Pedidos & Seguimiento' : isSeller ? 'Panel de Ventas & Comisiones' : 'Centro de Logística'}</h2>
                        <p className="text-muted fs-5 m-0">
                            {isClient ? 'Rastrea tus envíos en tiempo real y descarga tus facturas.'
                                : isSeller ? 'Monitorea tus ventas cerradas y calcula tus bonos del mes.'
                                : 'Administra el ciclo completo de ventas, despacho y métricas de SLA.'}
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        {(isAdmin || isSeller) && (
                            <>
                                <button className="btn btn-outline-primary fw-bold px-4 rounded-pill" onClick={() => addNotification({ title: 'Exportando', text: 'Reporte de órdenes descargado.', type: 'info' })}><i className="fas fa-download me-2"></i>Exportar</button>
                                <button className="btn btn-primary fw-bold px-4 rounded-pill shadow-sm" onClick={() => setIsNewOrderOpen(true)}><i className="fas fa-plus me-2"></i>{isSeller ? 'Venta Nueva' : 'Nueva Orden'}</button>
                            </>
                        )}
                        {isClient && (
                            <button className="btn btn-primary fw-bold px-4 rounded-pill shadow-sm" onClick={() => addNotification({title:'Soporte Logístico', text:'Un agente se unirá al chat brevemente.', type:'info'})}><i className="fas fa-headset me-2"></i>Ayuda con mi pedido</button>
                        )}
                    </div>
                </div>
            </div>

            {/* SUMMARY CARDS (Role Specific) */}
            <div className="row g-4 mb-5">
                {isAdmin ? (
                    [
                        { label: 'Total Órdenes', val: allOrders.length, sub: 'Ciclo activo', icon: 'fa-shopping-cart', color: 'border-primary' },
                        { label: 'En Tránsito', val: allOrders.filter(o=>o.status==='En Tránsito'||o.status==='Enviada').length, sub: 'Camino al cliente', icon: 'fa-truck', color: 'border-info' },
                        { label: 'Completadas', val: allOrders.filter(o=>o.status==='Entregada').length, sub: 'Este período', icon: 'fa-check-double', color: 'border-success' },
                        { label: 'Facturación Total', val: `$${(allOrders.reduce((a,o)=>a+(o.total||0),0)/1000).toFixed(0)}K`, sub: 'Valor acumulado', icon: 'fa-dollar-sign', color: 'border-warning' }
                    ].map((c, i) => (
                        <div key={i} className="col-6 col-xl-3">
                            <div className={`card border-0 shadow-sm rounded-4 border-start border-4 ${c.color} h-100`}>
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3"><div className="bg-light rounded-3 p-2"><i className={`fas ${c.icon} text-primary`}></i></div></div>
                                    <div className="h4 fw-extrabold text-dark mb-1">{c.val}</div>
                                    <div className="small fw-bold text-muted text-uppercase" style={{fontSize:'10px'}}>{c.label}</div>
                                    <div className="x-small text-muted">{c.sub}</div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : isSeller ? (
                    [
                        { label: 'Mis Ventas (Mes)', val: '24', sub: 'Ranking #2 este mes', icon: 'fa-trophy', color: 'border-warning' },
                        { label: 'Comisión Acum.', val: `$${(allOrders.reduce((a,o)=>a+(o.total||0)*0.03, 0)/1000).toFixed(1)}k`, sub: 'Bono proyectado', icon: 'fa-coins', color: 'border-success' },
                        { label: 'Pedidos en Ruta', val: allOrders.filter(o=>o.status==='En Tránsito').length, sub: 'Pendientes de cierre', icon: 'fa-route', color: 'border-info' },
                        { label: 'Ventas Perdidas', val: '2', sub: 'Por falta de stock', icon: 'fa-times-circle', color: 'border-danger' }
                    ].map((c, i) => (
                        <div key={i} className="col-6 col-xl-3">
                            <div className={`card border-0 shadow-sm rounded-4 border-start border-4 ${c.color} h-100 shadow-hover`}>
                                <div className="card-body p-4 text-center text-xl-start">
                                    <i className={`fas ${c.icon} text-primary fs-3 mb-2 opacity-50`}></i>
                                    <div className="h4 fw-extrabold text-dark mb-1">{c.val}</div>
                                    <div className="small fw-bold text-muted text-uppercase" style={{fontSize:'10px'}}>{c.label}</div>
                                    <div className="x-small text-muted">{c.sub}</div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    [
                        { label: 'Mis Pedidos Activos', val: '3', sub: '1 llega hoy', icon: 'fa-box-open', color: 'border-primary' },
                        { label: 'Compras del Mes', val: '$12,400', sub: 'Status Plan Oro', icon: 'fa-gem', color: 'border-warning' },
                        { label: 'Puntos Fidelidad', val: '450', sub: 'Canjeables', icon: 'fa-award', color: 'border-success' },
                        { label: 'Tickets de Soporte', val: '0', sub: 'Sin incidencias', icon: 'fa-headset', color: 'border-info' }
                    ].map((c, i) => (
                        <div key={i} className="col-6 col-xl-3">
                            <div className={`card border-0 shadow-sm rounded-4 border-start border-4 ${c.color} h-100`}>
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2"><i className={`fas ${c.icon} text-primary fs-4 opacity-50`}></i><span className="badge bg-light text-dark border rounded-pill x-small">Info</span></div>
                                    <div className="h4 fw-extrabold text-primary mb-0">{c.val}</div>
                                    <div className="small fw-bold text-dark text-uppercase mt-1" style={{fontSize:'11px'}}>{c.label}</div>
                                    <div className="x-small text-muted">{c.sub}</div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* MAIN LIST */}
            <Card className="border-0 shadow-sm overflow-hidden mb-5" noPadding
                title={<><i className="fas fa-list text-primary me-2 small"></i>{isClient ? 'Tus Historial de Pedidos' : 'Registro de Transacciones'}</>}
                extra={
                    <div className="d-flex gap-2">
                        <select className="form-select form-select-sm w-auto rounded-pill border fw-bold shadow-sm" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
                            <option value="">Status: Todos</option>
                            {statusFlow.map(s=><option key={s} value={s}>{s}</option>)}
                            <option value="Cancelada">Cancelada</option>
                        </select>
                    </div>
                }
            >
                <div className="p-4 border-bottom bg-light bg-opacity-10 d-flex flex-wrap gap-2 justify-content-between align-items-center">
                    <div className="input-group input-group-lg shadow-sm rounded-pill overflow-hidden border flex-grow-1" style={{maxWidth:'500px'}}>
                        <span className="input-group-text bg-white border-0 ps-4"><i className="fas fa-search text-muted"></i></span>
                        <input type="text" placeholder="Buscar por ID u Cliente..." className="form-control border-0 bg-white py-3" value={search} onChange={e=>setSearch(e.target.value)}/>
                    </div>
                    {isSeller && (
                        <div className="bg-primary-subtle text-primary rounded-pill px-4 py-2 fw-extrabold shadow-sm border border-primary-subtle">
                            <i className="fas fa-coins me-2"></i>Comisión Acumulada: $1,240.00
                        </div>
                    )}
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light"><tr className="small text-muted text-uppercase tracking-wider"><th className="ps-4">Orden #</th><th>Cliente</th><th>Fecha</th><th>Total</th>{isSeller && <th>Comisión</th>}<th>Estado</th><th className="pe-4 text-end">Acción</th></tr></thead>
                        <tbody>
                            {filtered.map((o, idx) => (
                                <tr key={o.id||`ord-${idx}`} className="border-transparent shadow-sm-hover">
                                    <td className="ps-4"><span className="badge bg-light text-dark border fw-bold">#{o.id}</span></td>
                                    <td><div className="d-flex align-items-center gap-2"><div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold x-small" style={{width:'28px',height:'28px'}}>{(o.client||'?').charAt(0)}</div><span className="fw-bold small">{o.client||'—'}</span></div></td>
                                    <td className="small text-muted">{o.date||o.createdAt||'—'}</td>
                                    <td className="fw-extrabold text-dark">$ {(o.total||0).toLocaleString()}</td>
                                    {isSeller && <td className="text-success fw-bold small">+$ {((o.total||0)*0.03).toFixed(2)}</td>}
                                    <td><span className={`badge rounded-pill px-3 py-2 fw-bold border ${statusColor[o.status]||'bg-secondary-subtle text-secondary'}`}>{o.status||'Pendiente'}</span></td>
                                    <td className="pe-4 text-end">
                                        <div className="d-flex justify-content-end gap-1">
                                            <button className="btn btn-light btn-sm rounded-circle p-2 border shadow-sm hover-lift" title="Ver Detalle" onClick={()=>{setSelectedOrder(o);setIsDetailOpen(true);}}><i className="fas fa-eye text-primary"></i></button>
                                            {isClient && <button className="btn btn-light btn-sm rounded-circle p-2 border shadow-sm hover-lift" title="Bajer Factura" onClick={()=>addNotification({title:'Factura', text:`Generando PDF para ${o.id}...`, type:'info'})}><i className="fas fa-file-invoice text-success"></i></button>}
                                            {(isAdmin || isSeller) && (
                                                <div className="dropdown">
                                                    <button className="btn btn-light btn-sm rounded-circle p-2 border shadow-sm hover-lift" data-bs-toggle="dropdown"><i className="fas fa-cog text-muted"></i></button>
                                                    <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-4 p-2">
                                                        {statusFlow.map(s => <li key={s}><button className="dropdown-item rounded-3 small fw-bold py-2" onClick={()=>handleStatusChange(o.id,s)}>{s}</button></li>)}
                                                        <li><hr className="dropdown-divider"/></li>
                                                        <li><button className="dropdown-item rounded-3 small fw-bold text-danger py-2" onClick={()=>handleStatusChange(o.id,'Cancelada')}>Cancelar Orden</button></li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* SELLER - SPECIAL DASHBOARD */}
            {isSeller && (
                <div className="row g-4 mb-5">
                    <div className="col-12 col-lg-7">
                        <Card title={<><i className="fas fa-chart-line text-success me-2"></i>Calculadora de Bonos Proyectados</>}>
                            <div className="p-4 bg-primary text-white rounded-4 shadow-lg mb-4 text-center">
                                <div className="x-small opacity-75 fw-bold text-uppercase mb-1">Tu Comisión Estimada este Trimestre</div>
                                <div className="display-5 fw-extrabold">$24,500.00 <span className="fs-5 opacity-75">MXN</span></div>
                                <div className="mt-3 d-flex justify-content-center gap-4">
                                    <div className="text-center"><div className="x-small opacity-75">Meta Trimestral</div><div className="fw-bold">85%</div></div>
                                    <div className="text-center"><div className="x-small opacity-75">Bono Extra</div><div className="fw-bold text-warning">+$5,000</div></div>
                                </div>
                            </div>
                            <div className="row g-3">
                                {[
                                    {label:'Ventas Pend. Pago', val:'$45,000', icon:'fa-clock', color:'bg-warning'},
                                    {label:'Tasa Prom. Comisión', val:'3.2%', icon:'fa-percent', color:'bg-info'},
                                    {label:'Venta Promedio', val:'$8,200', icon:'fa-calculator', color:'bg-success'}
                                ].map((stat,i)=>(
                                    <div key={i} className="col-4">
                                        <div className="p-3 bg-light rounded-4 text-center h-100 border">
                                            <div className={`${stat.color} text-white rounded-circle p-2 mx-auto mb-2 mb-lg-1`} style={{width:'32px', height:'32px', display:'flex', alignItems:'center', justifyItems:'center', justifyContent:'center'}}><i className={`fas ${stat.icon} x-small`}></i></div>
                                            <div className="small fw-extrabold text-dark">{stat.val}</div>
                                            <div className="small text-muted" style={{fontSize:'10px'}}>{stat.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                    <div className="col-12 col-lg-5">
                        <Card title={<><i className="fas fa-bell text-warning me-2"></i>Alertas de Cierre</>} className="h-100">
                             <div className="d-grid gap-3">
                                {[
                                    {msg:'Apple Corp requiere confirmación de entrega inmediata.', type:'danger', id:'ORD-2041'},
                                    {msg:'Cotización #9021 vence en 4 horas.', type:'warning', id:'COT-9021'},
                                    {msg:'La factura de Tech Solutions fue pagada.', type:'success', id:'INV-042'}
                                ].map((alert,i)=>(
                                    <div key={i} className={`p-3 rounded-4 border-start border-4 ${alert.type==='danger'?'border-danger bg-danger-subtle':alert.type==='warning'?'border-warning bg-warning-subtle':'border-success bg-success-subtle'} d-flex justify-content-between align-items-center`}>
                                        <div>
                                            <div className="fw-bold small">{alert.msg}</div>
                                            <div className="x-small text-muted">ID: {alert.id}</div>
                                        </div>
                                        <button className="btn btn-white btn-sm rounded-circle shadow-sm border" onClick={()=>addNotification({title:'Notificado', text:'Alerta gestionada.', type:'info'})}><i className="fas fa-check"></i></button>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* CLIENT - TRACKING HUB */}
            {isClient && (
                <div className="row g-4 mb-5">
                    <div className="col-12 col-lg-8">
                        <Card title={<><i className="fas fa-map-marker-alt text-primary me-2"></i>En dónde está mi pedido?</>} noPadding>
                            <div className="p-4 border-bottom bg-info bg-opacity-10">
                                <div className="d-flex align-items-center gap-4">
                                    <div className="bg-white rounded-4 p-3 shadow-sm border d-flex gap-3 align-items-center">
                                        <i className="fas fa-truck text-primary fs-3"></i>
                                        <div><div className="small text-muted fw-bold">Próxima Entrega</div><div className="fw-extrabold text-primary">#ORD-9821 — Hoy 4:00 PM</div></div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="progress rounded-pill bg-white border" style={{height:'12px'}}><div className="progress-bar progress-bar-striped progress-bar-animated bg-primary" style={{width:'75%'}}></div></div>
                                        <div className="d-flex justify-content-between mt-1 x-small fw-bold text-muted"><span>Salida Almacén</span><span>Puerto Aeropuerto</span><span className="text-primary">En Reparto</span><span>Entregado</span></div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <h6 className="fw-bold mb-3 small text-muted text-uppercase">Hitos Logísticos</h6>
                                <div className="ms-3 border-start ps-4 position-relative">
                                    {[
                                        {status:'En Reparto', desc:'El mensajero está a 20 mins de tu ubicación.', date:'Hoy, 14:20', active:true},
                                        {status:'Llegada CDMX Norte', desc:'Procesado en centro de distribución local.', date:'Hoy, 08:30', active:false},
                                        {status:'Enviado', desc:'Salida de almacén DuiTech Querétaro.', date:'Ayer, 18:00', active:false}
                                    ].map((step,i)=>(
                                        <div key={i} className="mb-4 position-relative">
                                            <div className={`position-absolute top-0 start-0 translate-middle rounded-circle border-4 border-white shadow-sm ${step.active?'bg-primary':'bg-secondary'}`} style={{width:'16px', height:'16px', marginLeft:'-24px', marginTop:'8px'}}></div>
                                            <div className="fw-bold small">{step.status}</div>
                                            <div className="x-small text-muted">{step.desc}</div>
                                            <div className="x-small text-primary fw-bold">{step.date}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="col-12 col-lg-4">
                        <Card title={<><i className="fas fa-file-invoice text-success me-2"></i>Portal de Facturas</>} className="h-100">
                            <div className="d-grid gap-2">
                                {[
                                    {id:'FACT-0482', date:'10 Mar', status:'Pagada', total:4500},
                                    {id:'FACT-0451', date:'02 Mar', status:'Pagada', total:12800},
                                    {id:'FACT-0390', date:'25 Feb', status:'Cancelada', total:2100}
                                ].map((inv,i)=>(
                                    <div key={i} className="p-3 bg-light rounded-4 d-flex justify-content-between align-items-center hover-lift position-relative overflow-hidden">
                                        <div className="position-absolute top-0 end-0 m-1"><span className={`badge x-small ${inv.status==='Pagada'?'bg-success':'bg-danger'}`}>{inv.status}</span></div>
                                        <div>
                                            <div className="fw-bold small">#{inv.id}</div>
                                            <div className="x-small text-muted">{inv.date} · $ {inv.total.toLocaleString()}</div>
                                        </div>
                                        <button className="btn btn-white btn-sm rounded-pill shadow-sm border fw-bold x-small" onClick={()=>addNotification({title:'Descarga', text:'Factura XML/PDF descargada.', type:'success'})}><i className="fas fa-download me-1"></i>XML/PDF</button>
                                    </div>
                                ))}
                            </div>
                            <button className="btn btn-outline-primary btn-sm w-100 mt-3 rounded-pill fw-bold">Ver Todo el Historial</button>
                        </Card>
                    </div>
                </div>
            )}

            {/* ADMIN - SPECIAL ANALYTICS */}
            {isAdmin && (
                <div className="row g-4 mb-5">
                    <div className="col-12 col-xl-4">
                        <div className="card border-0 shadow-sm rounded-4 p-4 h-100 text-center bg-dark text-white shadow-lg overflow-hidden">
                            <div className="x-small opacity-75 fw-bold text-uppercase mb-1">Impacto Logístico</div>
                            <div className="h1 fw-extrabold text-accent">98.2%</div>
                            <div className="small mb-3">Eficiencia de Ruta Promedio</div>
                            <div className="progress bg-white bg-opacity-10 rounded-pill" style={{height:'10px'}}><div className="progress-bar bg-accent" style={{width:'98%'}}></div></div>
                        </div>
                    </div>
                    <div className="col-12 col-xl-8">
                        <Card title={<><i className="fas fa-chart-bar text-primary me-2"></i>Volumen de Órdenes (Últimos 7 días)</>}>
                            <div className="d-flex align-items-end gap-2" style={{height:'120px'}}>
                                {[45,62,55,80,68,90,75].map((val,i)=>(
                                    <div key={i} className="flex-grow-1 bg-primary bg-opacity-25 rounded-top position-relative" style={{height:`${val}%`}}>
                                        <div className="position-absolute top-0 start-50 translate-middle-x mt-n4 x-small fw-bold text-primary">{val}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="d-flex justify-content-between mt-2 x-small fw-bold text-muted">
                                <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* MODALS */}
            <Modal isOpen={isDetailOpen} onClose={()=>setIsDetailOpen(false)} title={`Detalle de Orden #${selectedOrder?.id}`}>
                {selectedOrder && (
                    <div className="p-2">
                        <div className="row g-3 mb-4">
                            <div className="col-6"><div className="p-3 bg-light rounded-4"><div className="x-small text-muted text-uppercase fw-bold mb-1">Cliente</div><div className="fw-bold">{selectedOrder.client}</div></div></div>
                            <div className="col-6"><div className="p-3 bg-light rounded-4"><div className="x-small text-muted text-uppercase fw-bold mb-1">Estado</div><span className={`badge rounded-pill px-3 py-2 fw-bold border ${statusColor[selectedOrder.status]||''}`}>{selectedOrder.status}</span></div></div>
                        </div>
                        <h6 className="fw-bold mb-3 border-bottom pb-2 text-uppercase tracking-wider small text-muted">Líneas de Pedido</h6>
                        <div className="list-group list-group-flush shadow-sm rounded-4 mb-4 border">
                            <div className="list-group-item d-flex justify-content-between py-3">
                                <div><div className="fw-bold small">MacBook Pro M4 16"</div><div className="x-small text-muted">SKU: PRO-M4-16-512</div></div>
                                <div className="text-end fw-bold">$ 45,000.00</div>
                            </div>
                            <div className="list-group-item d-flex justify-content-between py-3">
                                <div><div className="fw-bold small">Magic Mouse</div><div className="x-small text-muted">SKU: ACC-MM-01</div></div>
                                <div className="text-end fw-bold">$ 1,800.00</div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between p-3 bg-primary text-white rounded-4 shadow-sm">
                            <span className="fw-bold">Total Venta:</span>
                            <span className="h5 fw-extrabold m-0">$ {(selectedOrder.total||0).toLocaleString()}</span>
                        </div>
                        {isSeller && (
                            <div className="mt-3 p-3 bg-success-subtle border border-success-subtle rounded-4 text-center">
                                <div className="x-small text-success fw-bold text-uppercase">Comisión Proyectada para esta Venta</div>
                                <div className="h5 fw-extrabold text-success">$ {((selectedOrder.total||0)*0.03).toFixed(2)}</div>
                            </div>
                        )}
                        {isClient && (
                            <div className="mt-4 d-grid gap-2">
                                <button className="btn btn-outline-primary rounded-pill fw-bold" onClick={()=>addNotification({title:'Ticket', text:'Abriendo soporte para pedido.', type:'info'})}><i className="fas fa-question-circle me-2"></i>Reportar Problema con pedido</button>
                                <button className="btn btn-success rounded-pill fw-bold" onClick={()=>addNotification({title:'Descarga', text:'Factura generada.', type:'info'})}><i className="fas fa-file-invoice me-2"></i>Descargar Recibo de Pago</button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            <Modal isOpen={isNewOrderOpen} onClose={()=>setIsNewOrderOpen(false)} title={isSeller ? "Nueva Venta" : "Crear Nueva Orden"}>
                <form onSubmit={handleCreateOrder} className="row g-4 p-2">
                    <div className="col-12"><label className="form-label fw-bold small text-muted text-uppercase">Nombre del Cliente / Empresa</label><input name="client" required className="form-control rounded-3" placeholder="Ej: Tech Solutions Corp"/></div>
                    <div className="col-12"><label className="form-label fw-bold small text-muted text-uppercase">Total Estimado de Venta ($)</label><div className="input-group"><span className="input-group-text bg-light">$</span><input name="total" type="number" min="0" step="0.01" required className="form-control rounded-3 border-start-0" placeholder="0.00"/></div></div>
                    {isSeller && (
                        <div className="col-12 bg-light p-3 rounded-4 border">
                            <div className="small text-muted mb-2"><i className="fas fa-info-circle me-2"></i>Como vendedor, tu comisión de esta venta (3%) se calculará automáticamente tras la confirmación del pago.</div>
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="small fw-bold">Bono Proyectado:</span>
                                <span className="fw-extrabold text-success">$ 0.00</span>
                            </div>
                        </div>
                    )}
                    <div className="col-12 mt-5 text-end"><button type="button" onClick={()=>setIsNewOrderOpen(false)} className="btn btn-light px-4 me-2 rounded-pill fw-bold">Cancelar</button><button type="submit" className="btn btn-primary px-5 fw-bold rounded-pill shadow-sm">Generar Orden</button></div>
                </form>
            </Modal>
        </div>
    );
};

export default Orders;
