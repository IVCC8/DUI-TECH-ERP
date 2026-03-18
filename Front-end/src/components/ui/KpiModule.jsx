import React from 'react';
import { Card } from '../Card/card';

const KpiModule = ({ title, value, unit = '', formula, interpretation, icon, color = 'primary', description }) => {
    return (
        <Card className={`border-0 shadow-lg overflow-hidden h-100 bg-white/10 backdrop-blur-md border-start border-${color} border-4`} data-aos="fade-up">
            <div className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold m-0 text-gradient d-flex align-items-center gap-2">
                        {icon && <i className={`${icon} text-${color}`}></i>}
                        {title}
                    </h5>
                    {description && <span className="small text-muted">{description}</span>}
                </div>

                <div className="mb-4 text-center">
                    <div className="display-4 fw-extrabold text-dark">
                        {value}{unit}
                    </div>
                </div>

                <div className="bg-white/50 rounded-4 p-4 mb-3 text-center border border-white/20">
                    <div className="small text-muted mb-2 text-uppercase fw-bold ls-wider">Fórmula Aplicada</div>
                    <div className="h5 font-monospace m-0 text-primary">
                        {formula}
                    </div>
                </div>

                <div className="d-flex align-items-start gap-2 pt-2 border-top border-dark/5">
                    <i className="fas fa-info-circle text-info mt-1"></i>
                    <p className="small mb-0">
                        <span className="fw-bold text-dark">Interpretación:</span> {interpretation}
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default KpiModule;
