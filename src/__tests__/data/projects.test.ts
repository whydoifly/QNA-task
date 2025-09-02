import { dummyProjects } from '@/data/projects'
import { Project, ProjectStatus } from '@/types/project'

describe('Dummy Projects Data', () => {
  test('should contain valid project data', () => {
    expect(dummyProjects).toBeDefined()
    expect(Array.isArray(dummyProjects)).toBe(true)
    expect(dummyProjects.length).toBeGreaterThan(0)
  })

  test('should have projects with all required fields', () => {
    dummyProjects.forEach((project: Project) => {
      expect(project).toHaveProperty('id')
      expect(project).toHaveProperty('name')
      expect(project).toHaveProperty('status')
      expect(project).toHaveProperty('deadline')
      expect(project).toHaveProperty('assignedTeamMember')
      expect(project).toHaveProperty('budget')
      expect(project).toHaveProperty('createdAt')
      expect(project).toHaveProperty('updatedAt')
      
      // Validate types
      expect(typeof project.id).toBe('string')
      expect(typeof project.name).toBe('string')
      expect(['active', 'on hold', 'completed']).toContain(project.status)
      expect(typeof project.deadline).toBe('string')
      expect(typeof project.assignedTeamMember).toBe('string')
      expect(typeof project.budget).toBe('number')
      expect(typeof project.createdAt).toBe('string')
      expect(typeof project.updatedAt).toBe('string')
      
      // Validate non-empty strings
      expect(project.id.trim()).not.toBe('')
      expect(project.name.trim()).not.toBe('')
      expect(project.assignedTeamMember.trim()).not.toBe('')
      
      // Validate positive budget
      expect(project.budget).toBeGreaterThan(0)
      
      // Validate date formats (ISO string)
      expect(() => new Date(project.deadline)).not.toThrow()
      expect(() => new Date(project.createdAt)).not.toThrow()
      expect(() => new Date(project.updatedAt)).not.toThrow()
    })
  })

  test('should have projects with different statuses', () => {
    const statuses = dummyProjects.map(project => project.status)
    const uniqueStatuses = [...new Set(statuses)]
    
    expect(uniqueStatuses.length).toBeGreaterThan(1)
    expect(uniqueStatuses.every(status => 
      ['active', 'on hold', 'completed'].includes(status)
    )).toBe(true)
  })

  test('should have projects with different team members', () => {
    const teamMembers = dummyProjects.map(project => project.assignedTeamMember)
    const uniqueTeamMembers = [...new Set(teamMembers)]
    
    expect(uniqueTeamMembers.length).toBeGreaterThan(1)
  })

  test('should have projects with valid deadline dates', () => {
    dummyProjects.forEach((project: Project) => {
      const deadline = new Date(project.deadline)
      expect(deadline).toBeInstanceOf(Date)
      expect(deadline.toString()).not.toBe('Invalid Date')
    })
  })

  test('should have projects with reasonable budget ranges', () => {
    dummyProjects.forEach((project: Project) => {
      expect(project.budget).toBeGreaterThan(0)
      expect(project.budget).toBeLessThan(1000000) // Less than 1M for reasonableness
    })
  })

  test('should have unique project IDs', () => {
    const ids = dummyProjects.map(project => project.id)
    const uniqueIds = [...new Set(ids)]
    
    expect(uniqueIds.length).toBe(dummyProjects.length)
  })

  test('should have consistent timestamp format', () => {
    dummyProjects.forEach((project: Project) => {
      // Check ISO 8601 format
      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
      expect(project.createdAt).toMatch(isoRegex)
      expect(project.updatedAt).toMatch(isoRegex)
      
      // Ensure updatedAt is not before createdAt
      const created = new Date(project.createdAt)
      const updated = new Date(project.updatedAt)
      expect(updated.getTime()).toBeGreaterThanOrEqual(created.getTime())
    })
  })

  test('should have projects with optional description field', () => {
    // Some projects should have descriptions, some might not
    const projectsWithDescription = dummyProjects.filter(project => 
      project.description && project.description.trim() !== ''
    )
    
    expect(projectsWithDescription.length).toBeGreaterThan(0)
    
    // If description exists, it should be a string
    dummyProjects.forEach((project: Project) => {
      if (project.description !== undefined) {
        expect(typeof project.description).toBe('string')
      }
    })
  })
})

describe('Project Status Type', () => {
  test('should only allow valid status values', () => {
    const validStatuses: ProjectStatus[] = ['active', 'on hold', 'completed']
    
    validStatuses.forEach(status => {
      // This would cause TypeScript error if invalid
      const testStatus: ProjectStatus = status
      expect(['active', 'on hold', 'completed']).toContain(testStatus)
    })
  })
})
