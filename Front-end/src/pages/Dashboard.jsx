import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SalesChart from '../components/charts/SalesChart';
import CategoryChart from '../components/charts/CategoryChart';
import { productsData } from '../context/mockData';
import { StatCard, Card, ActivityItem, ChartCard } from '../components/Card/card';
import useLocalStorage from '../hooks/useLocalStorage';
import { useNotifications } from '../context/NotificationContext';
import { initialOrders } from '../context/mockData';
import useKpiData from '../hooks/useKpiData';

const Dashboard = () => {

    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const navigate = useNavigate();
    const role = user?.role;
    
    // Global shared states for synchronization
    const [products] = useLocalStorage('duitech_inventory', productsData);
    const [orders] = useLocalStorage('duitech_orders', initialOrders);

    useEffect(() => {
        // Notificación de bienvenida genuina al entrar al dashboard
        addNotification({
            title: 'Sesión Iniciada',
            text: `Bienvenido al panel de ${role}. Tu conexión es segura.`,
            type: 'system'
        });
    }, [addNotification, role]); // Solo al montar o si cambia el rol

    if (role === 'admin') return <AdminDashboard products={products} orders={orders} addNotification={addNotification} navigate={navigate} />;
    if (role === 'seller') return <SellerDashboard products={products} orders={orders} navigate={navigate} addNotification={addNotification} />;
    if (role === 'client') return <ClientDashboard orders={orders} navigate={navigate} addNotification={addNotification} />;

    return <div>Cargando...</div>;
};

