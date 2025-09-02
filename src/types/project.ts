export type ProjectStatus = 'active' | 'on hold' | 'completed';

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  deadline: string;
  assignedTeamMember: string;
  budget: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData {
  name: string;
  status: ProjectStatus;
  deadline: string;
  assignedTeamMember: string;
  budget: number;
  description?: string;
}
