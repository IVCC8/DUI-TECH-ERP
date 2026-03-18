import { useState, useMemo, useCallback } from 'react';
import { productsData, initialOrders } from '../context/mockData';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import useLocalStorage from '../hooks/useLocalStorage';
import { Card } from '../components/Card/card';

const Catalog = () => {
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const [cartCount, setCartCount] = useState(0);

    const [orders, setOrders] = useLocalStorage('duitech_orders', initialOrders);
    const [inventory] = useLocalStorage('duitech_inventory', productsData);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [compareList, setCompareList] = useState([]);

    const categories = useMemo(() => ['Todas', ...new Set((inventory || []).map(p => p.category))], [inventory]);

    const filteredProducts = useMemo(() => (inventory || []).filter(p => {
        const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              p.brand?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    }), [inventory, searchQuery, selectedCategory]);

    const handleAddToCart = useCallback((productName) => {
        setCartCount(prev => prev + 1);
        addNotification({
            title: 'Producto Agregado',
            text: `Se añadió "${productName}" a tu carrito de compras.`,
            type: 'order'
        });
    }, [addNotification]);

    const toggleCompare = useCallback((product) => {
        setCompareList(prev => {
            if (prev.find(p => p.id === product.id)) {
                return prev.filter(p => p.id !== product.id);
            } else if (prev.length < 3) {
                return [...prev, product];
            } else {
                addNotification({ title: 'Límite alcanzado', text: 'Solo puedes comparar hasta 3 productos.', type: 'warning' });
                return prev;
            }
        });
    }, [addNotification]);

    const handleCheckout = () => {
        if (cartCount === 0) return;

        const newOrder = {
            id: (Math.floor(Math.random() * 9000) + 1000).toString(),
            client: user?.name || 'Cliente Invitado',
            clientName: user?.name || 'Cliente Invitado',
            date: 'Ahora',
            total: cartCount * 500,
            status: 'Pendiente',
            items: cartCount
        };

        setOrders([newOrder, ...orders]);
        setCartCount(0);
        
        addNotification({
            title: 'Compra Exitosa',
            text: `Tu pedido #${newOrder.id} ha sido registrado.`,
            type: 'success'
        });
    };

    const isSeller = user?.role === 'seller';
    const isClient = user?.role === 'client' || user?.role === 'user';

    return (
        <div className="container-fluid p-0 catalog-page" data-aos="fade-up">
            <div className="info-section mb-5 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="display-6 fw-bold text-gradient">Explorar Catálogo</h2>
                    <p className="text-muted fs-5">
                        {isSeller ? 'Visualiza comisiones y disponibilidad en tiempo real.' : 
                         isClient ? 'Encuentra los mejores productos y precios exclusivos.' : 
                         'Gestión global de productos y existencias.'}
                    </p>
                </div>
                <div 
                    className="cart-trigger position-relative cursor-pointer hover-lift p-4 glass-card rounded-circle shadow-lg border border-white/20"
                    onClick={handleCheckout}
                    title="Finalizar Compra"
                >
                    <i className="fas fa-shopping-cart h3 text-primary m-0"></i>
                    {cartCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-accent shadow-sm border-2 border-white px-2 py-2" style={{ fontSize: '12px' }}>
                            {cartCount}
                        </span>
                    )}
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-12 col-md-8">
                    <div className="input-group input-group-lg shadow-sm rounded-4 overflow-hidden border">
                        <span className="input-group-text bg-white border-0 ps-4"><i className="fas fa-search text-muted"></i></span>
                        <input 
                            type="text" 
                            className="form-control border-0 bg-white py-3" 
                            placeholder="Buscar por nombre, SKU o marca..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <select 
                        className="form-select form-select-lg border shadow-sm cursor-pointer glass-card rounded-4 py-3 fw-bold text-primary"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {(categories || []).map((cat, idx) => <option key={cat || `cat-${idx}`} value={cat}>{cat || 'General'}</option>)}
                    </select>
                </div>
            </div>

            {/* ── CLIENT EXCLUSIVE BANNER ───────────────────────────── */}
            {isClient && (
                <div className="row mb-5">
                    <div className="col-12">
                        <div className="glass-card bg-gradient-to-r from-primary/20 to-accent/20 p-5 rounded-4 border border-white/30 shadow-xl overflow-hidden position-relative" data-aos="fade-down">
                            <div className="position-absolute top-0 end-0 p-4 opacity-10">
                                <i className="fas fa-rocket display-1 rotate-12"></i>
                            </div>
                            <div className="position-relative z-1">
                                <h3 className="fw-bold text-dark mb-2">¡Ofertas Exclusivas de Temporada! 🚀</h3>
                                <p className="text-muted fs-5 mb-4">Aprovecha descuentos de hasta el 25% en tecnología seleccionada solo para clientes VIP.</p>
                                <div className="d-flex gap-3">
                                    <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">Ver Destacados</button>
                                    <div className="d-flex align-items-center gap-2 px-3 py-2 bg-white/50 rounded-pill border border-white/50">
                                        <i className="fas fa-gift text-accent"></i>
                                        <span className="small fw-bold text-dark">Doble puntuación en laptops</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── FEATURED CATEGORIES (CLIENT ONLY) ─────────────────── */}
            {isClient && (
                <div className="mb-5" data-aos="fade-right">
                    <h5 className="fw-bold text-dark mb-3"><i className="fas fa-tags text-primary me-2"></i>Categorías Destacadas</h5>
                    <div className="d-flex gap-3 overflow-auto pb-2 scrollbar-none">
                        {['Laptops', 'Monitores', 'Accesorios', 'Servidores'].map((cat, i) => (
                            <button 
                                key={i}
                                onClick={() => setSelectedCategory(cat)}
                                className={`btn rounded-pill px-4 py-2 fw-bold text-nowrap transition-all border-0 shadow-sm ${selectedCategory === cat ? 'btn-primary' : 'bg-white text-muted hover-bg-light'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── DYNAMIC COMPARER ─────────────────────────────────── */}
            {compareList.length > 0 && (
                <div className="card border-0 shadow-lg mb-5 bg-primary bg-gradient text-white rounded-4 overflow-hidden">
                    <div className="card-header border-0 bg-transparent p-4 d-flex justify-content-between align-items-center">
                        <h5 className="fw-bold m-0"><i className="fas fa-balance-scale me-2"></i> Comparativa de Selección ({compareList.length}/3)</h5>
                        <button className="btn btn-sm btn-light rounded-pill x-small fw-bold" onClick={() => setCompareList([])}>Limpiar Todo</button>
                    </div>
                    <div className="card-body p-4 pt-0">
                        <div className="row g-3">
                            {compareList.map((p, i) => (
                                <div key={i} className="col-12 col-md-4">
                                    <div className="bg-white/10 rounded-4 p-3 border border-white/20 position-relative">
                                        <button className="btn-close btn-close-white position-absolute top-0 end-0 m-2 x-small" onClick={() => toggleCompare(p)}></button>
                                        <div className="fw-bold x-small opacity-75 uppercase mb-1">{p.brand}</div>
                                        <div className="small fw-extrabold mb-2 text-truncate">{p.name}</div>
                                        <div className="d-flex justify-content-between align-items-center border-top border-white/10 pt-2 mt-2">
                                            <span className="h6 m-0 fw-extrabold text-accent">$ {p.price?.toLocaleString()}</span>
                                            <span className="xx-small opacity-75">Stock: {p.stock}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── PRODUCT OF THE WEEK (CLIENT ONLY) ────────────────── */}
            {isClient && (
                <div className="row mb-5">
                    <div className="col-12">
                        <Card className="border-0 shadow-lg overflow-hidden bg-white/20 backdrop-blur-md border border-white/30 rounded-4" data-aos="zoom-in">
                            <div className="row g-0">
                                <div className="col-md-5 bg-gradient-to-br from-primary to-accent p-5 d-flex align-items-center justify-content-center">
                                    <i className="fas fa-laptop-code display-1 text-white opacity-20 position-absolute"></i>
                                    <div className="text-center text-white position-relative">
                                        <span className="badge bg-white text-primary rounded-pill px-3 py-2 fw-bold mb-3">DESTACADO DE LA SEMANA</span>
                                        <h2 className="fw-extrabold mb-0">MacBook Pro M3 Max</h2>
                                        <p className="opacity-75">El poder definitivo para profesionales.</p>
                                    </div>
                                </div>
                                <div className="col-md-7 p-5 d-flex flex-column justify-content-center">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <div>
                                            <h4 className="fw-bold text-dark mb-1">Oferta Especial Limitada</h4>
                                            <p className="text-muted m-0">Consigue un 15% de descuento adicional al usar tus Puntos Dui.</p>
                                        </div>
                                        <div className="text-end">
                                            <div className="h3 fw-extrabold text-primary mb-0">$ 85,000</div>
                                            <span className="text-muted text-decoration-line-through small">$ 102,000</span>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-3">
                                        <button className="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow-lg" onClick={() => handleAddToCart('MacBook Pro M3 Max')}>Añadir al Carrito</button>
                                        <button className="btn btn-outline-primary rounded-pill px-4 fw-bold">Ver Especificaciones</button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            <div className="row g-4 mb-5">
                {(filteredProducts || []).length > 0 ? (filteredProducts || []).map((p, index) => {
                    const commission = Math.round(p.price * 0.05);
                    const isComparing = compareList.find(cp => cp.id === p.id);
                    return (
                        <div key={p.id || `prod-${index}`} className="col-12 col-sm-6 col-lg-4 col-xl-3" data-aos="fade-up" data-aos-delay={index * 50}>
                            <Card 
                                noPadding 
                                className={`h-100 border-2 transition-all shadow-sm hover-shadow-lg ${isComparing ? 'border-primary' : 'border-transparent'}`}
                                bodyClassName="d-flex flex-column"
                            >
                                <div className="card-img-top bg-light p-5 d-flex align-items-center justify-content-center position-relative h-48 rounded-top-4 overflow-hidden group">
                                    <i className="fas fa-desktop display-2 text-primary opacity-5"></i>
                                    <div className="position-absolute top-0 start-0 p-3">
                                        <span className={`badge ${(p.stock || 0) < 10 ? 'bg-danger' : 'bg-success'} shadow-sm rounded-pill fw-bold border-0 px-3 py-2`} style={{ fontSize: '10px' }}>
                                            {(p.stock || 0) < 10 ? 'STOCK BAJO' : 'DISPONIBLE'}
                                        </span>
                                    </div>
                                    <div className="position-absolute bottom-0 w-100 p-3 translate-y-full group-hover-translate-y-0 transition-all">
                                        <button 
                                            className={`btn btn-sm w-100 rounded-pill fw-bold ${isComparing ? 'btn-danger' : 'btn-white shadow-sm'}`}
                                            onClick={(e) => { e.stopPropagation(); toggleCompare(p); }}
                                            style={{ fontSize: '10px' }}
                                        >
                                            <i className={`fas ${isComparing ? 'fa-minus' : 'fa-plus'} me-2`}></i> 
                                            {isComparing ? 'Quitar' : 'Comparar'}
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4 d-flex flex-column flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <span className="small text-primary fw-extrabold text-uppercase tracking-wider" style={{ fontSize: '9px' }}>{p.category}</span>
                                        <div className="d-flex gap-1">
                                            {[1,2,3,4,5].map(s => <i key={s} className="fas fa-star text-warning" style={{ fontSize: '8px' }}></i>)}
                                        </div>
                                    </div>
                                    <h6 className="fw-bold text-dark mb-4 line-clamp-2" style={{ height: '2.5rem' }}>{p.name}</h6>
                                    
                                    {isSeller && (
                                        <div className="p-2 bg-success-subtle text-success rounded-3 mb-4 d-flex align-items-center justify-content-between">
                                            <span className="xx-small fw-bold">COMISIÓN ESTIMADA:</span>
                                            <span className="small fw-extrabold">+ $ {commission.toLocaleString()}</span>
                                        </div>
                                    )}

                                    {isClient && (p.price > 20000) && (
                                        <div className="badge bg-accent-subtle text-accent rounded-pill mb-4 x-small py-2 border border-accent/20">
                                            <i className="fas fa-shipping-fast me-1"></i> ENVÍO GRATIS VIP
                                        </div>
                                    )}

                                    {isClient && (
                                        <div className="d-flex align-items-center gap-2 mb-4 p-2 bg-white/50 backdrop-blur-sm rounded-3 border border-white/20">
                                            <i className="fas fa-coins text-warning"></i>
                                            <span className="xx-small fw-bold text-muted">GANA <span className="text-dark">{Math.round(p.price / 100)}</span> PUNTOS DUI</span>
                                        </div>
                                    )}

                                    <div className="mt-auto pt-3 border-top border-light d-flex justify-content-between align-items-center">
                                        <div>
                                            <div className="text-muted xx-small fw-bold text-uppercase mb-0">Precio Final</div>
                                            <div className="h5 fw-extrabold text-primary mb-0">$ {(p.price || 0).toLocaleString()}</div>
                                        </div>
                                        <button 
                                            className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm d-flex align-items-center gap-2 hover-scale"
                                            onClick={() => handleAddToCart(p.name)}
                                        >
                                            <i className="fas fa-cart-plus small"></i>
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    );
                 }) : (
                    <div className="col-12 text-center py-5">
                        <div className="glass-card p-5 rounded-4 d-inline-block border shadow-sm">
                            <i className="fas fa-search display-3 text-muted mb-4 opacity-25"></i>
                            <h4 className="fw-bold text-dark mb-2">Sin coincidencias</h4>
                            <p className="text-muted mb-0">No encontramos productos para tu búsqueda "{searchQuery}".</p>
                            <button className="btn btn-link text-primary mt-3 fw-bold" onClick={() => { setSearchQuery(''); setSelectedCategory('Todas'); }}>Limpiar filtros</button>
                        </div>
                    </div>
                )}
            </div>
            {/* ── NEW ARRIVALS & BENEFITS (CLIENT ONLY) ──────────────── */}
            {isClient && (
                <>
                    <div className="row mb-5">
                        <div className="col-12 col-lg-8" data-aos="fade-up">
                            <h5 className="fw-bold text-dark mb-4"><i className="fas fa-clock text-accent me-2"></i>Recién Llegados</h5>
                            <div className="d-flex gap-4 overflow-auto pb-4 scrollbar-none">
                                {inventory.slice(-4).reverse().map((p, i) => (
                                    <div key={i} className="glass-card p-4 rounded-4 border border-white/30 shadow-sm min-w-300 hover-lift transition-all">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <span className="badge bg-accent text-white rounded-pill px-2 py-1 x-small fw-bold">NUEVO</span>
                                            <span className="text-muted xx-small fw-bold uppercase">{p.category}</span>
                                        </div>
                                        <h6 className="fw-bold text-dark mb-2 text-truncate" style={{ maxWidth: '200px' }}>{p.name}</h6>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="fw-extrabold text-primary">$ {p.price.toLocaleString()}</span>
                                            <button className="btn btn-sm btn-primary rounded-circle" onClick={() => handleAddToCart(p.name)}><i className="fas fa-plus"></i></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-12 col-lg-4">
                            <h5 className="fw-bold text-dark mb-4"><i className="fas fa-crown text-warning me-2"></i>Beneficios Prime</h5>
                            <div className="bg-dark text-white p-4 rounded-4 shadow-lg position-relative overflow-hidden h-100 min-h-200" data-aos="fade-left">
                                <div className="position-absolute top-0 end-0 p-3 opacity-10 rotate-12 display-4">
                                    <i className="fas fa-gem"></i>
                                </div>
                                <div className="position-relative z-1 d-flex flex-column h-100">
                                    <h6 className="fw-bold mb-3 text-warning">Dui Tech Platinum</h6>
                                    <ul className="list-unstyled mb-4 flex-grow-1">
                                        <li className="d-flex align-items-center gap-2 mb-2 small opacity-75">
                                            <i className="fas fa-check-circle text-success font-size-10"></i> Soporte Prioritario 24/7
                                        </li>
                                        <li className="d-flex align-items-center gap-2 mb-2 small opacity-75">
                                            <i className="fas fa-check-circle text-success font-size-10"></i> Devoluciones Extendidas
                                        </li>
                                        <li className="d-flex align-items-center gap-2 small opacity-75">
                                            <i className="fas fa-check-circle text-success font-size-10"></i> Acceso a Pre-Ventas
                                        </li>
                                    </ul>
                                    <button className="btn btn-warning w-100 rounded-pill fw-bold text-dark x-small py-2 mt-auto">Revisar mis Puntos</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── NEWSLETTER SECTION (CLIENT ONLY) ─────────────────── */}
                    <div className="row mt-5 pt-3 mb-5">
                        <div className="col-12">
                        <div className="glass-card p-5 rounded-4 border border-white/30 shadow-xl text-center bg-gradient-to-b from-white/50 to-primary/5" data-aos="zoom-in">
                            <i className="fas fa-envelope-open-text display-4 text-primary mb-4"></i>
                            <h3 className="fw-bold text-dark mb-2">Únete al Club Dui Tech</h3>
                            <p className="text-muted fs-5 mb-4 mx-auto" style={{ maxWidth: '600px' }}>
                                Recibe notificaciones sobre nuevos productos, ofertas relámpago y consejos técnicos directamente en tu bandeja de entrada.
                            </p>
                            <div className="row justify-content-center">
                                <div className="col-md-6">
                                    <div className="input-group input-group-lg shadow-sm rounded-pill overflow-hidden border">
                                        <input type="email" className="form-control border-0 px-4" placeholder="tu@email.com" />
                                        <button className="btn btn-primary px-4 fw-bold" onClick={() => addNotification({ title: 'Suscripción Exitosa', text: '¡Bienvenido al Club Dui Tech!', type: 'success' })}>Suscribirse</button>
                                    </div>
                                    <p className="xx-small text-muted mt-3">Al suscribirte, aceptas nuestra política de privacidad y términos de servicio.</p>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Catalog;
