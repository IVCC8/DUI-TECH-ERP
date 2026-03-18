import { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import useApi from '../hooks/useApi';
import Modal from '../components/ui/Modal';
import { Card, StatCard, ChartCard } from '../components/Card/card';

const Finance = () => {
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const role = user?.role || 'client';
    const isAdmin = role === 'admin';
    const isSeller = role === 'seller';
    const isClient = role === 'client';

    const [year] = useState('2026');
    const [activeView, setActiveView] = useState('overview');
    const { data: records, loading } = useApi('financial');
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

    const totalIncome = (records || []).reduce((acc, r) => acc + (r.amount || 0), 0);
    const estimatedExpenses = totalIncome * 0.35;
    const profit = totalIncome - estimatedExpenses;

    if (loading) return <div className="p-5 text-center text-primary fw-bold"><i className="fas fa-spinner fa-spin me-2"></i>Cargando libros contables...</div>;

    return (
        <div className="container-fluid p-0">
            <div className="info-section mb-5">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <h2 className="display-6 fw-bold text-gradient">{isClient ? 'Mi Estado de Cuenta' : isSeller ? 'Mis Comisiones & Logros' : 'Análisis Financiero Central'}</h2>
                        <p className="text-muted fs-5 m-0">
                            {isClient ? 'Monitorea tus pagos, saldo a favor y facturación histórica.'
                                : isSeller ? 'Calcula tus bonos, revisa comisiones pagadas y proyecta tus ganancias.'
                                : 'Monitor de salud económica, P&L y cumplimiento fiscal en tiempo real.'}
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        {(isAdmin || isSeller) && (
                            <>
                                <button className="btn btn-outline-primary fw-bold px-4 rounded-pill" onClick={() => addNotification({title:'Conciliación', text:'Iniciando proceso de conciliación bancaria...', type:'info'})}><i className="fas fa-sync-alt me-2"></i>Conciliar</button>
                                <button className="btn btn-primary shadow-sm rounded-pill px-4 fw-bold" onClick={() => addNotification({ title: 'Generando Reporte', text: `Balance financiero ${year} en preparación.`, type: 'info' })}><i className="fas fa-file-invoice-dollar me-2"></i>Descargar PDF</button>
                            </>
                        )}
                        {isClient && (
                            <button className="btn btn-primary shadow-sm rounded-pill px-4 fw-bold" onClick={() => addNotification({title:'Portal de Pago', text:'Redirigiendo a pasarela segura...', type:'success'})}><i className="fas fa-credit-card me-2"></i>Pagar Saldo Pendiente</button>
                        )}
                    </div>
                </div>
            </div>

            {/* TABBED VIEW (Role Based) */}
            <div className="d-flex gap-2 mb-5 flex-wrap">
                {isAdmin ? (
                    [{ key: 'overview', label: 'Dashboard', icon: 'fa-chart-pie' }, { key: 'pl', label: 'P&L / Resultados', icon: 'fa-balance-scale' }, { key: 'cashflow', label: 'Flujo Caja', icon: 'fa-water' }, { key: 'audit', label: 'Auditoría', icon: 'fa-shield-alt' }].map(tab => (
                        <button key={tab.key} className={`btn rounded-pill px-4 fw-bold ${activeView === tab.key ? 'btn-primary shadow-sm' : 'btn-light border'}`} onClick={() => setActiveView(tab.key)}>
                            <i className={`fas ${tab.icon} me-2`}></i>{tab.label}
                        </button>
                    ))
                ) : isSeller ? (
                    [{ key: 'overview', label: 'Mis Ganancias', icon: 'fa-coins' }, { key: 'commissions', label: 'Comisiones Detalle', icon: 'fa-list-ul' }, { key: 'bonus', label: 'Plan de Bonos', icon: 'fa-award' }].map(tab => (
                        <button key={tab.key} className={`btn rounded-pill px-4 fw-bold ${activeView === tab.key ? 'btn-primary shadow-sm' : 'btn-light border'}`} onClick={() => setActiveView(tab.key)}>
                            <i className={`fas ${tab.icon} me-2`}></i>{tab.label}
                        </button>
                    ))
                ) : (
                    [{ key: 'overview', label: 'Estado Actual', icon: 'fa-wallet' }, { key: 'invoices', label: 'Mis Facturas', icon: 'fa-file-invoice' }, { key: 'credit', label: 'Línea de Crédito', icon: 'fa-credit-card' }].map(tab => (
                        <button key={tab.key} className={`btn rounded-pill px-4 fw-bold ${activeView === tab.key ? 'btn-primary shadow-sm' : 'btn-light border'}`} onClick={() => setActiveView(tab.key)}>
                            <i className={`fas ${tab.icon} me-2`}></i>{tab.label}
                        </button>
                    ))
                )}
            </div>

            {/* SUMMARY CARDS (Role Specific) */}
            <div className="row g-4 mb-5">
                {isAdmin ? (
                    [
                        { title: 'Ingresos Totales', val: `$${totalIncome.toLocaleString()}`, sub: 'Flujo bruto acumulado', icon: 'fa-arrow-up', color: 'border-success' },
                        { title: 'Utilidad Neta', val: `$${profit.toLocaleString(undefined,{maximumFractionDigits:0})}`, sub: 'Margen operativo: 65%', icon: 'fa-chart-line', color: 'border-primary' },
                        { title: 'Gastos Operativos', val: `$${estimatedExpenses.toLocaleString(undefined,{maximumFractionDigits:0})}`, sub: 'Fijo + Variable', icon: 'fa-receipt', color: 'border-warning' },
                        { title: 'SAT Pendiente', val: `$${(totalIncome*0.16).toLocaleString(undefined,{maximumFractionDigits:0})}`, sub: 'IVA Estimado', icon: 'fa-landmark', color: 'border-danger' }
                    ].map((c,i) => (
                        <div key={i} className="col-6 col-md-3">
                            <div className={`card border-0 shadow-sm rounded-4 border-start border-4 ${c.color} h-100`}>
                                <div className="card-body p-4 text-center text-md-start">
                                    <i className={`fas ${c.icon} text-primary fs-3 mb-2 opacity-25`}></i>
                                    <div className="h4 fw-extrabold text-dark mb-1">{c.val}</div>
                                    <div className="small fw-bold text-muted text-uppercase" style={{fontSize:'10px'}}>{c.title}</div>
                                    <div className="x-small text-muted">{c.sub}</div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : isSeller ? (
                    [
                        { title: 'Comisión Pagada', val: '$8,450', sub: 'Depositado en cuenta', icon: 'fa-check-circle', color: 'border-success' },
                        { title: 'Por Cobrar', val: '$3,200', sub: 'Cierre de mes 31 Mar', icon: 'fa-clock', color: 'border-warning' },
                        { title: 'Proyección Bono', val: '+$5,000', sub: 'Al llegar a meta 90%', icon: 'fa-chart-line', color: 'border-primary' },
                        { title: 'Total Anual', val: '$42,300', sub: 'Ganancia acumulada', icon: 'fa-wallet', color: 'border-info' }
                    ].map((c,i) => (
                        <div key={i} className="col-6 col-md-3">
                            <div className={`card border-0 shadow-sm rounded-4 border-start border-4 ${c.color} h-100`}>
                                <div className="card-body p-4">
                                     <div className="d-flex justify-content-between align-items-center mb-2"><i className={`fas ${c.icon} text-primary fs-4 opacity-50`}></i><span className="badge bg-light text-dark border rounded-pill x-small">Finanzas</span></div>
                                    <div className="h4 fw-extrabold text-dark mb-0">{c.val}</div>
                                    <div className="small fw-bold text-muted text-uppercase mt-1" style={{fontSize:'10px'}}>{c.title}</div>
                                    <div className="x-small text-muted">{c.sub}</div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    [
                        { title: 'Saldo a Pagar', val: '$12,400', sub: 'Vence en 8 días', icon: 'fa-exclamation-circle', color: 'border-warning' },
                        { title: 'Crédito Usado', val: '$45,000', sub: 'De $150,000 total', icon: 'fa-credit-card', color: 'border-primary' },
                        { title: 'Notas de Crédito', val: '$1,200', sub: 'A tu favor (Devoluciones)', icon: 'fa-plus-circle', color: 'border-success' },
                        { title: 'Facturas Q1', val: '12', sub: 'Todas descargables', icon: 'fa-file-invoice', color: 'border-info' }
                    ].map((c,i) => (
                        <div key={i} className="col-6 col-md-3">
                             <div className={`card border-0 shadow-sm rounded-4 border-start border-4 ${c.color} h-100 shadow-hover`}>
                                <div className="card-body p-4 text-center">
                                    <div className="h4 fw-extrabold text-primary mb-1">{c.val}</div>
                                    <div className="small fw-bold text-dark text-uppercase" style={{fontSize:'10px'}}>{c.title}</div>
                                    <div className="x-small text-muted">{c.sub}</div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* SELLER - EARNINGS VIEW */}
            {isSeller && activeView === 'overview' && (
                <div className="row g-4 mb-5">
                    <div className="col-12 col-lg-8">
                        <ChartCard title="Crecimiento de Mis Comisiones" icon="fa-chart-area">
                             <div className="d-flex align-items-end justify-content-between p-4 bg-light bg-opacity-50 rounded-4" style={{height:'180px'}}>
                                {[30, 45, 25, 60, 85, 40, 95].map((h, i) => (
                                    <div key={i} className="flex-grow-1 mx-1 bg-primary rounded-top position-relative cursor-pointer hover-lift" style={{height:`${h}%`}}>
                                        <div className="position-absolute top-0 start-50 translate-middle-x mt-n4 x-small fw-bold text-primary">${h*100}</div>
                                    </div>
                                ))}
                             </div>
                             <div className="d-flex justify-content-between mt-2 px-3 x-small fw-extrabold text-muted"><span>LUN</span><span>MAR</span><span>MIE</span><span>JUE</span><span>VIE</span><span>SAB</span><span>DOM</span></div>
                        </ChartCard>
                    </div>
                    <div className="col-12 col-lg-4">
                        <Card title={<><i className="fas fa-bullseye text-danger me-2"></i>Progreso Meta de Bonos</>} className="h-100">
                             <div className="text-center py-4">
                                <div className="h1 fw-extrabold text-primary mb-0">82%</div>
                                <div className="small text-muted fw-bold">Meta de Ventas Q1</div>
                                <p className="x-small opacity-75 mt-2">Faltan $18,200 para el bono Platinum.</p>
                             </div>
                             <div className="progress rounded-pill bg-light mb-4" style={{height:'12px'}}><div className="progress-bar progress-bar-striped progress-bar-animated bg-success" style={{width:'82%'}}></div></div>
                             <div className="d-grid gap-2">
                                <div className="p-3 bg-light rounded-4 d-flex justify-content-between align-items-center">
                                    <div><div className="small fw-bold">Comisión Flat (3%)</div><div className="x-small text-muted">Base garantizada</div></div>
                                    <span className="fw-bold text-success">$8,100</span>
                                </div>
                                <div className="p-3 bg-light rounded-4 d-flex justify-content-between align-items-center">
                                    <div><div className="small fw-bold">Bono Acelerador</div><div className="x-small text-muted">Sobre-cumplimiento</div></div>
                                    <span className="fw-bold text-muted">$0.00</span>
                                </div>
                             </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* CLIENT - STATEMENT VIEW */}
            {isClient && activeView === 'overview' && (
                <div className="row g-4 mb-5">
                    <div className="col-12 col-lg-7">
                        <Card title={<><i className="fas fa-list-alt text-primary me-2"></i>Consolidado de Movimientos</>} noPadding>
                            <div className="table-responsive">
                                <table className="table align-middle mb-0">
                                    <thead className="table-light"><tr className="x-small text-muted text-uppercase fw-bold"><th className="ps-4">Operación</th><th>Concepto</th><th>Fecha</th><th className="pe-4 text-end">Monto (MXN)</th></tr></thead>
                                    <tbody>
                                        {[{op:'Pago Recibido', id:'TR-88', date:'10 Mar', amt:'-12,500', type:'in'},{op:'Factura Generada', id:'INC-99', date:'08 Mar', amt:'+24,900', type:'out'},{op:'Nota Crédito', id:'NC-01', date:'05 Mar', amt:'-1,200', type:'in'}].map((m,i)=>(
                                            <tr key={i}>
                                                <td className="ps-4"><span className={`badge rounded-pill x-small ${m.type==='in'?'bg-success text-white':'bg-light text-dark border'}`}>{m.op}</span></td>
                                                <td className="small fw-bold">Ref: {m.id}</td>
                                                <td className="small text-muted">{m.date}</td>
                                                <td className={`pe-4 text-end fw-extrabold ${m.type==='in'?'text-success':'text-dark'}`}>{m.amt}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                    <div className="col-12 col-lg-5">
                         <Card title={<><i className="fas fa-shield-alt text-success me-2"></i>Estado de Línea de Crédito</>} className="bg-dark text-white border-0 shadow-lg h-100 overflow-hidden">
                            <i className="fas fa-credit-card position-absolute opacity-10" style={{fontSize:'120px', right:'-20px', top:'20px'}}></i>
                            <div className="p-2 position-relative">
                                <div className="mb-4">
                                    <div className="small text-white-50 text-uppercase fw-bold">Línea Total Autorizada</div>
                                    <div className="h2 fw-extrabold text-accent">$150,000.00</div>
                                </div>
                                <div className="d-grid gap-3">
                                    <div className="d-flex justify-content-between x-small"><span className="opacity-75">Disponible</span><span className="fw-bold text-success">$105,000</span></div>
                                    <div className="progress rounded-pill bg-white bg-opacity-10" style={{height:'8px'}}><div className="progress-bar bg-accent" style={{width:'30%'}}></div></div>
                                    <div className="d-flex justify-content-between x-small"><span className="opacity-75">Saldo en Uso (30%)</span><span className="fw-bold text-warning">$45,000</span></div>
                                </div>
                                <button className="btn btn-primary w-100 mt-5 rounded-pill fw-bold" onClick={()=>addNotification({title:'Credit Limit', text:'Solicitud de aumento enviada a finanzas.', type:'info'})}>Solicitar Aumento</button>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* ADMIN - FULL FINANCIAL PANELS */}
            {isAdmin && activeView === 'overview' && (
                <>
                    <div className="row g-4 mb-5">
                        <div className="col-12 col-xl-8">
                            <ChartCard title="Balance Consolidado Q1" icon="fa-university">
                                <div className="p-4 bg-light rounded-4">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <div><div className="h3 fw-extrabold text-primary m-0">$ {totalIncome.toLocaleString()}</div><div className="small text-muted fw-bold">Ingresos Operativos Totales</div></div>
                                        <div className="text-end"><div className="h3 fw-extrabold text-success m-0">+$ 282,540</div><div className="small text-muted fw-bold">EBITDA Limpio</div></div>
                                    </div>
                                    <div className="row g-2">
                                        <div className="col-8"><div className="bg-primary rounded-start px-3 py-2 text-white x-small fw-bold">INGRESOS (100%)</div></div>
                                        <div className="col-4"><div className="bg-danger rounded-end px-3 py-2 text-white x-small fw-bold text-end">COSTOS (35%)</div></div>
                                    </div>
                                </div>
                            </ChartCard>
                        </div>
                        <div className="col-12 col-xl-4">
                            <Card title={<><i className="fas fa-file-invoice-dollar text-warning me-2"></i>Cumplimiento Fiscal</>} className="bg-dark text-white shadow-lg border-0 h-100">
                                 <div className="mb-4"><label className="small text-white-50 text-uppercase fw-bold d-block mb-1">IVA por Liquidar</label><div className="h4 fw-bold text-warning">$ {(totalIncome * 0.16).toLocaleString()}</div></div>
                                 <div className="mb-4"><label className="small text-white-50 text-uppercase fw-bold d-block mb-1">Retenciones ISR</label><div className="h4 fw-bold text-info">$ {(totalIncome * 0.10).toLocaleString()}</div></div>
                                 <button className="btn btn-outline-light w-100 rounded-pill fw-bold" onClick={()=>addNotification({title:'SAT', text:'Conectando con portal tributario...', type:'info'})}><i className="fas fa-external-link-alt me-2"></i>Ir al SAT Portal</button>
                            </Card>
                        </div>
                    </div>

                    <div className="row g-4 mb-5">
                        <div className="col-12 col-lg-6">
                            <Card title={<><i className="fas fa-water text-info me-2"></i>Proyección de Flujo de Caja (Cashflow)</>}>
                                <div className="p-3 bg-light rounded-4 mb-4">
                                    <div className="d-flex justify-content-between x-small fw-bold text-muted text-uppercase mb-3"><span>Mes</span><span>Entradas Est.</span><span>Salidas Est.</span><span>Balance</span></div>
                                    {[
                                        {m:'Abril', in:145000, out:85000},
                                        {m:'Mayo', in:168000, out:92000},
                                        {m:'Junio', in:195000, out:110000}
                                    ].map((row,i)=>(
                                        <div key={i} className="d-flex justify-content-between small border-bottom py-2">
                                            <span className="fw-bold">{row.m}</span>
                                            <span className="text-success">$ {row.in.toLocaleString()}</span>
                                            <span className="text-danger">$ {row.out.toLocaleString()}</span>
                                            <span className="fw-extrabold text-primary">$ {(row.in - row.out).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                                <button className="btn btn-primary btn-sm w-100 rounded-pill fw-bold" onClick={()=>setIsBudgetModalOpen(true)}>Ajustar Presupuesto Presuntivo</button>
                            </Card>
                        </div>
                        <div className="col-12 col-lg-6">
                            <Card title={<><i className="fas fa-microchip text-warning me-2"></i>Desglose por Centro de Costos</>}>
                                 <div className="d-grid gap-3 py-2">
                                    {[
                                        {label:'Cloud & Hosting', p:45, val:'$12,400', color:'bg-primary'},
                                        {label:'Nóminas & RH', p:30, val:'$8,200', color:'bg-success'},
                                        {label:'Marketing Ads', p:15, val:'$4,100', color:'bg-warning'},
                                        {label:'Logística / Envíos', p:10, val:'$2,750', color:'bg-info'}
                                    ].map((item,i)=>(
                                        <div key={i}>
                                            <div className="d-flex justify-content-between x-small fw-bold mb-1">
                                                <span>{item.label}</span>
                                                <span className="text-muted">{item.val} ({item.p}%)</span>
                                            </div>
                                            <div className="progress rounded-pill" style={{height:'6px'}}>
                                                <div className={`progress-bar ${item.color}`} style={{width:`${item.p}%`}}></div>
                                            </div>
                                        </div>
                                    ))}
                                 </div>
                            </Card>
                        </div>
                    </div>
                </>
            )}

            {/* SELLER - COMMISSION LIST */}
            {isSeller && activeView === 'commissions' && (
                <Card title={<><i className="fas fa-file-dollar text-primary me-2"></i>Desglose de Comisiones por Venta</>} noPadding>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light"><tr className="x-small text-muted text-uppercase fw-bold"><th className="ps-4">Orden #</th><th>Cliente</th><th>Monto Venta</th><th>Comisión (3%)</th><th>Fecha</th><th className="pe-4 text-end">Status</th></tr></thead>
                            <tbody>
                                {[{id:'ORD-9021', cli:'Tech Solutions', amt:45000, comm:1350, date:'10 Mar', status:'Validada'},{id:'ORD-8945', cli:'Global Corp', amt:12000, comm:360, date:'05 Mar', status:'Pagada'},{id:'ORD-8821', cli:'StartupXYZ', amt:8500, comm:255, date:'01 Mar', status:'Pagada'}].map((c,i)=>(
                                    <tr key={i}>
                                        <td className="ps-4 small">#{c.id}</td>
                                        <td className="small fw-bold">{c.cli}</td>
                                        <td className="small text-muted">${c.amt.toLocaleString()}</td>
                                        <td className="small fw-extrabold text-success">${c.comm.toLocaleString()}</td>
                                        <td className="small text-muted">{c.date}</td>
                                        <td className="pe-4 text-end"><span className={`badge rounded-pill x-small ${c.status==='Pagada'?'bg-success':'bg-warning text-dark'}`}>{c.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* BUDGET MODAL (Admin Only) */}
            <Modal isOpen={isBudgetModalOpen} onClose={() => setIsBudgetModalOpen(false)} title="Ajustar Presupuesto Anual">
                <form className="row g-4 p-2" onSubmit={e => { e.preventDefault(); addNotification({ title: 'Presupuesto Actualizado', text: 'Cambios guardados exitosamente.', type: 'success' }); setIsBudgetModalOpen(false); }}>
                    {[{ name: 'hardware', label: 'Ventas de Hardware', default: '420000' }, { name: 'services', label: 'Servicios Técnicos', default: '80000' }, { name: 'software', label: 'Licenciamiento', default: '55000' }, { name: 'opex', label: 'Gastos Operativos (OPEX)', default: '120000' }].map((f, i) => (
                        <div key={i} className="col-12"><label className="form-label fw-bold small text-muted text-uppercase">{f.label}</label><div className="input-group"><span className="input-group-text bg-light">$</span><input name={f.name} type="number" min="0" defaultValue={f.default} className="form-control rounded-3" /></div></div>
                    ))}
                    <div className="col-12 mt-4 text-end"><button type="button" onClick={() => setIsBudgetModalOpen(false)} className="btn btn-light px-4 me-2 rounded-pill fw-bold">Cancelar</button><button type="submit" className="btn btn-primary px-5 fw-bold rounded-pill shadow-sm">Guardar Presupuesto</button></div>
                </form>
            </Modal>
        </div>
    );
};

export default Finance;
