import { useState, useEffect } from 'react';

function FormField({ field, value, onChange, error }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.multiselect-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  switch (field.type) {
    case 'select':
      return (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <select
            className={`w-full p-3 border-2 border-black rounded bg-pink-50 ${
              error ? 'border-red-500' : ''
            }`}
            value={value || ''}
            onChange={(e) => onChange(field.name, e.target.value)}
          >
            <option value="">Select {field.label}</option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      );

    case 'multiselect':
      return (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <div className="relative multiselect-container">
            <button
              type="button"
              className={`w-full p-3 border-2 border-black rounded bg-pink-50 text-left ${
                error ? 'border-red-500' : ''
              }`}
              onClick={() => setIsOpen(!isOpen)}
            >
              {value && value.length > 0
                ? value.join(', ')
                : `Select ${field.label}`}
            </button>
            {isOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border-2 border-black rounded shadow-lg max-h-60 overflow-auto">
                {field.options.map((option) => (
                  <label
                    key={option}
                    className="flex items-center p-2 hover:bg-pink-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={(value || []).includes(option)}
                      onChange={(e) => {
                        const newValue = e.target.checked
                          ? [...(value || []), option]
                          : (value || []).filter((v) => v !== option);
                        onChange(field.name, newValue);
                      }}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
          </div>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      );

    case 'textarea':
      return (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <textarea
            className={`w-full p-3 border-2 border-black rounded bg-pink-50 ${
              error ? 'border-red-500' : ''
            }`}
            value={value || ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      );

    default:
      return (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <input
            type={field.type}
            className={`w-full p-3 border-2 border-black rounded bg-pink-50 ${
              error ? 'border-red-500' : ''
            }`}
            value={value || ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder}
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      );
  }
}

export default FormField;