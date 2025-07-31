import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const FormField = ({
  label,
  name,
  type = 'text',
  register,
  errors = {},
  required = false,
  placeholder,
  className = '',
  children,
  ...props
}) => {
  const error = errors?.[name];
  const fieldId = `field-${name}`;

  const baseInputClasses = `
    w-full px-3 py-2 border rounded-lg 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    transition-all duration-200
    ${error 
      ? 'border-red-500 focus:ring-red-500' 
      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
    }
    bg-white dark:bg-gray-800 text-gray-900 dark:text-white
    placeholder-gray-500 dark:placeholder-gray-400
  `;

  const renderInput = () => {
    if (children) {
      return children;
    }

    const commonProps = {
      id: fieldId,
      className: `${baseInputClasses} ${className}`,
      placeholder,
      ...register(name, { required: required && `${label} is required` }),
      ...props,
    };

    switch (type) {
      case 'textarea':
        return <textarea {...commonProps} rows={4} />;
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">{placeholder || `Select ${label}`}</option>
            {props.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return <input type={type} {...commonProps} />;
    }
  };

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {renderInput()}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-sm text-red-600 dark:text-red-400"
        >
          {error.message}
        </motion.p>
      )}
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'textarea', 'select', 'file']),
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default FormField;
