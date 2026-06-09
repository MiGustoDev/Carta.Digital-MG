// src/components/common/Alert.jsx
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const icons = {
  error: AlertCircle,
  success: CheckCircle,
  info: Info,
};

const classes = {
  error: 'bg-red-50 border-error text-red-800',
  success: 'bg-secondary-50 border-secondary text-secondary-800',
  info: 'bg-primary-50 border-primary text-primary-800',
};

const iconClasses = {
  error: 'text-error',
  success: 'text-secondary',
  info: 'text-primary',
};

const Alert = ({ type = 'info', message, onClose, className = '' }) => {
  const Icon = icons[type];

  return (
    <div className={`flex items-start gap-3 p-4 rounded-btn border ${classes[type]} ${className}`}>
      <Icon size={18} className={`flex-shrink-0 mt-0.5 ${iconClasses[type]}`} />
      <p className="flex-1 text-sm font-medium">{message}</p>
      {onClose && (
        <button onClick={onClose} className="flex-shrink-0 hover:opacity-70 transition-opacity">
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
