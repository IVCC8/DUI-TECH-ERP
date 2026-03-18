import { useState, useEffect } from 'react';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Card, StatCard } from '../components/Card/card';
import KpiModule from '../components/ui/KpiModule';
import useKpiData from '../hooks/useKpiData';
import useApi from '../hooks/useApi';

const Inventory = () => {
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const role = user?.role || 'client';
    const isAdmin = role === 'admin';
    const isSeller = role === 'seller';
    const isClient = role === 'client';
    
    const { data: products, loading, postData, deleteData } = useApi('products');
    const [search, setSearch] = useState('');
    const { data: kpi } = useKpiData('inventory');
    const [hasNotified, setHasNotified] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

    const filteredProducts = (products || []).filter(p =>
        (p.name||'').toLowerCase().includes(search.toLowerCase()) ||
        (p.brand||'').toLowerCase().includes(search.toLowerCase()) ||
        (p.category||'').toLowerCase().includes(search.toLowerCase())
    );
    const lowStockProducts = (products||[]).filter(p=>(p.stock||0)<=10);
    const fullStockProducts = (products||[]).filter(p=>(p.stock||0)>=100);

    useEffect(() => {
        if (isAdmin && !hasNotified && products?.length > 0) {
            const timer = setTimeout(() => {
                if (lowStockProducts.length > 0) addNotification({ title: 'Alerta de Inventario', text: `${lowStockProducts.length} productos con stock crítico.`, type: 'stock' });
                setHasNotified(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isAdmin, products, lowStockProducts.length, addNotification, hasNotified]);

    const handleDeleteProduct = async (id, name) => {
        if (window.confirm(`¿Eliminar "${name}" del inventario?`)) {
            const success = await deleteData(id);
            if (success) addNotification({ title: 'Producto Eliminado', text: `"${name}" removido.`, type: 'info' });
        }
    };
    const handleExport = (type) => addNotification({ title: 'Exportación Iniciada', text: `Generando reporte en ${type}...`, type: 'success' });
    const handleAddProduct = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const success = await postData({ name: fd.get('name'), brand: fd.get('brand'), category: fd.get('category'), price: parseFloat(fd.get('price')), costPrice: parseFloat(fd.get('costPrice')||0), stock: parseInt(fd.get('stock')), model: fd.get('model') });
        if (success) { addNotification({ title: 'Inventario Actualizado', text: `"${fd.get('name')}" añadido al catálogo.`, type: 'stock' }); setIsModalOpen(false); }
    };

    if (loading) return <div className="p-5 text-center">Cargando inventario...</div>;

    return (
        <div className="container-fluid p-0 inventory-page">
            <div className="info-section mb-5">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <h2 className="display-6 fw-bold text-gradient">{isClient ? 'Mi Catálogo de Hardware' : isSeller ? 'Buscador de Stock & Catálogo' : 'Gestión de Almacén'}</h2>
                        <p className="text-muted fs-5 m-0">{isClient ? 'Consulta tus precios preferenciales y solicita cotizaciones.' : isSeller ? 'Consulta disponibilidad inmediata y Specs técnicas para tus ventas.' : 'Monitorea niveles de stock, registra ingresos y gestiona el catálogo.'}</p>
                    </div>
                    <div className="d-flex gap-2">
                        {isAdmin && (
                            <>
                                <button className="btn btn-outline-primary fw-bold px-4 rounded-pill" onClick={() => handleExport('PDF')}><i className="fas fa-file-pdf me-2"></i>Reporte</button>
                                <button className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 fw-bold rounded-pill shadow-sm" onClick={() => setIsModalOpen(true)}><i className="fas fa-plus small"></i>Registrar Producto</button>
                            </>
                        )}
                        {isSeller && (
                            <button className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 fw-bold rounded-pill shadow-sm" onClick={() => addNotification({title:'Lista de Precios', text:'Descargando catálogo mayorista...', type:'info'})}><i className="fas fa-file-download small"></i>Bajar Lista de Precios</button>
                        )}
                        {isClient && (
                            <button className="btn btn-warning d-flex align-items-center gap-2 px-4 py-2 fw-bold rounded-pill shadow-sm text-dark border-0" onClick={() => addNotification({title:'Solicitud Enviada', text:'Tu ejecutivo te contactará con una cotización.', type:'success'})}><i className="fas fa-file-invoice-dollar small"></i>Solicitar Cotización</button>
                        )}
                    </div>
                </div>
            </div>

            {/* SUMMARY STAT CARDS (Role Specific) */}
            <div className="row g-4 mb-5">
                {isAdmin ? (
                    [
                        { title: 'Total Productos', val: (products||[]).length, sub: 'SKUs en catálogo', icon: 'fa-boxes', color: 'border-primary' },
                        { title: 'Stock Crítico', val: lowStockProducts.length, sub: 'Por debajo de 10 u.', icon: 'fa-exclamation-triangle', color: 'border-danger' },
                        { title: 'Valor en Almacén', val: `$${((products||[]).reduce((a,p)=>a+(p.price||0)*(p.stock||0),0)/1000).toFixed(0)}K`, sub: 'Valuación total', icon: 'fa-warehouse', color: 'border-success' },
                        { title: 'Stock Lleno', val: fullStockProducts.length, sub: 'Sobre 100 unidades', icon: 'fa-layer-group', color: 'border-warning' }
                    ].map((c, i) => (
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
                    [
                        { title: 'Stock Disponible', val: products.reduce((a,p)=>a+(p.stock||0),0), sub: 'Unidades totales', icon: 'fa-box-open', color: 'border-primary' },
                        { title: 'Novedades', val: '12', sub: 'Productos nuevos este mes', icon: 'fa-star', color: 'border-warning' },
                        { title: 'Próximos Arribos', val: '450 u.', sub: 'En tránsito a almacén', icon: 'fa-truck-loading', color: 'border-info' },
                        { title: 'Backorders', val: '3', sub: 'Pendientes por stock', icon: 'fa-history', color: 'border-danger' }
                    ].map((c, i) => (
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
                ) : (
                    [
                        { title: 'Tus Artículos Compone', val: '15', sub: 'Productos en tu historial', icon: 'fa-shopping-bag', color: 'border-primary' },
                        { title: 'Crédito Disponible', val: '$150K', sub: 'Línea autorizada', icon: 'fa-credit-card', color: 'border-success' },
                        { title: 'Cotizaciones Activas', val: '2', sub: 'Vencen en 48 hrs', icon: 'fa-file-invoice-dollar', color: 'border-warning' },
                        { title: 'Puntos DuiPoints', val: '4,850', sub: 'Canjeables por equipo', icon: 'fa-gem', color: 'border-info' }
                    ].map((c, i) => (
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
                )}
            </div>

            {/* KPI MODULE (Admin Only) */}
            {isAdmin && (
                <div className="row mb-5">
                    <div className="col-12 col-xl-8 mx-auto">
                        <KpiModule title="Rotación de Inventario" value={kpi?.rotation||'--'} unit=" veces" description="Eficiencia en Cadena de Suministro" formula="Rotación = COGS / Valor Prom. Inventario" interpretation="Alta rotación = Buenas ventas y poco stock inmovilizado." icon="fas fa-boxes" color="warning"/>
                    </div>
                </div>
            )}

            {/* MAIN CATALOG / SEARCH */}
            <Card className="border-0 shadow-sm overflow-hidden mb-5" noPadding
                title={<><i className={`fas ${isClient ? 'fa-shopping-cart' : 'fa-th'} text-warning me-2 small`}></i>{isClient ? 'Pide según tus precios preferenciales' : isSeller ? 'Catálogo Digital para Ventas' : 'Inventario Maestro'}</>}
                extra={
                    <div className="d-flex gap-2">
                        <div className="btn-group btn-group-sm rounded-pill overflow-hidden border shadow-sm">
                            <button className={`btn ${viewMode==='table'?'btn-primary':'btn-light'}`} onClick={()=>setViewMode('table')}><i className="fas fa-list"></i></button>
                            <button className={`btn ${viewMode==='grid'?'btn-primary':'btn-light'}`} onClick={()=>setViewMode('grid')}><i className="fas fa-th-large"></i></button>
                        </div>
                        {isAdmin && <button className="btn btn-light btn-sm rounded-pill px-3 fw-bold border" onClick={()=>handleExport('EXCEL')}><i className="fas fa-file-csv me-2 text-success"></i>EXCEL</button>}
                    </div>
                }
            >
                <div className="p-4 border-bottom bg-light bg-opacity-10">
                    <div className="input-group input-group-lg shadow-sm rounded-4 overflow-hidden border">
                        <span className="input-group-text bg-white border-0 ps-4"><i className="fas fa-search text-muted"></i></span>
                        <input type="text" placeholder="Buscar por nombre, marca o categoría..." className="form-control border-0 bg-white py-3" value={search} onChange={e=>setSearch(e.target.value)}/>
                    </div>
                </div>

                {viewMode === 'table' ? (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light border-bottom">
                                <tr className="small text-muted text-uppercase tracking-wider">
                                    <th className="ps-4 py-3">Producto</th><th className="py-3">Categoría</th><th className="py-3">{isClient ? 'Tu Precio' : 'Precio Público'}</th><th className="py-3">Stock Disp.</th><th className="pe-4 py-3 text-end">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(filteredProducts||[]).map((p,idx)=>(
                                    <tr key={p.id||`prod-${idx}`}>
                                        <td className="ps-4">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="w-12 h-12 bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center border border-primary-subtle"><i className="fas fa-desktop fs-5"></i></div>
                                                <div><div className="fw-bold text-dark">{p.name||'Sin nombre'}</div><div className="small text-muted opacity-75">{p.brand||'Genérico'} • {p.model||'Sin modelo'}</div></div>
                                            </div>
                                        </td>
                                        <td><span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-3 py-2 rounded-pill fw-bold" style={{fontSize:'10px'}}>{p.category||'Varios'}</span></td>
                                        <td>
                                            <div className="d-flex flex-column">
                                                <span className="fw-extrabold text-primary">$ {(isClient ? (p.price * 0.9) : p.price).toLocaleString()}</span>
                                                {isClient && <span className="x-small text-muted text-decoration-line-through">$ {p.price.toLocaleString()} (-10%)</span>}
                                            </div>
                                        </td>
                                        <td style={{minWidth:'150px'}}>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="flex-grow-1 bg-light rounded-pill overflow-hidden border" style={{height:'8px'}}><div className={`h-100 ${(p.stock||0)<10?'bg-danger':(p.stock||0)<30?'bg-warning':'bg-success'}`} style={{width:`${Math.min(((p.stock||0)/100)*100,100)}%`}}></div></div>
                                                <span className={`x-small fw-extrabold ${(p.stock||0)<10?'text-danger':(p.stock||0)>0?'text-dark':'text-muted'}`}>{p.stock||0 > 0 ? `${p.stock} u.` : 'Sin Stock'}</span>
                                            </div>
                                        </td>
                                        <td className="pe-4 text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                <button className="btn btn-light btn-sm rounded-circle p-2 hover-lift shadow-sm border" title="Ficha Técnica" onClick={()=>{setSelectedProduct(p);setSelectedProduct({...p, negotiated: (p.price*0.9)}); setIsDetailOpen(true);}}><i className="fas fa-file-alt text-primary"></i></button>
                                                {isAdmin && (<><button className="btn btn-light btn-sm rounded-circle p-2 hover-lift shadow-sm border" title="Editar"><i className="fas fa-edit text-info"></i></button><button className="btn btn-light btn-sm rounded-circle p-2 hover-lift shadow-sm border" title="Eliminar" onClick={()=>handleDeleteProduct(p.id,p.name)}><i className="fas fa-trash text-danger"></i></button></>)}
                                                {isSeller && <button className="btn btn-success btn-sm rounded-pill px-3 fw-bold" onClick={()=>addNotification({title:'Carrito Actualizado', text:'Producto añadido a la cotización.', type:'success'})}><i className="fas fa-plus me-1"></i>Vender</button>}
                                                {isClient && <button className="btn btn-primary btn-sm rounded-pill px-3 fw-bold" disabled={p.stock <= 0} onClick={()=>addNotification({title:'Pedido de Stock', text:'Tu pedido ha pasado a revisión.', type:'success'})}><i className="fas fa-shopping-cart me-1"></i>Añadir</button>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-4">
                        <div className="row g-4">
                            {(filteredProducts||[]).map((p,idx)=>(
                                <div key={idx} className="col-12 col-md-6 col-xl-4 col-xxl-3">
                                    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-lift" style={{border: '1px solid #eee !important'}}>
                                        <div className="bg-light p-4 text-center position-relative" style={{minHeight:'180px', display:'flex', justifyContent:'center', alignItems:'center'}}>
                                            <i className="fas fa-laptop fs-1 text-primary opacity-25"></i>
                                            <span className="position-absolute top-0 end-0 m-3 badge bg-white text-dark shadow-sm rounded-pill border">{p.brand}</span>
                                            {isClient && <div className="position-absolute bottom-0 start-0 m-2"><span className="badge bg-warning text-dark fw-bold rounded-pill">VIP Price</span></div>}
                                        </div>
                                        <div className="card-body p-3">
                                            <div className="x-small text-muted text-uppercase fw-bold mb-1">{p.category}</div>
                                            <h6 className="fw-bold text-dark text-truncate mb-2">{p.name}</h6>
                                            <div className="d-flex justify-content-between align-items-center mt-3">
                                                <div>
                                                    <div className="h5 fw-extrabold text-primary m-0">$ {(isClient ? (p.price * 0.9) : p.price).toLocaleString()}</div>
                                                    <div className="x-small text-muted">{p.stock} pzas disp.</div>
                                                </div>
                                                <button className="btn btn-primary rounded-circle" style={{width:'36px', height:'36px', display:'flex', justifyContent:'center', alignItems:'center'}} onClick={()=>{setSelectedProduct(p); setIsDetailOpen(true);}}><i className="fas fa-info small"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Card>

            {/* SELLER - PROXIMOS ARRIBOS / CATALOGO DIGITAL */}
            {isSeller && (
                <div className="row g-4 mb-5">
                    <div className="col-12 col-lg-7">
                        <Card title={<><i className="fas fa-truck-loading text-info me-2"></i>Stock en Arribo (Próximos 7 días)</>} noPadding>
                            <div className="table-responsive">
                                <table className="table align-middle mb-0">
                                    <thead className="table-light"><tr className="x-small text-muted text-uppercase fw-bold"><th className="ps-4">Producto</th><th>Cantidad</th><th>ETA</th><th>Prioridad</th></tr></thead>
                                    <tbody>
                                        {[{name:'MacBook Air M3', qty:25, eta:'12 Mar', prio:'Alta'},{name:'Magic Mouse Gen 3', qty:100, eta:'14 Mar', prio:'Media'},{name:'Monitor Dell UltraSharp', qty:12, eta:'15 Mar', prio:'Baja'}].map((p,i)=>(
                                            <tr key={i}>
                                                <td className="ps-4 fw-bold small">{p.name}</td>
                                                <td className="small">{p.qty} u.</td>
                                                <td className="small text-primary fw-bold">{p.eta}</td>
                                                <td><span className={`badge rounded-pill x-small ${p.prio==='Alta'?'bg-danger':'bg-secondary'}`}>{p.prio}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                    <div className="col-12 col-lg-5">
                        <Card title={<><i className="fas fa-qrcode text-primary me-2"></i>Catálogo QR para Clientes</>} className="bg-dark text-white shadow-lg overflow-hidden border-0">
                            <div className="d-flex align-items-center gap-4">
                                <div className="bg-white p-2 rounded-3 shadow-sm" style={{width:'100px', height:'100px'}}><div className="w-100 h-100 bg-dark opacity-10 d-flex align-items-center justify-content-center fw-bold text-dark x-small text-center px-1">QR CODE GENERATING</div></div>
                                <div className="flex-1">
                                    <h6 className="fw-bold mb-1">Link de Exhibición</h6>
                                    <p className="x-small opacity-75 mb-3">Escanea para mostrar catálogo a clientes sin precios de costo.</p>
                                    <button className="btn btn-primary btn-sm rounded-pill fw-bold w-100"><i className="fas fa-share-alt me-2"></i>Compartir Link</button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* CLIENT - MIS COTIZACIONES / SOPORTE */}
            {isClient && (
                <div className="row g-4 mb-5">
                    <div className="col-12 col-lg-8">
                        <Card title={<><i className="fas fa-file-invoice-dollar text-warning me-2"></i>Mis Cotizaciones Pendientes</>} noPadding>
                            <div className="table-responsive">
                                <table className="table align-middle mb-0">
                                    <thead className="table-light"><tr className="x-small text-muted text-uppercase fw-bold"><th className="ps-4">Folio</th><th>Fecha</th><th>Vence</th><th>Monto</th><th>Estado</th><th className="pe-4 text-end">Acción</th></tr></thead>
                                    <tbody>
                                        {[{id:'COT-9901',date:'10 Mar',expiry:'15 Mar',total:12400,status:'Vigente'},{id:'COT-9875',date:'05 Mar',expiry:'Expired',total:4500,status:'Vencida'}].map((c,i)=>(
                                            <tr key={i}>
                                                <td className="ps-4 fw-bold small">#{c.id}</td>
                                                <td className="small text-muted">{c.date}</td>
                                                <td className={`small ${c.expiry==='Expired'?'text-danger fw-bold':'text-muted'}`}>{c.expiry}</td>
                                                <td className="fw-extrabold text-primary small">$ {c.total.toLocaleString()}</td>
                                                <td><span className={`badge rounded-pill x-small ${c.status==='Vigente'?'bg-success':'bg-secondary'}`}>{c.status}</span></td>
                                                <td className="pe-4 text-end"><button className="btn btn-sm btn-light border rounded-pill" disabled={c.status==='Vencida'}>Pagar Ahora</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                    <div className="col-12 col-lg-4">
                        <Card title={<><i className="fas fa-headset text-primary me-2"></i>Servicio Concierge</>} className="bg-primary text-white border-0 shadow-lg">
                            <p className="small mb-4 opacity-75">Tus precios preferenciales están activos. Si requieres un volumen mayor, solicita un "Special Deal" con tu asesor.</p>
                            <div className="d-flex align-items-center gap-3 bg-white bg-opacity-10 p-3 rounded-4">
                                <div className="bg-white rounded-circle p-2" style={{width:'40px',height:'40px'}}><i className="fas fa-user-tie text-primary"></i></div>
                                <div><div className="small fw-bold">Laura Sánchez</div><div className="x-small opacity-75">Ejecutiva VIP Asignada</div></div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* ADMIN - ZONAS Y WAREHOUSE (Only for Admin) */}
            {isAdmin && (
                <div className="row g-4 mb-5">
                    <div className="col-12 col-lg-5">
                        <Card title={<><i className="fas fa-map-marker-alt text-info me-2"></i>Almacén: Capacidad por Zona</>}>
                             <div className="d-grid gap-3">
                                {[{zone:'Zona A — Entradas',capacity:85,color:'bg-primary'},{zone:'Zona B — Alta Rotación',capacity:62,color:'bg-success'},{zone:'Zona C — Despacho',capacity:45,color:'bg-warning'}].map((z,i)=>(
                                    <div key={i}>
                                        <div className="d-flex justify-content-between x-small fw-bold mb-1"><span>{z.zone}</span><span className="text-muted">{z.capacity}%</span></div>
                                        <div className="progress rounded-pill shadow-sm" style={{height:'8px'}}><div className={`progress-bar ${z.color}`} style={{width:`${z.capacity}%`}}></div></div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                    <div className="col-12 col-lg-7">
                        <Card title={<><i className="fas fa-file-invoice text-primary me-2"></i>Órdenes de Compra a Proveedores</>} noPadding>
                             <div className="table-responsive">
                                <table className="table align-middle mb-0">
                                    <thead className="table-light"><tr className="x-small text-muted text-uppercase fw-bold"><th className="ps-4">OC #</th><th>Proveedor</th><th>Monto</th><th>Estado</th></tr></thead>
                                    <tbody>
                                        {[{id:'OC-2041',supp:'Apple MX',amount:160000,status:'En Tránsito'},{id:'OC-2042',supp:'Dell Tech',amount:45000,status:'Confirmada'}].map((oc,i)=>(
                                            <tr key={i}>
                                                <td className="ps-4 small">#{oc.id}</td>
                                                <td className="small fw-bold">{oc.supp}</td>
                                                <td className="small fw-extrabold text-primary">${oc.amount.toLocaleString()}</td>
                                                <td><span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill x-small">{oc.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* MODALS */}
            <Modal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} title="Registrar Producto en Inventario">
                <form onSubmit={handleAddProduct} className="row g-4 p-2">
                    <div className="col-md-8"><label className="form-label fw-bold small text-muted text-uppercase">Nombre del Producto</label><input name="name" required className="form-control rounded-3" placeholder='Ej: Monitor Gamer LG 27"'/></div>
                    <div className="col-md-4"><label className="form-label fw-bold small text-muted text-uppercase">Modelo</label><input name="model" required className="form-control rounded-3" placeholder="X-200"/></div>
                    <div className="col-md-6"><label className="form-label fw-bold small text-muted text-uppercase">Marca</label><input name="brand" required className="form-control rounded-3" placeholder="Samsung, Dell..."/></div>
                    <div className="col-md-6"><label className="form-label fw-bold small text-muted text-uppercase">Categoría</label><select name="category" className="form-select rounded-3"><option>Laptops</option><option>Monitores</option><option>Accesorios</option><option>Componentes</option><option>Periféricos</option></select></div>
                    <div className="col-md-6"><label className="form-label fw-bold small text-muted text-uppercase">Precio de Venta ($)</label><div className="input-group"><span className="input-group-text bg-light">$</span><input name="price" type="number" min="0" step="0.01" required className="form-control rounded-end-3"/></div></div>
                    <div className="col-md-6"><label className="form-label fw-bold small text-muted text-uppercase">Stock Inicial</label><input name="stock" type="number" min="0" required className="form-control rounded-3"/></div>
                    <div className="col-12 mt-5 text-end"><button type="button" onClick={()=>setIsModalOpen(false)} className="btn btn-light px-4 me-2 rounded-pill fw-bold">Cancelar</button><button type="submit" className="btn btn-primary px-5 fw-bold rounded-pill shadow-sm">Guardar</button></div>
                </form>
            </Modal>
            
            <Modal isOpen={isDetailOpen} onClose={()=>setIsDetailOpen(false)} title={`Información del Producto: ${selectedProduct?.name}`}>
                <div className="p-2">
                    <div className="row g-4 mb-4">
                        <div className="col-6"><label className="small text-muted text-uppercase fw-extrabold d-block mb-1">Precio {(isClient||isSeller) && 'Preferencial'}</label><div className="h4 fw-extrabold text-primary">$ {(selectedProduct?.negotiated || selectedProduct?.price || 0).toLocaleString()}</div></div>
                        <div className="col-6"><label className="small text-muted text-uppercase fw-extrabold d-block mb-1">Stock Actual</label><div className={`h4 fw-extrabold m-0 ${selectedProduct?.stock<10?'text-danger':'text-success'}`}>{selectedProduct?.stock || 0} unidades</div></div>
                    </div>
                    <h6 className="fw-bold mb-3 border-bottom pb-2 text-uppercase tracking-wider small text-muted">Características Técnicas</h6>
                    <div className="bg-light p-3 rounded-4 mb-4">
                        <div className="row g-2">
                            <div className="col-6 small fw-bold">Categoría:</div><div className="col-6 small text-muted">{selectedProduct?.category}</div>
                            <div className="col-6 small fw-bold">Marca:</div><div className="col-6 small text-muted">{selectedProduct?.brand}</div>
                            <div className="col-6 small fw-bold">Modelo:</div><div className="col-6 small text-muted">{selectedProduct?.model}</div>
                            <div className="col-6 small fw-bold">Garantía:</div><div className="col-6 small text-muted">12 meses con DuiTech</div>
                        </div>
                    </div>
                    {(isClient || isSeller) && (
                        <div className="d-grid gap-2">
                            <button className="btn btn-outline-primary rounded-pill fw-bold" onClick={()=>addNotification({title:'Descarga', text:'Ficha técnica PDF guardada.', type:'info'})}><i className="fas fa-file-download me-2"></i>Descargar Ficha Técnica (PDF)</button>
                            <button className="btn btn-primary rounded-pill fw-bold py-2 mt-2">{isSeller ? 'Añadir a Cotización' : 'Añadir al Carrito'}</button>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default Inventory;
