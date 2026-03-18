import PropTypes from 'prop-types';

const StatCard = ({ title, value, sub, trend, icon, ...props }) => (
    <div className={`stat-card ${trend === 'down' ? 'alert' : ''}`} {...props}>
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold m-0">{title}</h3>
            {icon && <i className={`fas ${icon} text-muted opacity-30 text-lg`}></i>}
        </div>
        <div className="value">{value}</div>
        <div className={`text-xs mt-3 flex items-center gap-1 font-semibold ${trend === 'up' ? 'text-success' : trend === 'down' ? 'text-danger' : 'text-muted'}`}>
            {sub}
        </div>
    </div>
);

StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    sub: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    trend: PropTypes.oneOf(['up', 'down', 'neutral']),
    icon: PropTypes.string,
};

export default StatCard;