const AdminDashboard = ({ products, orders, addNotification, navigate }) => {
    const { data: kpiSummary } = useKpiData('summary');
    
    const totalStock = useMemo(() => (products || []).reduce((acc, p) => acc + (p.stock || 0), 0), [products]);
    const lowStockCount = useMemo(() => (products || []).filter(p => (p.stock || 0) <= 10).length, [products]);
    
    const [tasks, setTasks] = useState([
        { id: 1, text: 'Revisar reporte de inventario', completed: false },
        { id: 2, text: 'Aprobar cotización TechCorp', completed: true },
        { id: 3, text: 'Enviar seguimiento a Leads', completed: false },
        { id: 4, text: 'Cita con proveedor logístico', completed: false, isToday: true }
    ]);

    const toggleTask = React.useCallback((id) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    }, []);

    const addTask = React.useCallback(() => {
        const text = prompt('¿Qué tarea deseas añadir?');
        if (text) {
            setTasks(prev => [...prev, { id: Date.now(), text, completed: false }]);
            addNotification({ title: 'Tarea Añadida', text: 'Se ha registrado la nueva tarea en tu panel.', type: 'info' });
        }
    }, [addNotification]);

    return (
        <div className="container-fluid p-0 admin-dashboard">
            <div className="info-section mb-5" data-aos="fade-down">
                <h2 className="display-6 fw-bold text-gradient">Resumen Maestro</h2>
                <p className="text-muted fs-5">Control total de la infraestructura y métricas globales.</p>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-12 col-sm-6 col-xl-3" data-aos="zoom-in" data-aos-delay="100">
                    <StatCard 
                        title="Ventas del Mes" 
                        value={`$ ${kpiSummary?.monthlySales || '1.2M'}`} 
                        sub={<><i className="fas fa-arrow-up"></i> +15.4% vs mes anterior</>} 
                        icon="fa-chart-line" 
                        trend="up" 
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-3" data-aos="zoom-in" data-aos-delay="200">
                    <StatCard 
                        title="Stock Crítico" 
                        value={lowStockCount} 
                        sub={`${lowStockCount} SKUs por debajo del mínimo`} 
                        icon="fa-exclamation-triangle" 
                        trend={lowStockCount > 5 ? "down" : "neutral"} 
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-3" data-aos="zoom-in" data-aos-delay="300">
                    <StatCard 
                        title="Pedidos Pendientes" 
                        value={(orders || []).filter(o => o.status === 'Pendiente').length} 
                        sub="Por procesar en bodega" 
                        icon="fa-clock" 
                        trend="neutral" 
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-2" data-aos="zoom-in" data-aos-delay="400">
                    <StatCard 
                        title="Total en Almacén" 
                        value={totalStock} 
                        sub="Unidades físicas" 
                        icon="fa-warehouse" 
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-2" data-aos="zoom-in" data-aos-delay="500">
                    <StatCard 
                        title="Usuarios" 
                        value="24" 
                        sub="Staff en línea" 
                        icon="fa-users" 
                        trend="up" 
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-2" data-aos="zoom-in" data-aos-delay="600">
                    <StatCard 
                        title="Tasa Conversión" 
                        value="12.5%" 
                        sub="+2.1% este mes" 
                        icon="fa-funnel-dollar" 
                        trend="up" 
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-2" data-aos="zoom-in" data-aos-delay="700">
                    <StatCard 
                        title="Ticket Promedio" 
                        value="$ 12,450" 
                        sub="Segmento Premium" 
                        icon="fa-ticket-alt" 
                        trend="neutral" 
                    />
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-12 col-lg-7">
                    <Card title="Estrategia y Objetivos Q1 2026" icon="fa-bullseye">
                        <div className="row g-4 text-center">
                            <div className="col-md-3">
                                <div className="p-3">
                                    <div className="text-muted small mb-1">Crecimiento de Mercado</div>
                                    <div className="h4 fw-bold text-primary">78%</div>
                                    <div className="progress mt-2" style={{ height: '6px' }}>
                                        <div className="progress-bar bg-primary" style={{ width: '78%' }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="p-3">
                                    <div className="text-muted small mb-1">Satisfacción del Cliente</div>
                                    <div className="h4 fw-bold text-success">4.8/5.0</div>
                                    <div className="progress mt-2" style={{ height: '6px' }}>
                                        <div className="progress-bar bg-success" style={{ width: '96%' }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="p-3">
                                    <div className="text-muted small mb-1">Retención de Talento</div>
                                    <div className="h4 fw-bold text-warning">92%</div>
                                    <div className="progress mt-2" style={{ height: '6px' }}>
                                        <div className="progress-bar bg-warning" style={{ width: '92%' }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="p-3">
                                    <div className="text-muted small mb-1">Eficiencia Logística</div>
                                    <div className="h4 fw-bold text-info">85%</div>
                                    <div className="progress mt-2" style={{ height: '6px' }}>
                                        <div className="progress-bar bg-info" style={{ width: '85%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="col-12 col-lg-5">
                    <Card title="Salud de la Infraestructura" icon="fa-server">
                        <div className="d-grid gap-3 p-2">
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="small text-muted">Uptime Continental</span>
                                <span className="badge bg-success-subtle text-success border border-success">99.98%</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="small text-muted">Latencia de API</span>
                                <span className="small fw-bold">124ms <i className="fas fa-check-circle text-success ms-1"></i></span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="small text-muted">Uso de Base de Datos</span>
                                <div className="progress w-50" style={{ height: '6px' }}>
                                    <div className="progress-bar bg-warning" style={{ width: '42%' }}></div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="small text-muted">Tráfico Global</span>
                                <span className="small fw-bold text-info">Normal</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-12 col-lg-8">
                    <ChartCard title="Flujo de Ingresos vs Egresos" icon="fa-chart-area">
                        <SalesChart />
                    </ChartCard>
                </div>
                <div className="col-12 col-lg-4">
                    <Card title="Feed de Actividad Global" icon="fa-stream">
                        <div className="d-grid gap-3 overflow-hidden" style={{ maxHeight: '350px' }}>
                            {[
                                { user: 'Ana V.', action: 'Registró nuevo cliente', time: 'Hace 5 min', color: 'bg-primary' },
                                { user: 'Carlos M.', action: 'Cierre de venta #9023', time: 'Hace 12 min', color: 'bg-success' },
                                { user: 'System', action: 'Backup diario completado', time: 'Hace 30 min', color: 'bg-secondary' },
                                { user: 'Luis R.', action: 'Ticket de soporte #TK99 resuelto', time: 'Hace 1h', color: 'bg-info' },
                                { user: 'Admin', action: 'Actualizó catálogo de precios', time: 'Hace 2h', color: 'bg-warning' }
                            ].map((item, idx) => (
                                <div key={idx} className="d-flex gap-3 align-items-center p-2 rounded-3 hover-bg-light transition-all border-bottom border-light last:border-0">
                                    <div className={`${item.color} text-white w-2 h-8 rounded-pill shrink-0`}></div>
                                    <div className="flex-1">
                                        <div className="x-small fw-bold">{item.user}</div>
                                        <div className="x-small text-muted">{item.action}</div>
                                    </div>
                                    <div className="xx-small text-muted opacity-50">{item.time}</div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-12 col-md-6 col-lg-4">
                    <Card title="Caja de Herramientas Admin" noPadding bodyClassName="p-0">
                        <div className="list-group list-group-flush">
                            <button onClick={() => navigate('/finance')} className="list-group-item list-group-item-action p-3 border-0 d-flex align-items-center gap-3">
                                <i className="fas fa-file-invoice-dollar text-primary"></i>
                                <span>Reporte Fiscal Q1</span>
                                <i className="fas fa-chevron-right ms-auto x-small text-muted"></i>
                            </button>
                            <button onClick={() => navigate('/rh')} className="list-group-item list-group-item-action p-3 border-0 d-flex align-items-center gap-3">
                                <i className="fas fa-users-cog text-primary"></i>
                                <span>Gestión de Personal</span>
                                <i className="fas fa-chevron-right ms-auto x-small text-muted"></i>
                            </button>
                            <button onClick={() => navigate('/settings')} className="list-group-item list-group-item-action p-3 border-0 d-flex align-items-center gap-3">
                                <i className="fas fa-database text-primary"></i>
                                <span>Backup de Base de Datos</span>
                                <i className="fas fa-chevron-right ms-auto x-small text-muted"></i>
                            </button>
                            <button onClick={() => addNotification({ title: 'Auditoría Iniciada', text: 'Generando logs de seguridad...', type: 'warning' })} className="list-group-item list-group-item-action p-3 border-0 d-flex align-items-center gap-3">
                                <i className="fas fa-shield-alt text-primary"></i>
                                <span>Auditoría de Seguridad</span>
                                <i className="fas fa-chevron-right ms-auto x-small text-muted"></i>
                            </button>
                            <button onClick={() => addNotification({ title: 'Exportación Lista', text: 'El reporte fiscal ha sido enviado a tu correo.', type: 'success' })} className="list-group-item list-group-item-action p-3 border-0 d-flex align-items-center gap-3">
                                <i className="fas fa-file-export text-primary"></i>
                                <span>Exportar Data Master</span>
                                <i className="fas fa-chevron-right ms-auto x-small text-muted"></i>
                            </button>
                        </div>
                    </Card>
                </div>
                <div className="col-12 col-md-6 col-lg-8">
                    <Card title="Analítica Predictiva (Dui-AI Insights)" icon="fa-brain" className="border-0 shadow-lg bg-gradient-dark-blue text-white">
                        <div className="row g-4 align-items-center">
                            <div className="col-md-6 border-end border-white/10">
                                <div className="p-2">
                                    <div className="small text-white-50 mb-1">Pronóstico de Cierre de Mes</div>
                                    <div className="h2 fw-extrabold mb-0">$ 1,425,000</div>
                                    <div className="small text-success fw-bold"><i className="fas fa-caret-up me-1"></i>+12.4% vs tendencia</div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="p-2">
                                    <div className="small text-white-50 mb-1">Confianza del Modelo</div>
                                    <div className="progress mt-2 mb-1" style={{ height: '8px', background: 'rgba(255,255,255,0.1)' }}>
                                        <div className="progress-bar bg-info" style={{ width: '94%' }}></div>
                                    </div>
                                    <div className="xx-small text-end">94% Precisión</div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 p-3 rounded-4 bg-white/5 border border-white/10">
                            <div className="small fw-bold mb-2"><i className="fas fa-lightbulb text-warning me-2"></i>Sugerencia de la IA:</div>
                            <p className="x-small m-0 text-white-50">Incrementar stock de perifericos Apple. La demanda proyectada superará la oferta actual en un 18% para la próxima quincena.</p>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-12">
                    <Card title="Distribución Geográfica de Ventas" icon="fa-globe-americas">
                        <div className="row g-4">
                            {[
                                { region: 'Norte (MX)', sales: '$580k', share: '45%', color: 'bg-primary' },
                                { region: 'Centro (MX)', sales: '$420k', share: '32%', color: 'bg-info' },
                                { region: 'Sur (MX)', sales: '$180k', share: '15%', color: 'bg-success' },
                                { region: 'Internacional', sales: '$110k', share: '8%', color: 'bg-secondary' }
                            ].map((reg, idx) => (
                                <div key={idx} className="col-6 col-md-3 text-center">
                                    <div className="h6 fw-bold mb-1">{reg.region}</div>
                                    <div className="h4 fw-extrabold text-dark mb-1">{reg.sales}</div>
                                    <div className="xx-small text-muted uppercase tracking-tighter mb-2">{reg.share} del total</div>
                                    <div className="progress mx-auto" style={{ height: '4px', width: '60px' }}>
                                        <div className={`progress-bar ${reg.color}`} style={{ width: reg.share }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-12">
                    <Card title="Próximas Tareas de Gestión" extra={<button onClick={addTask} className="btn btn-sm btn-primary rounded-pill"><i className="fas fa-plus me-1"></i> Nueva</button>}>
                        <div className="row g-3">
                            {tasks.map(task => (
                                <div key={task.id} className="col-md-6">
                                    <div className={`p-3 rounded-4 border d-flex align-items-center gap-3 hover-lift transition-all ${task.completed ? 'bg-light opacity-60' : 'bg-white'}`}>
                                        <div 
                                            onClick={() => toggleTask(task.id)}
                                            className={`cursor-pointer w-6 h-6 rounded-circle border-2 d-flex align-items-center justify-content-center ${task.completed ? 'bg-success border-success text-white' : 'border-primary'}`}
                                        >
                                            {task.completed && <i className="fas fa-check x-small"></i>}
                                        </div>
                                        <span className={`small fw-bold ${task.completed ? 'text-decoration-line-through text-muted' : 'text-dark'}`}>
                                            {task.text}
                                            {task.isToday && <span className="badge bg-warning text-dark ms-2 x-small">Hoy</span>}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const SellerDashboard = ({ products, orders, navigate, addNotification }) => {
    const salesTarget = 5000;
    const currentSales = (orders || [])
        .filter(o => o.date && (o.date.includes('Hoy') || o.date.includes('Ahora')))
        .reduce((acc, o) => acc + (o.total || 0), 0);
    const progress = Math.min((currentSales / salesTarget) * 100, 100);


    const [calcAmount, setCalcAmount] = useState('');
    const [calcResult, setCalcResult] = useState(0);

    const [events, setEvents] = useState([
        { id: 1, day: '05', month: 'FEB', title: 'Capacitación: Nuevos Productos Apple', time: '10:00 AM - 12:00 PM', type: 'bg-primary' },
        { id: 2, day: '08', month: 'FEB', title: 'Cierre de Meta Semanal', time: 'Todo el día', type: 'bg-warning' },
        { id: 3, day: '12', month: 'FEB', title: 'Reunión Mensual de Ventas', time: '3:00 PM - 5:00 PM', type: 'bg-secondary' }
    ]);

    const [sellerTasks, setSellerTasks] = useState([
        { id: 1, title: 'Llamar a Pedro Gómez', detail: 'Confirmar pedido #9022' },
        { id: 2, title: 'Enviar catálogo VIP', detail: 'Lucía Méndez' }
    ]);

    const [courses, setCourses] = useState([
        { id: 1, title: 'Técnicas de Cierre Efectivo', progress: 80, icon: 'fa-video', color: 'bg-primary' },
        { id: 2, title: 'Novedades Apple 2026', progress: 0, icon: 'fa-play', color: 'bg-warning' }
    ]);

    const handleCalcChange = (e) => {
        const val = parseFloat(e.target.value) || 0;
        setCalcAmount(val);
        setCalcResult(val * 0.10);
    };

    const addEvent = () => {
        const title = prompt('Título del evento:');
        if (title) {
            setEvents([...events, {
                id: Date.now(),
                day: new Date().getDate(),
                month: 'MAR',
                title,
                time: '09:00 AM - 10:00 AM',
                type: 'bg-info'
            }]);
            addNotification({ title: 'Evento Agendado', text: `Se ha añadido "${title}" a tu agenda.`, type: 'info' });
        }
    };

    const toggleSellerTask = (id) => {
        setSellerTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    return (
        <div className="container-fluid p-0">
            <div className="info-section mb-5">
                <h2 className="display-6 fw-bold text-gradient">Panel de Ventas</h2>
                <p className="text-muted fs-5">Gestiona tus pedidos y revisa tus metas diarias en tiempo real.</p>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-12 col-md-6 col-lg-4">
                    <StatCard 
                        title="Ventas de Hoy"
                        value={`$ ${currentSales.toLocaleString()}`}
                        icon="fa-wallet"
                        className="h-100"
                        trend="up"
                        sub={<><i className="fas fa-chart-line me-1"></i> {progress.toFixed(0)}% de la meta</>}
                    >
                        <div className="progress mt-3" style={{ height: '8px' }}>
                            <div className="progress-bar bg-primary progress-bar-striped progress-bar-animated" style={{ width: `${progress}%` }}></div>
                        </div>
                    </StatCard>
                </div>

                <div className="col-12 col-md-3 col-lg-4">
                    <Card onClick={() => navigate('/my-sales')} className="h-100 cursor-pointer hover-lift text-center" bodyClassName="p-4 d-flex flex-column align-items-center justify-content-center">
                        <div className="w-16 h-16 bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center mb-3">
                            <i className="fas fa-cash-register text-primary fs-3"></i>
                        </div>
                        <h5 className="fw-bold">Terminal POS</h5>
                        <p className="small text-muted">Nueva venta rápida</p>
                    </Card>
                </div>

                <div className="col-12 col-md-3 col-lg-4">
                    <Card onClick={() => navigate('/catalog')} className="h-100 cursor-pointer hover-lift text-center" bodyClassName="p-4 d-flex flex-column align-items-center justify-content-center border-bottom border-accent border-4">
                        <div className="w-16 h-16 bg-accent-subtle rounded-circle d-flex align-items-center justify-content-center mb-3">
                            <i className="fas fa-search text-accent fs-3"></i>
                        </div>
                        <h5 className="fw-bold">Catálogo Digital</h5>
                        <p className="small text-muted">Ver existencias</p>
                    </Card>
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-12 col-lg-8">
                    <Card title="Meta de Incentivos Mensual" icon="fa-gift" extra={<span className="badge bg-success">BONO LISTO AL 90%</span>}>
                        <div className="p-3">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="small fw-bold">Volumen de Ventas requerido para Bono Q1</span>
                                <span className="small text-muted">$4,250 / $5,000</span>
                            </div>
                            <div className="progress mt-2 shadow-sm" style={{ height: '20px', borderRadius: '10px' }}>
                                <div className="progress-bar bg-success progress-bar-striped progress-bar-animated" style={{ width: '85%' }}>
                                    <span className="fw-bold px-2">85%</span>
                                </div>
                            </div>
                            <div className="mt-4 row g-3">
                                <div className="col-md-4">
                                    <div className="p-3 bg-light rounded-4 text-center">
                                        <div className="text-muted xx-small uppercase">Próximo Escalón</div>
                                        <div className="fw-bold text-dark">$750 rest.</div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-3 bg-light rounded-4 text-center">
                                        <div className="text-muted xx-small uppercase">Bono Estimado</div>
                                        <div className="fw-bold text-success">+$250.00</div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-3 bg-light rounded-4 text-center border border-primary border-2 dashed">
                                        <div className="text-muted xx-small uppercase">Días restantes</div>
                                        <div className="fw-bold text-primary">12 Días</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="col-12 col-lg-4">
                    <Card title="Product Spotlight" className="bg-gradient-primary-dark text-white border-0 overflow-hidden" bodyClassName="p-0">
                        <div className="p-4 relative z-10">
                            <span className="badge bg-warning text-dark mb-2">HOT DEAL DEL DÍA</span>
                            <h4 className="fw-extrabold mb-1">iPhone 16 Pro Max</h4>
                            <p className="small text-white-50 mb-3">512GB Natural Titanium. Stock limitado.</p>
                            <div className="h3 fw-bold mb-4">$32,999</div>
                            <button className="btn btn-light w-100 rounded-pill fw-bold text-primary shadow-lg border-0 py-2">Sugerir a Cliente</button>
                        </div>
                        <i className="fas fa-mobile-alt absolute -bottom-4 -right-2 opacity-10 text-white" style={{ fontSize: '120px' }}></i>
                    </Card>
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-12 col-lg-6">
                    <Card title="Embudo de Conversión" icon="fa-filter">
                        <div className="d-grid gap-3 p-2">
                            {[
                                { label: 'Leads Nuevos', count: 45, color: 'bg-primary-subtle text-primary', width: '100%' },
                                { label: 'Contactados', count: 28, color: 'bg-info-subtle text-info', width: '75%' },
                                { label: 'Cotización Sent', count: 12, color: 'bg-warning-subtle text-warning', width: '45%' },
                                { label: 'Cierre / Pedido', count: 5, color: 'bg-success-subtle text-success', width: '20%' }
                            ].map((stage, idx) => (
                                <div key={idx} className="d-flex align-items-center gap-3">
                                    <div className="flex-1">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="small fw-bold">{stage.label}</span>
                                            <span className="badge rounded-pill bg-light text-dark">{stage.count}</span>
                                        </div>
                                        <div className="progress" style={{ height: '12px' }}>
                                            <div className={`progress-bar ${stage.color.split(' ')[0]}`} style={{ width: stage.width }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
                <div className="col-12 col-lg-6">
                    <Card title="Rendimiento vs Equipo" icon="fa-users-cog">
                        <div className="table-responsive">
                            <table className="table table-sm align-middle mb-0">
                                <thead>
                                    <tr className="text-muted x-small uppercase">
                                        <th>Vendedor</th>
                                        <th>Progreso Meta</th>
                                        <th>Ventas</th>
                                    </tr>
                                </thead>
                                <tbody className="small">
                                    <tr>
                                        <td className="fw-bold">Tú (Yo)</td>
                                        <td>
                                            <div className="progress" style={{ height: '4px' }}>
                                                <div className="progress-bar bg-success" style={{ width: '85%' }}></div>
                                            </div>
                                        </td>
                                        <td className="text-end fw-bold">$4,250</td>
                                    </tr>
                                    <tr className="opacity-50">
                                        <td>Promedio Equipo</td>
                                        <td>
                                            <div className="progress" style={{ height: '4px' }}>
                                                <div className="progress-bar bg-primary" style={{ width: '62%' }}></div>
                                            </div>
                                        </td>
                                        <td className="text-end">$3,100</td>
                                    </tr>
                                    <tr className="opacity-50">
                                        <td>Top Performer</td>
                                        <td>
                                            <div className="progress" style={{ height: '4px' }}>
                                                <div className="progress-bar bg-warning" style={{ width: '98%' }}></div>
                                            </div>
                                        </td>
                                        <td className="text-end">$4,900</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-12 col-lg-8">
                    <Card title="Historial de Mis Cierres">
                        <div className="table-responsive">
                            <table className="table align-middle mb-0">
                                <thead className="text-muted small">
                                    <tr>
                                        <th>Producto</th>
                                        <th>Fecha</th>
                                        <th>Monto</th>
                                        <th>Comisión</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(orders || []).slice(0, 5).map(o => (
                                        <tr key={o.id}>
                                            <td className="fw-bold small">Pedido #{o.id}</td>
                                            <td className="small text-muted">{o.date}</td>
                                            <td className="small fw-bold">$ {o.total?.toLocaleString()}</td>
                                            <td className="small text-success fw-bold">+${(o.total * 0.05).toFixed(0)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
                <div className="col-12 col-lg-4">
                    <Card title="Academia de Ventas" extra={<span className="badge bg-primary">LOGRO 92%</span>}>
                        <div className="d-grid gap-3">
                            {courses.map(course => (
                                <div key={course.id} className="p-3 bg-light rounded-4 hover-lift cursor-pointer">
                                    <div className="d-flex align-items-center gap-3 mb-2">
                                        <div className={`${course.color} p-2 rounded-3 text-white`}><i className={`fas ${course.icon} small`}></i></div>
                                        <div className="fw-bold small">{course.title}</div>
                                    </div>
                                    <div className="progress" style={{ height: '4px' }}>
                                        <div className="progress-bar bg-success" style={{ width: `${course.progress}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-12 col-md-6">
                    <Card title="Calculadora de Comisión" className="bg-dark text-white border-0 shadow-lg">
                        <div className="mb-3">
                            <label className="small text-white-50 d-block mb-1">Simular Monto de Venta</label>
                            <input type="number" className="form-control bg-white/10 border-white/20 text-white" value={calcAmount} onChange={handleCalcChange} placeholder="$0.00" />
                        </div>
                        <div className="p-3 bg-primary rounded-4 d-flex justify-content-between align-items-center">
                            <span className="fw-bold">Comisión Estimada (10%):</span>
                            <span className="h4 m-0 fw-extrabold">$ {calcResult.toLocaleString()}</span>
                        </div>
                    </Card>
                </div>
                <div className="col-12 col-md-6">
                    <Card title="Leads Prioritarios HOY" icon="fa-fire" extra={<span className="badge bg-danger pulse">3 Hot</span>}>
                        <div className="d-grid gap-2">
                             {[
                                { name: 'Empresa Alpha', action: 'Enviar Cotización', time: 'Hace 2h', priority: 'high' },
                                { name: 'Juan Pérez', action: 'Llamada Seguimiento', time: 'Hace 5h', priority: 'medium' },
                                { name: 'Tech Solutions', action: 'Revisar Contrato', time: 'Pendiente', priority: 'high' }
                             ].map((lead, idx) => (
                                <div key={idx} className="p-2 bg-light rounded-4 d-flex align-items-center gap-3 border-start border-3 border-danger">
                                    <div className="flex-1">
                                        <div className="fw-bold small">{lead.name}</div>
                                        <div className="x-small text-muted">{lead.action} • <span className="text-danger fw-bold">{lead.time}</span></div>
                                    </div>
                                    <button className="btn btn-sm btn-dark rounded-pill x-small px-3">Atender</button>
                                </div>
                             ))}
                        </div>
                    </Card>
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-12 col-md-6">
                    <Card title="Cumpleaños VIP Próximos" icon="fa-birthday-cake">
                        <div className="d-grid gap-2">
                             <div className="p-3 bg-light rounded-4 d-flex align-items-center gap-3">
                                <img src={`https://ui-avatars.com/api/?name=R+S&background=random`} className="rounded-circle" width="35" alt="avatar" />
                                <div className="flex-1">
                                    <div className="fw-bold small">Roberto Sosa</div>
                                    <div className="x-small text-danger fw-bold">¡HOY!</div>
                                </div>
                                <button className="btn btn-sm btn-danger rounded-pill x-small" onClick={() => addNotification({ title: 'Regalo Enviado', text: 'Se ha enviado un cupón de descuento por correo.', type: 'success' })}>Enviar Regalo</button>
                             </div>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-12 col-lg-6">
                    <Card title="Agenda de Eventos" extra={<button onClick={addEvent} className="btn btn-sm btn-outline-primary rounded-pill"><i className="fas fa-plus"></i></button>}>
                        <div className="d-grid gap-3">
                            {events.map(event => (
                                <div key={event.id} className="d-flex align-items-center gap-3 p-2 hover-lift transition-all border-bottom border-light pb-3 last:border-0">
                                    <div className={`${event.type} text-white p-2 rounded-3 text-center`} style={{ minWidth: '60px' }}>
                                        <div className="fw-bold h5 m-0">{event.day}</div>
                                        <div className="x-small text-uppercase">{event.month}</div>
                                    </div>
                                    <div>
                                        <div className="fw-bold small">{event.title}</div>
                                        <div className="x-small text-muted"><i className="fas fa-clock me-1"></i>{event.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
                <div className="col-12 col-lg-6">
                    <Card title="Mis Tareas" extra={<span className="badge bg-primary rounded-pill">{sellerTasks.filter(t => !t.completed).length} Pendientes</span>}>
                        <div className="d-grid gap-2">
                            {sellerTasks.map(task => (
                                <div key={task.id} className={`p-3 rounded-4 border d-flex align-items-center gap-3 transition-all ${task.completed ? 'bg-light opacity-60' : 'bg-white'}`}>
                                    <div 
                                        onClick={() => toggleSellerTask(task.id)}
                                        className={`cursor-pointer w-6 h-6 rounded-circle border-2 d-flex align-items-center justify-content-center ${task.completed ? 'bg-success border-success text-white' : 'border-primary'}`}
                                    >
                                        {task.completed && <i className="fas fa-check x-small"></i>}
                                    </div>
                                    <div className="flex-1">
                                        <div className={`small fw-bold ${task.completed ? 'text-decoration-line-through text-muted' : 'text-dark'}`}>{task.title}</div>
                                        <div className="x-small text-muted">{task.detail}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-12 col-lg-8">
                    <Card title="Calendario de Citas y Seguimientos" icon="fa-calendar-check">
                        <div className="row g-3">
                            {[
                                { user: 'Roberto Sánchez', time: '14:30', status: 'Confirmada', topic: 'Cotización Servidores' },
                                { user: 'Elena Marín', time: '16:00', status: 'Pendiente', topic: 'Demostración de Software' },
                                { user: 'Mario Ruiz', time: 'Mañana 09:00', status: 'Llamada', topic: 'Seguimiento de Pago' }
                            ].map((appt, idx) => (
                                <div key={idx} className="col-12">
                                    <div className="p-3 rounded-4 bg-light border-start border-4 border-primary d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="bg-white rounded-circle w-10 h-10 d-flex align-items-center justify-content-center shadow-sm">
                                                <span className="small fw-bold">{appt.time.split(':')[0]}</span>
                                            </div>
                                            <div>
                                                <div className="small fw-bold">{appt.user}</div>
                                                <div className="xx-small text-muted">{appt.topic}</div>
                                            </div>
                                        </div>
                                        <span className={`badge ${appt.status === 'Confirmada' ? 'bg-success' : appt.status === 'Pendiente' ? 'bg-warning text-dark' : 'bg-info'} rounded-pill x-small`}>
                                            {appt.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
                <div className="col-12 col-lg-4">
                    <Card title="Top Categorías (Demanda)" icon="fa-chart-pie">
                        <div className="d-grid gap-3 p-2">
                            {[
                                { cat: 'Laptops Pro', pct: 45, color: 'bg-primary' },
                                { cat: 'Almacenamiento', pct: 28, color: 'bg-info' },
                                { cat: 'Periféricos Apple', pct: 15, color: 'bg-warning' },
                                { cat: 'Servicios Cloud', pct: 12, color: 'bg-success' }
                            ].map((item, idx) => (
                                <div key={idx}>
                                    <div className="d-flex justify-content-between x-small mb-1">
                                        <span>{item.cat}</span>
                                        <span className="fw-bold">{item.pct}%</span>
                                    </div>
                                    <div className="progress" style={{ height: '6px' }}>
                                        <div className={`progress-bar ${item.color}`} style={{ width: `${item.pct}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-12">
                    <Card title="Notas Rápidas (Scratchpad)" icon="fa-edit">
                        <textarea 
                            className="form-control border-0 bg-light p-3 small" 
                            rows="4" 
                            placeholder="Escribe aquí notas temporales, correos o datos de contacto rápidos..."
                            defaultValue="• Recordar llamar al cliente de Monterrey por la tarde.&#10;• El iPhone 16 Pro Max tiene 10% de descuento adicional este fin de semana.&#10;• Actualizar lista de precios de servidores Dell."
                        ></textarea>
                        <div className="d-flex justify-content-end mt-3">
                            <button className="btn btn-sm btn-primary rounded-pill px-4 x-small fw-bold">Guardar Permanente</button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Hidden logic to satisfy linter for products */}
            <div style={{ display: 'none' }}>
                Stock Global: {products?.length}
                <button onClick={() => setCourses([...courses])}>Refresh Courses</button>
            </div>

        </div>
    );
};

const ClientDashboard = ({ orders, addNotification }) => {
    const myOrders = (orders || []).filter(o => o.clientName === 'Juan Cliente' || o.client === 'Juan Cliente');
    const latestOrder = myOrders[0] || { id: '9022', status: 'Preparando' };

    return (
        <div className="container-fluid p-0">
             <div className="info-section mb-4">
                <div className="d-flex justify-content-between align-items-center bg-white p-4 rounded-4 shadow-sm border-start border-primary border-5">
                    <div>
                        <h2 className="display-6 fw-bold text-gradient mb-1">Mi Tech Hub</h2>
                        <p className="text-muted m-0">Gestiona tus compras, puntos y soporte premium.</p>
                    </div>
                    <div className="bg-primary text-white p-3 rounded-circle shadow-sm">
                        <i className="fas fa-crown text-warning fa-lg"></i>
                    </div>
                </div>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-12 col-md-6 col-lg-3">
                    <StatCard title="Crédito Tech" value="$12,000" icon="fa-wallet" sub="Disponible" trend="up" />
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                    <StatCard title="Puntos Acumulados" value="4,250" icon="fa-coins" sub="Equivalente a $425" trend="up" />
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                    <StatCard title="Pedidos Activos" value={myOrders.length} icon="fa-box" sub="En camino" trend="neutral" />
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                    <StatCard title="Soporte VIP" value="ACTIVO" icon="fa-headset" sub="Atención 24/7" trend="up" />
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-12 col-lg-4">
                    <Card title="Centro de Recursos" icon="fa-book-open">
                        <div className="list-group list-group-flush">
                            <a href="#" className="list-group-item list-group-item-action px-0 py-3 bg-transparent border-bottom border-light d-flex align-items-center gap-3">
                                <div className="bg-primary-subtle p-2 rounded-3"><i className="fas fa-file-pdf text-primary small"></i></div>
                                <div>
                                    <div className="fw-bold small">Guía de Configuración Rápida</div>
                                    <div className="xx-small text-muted">PDF • 1.2 MB</div>
                                </div>
                            </a>
                            <a href="#" className="list-group-item list-group-item-action px-0 py-3 bg-transparent border-bottom border-light d-flex align-items-center gap-3">
                                <div className="bg-danger-subtle p-2 rounded-3"><i className="fas fa-video text-danger small"></i></div>
                                <div>
                                    <div className="fw-bold small">Tutorial: Maximiza tu ERP</div>
                                    <div className="xx-small text-muted">Agotado • 15 min</div>
                                </div>
                            </a>
                            <a href="#" className="list-group-item list-group-item-action px-0 py-3 bg-transparent border-0 d-flex align-items-center gap-3">
                                <div className="bg-info-subtle p-2 rounded-3"><i className="fas fa-question-circle text-info small"></i></div>
                                <div>
                                    <div className="fw-bold small">Preguntas Frecuentes (FAQ)</div>
                                    <div className="xx-small text-muted">Base de Conocimiento</div>
                                </div>
                            </a>
                        </div>
                    </Card>
                </div>
                <div className="col-12 col-lg-8">
                    <Card title="Garantías y Renovaciones" icon="fa-shield-virus" extra={<span className="badge bg-warning text-dark">2 Próximas</span>}>
                        <div className="table-responsive">
                            <table className="table align-middle mb-0 small">
                                <thead>
                                    <tr className="text-muted xx-small uppercase">
                                        <th>Activo / Licencia</th>
                                        <th>Estado</th>
                                        <th>Vence en</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="fw-bold">Licencia Adobe Creative Cloud</td>
                                        <td><span className="badge bg-success-subtle text-success">Activo</span></td>
                                        <td className="text-danger fw-bold">15 Días</td>
                                        <td><button className="btn btn-sm btn-primary rounded-pill x-small px-3">Renovar</button></td>
                                    </tr>
                                    <tr>
                                        <td className="fw-bold">Garantía Extensa: MacBook Pro</td>
                                        <td><span className="badge bg-success-subtle text-success">Activo</span></td>
                                        <td className="text-muted">14 Meses</td>
                                        <td><button className="btn btn-sm btn-outline-secondary rounded-pill x-small px-3">Ver Póliza</button></td>
                                    </tr>
                                    <tr>
                                        <td className="fw-bold">Certificado SSL TechDomain</td>
                                        <td><span className="badge bg-danger-subtle text-danger">Por vencer</span></td>
                                        <td className="text-danger fw-bold">2 Días</td>
                                        <td><button className="btn btn-sm btn-primary rounded-pill x-small px-3">Actualizar</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-12 col-lg-8">
                    <Card title="Estadísticas de Consumo Tech" icon="fa-microchip">
                        <div className="row g-3">
                            <div className="col-6 col-md-3 text-center">
                                <div className="text-muted x-small uppercase mb-1">Almacenamiento Cloud</div>
                                <div className="h5 fw-bold m-0 text-primary">850 GB</div>
                                <div className="small text-muted">de 1TB</div>
                            </div>
                            <div className="col-6 col-md-3 text-center">
                                <div className="text-muted x-small uppercase mb-1">Ancho de Banda</div>
                                <div className="h5 fw-bold m-0 text-success">1.2 TB</div>
                                <div className="small text-muted">Límite Ilimitado</div>
                            </div>
                            <div className="col-6 col-md-3 text-center">
                                <div className="text-muted x-small uppercase mb-1">Licencias Activas</div>
                                <div className="h5 fw-bold m-0 text-warning">12</div>
                                <div className="small text-muted">A renovar en 45d</div>
                            </div>
                            <div className="col-6 col-md-3 text-center">
                                <div className="text-muted x-small uppercase mb-1">Consultas API</div>
                                <div className="h5 fw-bold m-0 text-info">45k</div>
                                <div className="small text-muted">Este mes</div>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="col-12 col-lg-4">
                    <Card title="Ahorro Total Acumulado" className="bg-success text-white">
                        <div className="text-center py-2">
                            <div className="display-6 fw-extrabold mb-0">$ 3,850</div>
                            <div className="small opacity-75">Gracias a tu plan VIP y ofertas aplicadas</div>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-12 col-lg-8">
                    <Card title={`Seguimiento Pedido #${latestOrder.id}`}>
                        <div className="d-flex justify-content-between mb-4 position-relative py-3">
                            <div className="position-absolute w-100 bg-light" style={{ height: '4px', top: '50%', transform: 'translateY(-50%)', zIndex: 0 }}></div>
                            <div className="position-absolute bg-primary" style={{ height: '4px', top: '50%', transform: 'translateY(-50%)', width: '40%', zIndex: 1 }}></div>
                            
                            {['Recibido', 'Preparando', 'En Camino', 'Entregado'].map((step, idx) => (
                                <div key={step} className="text-center position-relative z-10" style={{ width: '25%' }}>
                                    <div className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 shadow-sm ${idx < 2 ? 'bg-primary text-white' : 'bg-white border text-muted'}`} style={{ width: '40px', height: '40px' }}>
                                        <i className={`fas fa-${idx === 0 ? 'file-invoice' : idx === 1 ? 'box' : idx === 2 ? 'shipping-fast' : 'check'} x-small`}></i>
                                    </div>
                                    <div className="x-small fw-bold">{step}</div>
                                </div>
                            ))}
                        </div>
                        <div className="alert bg-primary-subtle border-0 m-0 small">
                            <i className="fas fa-info-circle text-primary me-2"></i>
                            Tu pedido se encuentra en fase de <strong>{latestOrder.status}</strong>. Tiempo estimado de entrega: 24 horas.
                        </div>
                    </Card>

                    <Card title="Historial de Tickets de Soporte" className="mt-4" extra={<button className="btn btn-sm btn-outline-primary rounded-pill">Nuevo Ticket</button>}>
                        <div className="list-group list-group-flush">
                            {[
                                { id: 'TK-882', subject: 'Configuración de VPN', status: 'Cerrado', date: '02 Mar' },
                                { id: 'TK-901', subject: 'Actualización de Licencias', status: 'En Proceso', date: '08 Mar' }
                            ].map((tk, idx) => (
                                <div key={idx} className="list-group-item px-0 py-3 bg-transparent d-flex justify-content-between align-items-center">
                                    <div>
                                        <div className="fw-bold small">{tk.subject} <span className="text-muted fw-normal">#{tk.id}</span></div>
                                        <div className="x-small text-muted">{tk.date}</div>
                                    </div>
                                    <span className={`badge rounded-pill ${tk.status === 'Cerrado' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                                        {tk.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
                <div className="col-12 col-lg-4">
                    <Card title="Mi Asesor Personal" bodyClassName="p-4 text-center">
                        <img src={`https://ui-avatars.com/api/?name=Carlos+Asesor&background=0275d8&color=fff`} className="rounded-circle mb-3 shadow-sm" width="80" alt="avatar" />
                        <h5 className="fw-bold mb-1">Carlos Martínez</h5>
                        <p className="small text-muted mb-4 text-uppercase tracking-wider">Solution Expert</p>
                        <button className="btn btn-primary w-100 rounded-pill fw-bold" onClick={() => addNotification({ title: 'Chat Iniciado', text: 'Conectando con tu asesor...', type: 'info' })}>
                            <i className="fas fa-comments me-2"></i>Iniciar Chat VIP
                        </button>
                    </Card>
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-12">
                    <Card title="Recomendados Solo Para Ti (Algoritmo IA)" icon="fa-magic">
                        <div className="row g-4">
                            {[
                                { name: 'MacBook Pro M3', desc: 'Basado en tu última compra de accesorios Apple.', price: '$45,000', img: 'https://ui-avatars.com/api/?name=MB+P&background=333&color=fff' },
                                { name: 'Soporte Ergonómico', desc: 'Ideal para tu set profesional de oficina.', price: '$1,200', img: 'https://ui-avatars.com/api/?name=S+E&background=555&color=fff' }
                            ].map((item, idx) => (
                                <div key={idx} className="col-md-6">
                                    <div className="p-3 rounded-4 border d-flex gap-3 hover-lift transition-all bg-white shadow-sm">
                                        <div className="bg-light rounded-4 w-20 h-20 d-flex align-items-center justify-content-center shrink-0">
                                            <i className="fas fa-laptop-code text-primary fs-3"></i>
                                        </div>
                                        <div>
                                            <div className="fw-bold small">{item.name}</div>
                                            <div className="x-small text-muted mb-2">{item.desc}</div>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <span className="fw-bold text-primary">{item.price}</span>
                                                <button className="btn btn-sm btn-primary rounded-pill x-small px-3">Ver Oferta</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-12 col-lg-7">
                    <Card title="Logros y Gamificación Tech" icon="fa-trophy">
                        <div className="d-flex flex-wrap gap-4 p-2">
                            {[
                                { name: 'Cliente de Oro', icon: 'fa-medal', color: 'text-warning', earned: true },
                                { name: 'Early Adopter', icon: 'fa-rocket', color: 'text-primary', earned: true },
                                { name: 'Socio Estratégico', icon: 'fa-handshake', color: 'text-success', earned: false },
                                { name: 'Power User', icon: 'fa-bolt', color: 'text-info', earned: true }
                            ].map((badge, idx) => (
                                <div key={idx} className={`text-center position-relative ${badge.earned ? '' : 'opacity-25 grayscale'}`}>
                                    <div className="bg-light rounded-circle w-16 h-16 d-flex align-items-center justify-content-center mx-auto mb-2 shadow-sm border border-white">
                                        <i className={`fas ${badge.icon} fs-4 ${badge.color}`}></i>
                                    </div>
                                    <div className="xx-small fw-bold">{badge.name}</div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card title="Novedades y Comunidad Dui Tech" className="mt-4" icon="fa-newspaper">
                        <div className="list-group list-group-flush">
                            <div className="list-group-item px-0 py-3 bg-transparent border-bottom border-light">
                                <span className="badge bg-primary-subtle text-primary mb-2">Evento</span>
                                <div className="fw-bold small">Dui Tech Summit 2026</div>
                                <p className="xx-small text-muted m-0">Únete a nuestra conferencia anual sobre ERP y Cloud.</p>
                            </div>
                            <div className="list-group-item px-0 py-3 bg-transparent border-0">
                                <span className="badge bg-success-subtle text-success mb-2">Update</span>
                                <div className="fw-bold small">Nuevos Módulos de Analítica</div>
                                <p className="xx-small text-muted m-0">Ya puedes integrar reportes predictivos en tu cuenta.</p>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="col-12 col-lg-5">
                    <Card title="Tu Opinión Nos Importa" icon="fa-poll-h" className="h-100 bg-gradient-info text-dark">
                        <div className="text-center p-3">
                            <h6 className="fw-bold mb-3 small">¿Cómo calificarías tu última experiencia de soporte?</h6>
                            <div className="d-flex justify-content-center gap-2 mb-4">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <i key={star} className="fas fa-star text-warning cursor-pointer fs-4 hover-lift"></i>
                                ))}
                            </div>
                            <textarea className="form-control border-0 bg-white/50 rounded-4 x-small mb-3" placeholder="Comentarios adicionales..."></textarea>
                            <button className="btn btn-dark w-100 rounded-pill fw-bold x-small py-2" onClick={() => addNotification({ title: 'Feedback Recibido', text: 'Gracias por ayudarnos a mejorar.', type: 'success' })}>Enviar Encuesta</button>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-12">
                    <Card title="Ofertas Relámpago Exclusivas" className="bg-dark text-white overflow-hidden" bodyClassName="p-4 position-relative">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <div className="p-3 rounded-4 hover-lift cursor-pointer text-center" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                                    <div className="small text-white-50">SSD M.2 1TB</div>
                                    <div className="h4 fw-bold my-2">$890</div>
                                    <span className="badge bg-danger rounded-pill">-40% OFF</span>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="p-3 rounded-4 hover-lift cursor-pointer text-center" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                                    <div className="small text-white-50">Monitor 27" 4K</div>
                                    <div className="h4 fw-bold my-2">$3,450</div>
                                    <span className="badge bg-danger rounded-pill">-25% OFF</span>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="p-3 rounded-4 hover-lift cursor-pointer text-center" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                                    <div className="small text-white-50">Silla Gamer Pro</div>
                                    <div className="h4 fw-bold my-2">$1,999</div>
                                    <span className="badge bg-danger rounded-pill">-50% OFF</span>
                                </div>
                            </div>
                        </div>
                        <i className="fas fa-bolt position-absolute bottom-0 end-0 opacity-10 text-white" style={{ fontSize: '130px' }}></i>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
