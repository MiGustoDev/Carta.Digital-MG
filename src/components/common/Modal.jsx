// src/components/common/Modal.jsx
import { cloneElement, isValidElement, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsVisible(false);
      setIsClosing(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }
  }, []);

  const handleRequestClose = () => {
    if (isClosing) return;

    setIsClosing(true);
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = window.setTimeout(() => {
      onClose();
    }, 180);
  };

  if (!isOpen && !isVisible) return null;

  const content = isValidElement(children)
    ? cloneElement(children, { onRequestClose: handleRequestClose })
    : children;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ease-out ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleRequestClose}
      />

      {/* Panel */}
      <div
        className={`
          relative bg-white rounded-card shadow-card-hover w-full ${maxWidth}
          max-h-[90vh] flex flex-col transition-all duration-200 ease-out
          ${isClosing ? 'opacity-0 translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-text">{title}</h2>
          <button
            onClick={handleRequestClose}
            className="p-2 rounded-btn text-text-secondary hover:text-text hover:bg-background-secondary transition-colors"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 scrollbar-thin">
          {content}
        </div>
      </div>
    </div>
  );
};

export default Modal;
