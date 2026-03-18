import React from 'react';
import PropTypes from 'prop-types';

/**
 * Generic Card component for Dui Tech ERP.
 * Leverages Bootstrap .card classes.
 */
/**
 * Generic Card component for Dui Tech ERP.
 * Leverages Bootstrap .card classes.
 */
export const Card = React.memo(({ 
    title, 
    children, 
    footer, 
    extra, 
    className = '', 
    bodyClassName = '',
    noPadding = false,
    glass = true,
    ...props 
}) => {
    return (
        <div className={`card border-0 shadow-sm overflow-hidden ${glass ? 'glass-card' : ''} ${className}`} {...props}>
            {(title || extra) && (
                <div className="card-header bg-transparent border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
                    {title && <h5 className="fw-bold m-0 text-primary">{title}</h5>}
                    {extra && <div className="card-extra">{extra}</div>}
                </div>
            )}
            <div className={`card-body ${noPadding ? 'p-0' : 'p-4'} ${bodyClassName}`}>
                {children}
            </div>
            {footer && (
                <div className="card-footer bg-transparent border-top py-3 px-4">
                    {footer}
                </div>
            )}
        </div>
    );
});

/**
 * StatCard for dashboard metrics.
 * USES: .stat-card and .stat-card .value from index.css
 */
export const StatCard = React.memo(({ title, value, sub, trend, icon, className = '', ...props }) => (
    <div className={`stat-card glass-card ${trend === 'down' ? 'alert' : ''} ${className}`} {...props}>
        <div className="d-flex justify-content-between align-items-start mb-2">
            <h3 className="fw-bold m-0 text-uppercase tracking-wider" style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{title}</h3>
            {icon && <i className={`fas ${icon} text-muted opacity-30 text-lg`}></i>}
        </div>
        <div className="value">{value}</div>
        <div className={`text-xs mt-3 d-flex align-items-center gap-1 fw-bold ${trend === 'up' ? 'text-success' : trend === 'down' ? 'text-danger' : 'text-muted'}`}>
            {sub}
        </div>
    </div>
));

/**
 * ActivityItem for log lists inside cards.
 */
export const ActivityItem = React.memo(({ time, text, icon, dark }) => (
    <div className={`d-flex gap-3 mb-3 pb-3 ${dark ? 'border-bottom border-white/10' : 'border-bottom border-light'} last:border-0`}>
        <div className={`w-8 h-8 rounded-circle d-flex align-items-center justify-content-center shrink-0 ${dark ? 'bg-white/10 text-white' : 'bg-primary-subtle text-primary'}`}>
            <i className={`fas ${icon} small`}></i>
        </div>
        <div>
            <div className={`fw-bold small ${dark ? 'text-white' : 'text-dark'}`}>{text}</div>
            <div className={`x-small ${dark ? 'text-white-50' : 'text-muted'}`}>{time}</div>
        </div>
    </div>
));

/**
 * Specialized Card for Charts.
 */
export const ChartCard = React.memo(({ title, children, icon, extra, ...props }) => (
    <Card 
        title={<><i className={`fas ${icon} text-primary me-2`}></i>{title}</>}
        extra={extra}
        {...props}
    >
        <div style={{ height: '350px' }}>
            {children}
        </div>
    </Card>
));

Card.propTypes = {
    title: PropTypes.node,
    children: PropTypes.node.isRequired,
    footer: PropTypes.node,
    extra: PropTypes.node,
    className: PropTypes.string,
    bodyClassName: PropTypes.string,
    noPadding: PropTypes.bool,
};

StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    sub: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    trend: PropTypes.oneOf(['up', 'down', 'neutral']),
    icon: PropTypes.string,
    className: PropTypes.string,
};

export default Card;
