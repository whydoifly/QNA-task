import { Project } from '@/types/project';

export const dummyProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform Redesign',
    status: 'active',
    deadline: '2024-03-15',
    assignedTeamMember: 'Sarah Johnson',
    budget: 75000,
    description: 'Complete redesign of the e-commerce platform with modern UI/UX',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '2',
    name: 'Mobile App Development',
    status: 'active',
    deadline: '2024-04-20',
    assignedTeamMember: 'Michael Chen',
    budget: 120000,
    description: 'Native iOS and Android app development for customer portal',
    createdAt: '2024-01-05T10:15:00Z',
    updatedAt: '2024-01-18T16:45:00Z'
  },
  {
    id: '3',
    name: 'Database Migration',
    status: 'on hold',
    deadline: '2024-02-28',
    assignedTeamMember: 'David Rodriguez',
    budget: 45000,
    description: 'Migration from legacy database to modern cloud solution',
    createdAt: '2023-12-20T11:30:00Z',
    updatedAt: '2024-01-15T09:20:00Z'
  },
  {
    id: '4',
    name: 'Security Audit Implementation',
    status: 'completed',
    deadline: '2024-01-31',
    assignedTeamMember: 'Emily Watson',
    budget: 35000,
    description: 'Implementation of security recommendations from recent audit',
    createdAt: '2023-12-01T08:00:00Z',
    updatedAt: '2024-01-31T17:00:00Z'
  },
  {
    id: '5',
    name: 'API Gateway Setup',
    status: 'active',
    deadline: '2024-03-10',
    assignedTeamMember: 'Alex Thompson',
    budget: 28000,
    description: 'Setup and configuration of API gateway for microservices',
    createdAt: '2024-01-08T13:20:00Z',
    updatedAt: '2024-01-22T11:10:00Z'
  },
  {
    id: '6',
    name: 'Performance Optimization',
    status: 'on hold',
    deadline: '2024-05-15',
    assignedTeamMember: 'Lisa Park',
    budget: 52000,
    description: 'Frontend and backend performance optimization initiative',
    createdAt: '2024-01-12T14:45:00Z',
    updatedAt: '2024-01-19T10:30:00Z'
  },
  {
    id: '7',
    name: 'User Analytics Dashboard',
    status: 'completed',
    deadline: '2024-01-15',
    assignedTeamMember: 'Robert Kim',
    budget: 38000,
    description: 'Real-time analytics dashboard for user behavior tracking',
    createdAt: '2023-11-15T09:30:00Z',
    updatedAt: '2024-01-15T16:20:00Z'
  },
  {
    id: '8',
    name: 'Payment System Integration',
    status: 'active',
    deadline: '2024-04-05',
    assignedTeamMember: 'Jennifer Lee',
    budget: 95000,
    description: 'Integration with multiple payment providers and fraud detection',
    createdAt: '2024-01-03T12:00:00Z',
    updatedAt: '2024-01-25T15:40:00Z'
  }
];
