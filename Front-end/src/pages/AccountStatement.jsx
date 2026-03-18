import { useState, useMemo } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { initialOrders } from '../context/mockData';
import useLocalStorage from '../hooks/useLocalStorage';
import { Card } from '../components/Card/card';

const AccountStatement = () => {
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const [orders] = useLocalStorage('duitech_orders', initialOrders);
    const [filter, setFilter] = useState('all');

    const isAdmin = user?.role === 'admin';
    const isSeller = user?.role === 'seller';
    const isClient = user?.role === 'client';

    const handleDownload = () => {
        addNotification({
            title: 'Descarga Iniciada',
            text: 'Tu estado de cuenta se está descargando en PDF.',
            type: 'success'
        });
    };

    // Transform real orders into transactions
    const transactions = useMemo(() => {
        const base = orders.map((o) => ({
            id: o.id,
            date: o.date === 'Ahora' ? '12 Mar' : o.date,
            concept: `Compra #${o.id}`,
            type: 'debit',
            amount: o.total,
            status: o.status
        }));

        if (isAdmin || isSeller) {
            base.unshift({ id: 'P-100', date: '11 Mar', concept: 'Ajuste de Saldo Internal', type: 'credit', amount: 5000, status: 'Completado' });
        }
        return base;
    }, [orders, isAdmin, isSeller]);

    const filteredTransactions = filter === 'all' ? transactions : transactions.filter(t => t.type === filter);

    return (
        <div className="container-fluid p-0">
            <div className="info-section mb-5" data-aos="fade-down">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-4">
                    <div>
                        <h2 className="display-6 fw-bold text-gradient">
                            {isAdmin ? 'Análisis de Cartera y Créditos' : isClient ? 'Mi Wallet y Estado de Cuenta' : 'Resumen de Liquidaciones'}
                        </h2>
                        <p className="text-muted fs-5 m-0">
                            {isAdmin ? 'Gestión de riesgo crediticio y supervisión de cobranza global.' : 
                             isClient ? 'Controla tus consumos, puntos acumulados y saldos pendientes.' : 
                             'Historial de pagos de comisiones y bonos de productividad.'}
                        </p>
                    </div>
                    <button className="btn btn-primary px-4 py-2 rounded-pill shadow-sm fw-bold" onClick={handleDownload}>
                        <i className="fas fa-file-pdf me-2"></i>Exportar Periodo
                    </button>
                </div>
            </div>

            {/* TOP CARDS - Role Specific Metrics */}
            <div className="row g-4 mb-5">
                <div className="col-12 col-md-4" data-aos="zoom-in" data-aos-delay="100">
                    <div className="card border-0 shadow-sm p-4 h-100 bg-dark text-white overflow-hidden position-relative">
                        <i className={`fas ${isAdmin ? 'fa-chart-pie' : isClient ? 'fa-wallet' : 'fa-coins'} position-absolute end-0 bottom-0 opacity-10 m-n3`} style={{ fontSize: '120px' }}></i>
                        <h6 className="fw-bold text-accent mb-3 uppercase tracking-widest" style={{ fontSize: '0.7rem' }}>
                            {isAdmin ? 'Cartera Total' : isClient ? 'Saldo Disponible' : 'Comisión Acumulada'}
                        </h6>
                        <div className="h2 fw-extrabold mb-2">{isAdmin ? '$ 4.2M' : isClient ? '$ 12,400' : '$ 8,450'}</div>
                        <p className="small text-white-50 mb-0">Actualizado hace 5 min.</p>
                    </div>
                </div>
                <div className="col-12 col-md-4" data-aos="zoom-in" data-aos-delay="200">
                    <div className="card border-0 shadow-sm p-4 h-100 border-start border-primary border-4">
                        <h6 className="fw-bold text-muted mb-3 uppercase tracking-widest" style={{ fontSize: '0.7rem' }}>
                            {isAdmin ? 'Riesgo de Cartera' : isClient ? 'Próximo Vencimiento' : 'Pagos Pendientes'}
                        </h6>
                        <div className="h2 fw-extrabold text-primary mb-2">{isAdmin ? 'Low (2.4%)' : isClient ? '15 de Mar' : '$ 3,200'}</div>
                        <div className={`badge ${isAdmin ? 'bg-success' : 'bg-warning text-dark'} rounded-pill x-small px-3`}>
                             {isAdmin ? 'Sano' : 'Atención Requerida'}
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4" data-aos="zoom-in" data-aos-delay="300">
                    <div className="card border-0 shadow-sm p-4 h-100">
                        <h6 className="fw-bold text-muted mb-3 uppercase tracking-widest" style={{ fontSize: '0.7rem' }}>
                            {isClient ? 'Puntos Rewards' : 'Tasa de Recuperación'}
                        </h6>
                        <div className="h2 fw-extrabold text-dark mb-2">{isClient ? '4,250' : '98.5%'}</div>
                        <p className="small text-success fw-bold mb-0">
                            <i className="fas fa-caret-up me-1"></i> +5.2% este mes
                        </p>
                    </div>
                </div>
            </div>

            <div className="row g-4 mb-5">
                {/* TRANSACTIONS TABLE */}
                <div className="col-12 col-lg-8" data-aos="fade-right">
                    <Card title="Movimientos del Periodo" icon="fa-list-ul" noPadding>
                        <div className="px-4 py-3 border-bottom d-flex gap-2 bg-light bg-opacity-50">
                            <button className={`btn btn-xs ${filter === 'all' ? 'btn-primary' : 'btn-light border'} rounded-pill px-3`} onClick={() => setFilter('all')}>Todo</button>
                            <button className={`btn btn-xs ${filter === 'debit' ? 'btn-light border text-danger' : 'btn-light border'} rounded-pill px-3`} onClick={() => setFilter('debit')}>Cargos</button>
                            <button className={`btn btn-xs ${filter === 'credit' ? 'btn-light border text-success' : 'btn-light border'} rounded-pill px-3`} onClick={() => setFilter('credit')}>Abonos</button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr className="xx-small uppercase tracking-widest text-muted">
                                        <th className="ps-4">Fecha</th>
                                        <th>Referencia / Concepto</th>
                                        <th>Monto</th>
                                        <th>Estado</th>
                                        <th className="pe-4 text-end">Ticket</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.map((t, idx) => (
                                        <tr key={idx}>
                                            <td className="ps-4 small text-muted">{t.date}</td>
                                            <td>
                                                <div className="fw-bold small">{t.concept}</div>
                                                <div className="xx-small text-muted">{t.id}</div>
                                            </td>
                                            <td className={`fw-extrabold small ${t.type === 'credit' ? 'text-success' : 'text-danger'}`}>
                                                {t.type === 'credit' ? '+' : '-'} $ {t.amount.toLocaleString()}
                                            </td>
                                            <td>
                                                <span className={`badge rounded-circle p-1 me-2 ${t.status === 'Entregado' || t.status === 'Completado' ? 'bg-success' : 'bg-warning'}`} style={{ width: '8px', height: '8px', display: 'inline-block' }}></span>
                                                <span className="x-small fw-bold">{t.status}</span>
                                            </td>
                                            <td className="pe-4 text-end">
                                                <button className="btn btn-sm btn-light text-primary rounded-circle shadow-xs">
                                                    <i className="fas fa-file-invoice"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* SIDE PANELS - Role Based */}
                <div className="col-12 col-lg-4" data-aos="fade-left">
                    {isAdmin ? (
                         <div className="d-grid gap-4">
                            <Card title="Distribución de Deuda" icon="fa-chart-bar">
                                <div className="d-grid gap-3">
                                    {[{ l: '0-30 días', p: 85, c: 'bg-success' }, { l: '31-60 días', p: 10, c: 'bg-warning' }, { l: '61-90 días', p: 5, c: 'bg-danger' }].map((item, i) => (
                                        <div key={i}>
                                            <div className="d-flex justify-content-between xx-small fw-bold mb-1">
                                                <span>{item.l}</span>
                                                <span className="text-muted">{item.p}%</span>
                                            </div>
                                            <div className="progress" style={{ height: '6px' }}>
                                                <div className={`progress-bar ${item.c}`} style={{ width: `${item.p}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                            <Card title="Alertas de Cobranza" icon="fa-bell">
                                <div className="p-3 bg-danger-subtle rounded-4 mb-2 border border-danger-subtle">
                                    <div className="small fw-bold text-danger">3 Cuentas en Mora Primaria</div>
                                    <div className="xx-small text-danger opacity-75">Total excedido: $ 42,000</div>
                                </div>
                                <button className="btn btn-outline-danger btn-sm w-100 rounded-pill mt-2 fw-bold">Ver Detalles</button>
                            </Card>
                         </div>
                    ) : isClient ? (
                        <div className="d-grid gap-4">
                            <Card title="Nivel de Lealtad" icon="fa-medal">
                                <div className="text-center py-2">
                                    <div className="display-6 fw-extrabold text-primary mb-0">Platinum</div>
                                    <div className="small text-muted fw-bold">Status VIP Activo</div>
                                </div>
                                <hr className="opacity-10" />
                                <div className="d-grid gap-2">
                                    <div className="p-3 bg-light rounded-4 d-flex align-items-center gap-3">
                                        <i className="fas fa-shipping-fast text-primary"></i>
                                        <div className="small fw-bold">Envío Gratis Ilimitado</div>
                                    </div>
                                    <div className="p-3 bg-light rounded-4 d-flex align-items-center gap-3">
                                        <i className="fas fa-percentage text-success"></i>
                                        <div className="small fw-bold">10% Off en Accesorios</div>
                                    </div>
                                </div>
                            </Card>
                            <div className="card bg-accent text-white border-0 p-4 rounded-4 shadow-lg overflow-hidden position-relative">
                                <i className="fas fa-gift position-absolute end-0 top-0 opacity-10 m-n3 display-1"></i>
                                <h6 className="fw-bold mb-3 uppercase tracking-widest" style={{ fontSize: '0.7rem' }}>Canje de Puntos</h6>
                                <p className="small mb-4 opacity-75">Tienes puntos suficientes para un cupón de $ 400 MXN.</p>
                                <button className="btn btn-white w-100 rounded-pill fw-bold text-accent">Canjear Ahora</button>
                            </div>
                        </div>
                    ) : (
                        <Card title="Resumen de Liquidación" icon="fa-hand-holding-usd">
                            <div className="p-4 bg-light rounded-4 text-center">
                                <div className="xx-small text-muted uppercase fw-extrabold mb-1">Próxima Fecha de Corte</div>
                                <div className="h4 fw-bold text-dark mb-4">15 MAR 2026</div>
                                <div className="d-grid gap-2">
                                    <div className="d-flex justify-content-between small px-2"><span>Ventas Brutas</span><span className="fw-bold">$ 245,000</span></div>
                                    <div className="d-flex justify-content-between small px-2"><span>Comisión Base</span><span className="fw-bold">$ 7,350</span></div>
                                    <div className="d-flex justify-content-between small px-2 text-primary fw-bold border-top pt-2"><span>Neto a Recibir</span><span>$ 7,350</span></div>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountStatement;
