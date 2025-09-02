'use client';

import { useState, useEffect } from 'react';
import { Project, ProjectFormData, ProjectStatus } from '@/types/project';

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

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData.assignedTeamMember.trim()) {
      newErrors.assignedTeamMember = 'Team member is required';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate < today) {
        newErrors.deadline = 'Deadline cannot be in the past';
      }
    }

    if (budgetDisplayValue.trim() === '' || formData.budget <= 0) {
      newErrors.budget = 'Budget must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Format budget input to allow only numbers and decimals
  const formatBudgetInput = (value: string): string => {
    // Remove any non-digit and non-decimal characters
    const cleaned = value.replace(/[^\d.]/g, '');
    
    // Handle multiple decimal points - keep only the first one
    const firstDecimalIndex = cleaned.indexOf('.');
    let result = cleaned;
    if (firstDecimalIndex !== -1) {
      const beforeDecimal = cleaned.substring(0, firstDecimalIndex);
      const afterDecimal = cleaned.substring(firstDecimalIndex + 1).replace(/\./g, '');
      result = beforeDecimal + '.' + afterDecimal;
    }
    
    // Limit decimal places to 2
    const parts = result.split('.');
    if (parts.length === 2 && parts[1].length > 2) {
      result = parts[0] + '.' + parts[1].slice(0, 2);
    }
    
    return result;
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (field === 'budget') {
      const stringValue = value.toString();
      const formattedValue = formatBudgetInput(stringValue);
      setBudgetDisplayValue(formattedValue);
      
      // Convert to number for form data, defaulting to 0 for empty string
      const numericValue = formattedValue === '' ? 0 : parseFloat(formattedValue) || 0;
      setFormData(prev => ({
        ...prev,
        [field]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Project Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Project Name *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
            errors.name
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
          placeholder="Enter project name"
          disabled={isLoading}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
      </div>

      {/* Status and Team Member Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status *
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value as ProjectStatus)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            disabled={isLoading}
          >
            <option value="active">Active</option>
            <option value="on hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Team Member */}
        <div>
          <label htmlFor="assignedTeamMember" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Assigned Team Member *
          </label>
          <input
            type="text"
            id="assignedTeamMember"
            value={formData.assignedTeamMember}
            onChange={(e) => handleInputChange('assignedTeamMember', e.target.value)}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
              errors.assignedTeamMember
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
            placeholder="Enter team member name"
            disabled={isLoading}
          />
          {errors.assignedTeamMember && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.assignedTeamMember}</p>
          )}
        </div>
      </div>

      {/* Deadline and Budget Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deadline */}
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Deadline *
          </label>
          <input
            type="date"
            id="deadline"
            value={formData.deadline}
            onChange={(e) => handleInputChange('deadline', e.target.value)}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
              errors.deadline
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
            disabled={isLoading}
          />
          {errors.deadline && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.deadline}</p>}
        </div>

        {/* Budget */}
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Budget ($) *
          </label>
          <input
            type="text"
            id="budget"
            value={budgetDisplayValue}
            onChange={(e) => handleInputChange('budget', e.target.value)}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
              errors.budget
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
            placeholder="Enter budget amount (e.g., 50000)"
            disabled={isLoading}
          />
          {errors.budget && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.budget}</p>}
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          placeholder="Enter project description (optional)"
          disabled={isLoading}
        />
      </div>

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
