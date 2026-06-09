// src/components/common/ToastContainer.jsx
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const toastClasses = {
  success: 'toast-success',
  error: 'toast-error',
  info: 'toast-info',
};

const iconColors = {
  success: 'text-secondary',
  error: 'text-error',
  info: 'text-primary',
};

const Toast = ({ id, type, message, onRemove }) => {
  const Icon = toastIcons[type];
  return (
    <div className={`toast ${toastClasses[type]}`}>
      <Icon size={18} className={`flex-shrink-0 mt-0.5 ${iconColors[type]}`} />
      <p className="flex-1 text-sm">{message}</p>
      <button
        onClick={() => onRemove(id)}
        className="flex-shrink-0 text-text-secondary hover:text-text transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
