import { useState, useEffect } from 'react';
import axios from '../../utils/axios';

export const useQuestionnaire = (initialPage = 0) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    // Load saved progress from localStorage
    const savedData = localStorage.getItem('questionnaireProgress');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleInputChange = (name, value) => {
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    setErrors({ ...errors, [name]: '' });
    
    // Save progress
    localStorage.setItem('questionnaireProgress', JSON.stringify(updatedData));
  };

  const validatePage = (pageFields) => {
    const newErrors = {};
    pageFields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (pageFields) => {
    if (validatePage(pageFields)) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentPage(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      await axios.post('/auth/questionnaire', formData, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      localStorage.removeItem('questionnaireProgress');
      return true;
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Failed to submit questionnaire');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentPage,
    formData,
    errors,
    isSubmitting,
    submitError,
    handleInputChange,
    handleNext,
    handlePrevious,
    handleSubmit
  };
};