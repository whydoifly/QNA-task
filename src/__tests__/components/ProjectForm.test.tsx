import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProjectForm from '@/components/ProjectForm'
import { Project } from '@/types/project'

describe('ProjectForm Component', () => {
  const mockOnSubmit = jest.fn()
  const mockOnCancel = jest.fn()
  
  const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    isLoading: false
  }

  const futureDate = new Date()
  futureDate.setFullYear(futureDate.getFullYear() + 1)
  const futureDateString = futureDate.toISOString().split('T')[0]
  
  const mockProject: Project = {
    id: '1',
    name: 'Test Project',
    status: 'active' as const,
    deadline: futureDateString,
    assignedTeamMember: 'John Doe',
    budget: 50000,
    description: 'Test description',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should render empty form for new project', () => {
    render(<ProjectForm {...defaultProps} />)
    
    expect(screen.getByLabelText(/Project Name/)).toHaveValue('')
    expect(screen.getByLabelText(/Status/)).toHaveValue('active')
    expect(screen.getByLabelText(/Team Member/)).toHaveValue('')
    expect(screen.getByLabelText(/Deadline/)).toHaveValue('')
    expect(screen.getByLabelText(/Budget/)).toHaveValue(0)
    expect(screen.getByLabelText(/Description/)).toHaveValue('')
    expect(screen.getByText('Create Project')).toBeInTheDocument()
  })

  test('should render pre-populated form for editing project', () => {
    render(<ProjectForm {...defaultProps} project={mockProject} />)
    
    expect(screen.getByDisplayValue('Test Project')).toBeInTheDocument()
    expect(screen.getByLabelText(/Status/).value).toBe('active')
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
    expect(screen.getByDisplayValue(futureDateString)).toBeInTheDocument()
    expect(screen.getByDisplayValue('50000')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument()
    expect(screen.getByText('Update Project')).toBeInTheDocument()
  })

  test('should show validation errors for empty required fields', async () => {
    const user = userEvent.setup()
    render(<ProjectForm {...defaultProps} />)
    
    const submitButton = screen.getByText('Create Project')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Project name is required')).toBeInTheDocument()
      expect(screen.getByText('Team member is required')).toBeInTheDocument()
      expect(screen.getByText('Deadline is required')).toBeInTheDocument()
      expect(screen.getByText('Budget must be greater than 0')).toBeInTheDocument()
    })
    
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  test('should validate past deadline', async () => {
    const user = userEvent.setup()
    render(<ProjectForm {...defaultProps} />)
    
    // Fill form with past deadline
    await user.type(screen.getByLabelText(/Project Name/), 'Test')
    await user.type(screen.getByLabelText(/Team Member/), 'John')
    await user.type(screen.getByLabelText(/Deadline/), '2020-01-01')
    await user.type(screen.getByLabelText(/Budget/), '1000')
    
    await user.click(screen.getByText('Create Project'))
    
    await waitFor(() => {
      expect(screen.getByText('Deadline cannot be in the past')).toBeInTheDocument()
    })
    
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  test('should validate zero budget', async () => {
    const user = userEvent.setup()
    render(<ProjectForm {...defaultProps} />)
    
    // Use a date that's definitely in the future
    const futureDate = new Date()
    futureDate.setFullYear(futureDate.getFullYear() + 1)
    const futureDateString = futureDate.toISOString().split('T')[0]
    
    // Fill form with zero budget (default value)
    await user.type(screen.getByLabelText(/Project Name/), 'Test')
    await user.type(screen.getByLabelText(/Team Member/), 'John')
    await user.type(screen.getByLabelText(/Deadline/), futureDateString)
    // Budget is already 0 by default
    
    await user.click(screen.getByText('Create Project'))
    
    await waitFor(() => {
      expect(screen.getByText('Budget must be greater than 0')).toBeInTheDocument()
    })
    
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  test('should clear validation error when user starts typing', async () => {
    const user = userEvent.setup()
    render(<ProjectForm {...defaultProps} />)
    
    // Trigger validation error
    await user.click(screen.getByText('Create Project'))
    
    await waitFor(() => {
      expect(screen.getByText('Project name is required')).toBeInTheDocument()
    })
    
    // Start typing in name field
    await user.type(screen.getByLabelText(/Project Name/), 'T')
    
    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText('Project name is required')).not.toBeInTheDocument()
    })
  })

  test('should submit form with valid data', async () => {
    const user = userEvent.setup()
    render(<ProjectForm {...defaultProps} />)
    
    // Use a date that's definitely in the future
    const futureDate = new Date()
    futureDate.setFullYear(futureDate.getFullYear() + 1)
    const futureDateString = futureDate.toISOString().split('T')[0]
    
    // Fill form with valid data
    await user.type(screen.getByLabelText(/Project Name/), 'New Project')
    await user.selectOptions(screen.getByLabelText(/Status/), 'on hold')
    await user.type(screen.getByLabelText(/Team Member/), 'Jane Smith')
    await user.type(screen.getByLabelText(/Deadline/), futureDateString)
    await user.type(screen.getByLabelText(/Budget/), '75000')
    await user.type(screen.getByLabelText(/Description/), 'New project description')
    
    await user.click(screen.getByText('Create Project'))
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'New Project',
        status: 'on hold',
        assignedTeamMember: 'Jane Smith',
        deadline: futureDateString,
        budget: 75000,
        description: 'New project description'
      })
    })
  })

  test('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(<ProjectForm {...defaultProps} />)
    
    await user.click(screen.getByText('Cancel'))
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1)
  })

  test('should show loading state when isLoading is true', () => {
    render(<ProjectForm {...defaultProps} isLoading={true} />)
    
    expect(screen.getByText('Saving...')).toBeInTheDocument()
    
    // Form fields should be disabled
    expect(screen.getByLabelText(/Project Name/)).toBeDisabled()
    expect(screen.getByLabelText(/Status/)).toBeDisabled()
    expect(screen.getByLabelText(/Team Member/)).toBeDisabled()
    expect(screen.getByLabelText(/Deadline/)).toBeDisabled()
    expect(screen.getByLabelText(/Budget/)).toBeDisabled()
    expect(screen.getByLabelText(/Description/)).toBeDisabled()
    
    // Buttons should be disabled
    expect(screen.getByText('Cancel')).toBeDisabled()
    expect(screen.getByRole('button', { name: /Saving/ })).toBeDisabled()
  })

  test('should handle all status options', async () => {
    const user = userEvent.setup()
    render(<ProjectForm {...defaultProps} />)
    
    const statusSelect = screen.getByLabelText(/Status/) as HTMLSelectElement
    
    // Test all status options
    await user.selectOptions(statusSelect, 'active')
    expect(statusSelect.value).toBe('active')
    
    await user.selectOptions(statusSelect, 'on hold')
    expect(statusSelect.value).toBe('on hold')
    
    await user.selectOptions(statusSelect, 'completed')
    expect(statusSelect.value).toBe('completed')
  })

  test('should handle budget input as number', async () => {
    const user = userEvent.setup()
    render(<ProjectForm {...defaultProps} />)
    
    const budgetInput = screen.getByLabelText(/Budget/)
    
    await user.type(budgetInput, '123.45')
    
    expect(budgetInput).toHaveValue(123.45)
  })

  test('should handle description as optional field', async () => {
    const user = userEvent.setup()
    render(<ProjectForm {...defaultProps} />)
    
    // Use a date that's definitely in the future
    const futureDate = new Date()
    futureDate.setFullYear(futureDate.getFullYear() + 1)
    const futureDateString = futureDate.toISOString().split('T')[0]
    
    // Fill required fields only
    await user.type(screen.getByLabelText(/Project Name/), 'Test Project')
    await user.type(screen.getByLabelText(/Team Member/), 'John Doe')
    await user.type(screen.getByLabelText(/Deadline/), futureDateString)
    await user.type(screen.getByLabelText(/Budget/), '50000')
    // Leave description empty
    
    await user.click(screen.getByText('Create Project'))
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Test Project',
        status: 'active',
        assignedTeamMember: 'John Doe',
        deadline: futureDateString,
        budget: 50000,
        description: ''
      })
    })
  })
})
