import React, { useState, useEffect } from 'react';
import './AccessibilityPanel.css';

export const AccessibilityPanel = ({ onClose }) => {
    // Cargar estado inicial desde localStorage si existe
    const [fontSize, setFontSize] = useState(() => {
        const guardado = localStorage.getItem('accesibilidad-font-size');
        return guardado ? Number(guardado) : 100;
    });

    const [toggles, setToggles] = useState(() => {
        const guardado = localStorage.getItem('accesibilidad-toggles');
        return guardado ? JSON.parse(guardado) : {
            altoContraste: false,
            reducirMovimiento: false,
            subrayarEnlaces: false,
            espaciadoLectura: false,
        };
    });

    // APLICAR CAMBIOS EN TODA LA PÁGINA
    useEffect(() => {
        const root = document.documentElement;

        // 1. Tamaño del texto global
        root.style.fontSize = `${fontSize}%`;

        // 2. Alternar clases CSS globales según los interruptores
        root.classList.toggle('high-contrast', toggles.altoContraste);
        root.classList.toggle('reduce-motion', toggles.reducirMovimiento);
        root.classList.toggle('underline-links', toggles.subrayarEnlaces);
        root.classList.toggle('reading-spacing', toggles.espaciadoLectura);

        // 3. Persistir opciones en el navegador
        localStorage.setItem('accesibilidad-font-size', fontSize);
        localStorage.setItem('accesibilidad-toggles', JSON.stringify(toggles));
    }, [fontSize, toggles]);

    const handleToggle = (key) => {
        setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleReset = () => {
        setFontSize(100);
        setToggles({
            altoContraste: false,
            reducirMovimiento: false,
            subrayarEnlaces: false,
            espaciadoLectura: false,
        });
    };

    return (
        <div className="accessibility-panel">
            {/* Encabezado */}
            <div className="ap-header">
                <h2 className="ap-title titular-h3">Accesibilidad</h2>
                <button className="ap-close-btn" onClick={onClose} aria-label="Cerrar panel">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="var(--marca-primario)" />
                    </svg>
                </button>
            </div>

            {/* Control de tamaño de texto */}
            <div className="ap-section">
                <h3 className="ap-section-title cuerpo-p-fuerte">Tamaño del texto</h3>
                <div className="ap-text-control">
                    <button
                        className="ap-text-btn cuerpo-m-fuerte"
                        onClick={() => setFontSize(prev => Math.max(prev - 5, 85))}
                        aria-label="Disminuir tamaño de texto"
                    >
                        -
                    </button>
                    <span className="ap-text-indicator cuerpo-m-fuerte">A</span>
                    <button
                        className="ap-text-btn cuerpo-m-fuerte"
                        onClick={() => setFontSize(prev => Math.min(prev + 5, 125))}
                        aria-label="Aumentar tamaño de texto"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Opciones de interruptores */}
            <div className="ap-toggles-list">
                <ToggleOption
                    title="Alto contraste"
                    description="Más diferencia entre el texto y el fondo"
                    isActive={toggles.altoContraste}
                    onToggle={() => handleToggle('altoContraste')}
                />
                <ToggleOption
                    title="Reducir movimiento"
                    description="Sin animaciones ni transiciones"
                    isActive={toggles.reducirMovimiento}
                    onToggle={() => handleToggle('reducirMovimiento')}
                />
                <ToggleOption
                    title="Subrayar enlaces"
                    description="Los enlaces se distinguen sin depender del color"
                    isActive={toggles.subrayarEnlaces}
                    onToggle={() => handleToggle('subrayarEnlaces')}
                />
                <ToggleOption
                    title="Espaciado de lectura"
                    description="Más espacio entre líneas y entre letras"
                    isActive={toggles.espaciadoLectura}
                    onToggle={() => handleToggle('espaciadoLectura')}
                />
            </div>

            {/* Nota informativa */}
            <p className="ap-footer-note detalle-nota">
                Se guarda en este dispositivo. Los valores iniciales salen de lo que ya definiste en tu sistema.
            </p>

            {/* Pie del panel */}
            <div className="ap-footer-actions">
                <a href="#declaracion-accesibilidad" className="ap-link detalle-nota-fuerte">
                    Declaración de accesibilidad
                </a>
                <button className="ap-reset-btn detalle-nota-fuerte" onClick={handleReset}>
                    Restablecer
                </button>
            </div>
        </div>
    );
};

const ToggleOption = ({ title, description, isActive, onToggle }) => (
    <div className="ap-toggle-item">
        <div className="ap-toggle-text">
            <h4 className="ap-toggle-title cuerpo-p-fuerte">{title}</h4>
            <p className="ap-toggle-desc detalle-nota">{description}</p>
        </div>
        <button
            className={`ap-toggle-switch ${isActive ? 'active' : ''}`}
            onClick={onToggle}
            aria-pressed={isActive}
        >
            <span className="ap-toggle-thumb"></span>
        </button>
    </div>
);