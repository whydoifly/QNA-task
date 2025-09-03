'use client';

import { useState, useEffect } from 'react';
import { Project, ProjectFormData, ProjectStatus } from '@/types/project';

// Reusable form field components
interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  htmlFor?: string;
  children: React.ReactNode;
}

function FormField({ label, required = false, error, htmlFor, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

function Input({ error, className = '', ...props }: InputProps) {
  const baseClasses = "block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100";
  const errorClasses = error 
    ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
    : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500";
  
  return (
    <input 
      className={`${baseClasses} ${errorClasses} ${className}`} 
      {...props} 
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  children: React.ReactNode;
}

function Select({ error, className = '', children, ...props }: SelectProps) {
  const baseClasses = "block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100";
  const errorClasses = error 
    ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
    : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500";
  
  return (
    <select 
      className={`${baseClasses} ${errorClasses} ${className}`} 
      {...props}
    >
      {children}
    </select>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

function Textarea({ error, className = '', ...props }: TextareaProps) {
  const baseClasses = "block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100";
  const errorClasses = error 
    ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
    : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500";
  
  return (
    <textarea 
      className={`${baseClasses} ${errorClasses} ${className}`} 
      {...props} 
    />
  );
}

// Form configuration
const FORM_FIELDS = {
  name: {
    label: 'Project Name',
    required: true,
    placeholder: 'Enter project name',
    type: 'text' as const
  },
  status: {
    label: 'Status',
    required: true,
    type: 'select' as const,
    options: [
      { value: 'active', label: 'Active' },
      { value: 'on hold', label: 'On Hold' },
      { value: 'completed', label: 'Completed' }
    ]
  },
  assignedTeamMember: {
    label: 'Assigned Team Member',
    required: true,
    placeholder: 'Enter team member name',
    type: 'text' as const
  },
  deadline: {
    label: 'Deadline',
    required: true,
    type: 'date' as const
  },
  budget: {
    label: 'Budget ($)',
    required: true,
    placeholder: 'Enter budget amount (e.g., 50000)',
    type: 'currency' as const
  },
  description: {
    label: 'Description',
    required: false,
    placeholder: 'Enter project description (optional)',
    type: 'textarea' as const
  }
} as const;

// Validation rules
const VALIDATION_RULES = {
  name: (value: string) => !value.trim() ? 'Project name is required' : '',
  assignedTeamMember: (value: string) => !value.trim() ? 'Team member is required' : '',
  deadline: (value: string, isClient: boolean) => {
    if (!value) return 'Deadline is required';
    if (isClient) {
      const deadlineDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate < today) return 'Deadline cannot be in the past';
    }
    return '';
  },
  budget: (value: number, displayValue: string) => {
    if (displayValue.trim() === '' || value <= 0) return 'Budget must be greater than 0';
    return '';
  }
};

interface ProjectFormProps {
  project?: Project;
  onSubmit: (formData: ProjectFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ProjectForm({ project, onSubmit, onCancel, isLoading = false }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    status: 'active',
    deadline: '',
    assignedTeamMember: '',
    budget: 0,
    description: ''
  });

  const [budgetDisplayValue, setBudgetDisplayValue] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set client-side flag to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        status: project.status,
        deadline: project.deadline,
        assignedTeamMember: project.assignedTeamMember,
        budget: project.budget,
        description: project.description || ''
      });
      setBudgetDisplayValue(project.budget.toString());
    } else {
      setBudgetDisplayValue('');
    }
  }, [project]);

  // Utility functions
  const formatBudgetInput = (value: string): string => {
    const cleaned = value.replace(/[^\d.]/g, '');
    const firstDecimalIndex = cleaned.indexOf('.');
    let result = cleaned;
    
    if (firstDecimalIndex !== -1) {
      const beforeDecimal = cleaned.substring(0, firstDecimalIndex);
      const afterDecimal = cleaned.substring(firstDecimalIndex + 1).replace(/\./g, '');
      result = beforeDecimal + '.' + afterDecimal;
    }
    
    const parts = result.split('.');
    if (parts.length === 2 && parts[1].length > 2) {
      result = parts[0] + '.' + parts[1].slice(0, 2);
    }
    
    return result;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    newErrors.name = VALIDATION_RULES.name(formData.name);
    newErrors.assignedTeamMember = VALIDATION_RULES.assignedTeamMember(formData.assignedTeamMember);
    newErrors.deadline = VALIDATION_RULES.deadline(formData.deadline, isClient);
    newErrors.budget = VALIDATION_RULES.budget(formData.budget, budgetDisplayValue);

    // Remove empty errors
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProjectFormData, value: string | number) => {
    if (field === 'budget') {
      const stringValue = value.toString();
      const formattedValue = formatBudgetInput(stringValue);
      setBudgetDisplayValue(formattedValue);
      
      const numericValue = formattedValue === '' ? 0 : parseFloat(formattedValue) || 0;
      setFormData(prev => ({ ...prev, [field]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderFormField = (fieldName: keyof typeof FORM_FIELDS) => {
    const field = FORM_FIELDS[fieldName];
    const error = errors[fieldName];
    const hasError = !!error;
    const fieldId = `field-${fieldName}`;

    switch (field.type) {
      case 'text':
        return (
          <FormField label={field.label} required={field.required} error={error} htmlFor={fieldId}>
            <Input
              id={fieldId}
              type="text"
              value={formData[fieldName] as string}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              placeholder={field.placeholder}
              error={hasError}
              disabled={isLoading}
            />
          </FormField>
        );

      case 'select':
        return (
          <FormField label={field.label} required={field.required} error={error} htmlFor={fieldId}>
            <Select
              id={fieldId}
              value={formData[fieldName] as string}
              onChange={(e) => handleInputChange(fieldName, e.target.value as ProjectStatus)}
              error={hasError}
              disabled={isLoading}
            >
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormField>
        );

      case 'date':
        return (
          <FormField label={field.label} required={field.required} error={error} htmlFor={fieldId}>
            <Input
              id={fieldId}
              type="date"
              value={formData[fieldName] as string}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              error={hasError}
              disabled={isLoading}
            />
          </FormField>
        );

      case 'currency':
        return (
          <FormField label={field.label} required={field.required} error={error} htmlFor={fieldId}>
            <Input
              id={fieldId}
              type="text"
              value={budgetDisplayValue}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              placeholder={field.placeholder}
              error={hasError}
              disabled={isLoading}
            />
          </FormField>
        );

      case 'textarea':
        return (
          <FormField label={field.label} required={field.required} error={error} htmlFor={fieldId}>
            <Textarea
              id={fieldId}
              value={formData[fieldName] as string}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              error={hasError}
              disabled={isLoading}
            />
          </FormField>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Project Name */}
      {renderFormField('name')}

      {/* Status and Team Member Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderFormField('status')}
        {renderFormField('assignedTeamMember')}
      </div>

      {/* Deadline and Budget Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderFormField('deadline')}
        {renderFormField('budget')}
      </div>

      {/* Description */}
      {renderFormField('description')}

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </div>
          ) : (
            project ? 'Update Project' : 'Create Project'
          )}
        </button>
      </div>
    </form>
  );
}