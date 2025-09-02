import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from '@/components/Modal'

describe('Modal Component', () => {
  const mockOnClose = jest.fn()
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    title: 'Test Modal',
    children: <div>Modal Content</div>
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should render modal when isOpen is true', () => {
    render(<Modal {...defaultProps} />)
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  test('should not render modal when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument()
  })

  test('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    render(<Modal {...defaultProps} />)
    
    const closeButton = screen.getByRole('button')
    await user.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  test('should call onClose when backdrop is clicked', async () => {
    const user = userEvent.setup()
    render(<Modal {...defaultProps} />)
    
    const backdrop = document.querySelector('.fixed.inset-0.bg-black')
    if (backdrop) {
      await user.click(backdrop)
    }
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  test('should call onClose when Escape key is pressed', () => {
    render(<Modal {...defaultProps} />)
    
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  test('should not call onClose when modal content is clicked', async () => {
    const user = userEvent.setup()
    render(<Modal {...defaultProps} />)
    
    const modalContent = screen.getByText('Modal Content')
    await user.click(modalContent)
    
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  test('should prevent body scroll when modal is open', () => {
    const originalOverflow = document.body.style.overflow
    
    render(<Modal {...defaultProps} />)
    
    expect(document.body.style.overflow).toBe('hidden')
    
    // Cleanup
    document.body.style.overflow = originalOverflow
  })

  test('should restore body scroll when modal is closed', () => {
    const { rerender } = render(<Modal {...defaultProps} />)
    
    expect(document.body.style.overflow).toBe('hidden')
    
    rerender(<Modal {...defaultProps} isOpen={false} />)
    
    expect(document.body.style.overflow).toBe('unset')
  })
})
