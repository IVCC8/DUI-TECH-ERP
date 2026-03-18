import { useState, useMemo } from 'react';
import Modal from '../components/ui/Modal';
import { initialOrders } from '../context/mockData';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/ui/StatCard';
import useLocalStorage from '../hooks/useLocalStorage';
import KpiModule from '../components/ui/KpiModule';
import useKpiData from '../hooks/useKpiData';
import useApi from '../hooks/useApi';
import { Card } from '../components/Card/card';

const generateSaleId = () => 'V-' + Math.floor(Math.random() * 9000 + 1000);

const MySales = () => {
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const [sales, setSales] = useLocalStorage('duitech_orders', initialOrders);
    const { data: inventory, loading: loadingProducts } = useApi('products');
    const [cart, setCart] = useState([]);
    const [isPosOpen, setIsPosOpen] = useState(false);
    const [search, setSearch] = useState('');
    const { data: kpi } = useKpiData('sales');

    const isAdmin = user?.role === 'admin';
    const isSeller = user?.role === 'seller';
    const isClient = user?.role === 'client';

    const addToCart = (product) => {
        const exists = cart.find(item => item.id === product.id);
        if (exists) {
            setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
        } else {
            setCart([...cart, { ...product, qty: 1 }]);
        }
    };

    const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.qty), 0), [cart]);

    const { postData: recordSale } = useApi('financial');

    const handleFinalizeSale = async (e) => {
        e.preventDefault();
        const clientName = e.target.clientName.value || 'Venta Mostrador';
        
        await recordSale({
            type: 'INVOICE',
            amount: cartTotal,
            status: 'PAID'
        });

        const newSale = {
            id: generateSaleId(),
            date: 'Ahora',
            client: clientName,
            clientName: clientName,
            total: cartTotal,
            items: cart.reduce((acc, i) => acc + i.qty, 0),
            status: 'Entregado'
        };

        setSales([newSale, ...sales]);
        
        addNotification({
            title: 'Venta Registrada',
            text: `Venta #${newSale.id} por $${cartTotal.toLocaleString()} a ${clientName}.`,
            type: 'order'
        });

        setCart([]);
        setIsPosOpen(false);
    };

    // Client filter: only show their orders
    const filteredSales = isClient ? sales.filter(s => s.client === user?.name || s.clientName === user?.name) : sales;

    const sellerLeaderboard = [
        { name: 'Carlos Ruiz', sales: 42, revenue: '$1.2M', growth: '+12%', color: 'primary' },
        { name: 'Ana Beltrán', sales: 38, revenue: '$980k', growth: '+8%', color: 'success' },
        { name: 'Luis Morales', sales: 35, revenue: '$850k', growth: '-2%', color: 'warning' },
        { name: 'Sofía Lara', sales: 29, revenue: '$720k', growth: '+15%', color: 'info' }
    ];

    return (
        <div className="container-fluid p-0">
            <div className="info-section mb-5" data-aos="fade-down">
                <h2 className="display-6 fw-bold text-gradient">
                    {isAdmin ? 'Panel de Control de Ingresos' : isClient ? 'Mis Compras y Pedidos' : 'Mi Terminal de Ventas (POS)'}
                </h2>
                <p className="text-muted fs-5">
                    {isAdmin ? 'Supervisión global de ventas y rendimiento de fuerza comercial.' : 
                     isClient ? 'Seguimiento de pedidos, facturas y puntos de lealtad.' : 
                     'Realiza ventas rápidas y gestiona tus comisiones diarias.'}
                </p>
            </div>

            {/* KPI MODULE for Admin/Seller */}
            {(isAdmin || isSeller) && (
                <div className="row mb-5" data-aos="zoom-in">
                    <div className="col-12 col-xl-10 mx-auto">
                        <KpiModule 
                            title={isAdmin ? "Ingreso Bruto Mensual (Consolidado)" : "Tasa de Conversión Personal"}
                            value={isAdmin ? "$ 4.2M" : (kpi?.conversionRate || '24%')}
                            unit={isAdmin ? "MXN" : "%"}
                            description={isAdmin ? "Total facturado a través de todos los canales de venta." : "Efectividad Comercial y Retorno de Marketing."}
                            formula={isAdmin ? "Ingreso = Σ(Ventas Cerradas)" : "Tasa Conv. = (Ventas Cerradas / Leads Generados) * 100"}
                            icon={isAdmin ? "fas fa-chart-line" : "fas fa-handshake"}
                            color={isAdmin ? "accent" : "primary"}
                        />
                    </div>
                </div>
            )}

            {/* ROLE-BASED STAT CARDS */}
            <div className="row g-4 mb-5" data-aos="fade-up">
                <div className="col-12 col-md-4">
                    <StatCard 
                        title={isClient ? "Total Invertido" : "Total Ventas Periodo"} 
                        value={isClient ? "$ 82,400" : "$ 1.2M"} 
                        sub={isClient ? "5 pedidos realizados" : "Meta: $ 1.5M"} 
                        icon="fa-wallet" 
                        trend="up" 
                    />
                </div>
                <div className="col-12 col-md-4">
                    <StatCard 
                        title={isClient ? "Puntos de Lealtad" : "Promedio de Ticket"} 
                        value={isClient ? "4,250 pts" : "$ 28,500"} 
                        sub={isClient ? "Equivale a $ 425 MXN" : "Crecimiento del 5%"} 
                        icon={isClient ? "fa-star" : "fa-receipt"} 
                        trend="neutral" 
                    />
                </div>
                <div className="col-12 col-md-4">
                    {isClient ? (
                         <div className="card h-100 border-0 shadow-sm p-4 bg-accent text-white hover-lift translate-y-n2">
                            <div className="d-flex justify-content-between mb-3"><h6 className="fw-bold m-0 opacity-75">Nivel de Cliente</h6><i className="fas fa-crown opacity-50"></i></div>
                            <div className="h2 fw-extrabold mb-1">Platinum VIP</div>
                            <p className="small opacity-75 mb-0">Disfrutas de un 10% de descuento extra.</p>
                        </div>
                    ) : (
                        <div 
                            onClick={() => setIsPosOpen(true)}
                            className="card h-100 border-0 shadow-sm p-4 bg-primary text-white cursor-pointer hover-lift translate-y-n2"
                        >
                            <div className="d-flex justify-content-between mb-3"><h6 className="fw-bold m-0 opacity-75">Comercio Rápido</h6><i className="fas fa-keyboard opacity-50"></i></div>
                            <div className="h2 fw-extrabold mb-1">Abrir POS</div>
                            <p className="small opacity-75 mb-0">F2 • Iniciar nueva terminal de venta</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="row g-4 mb-5" data-aos="fade-up">
                {/* SALES LIST / PURCHASE HISTORY */}
                <div className={isAdmin ? "col-12 col-lg-8" : "col-12"}>
                    <Card title={isClient ? "Historial de Compras" : "Registro de Transacciones"} icon="fa-history" noPadding>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr className="xx-small uppercase tracking-wider text-muted">
                                        <th className="ps-4">Folio</th>
                                        <th>Fecha</th>
                                        {!isClient && <th>Cliente</th>}
                                        <th>Artículos</th>
                                        <th>Monto Total</th>
                                        <th>Estado</th>
                                        <th className="pe-4 text-end">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSales.slice(0, 8).map((sale, idx) => (
                                        <tr key={idx} className="small">
                                            <td className="ps-4"><span className="badge bg-light text-dark border fw-bold">#{sale.id}</span></td>
                                            <td className="text-muted">{sale.date === 'Ahora' ? 'Hoy' : sale.date}</td>
                                            {!isClient && <td className="fw-bold text-dark">{sale.client || 'Venta Local'}</td>}
                                            <td>{sale.items} items</td>
                                            <td className="fw-bold text-primary">$ {(sale.total || 0).toLocaleString()}</td>
                                            <td>
                                                <span className={`badge rounded-pill px-3 py-1 ${sale.status === 'Entregado' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                                                    {sale.status}
                                                </span>
                                            </td>
                                            <td className="pe-4 text-end">
                                                <button className="btn btn-sm btn-light text-primary rounded-circle shadow-xs me-2" title="Detalles"><i className="fas fa-eye"></i></button>
                                                {isClient && <button className="btn btn-sm btn-outline-primary rounded-pill px-3 x-small fw-bold">Reordenar</button>}
                                                {!isClient && <button className="btn btn-sm btn-light text-muted rounded-circle shadow-xs"><i className="fas fa-print"></i></button>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* ADMIN LEADERBOARD */}
                {isAdmin && (
                    <div className="col-12 col-lg-4">
                        <Card title="Ranking de Vendedores" icon="fa-trophy">
                            <div className="d-grid gap-3">
                                {sellerLeaderboard.map((seller, idx) => (
                                    <div key={idx} className="p-3 bg-light rounded-4 border-start border-4 border-primary hover-lift transition-all">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <div className="fw-bold small">{seller.name}</div>
                                            <span className={`badge bg-${seller.color} rounded-pill x-small`}>{seller.growth}</span>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-end">
                                            <div>
                                                <div className="xx-small text-muted uppercase fw-bold">Volumen</div>
                                                <div className="small fw-extrabold text-dark">{seller.sales} ventas</div>
                                            </div>
                                            <div className="text-end">
                                                <div className="xx-small text-muted uppercase fw-bold">Revenue</div>
                                                <div className="small fw-extrabold text-primary">{seller.revenue}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            {/* SELLER COMMISSION PREVIEW (ONLY FOR SELLERS) */}
            {isSeller && (
                <div className="row g-4 mb-5" data-aos="fade-up" data-aos-delay="200">
                    <div className="col-12 col-lg-6">
                        <Card title="Simulador de Comisión" icon="fa-calculator">
                             <div className="p-4 bg-dark text-white rounded-4 shadow-lg position-relative overflow-hidden">
                                <i className="fas fa-coins position-absolute end-0 bottom-0 display-1 opacity-10 m-n3"></i>
                                <h6 className="fw-bold text-accent mb-4">Calcula tu Bono Trimestral</h6>
                                <div className="row g-3 mb-4">
                                    <div className="col-8">
                                        <label className="xx-small uppercase opacity-75 mb-1 d-block">Monto Facturado Estimado</label>
                                        <input type="number" className="form-control form-control-sm bg-white/10 border-white/20 text-white fw-bold" placeholder="$ 500k" />
                                    </div>
                                    <div className="col-4">
                                         <label className="xx-small uppercase opacity-75 mb-1 d-block">% Bono</label>
                                         <input type="text" className="form-control form-control-sm bg-white/10 border-white/20 text-white text-center fw-bold" value="3.5%" readOnly />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center bg-white/5 p-3 rounded-3 border border-white/10">
                                    <span className="small opacity-75">Bono Proyectado</span>
                                    <span className="h4 m-0 fw-extrabold text-accent">$ 17,500</span>
                                </div>
                             </div>
                        </Card>
                    </div>
                    <div className="col-12 col-lg-6">
                        <Card title="Próximos Pagos" icon="fa-calendar-check">
                            <div className="list-group list-group-flush">
                                {[{ date: '15 Mar', type: 'Comisión Quincenal', amount: '$ 8,420' }, { date: '31 Mar', type: 'Bono Productividad', amount: '$ 2,500' }].map((p, i) => (
                                    <div key={i} className="list-group-item px-0 border-0 d-flex justify-content-between align-items-center mb-3">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="bg-light p-2 rounded-3 text-center" style={{ minWidth: '55px' }}>
                                                <div className="xx-small text-muted fw-bold uppercase">{p.date.split(' ')[1]}</div>
                                                <div className="small fw-extrabold text-dark">{p.date.split(' ')[0]}</div>
                                            </div>
                                            <div>
                                                <div className="small fw-bold text-dark">{p.type}</div>
                                                <div className="xx-small text-muted">Pago Programado</div>
                                            </div>
                                        </div>
                                        <div className="fw-extrabold text-success">{p.amount}</div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* SELLER INSIGHTS & TOP PRODUCTS TO FILL GAP */}
            {isSeller && (
                <div className="row g-4 mb-5" data-aos="fade-up">
                    <div className="col-12 col-lg-7">
                        <Card title="Productos Estrella (Tu Top 3)" icon="fa-chart-pie">
                            <div className="d-grid gap-3 p-2">
                                {[
                                    { name: 'MacBook Pro M3 Max', pct: 45, color: 'bg-primary' },
                                    { name: 'Servidor Dell PowerEdge', pct: 35, color: 'bg-info' },
                                    { name: 'Licencia Microsoft 365 E5', pct: 20, color: 'bg-warning' }
                                ].map((item, idx) => (
                                    <div key={idx}>
                                        <div className="d-flex justify-content-between x-small mb-1">
                                            <span className="fw-bold">{item.name}</span>
                                            <span className="fw-extrabold text-muted">{item.pct}% de tus ventas</span>
                                        </div>
                                        <div className="progress" style={{ height: '8px' }}>
                                            <div className={`progress-bar ${item.color} progress-bar-striped`} style={{ width: `${item.pct}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                    <div className="col-12 col-lg-5">
                        <Card title="Radar de Oportunidades" icon="fa-radar" className="bg-primary-subtle border-0">
                            <div className="d-flex align-items-center gap-4 p-2">
                                <div className="bg-white p-3 rounded-circle shadow-sm flex-shrink-0">
                                    <i className="fas fa-bullseye text-primary fs-3"></i>
                                </div>
                                <div>
                                    <h6 className="fw-bold text-dark mb-1">Renovaciones Cercanas</h6>
                                    <p className="small text-muted mb-2">Tienes <strong>4</strong> clientes cuyas pólizas de soporte vencen este mes.</p>
                                    <button className="btn btn-sm btn-primary rounded-pill x-small fw-bold px-3">Ver Lista</button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* NEW ADDITION FOR SELLER: CRM AND MATERIAL */}
            {isSeller && (
                <div className="row g-4 mb-5" data-aos="fade-up">
                    <div className="col-12 col-lg-8">
                        <Card title="Seguimiento de Leads (CRM Básico)" icon="fa-address-book">
                            <div className="table-responsive">
                                <table className="table align-middle mb-0">
                                    <thead className="table-light">
                                        <tr className="xx-small uppercase text-muted">
                                            <th>Prospecto</th>
                                            <th>Empresa</th>
                                            <th>Interés</th>
                                            <th>Estado</th>
                                            <th className="text-end">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { name: 'Miguel Ángel', company: 'Tech Solutions MX', interest: 'Laptops Pro', status: 'En Negociación', color: 'primary' },
                                            { name: 'Diana Rivera', company: 'Designers Inc.', interest: 'Monitores 4K', status: 'Cotización Enviada', color: 'info' },
                                            { name: 'Jorge Pérez', company: 'Freelance', interest: 'Periféricos', status: 'Nuevo Contacto', color: 'warning' }
                                        ].map((lead, idx) => (
                                            <tr key={idx} className="small">
                                                <td className="fw-bold">{lead.name}</td>
                                                <td className="text-muted">{lead.company}</td>
                                                <td>{lead.interest}</td>
                                                <td><span className={`badge bg-${lead.color}-subtle text-${lead.color} rounded-pill`}>{lead.status}</span></td>
                                                <td className="text-end">
                                                    <button className="btn btn-sm btn-outline-primary rounded-pill px-3 x-small fw-bold"><i className="fas fa-phone-alt me-1"></i> Llamar</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                    <div className="col-12 col-lg-4">
                        <Card title="Material de Apoyo" icon="fa-folder-open">
                            <div className="d-grid gap-3">
                                {[
                                    { title: 'Catálogo Q1 2026', type: 'PDF', size: '2.4 MB', icon: 'fa-file-pdf', color: 'danger' },
                                    { title: 'Promo Servidores', type: 'IMG', size: '1.1 MB', icon: 'fa-image', color: 'info' },
                                    { title: 'Plantilla de Cotización', type: 'DOCX', size: '800 KB', icon: 'fa-file-word', color: 'primary' }
                                ].map((doc, idx) => (
                                    <div key={idx} className="p-3 bg-light rounded-4 d-flex justify-content-between align-items-center hover-lift cursor-pointer border">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className={`bg-${doc.color}-subtle p-2 rounded-circle text-center d-flex align-items-center justify-content-center`} style={{ width: '40px', height: '40px' }}>
                                                <i className={`fas ${doc.icon} text-${doc.color}`}></i>
                                            </div>
                                            <div>
                                                <div className="fw-bold small text-dark">{doc.title}</div>
                                                <div className="xx-small text-muted">{doc.type} • {doc.size}</div>
                                            </div>
                                        </div>
                                        <i className="fas fa-download text-muted hover-text-primary"></i>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* POS MODAL */}
            <Modal isOpen={isPosOpen} onClose={() => setIsPosOpen(false)} title="Terminal de Ventas (Point of Sale)">
                <div className="row g-4" style={{ minHeight: '600px' }}>
                    <div className="col-12 col-lg-8 d-flex flex-column border-end border-light">
                        <div className="input-group mb-4 shadow-sm">
                            <span className="input-group-text bg-white border-end-0"><i className="fas fa-search text-muted"></i></span>
                            <input type="text" placeholder="Buscar productos..." className="form-control border-start-0" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <div className="flex-grow-1 overflow-auto" style={{ maxHeight: '500px' }}>
                            <div className="row g-3">
                                {loadingProducts ? <div>Cargando...</div> : (inventory || []).filter(p => (p.name || '').toLowerCase().includes(search.toLowerCase())).map((p, pIdx) => (
                                    <div className="col-6 col-md-3" key={pIdx}>
                                        <div className="card h-100 border p-3 hover-lift shadow-none cursor-pointer text-center" onClick={() => addToCart(p)}>
                                            <div className="xx-small fw-bold text-muted mb-1 text-uppercase">{p.brand}</div>
                                            <div className="small fw-bold text-dark mb-2 line-clamp-1">{p.name}</div>
                                            <div className="fw-extrabold text-primary small">$ {p.price?.toLocaleString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-4 d-flex flex-column ps-lg-4">
                        <h6 className="fw-bold mb-4 uppercase tracking-widest text-muted"><i className="fas fa-shopping-basket me-2"></i> Orden Actual</h6>
                        <div className="flex-grow-1 overflow-auto bg-light rounded-4 p-3 mb-4">
                             {cart.length === 0 ? <div className="text-center py-5 text-muted small opacity-50"><i className="fas fa-cart-plus display-1 mb-3"></i><br/>Carrito vacío</div> : cart.map((item, idx) => (
                                <div key={idx} className="bg-white p-2 rounded-3 border mb-2 d-flex justify-content-between align-items-center shadow-xs">
                                     <div className="min-w-0 flex-grow-1"><div className="small fw-bold text-dark text-truncate">{item.name}</div><div className="xx-small text-muted">{item.qty} u. x $ {item.price?.toLocaleString()}</div></div>
                                     <div className="fw-bold text-primary small">$ {(item.qty * item.price).toLocaleString()}</div>
                                </div>
                             ))}
                        </div>
                        <div className="border-top pt-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <span className="fw-bold">TOTAL NETO</span>
                                <span className="h4 m-0 fw-extrabold text-primary">$ {cartTotal.toLocaleString()}</span>
                            </div>
                            <form onSubmit={handleFinalizeSale} className="d-grid gap-2">
                                <input name="clientName" placeholder="Identificar Cliente..." className="form-control rounded-pill border-2" />
                                <button type="submit" className="btn btn-primary btn-lg rounded-pill fw-bold shadow-sm mt-2" disabled={cart.length === 0}>Finalizar Transacción</button>
                            </form>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default MySales;

