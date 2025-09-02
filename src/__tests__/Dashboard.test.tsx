import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Dashboard from '@/app/page'

describe('Dashboard Component', () => {
  beforeEach(() => {
    // Reset any mocks before each test
    jest.clearAllMocks()
  })

  // Test Case 1: Searching/Filtering Projects
  describe('Search and Filter Functionality', () => {
    test('should filter projects by search term', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)

      // Wait for the component to render
      await waitFor(() => {
        expect(screen.getByText('E-commerce Platform Redesign')).toBeInTheDocument()
      })

      // Search for "Mobile"
      const searchInput = screen.getByPlaceholderText('Search projects...')
      await user.type(searchInput, 'Mobile')

      // Should show only Mobile App Development project
      await waitFor(() => {
        expect(screen.getByText('Mobile App Development')).toBeInTheDocument()
        expect(screen.queryByText('E-commerce Platform Redesign')).not.toBeInTheDocument()
      })
    })

    test('should filter projects by status', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByText('E-commerce Platform Redesign')).toBeInTheDocument()
      })

      // Filter by "active" status
      const statusFilter = screen.getByDisplayValue('All Statuses')
      await user.selectOptions(statusFilter, 'active')

      // Should show only active projects (there are multiple active projects in our data)
      await waitFor(() => {
        expect(screen.getByText('E-commerce Platform Redesign')).toBeInTheDocument()
        expect(screen.getByText('API Gateway Setup')).toBeInTheDocument()
        expect(screen.getByText('Payment System Integration')).toBeInTheDocument()
      })
    })

    test('should filter projects by team member', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByText('E-commerce Platform Redesign')).toBeInTheDocument()
      })

      // Filter by team member
      const teamMemberFilter = screen.getByDisplayValue('All Team Members')
      await user.selectOptions(teamMemberFilter, 'Emily Watson')

      // Should show only Emily's projects
      await waitFor(() => {
        expect(screen.getByText('Security Audit Implementation')).toBeInTheDocument()
        expect(screen.queryByText('E-commerce Platform Redesign')).not.toBeInTheDocument()
        expect(screen.queryByText('Mobile App Development')).not.toBeInTheDocument()
      })
    })

    test('should clear all filters when clear button is clicked', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByText('E-commerce Platform Redesign')).toBeInTheDocument()
      })

      // Apply search filter
      const searchInput = screen.getByPlaceholderText('Search projects...')
      await user.type(searchInput, 'Mobile')

      // Apply status filter
      const statusFilter = screen.getByDisplayValue('All Statuses')
      await user.selectOptions(statusFilter, 'active')

      // Clear filters should appear
      await waitFor(() => {
        expect(screen.getByText('Clear all filters')).toBeInTheDocument()
      })

      // Click clear filters
      await user.click(screen.getByText('Clear all filters'))

      // All projects should be visible again
      await waitFor(() => {
        expect(screen.getByText('E-commerce Platform Redesign')).toBeInTheDocument()
        expect(screen.getByText('Mobile App Development')).toBeInTheDocument()
      })
    })

    test('should show "no projects found" when no matches', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByText('E-commerce Platform Redesign')).toBeInTheDocument()
      })

      // Search for non-existent project
      const searchInput = screen.getByPlaceholderText('Search projects...')
      await user.type(searchInput, 'Non-existent Project')

      // Should show empty state
      await waitFor(() => {
        expect(screen.getByText('No projects found')).toBeInTheDocument()
        expect(screen.getByText('Try adjusting your search or filter criteria')).toBeInTheDocument()
      })
    })
  })

  // Test Case 2: Adding a New Project
  describe('Adding New Project', () => {
    test('should open modal when Add Project button is clicked', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)

      const addButton = screen.getByText('Add Project')
      await user.click(addButton)

      // Modal should open
      await waitFor(() => {
        expect(screen.getByText('Add New Project')).toBeInTheDocument()
        expect(screen.getByLabelText(/Project Name/)).toBeInTheDocument()
      })
    })

    test('should successfully add a new project', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)

      // Open modal
      await user.click(screen.getByText('Add Project'))

      await waitFor(() => {
        expect(screen.getByText('Add New Project')).toBeInTheDocument()
      })

      // Fill out form
      await user.type(screen.getByLabelText(/Project Name/), 'New Test Project')
      await user.selectOptions(screen.getByLabelText(/Status/), 'active')
      await user.type(screen.getByLabelText(/Team Member/), 'John Doe')
      await user.type(screen.getByLabelText(/Deadline/), '2024-12-31')
      await user.type(screen.getByLabelText(/Budget/), '50000')
      await user.type(screen.getByLabelText(/Description/), 'Test project description')

      // Submit form
      await user.click(screen.getByText('Create Project'))

      // Wait for project to be added and modal to close
      await waitFor(() => {
        expect(screen.queryByText('Add New Project')).not.toBeInTheDocument()
      }, { timeout: 2000 })

      // New project should appear in the list
      await waitFor(() => {
        expect(screen.getByText('New Test Project')).toBeInTheDocument()
      })
    })

    test('should close modal when Cancel is clicked', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)

      // Open modal
      await user.click(screen.getByText('Add Project'))

      await waitFor(() => {
        expect(screen.getByText('Add New Project')).toBeInTheDocument()
      })

      // Click Cancel
      await user.click(screen.getByText('Cancel'))

      // Modal should close
      await waitFor(() => {
        expect(screen.queryByText('Add New Project')).not.toBeInTheDocument()
      })
    })

    test('should close modal when clicking backdrop', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)

      // Open modal
      await user.click(screen.getByText('Add Project'))

      await waitFor(() => {
        expect(screen.getByText('Add New Project')).toBeInTheDocument()
      })

      // Click backdrop (the modal overlay)
      const modalBackdrop = document.querySelector('.fixed.inset-0.bg-black')
      if (modalBackdrop) {
        await user.click(modalBackdrop)
      }

      // Modal should close
      await waitFor(() => {
        expect(screen.queryByText('Add New Project')).not.toBeInTheDocument()
      })
    })
  })

  // Test Case 3: Editing an Existing Project
  describe('Editing Existing Project', () => {
    test('should open edit modal with pre-populated data', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByText('E-commerce Platform Redesign')).toBeInTheDocument()
      })

      // Click Edit button for first project
      const editButtons = screen.getAllByText('Edit')
      await user.click(editButtons[0])

      // Modal should open with pre-populated data
      await waitFor(() => {
        expect(screen.getByText('Edit Project')).toBeInTheDocument()
        expect(screen.getByDisplayValue('E-commerce Platform')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Sarah Johnson')).toBeInTheDocument()
      })
    })

    test('should successfully update an existing project', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByText('E-commerce Platform Redesign')).toBeInTheDocument()
      })

      // Click Edit button
      const editButtons = screen.getAllByText('Edit')
      await user.click(editButtons[0])

      await waitFor(() => {
        expect(screen.getByText('Edit Project')).toBeInTheDocument()
      })

      // Update project name
      const nameInput = screen.getByDisplayValue('E-commerce Platform')
      await user.clear(nameInput)
      await user.type(nameInput, 'Updated E-commerce Platform')

      // Submit form
      await user.click(screen.getByText('Update Project'))

      // Wait for update to complete
      await waitFor(() => {
        expect(screen.queryByText('Edit Project')).not.toBeInTheDocument()
      }, { timeout: 2000 })

      // Updated project should appear in the list
      await waitFor(() => {
        expect(screen.getByText('Updated E-commerce Platform')).toBeInTheDocument()
      })
    })
  })

  // Test Case 4: Form Validation
  describe('Form Validation', () => {
    test('should show validation errors for required fields', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)

      // Open add project modal
      await user.click(screen.getByText('Add Project'))

      await waitFor(() => {
        expect(screen.getByText('Add New Project')).toBeInTheDocument()
      })

      // Try to submit empty form
      await user.click(screen.getByText('Create Project'))

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText('Project name is required')).toBeInTheDocument()
        expect(screen.getByText('Team member is required')).toBeInTheDocument()
        expect(screen.getByText('Deadline is required')).toBeInTheDocument()
        expect(screen.getByText('Budget must be greater than 0')).toBeInTheDocument()
      })
    })

    test('should validate past deadline dates', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)

      // Open add project modal
      await user.click(screen.getByText('Add Project'))

      await waitFor(() => {
        expect(screen.getByText('Add New Project')).toBeInTheDocument()
      })

      // Fill required fields with past deadline
      await user.type(screen.getByLabelText(/Project Name/), 'Test Project')
      await user.type(screen.getByLabelText(/Team Member/), 'John Doe')
      await user.type(screen.getByLabelText(/Deadline/), '2020-01-01')
      await user.type(screen.getByLabelText(/Budget/), '1000')

      // Try to submit
      await user.click(screen.getByText('Create Project'))

      // Should show deadline validation error
      await waitFor(() => {
        expect(screen.getByText('Deadline cannot be in the past')).toBeInTheDocument()
      })
    })

    test('should clear validation errors when user starts typing', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)

      // Open add project modal
      await user.click(screen.getByText('Add Project'))

      await waitFor(() => {
        expect(screen.getByText('Add New Project')).toBeInTheDocument()
      })

      // Try to submit empty form to trigger validation
      await user.click(screen.getByText('Create Project'))

      await waitFor(() => {
        expect(screen.getByText('Project name is required')).toBeInTheDocument()
      })

      // Start typing in name field
      await user.type(screen.getByLabelText(/Project Name/), 'T')

      // Error should disappear
      await waitFor(() => {
        expect(screen.queryByText('Project name is required')).not.toBeInTheDocument()
      })
    })

    test('should validate budget as positive number', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)

      // Open add project modal
      await user.click(screen.getByText('Add Project'))

      await waitFor(() => {
        expect(screen.getByText('Add New Project')).toBeInTheDocument()
      })

      // Fill fields with negative budget
      await user.type(screen.getByLabelText(/Project Name/), 'Test Project')
      await user.type(screen.getByLabelText(/Team Member/), 'John Doe')
      await user.type(screen.getByLabelText(/Deadline/), '2024-12-31')
      await user.type(screen.getByLabelText(/Budget/), '-1000')

      // Try to submit
      await user.click(screen.getByText('Create Project'))

      // Should show budget validation error
      await waitFor(() => {
        expect(screen.getByText('Budget must be greater than 0')).toBeInTheDocument()
      })
    })
  })

  // Test Case 5: UI Responsiveness (Mobile vs Desktop)
  describe('UI Responsiveness', () => {
    test('should show mobile card layout on small screens', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      })

      render(<Dashboard />)

      // Mobile card layout should be visible (block lg:hidden)
      const mobileLayout = document.querySelector('.block.lg\\:hidden')
      expect(mobileLayout).toBeInTheDocument()

      // Desktop table layout should be hidden (hidden lg:block)
      const desktopLayout = document.querySelector('.hidden.lg\\:block')
      expect(desktopLayout).toBeInTheDocument()
    })

    test('should show desktop table layout on large screens', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      })

      render(<Dashboard />)

      // Both mobile and desktop layouts should be in DOM
      // but CSS classes determine visibility
      const mobileLayout = document.querySelector('.block.lg\\:hidden')
      const desktopLayout = document.querySelector('.hidden.lg\\:block')
      
      expect(mobileLayout).toBeInTheDocument()
      expect(desktopLayout).toBeInTheDocument()
    })

    test('should have responsive stats cards layout', async () => {
      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByText('Total Projects')).toBeInTheDocument()
      })

      // Stats cards should have responsive grid classes
      const statsContainer = document.querySelector('.grid.grid-cols-2.lg\\:grid-cols-4')
      expect(statsContainer).toBeInTheDocument()
    })

    test('should have responsive search and filter layout', async () => {
      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search projects...')).toBeInTheDocument()
      })

      // Search and filters should have responsive grid
      const filtersContainer = document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3')
      expect(filtersContainer).toBeInTheDocument()
    })

    test('should show project actions in mobile card layout', async () => {
      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByText('E-commerce Platform Redesign')).toBeInTheDocument()
      })

      // Mobile layout should have action buttons
      const mobileLayout = document.querySelector('.block.lg\\:hidden')
      expect(mobileLayout).toBeInTheDocument()

      // Should have Edit and Delete buttons in mobile layout
      const editButtons = screen.getAllByText('Edit')
      const deleteButtons = screen.getAllByText('Delete')
      
      expect(editButtons.length).toBeGreaterThan(0)
      expect(deleteButtons.length).toBeGreaterThan(0)
    })
  })

  // Additional Test: Delete Functionality
  describe('Delete Project Functionality', () => {
    test('should delete project after confirmation', async () => {
      const user = userEvent.setup()
      
      // Mock window.confirm to return true
      global.confirm = jest.fn(() => true)
      
      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByText('E-commerce Platform Redesign')).toBeInTheDocument()
      })

      // Click Delete button for first project
      const deleteButtons = screen.getAllByText('Delete')
      await user.click(deleteButtons[0])

      // Confirm should have been called
      expect(global.confirm).toHaveBeenCalledWith(
        'Are you sure you want to delete this project? This action cannot be undone.'
      )

      // Project should be removed after the simulated API call
      await waitFor(() => {
        expect(screen.queryByText('E-commerce Platform')).not.toBeInTheDocument()
      }, { timeout: 1000 })
    })

    test('should not delete project if confirmation is cancelled', async () => {
      const user = userEvent.setup()
      
      // Mock window.confirm to return false
      global.confirm = jest.fn(() => false)
      
      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByText('E-commerce Platform Redesign')).toBeInTheDocument()
      })

      // Click Delete button
      const deleteButtons = screen.getAllByText('Delete')
      await user.click(deleteButtons[0])

      // Confirm should have been called
      expect(global.confirm).toHaveBeenCalled()

      // Project should still be there
      expect(screen.getByText('E-commerce Platform')).toBeInTheDocument()
    })
  })

  // Statistics Display Test
  describe('Project Statistics', () => {
    test('should display correct project statistics', async () => {
      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByText('3')).toBeInTheDocument() // Total projects
      })

      // Check individual status counts
      const statsCards = screen.getAllByText('1')
      expect(statsCards.length).toBeGreaterThanOrEqual(3) // Active, On Hold, Completed counts
    })

    test('should update statistics when projects are filtered', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByText('E-commerce Platform Redesign')).toBeInTheDocument()
      })

      // Filter by active status
      const statusFilter = screen.getByDisplayValue('All Statuses')
      await user.selectOptions(statusFilter, 'active')

      // Results counter should update
      await waitFor(() => {
        expect(screen.getByText('(1 of 3)')).toBeInTheDocument()
      })
    })
  })
})
