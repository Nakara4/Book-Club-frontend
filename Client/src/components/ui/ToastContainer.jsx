import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { selectToasts, removeToast, TOAST_TYPES } from '../../features/toast/toastSlice';

const Toast = ({ toast, onRemove, onRetry }) => {
  const { id, message, type, duration, retryAction, retryLabel } = toast;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onRemove(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onRemove]);

  const getToastStyles = () => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return 'bg-green-600 text-white border-green-700';
      case TOAST_TYPES.ERROR:
        return 'bg-red-600 text-white border-red-700';
      case TOAST_TYPES.WARNING:
        return 'bg-yellow-600 text-white border-yellow-700';
      case TOAST_TYPES.INFO:
      default:
        return 'bg-blue-600 text-white border-blue-700';
    }
  };

  const getIcon = () => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return '✅';
      case TOAST_TYPES.ERROR:
        return '❌';
      case TOAST_TYPES.WARNING:
        return '⚠️';
      case TOAST_TYPES.INFO:
      default:
        return 'ℹ️';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.8 }}
      className={`
        relative flex items-center gap-3 p-4 rounded-lg shadow-lg border-l-4 max-w-md w-full
        ${getToastStyles()}
      `}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {/* Icon */}
      <div className="flex-shrink-0 text-lg" aria-hidden="true">
        {getIcon()}
      </div>

      {/* Message */}
      <div className="flex-1 text-sm font-medium">
        {message}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Retry button */}
        {retryAction && (
          <button
            onClick={() => onRetry(retryAction)}
            className="
              px-2 py-1 text-xs font-medium rounded
              bg-white bg-opacity-20 hover:bg-opacity-30
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50
            "
            aria-label={`${retryLabel} action`}
          >
            {retryLabel}
          </button>
        )}

        {/* Close button */}
        <button
          onClick={() => onRemove(id)}
          className="
            flex-shrink-0 p-1 rounded-full
            hover:bg-white hover:bg-opacity-20
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50
          "
          aria-label="Dismiss notification"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

const ToastContainer = () => {
  const dispatch = useDispatch();
  const toasts = useSelector(selectToasts);

  const handleRemoveToast = (toastId) => {
    dispatch(removeToast(toastId));
  };

  const handleRetry = (retryAction) => {
    if (retryAction && typeof retryAction === 'function') {
      retryAction();
    } else if (retryAction && typeof retryAction === 'object') {
      // If retryAction is a Redux action
      dispatch(retryAction);
    }
  };

  return (
    <div
      className="
        fixed top-4 right-4 z-50 space-y-3
        pointer-events-none
      "
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              toast={toast}
              onRemove={handleRemoveToast}
              onRetry={handleRetry}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
