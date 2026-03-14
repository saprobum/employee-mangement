export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Contact {
  phone: string;
  email: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface Employment {
  department: string;
  position: string;
  startDate: string;
  endDate?: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  salary: number;
  manager?: string;
}

export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsExperience: number;
}

export interface Project {
  id: number;
  name: string;
  role: string;
  startDate: string;
  endDate?: string;
  status: 'Completed' | 'In Progress' | 'Planned';
}

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  dateIssued: string;
  expiryDate?: string;
}

export interface PerformanceReview {
  id: number;
  date: string;
  reviewer: string;
  rating: number;
  comments: string;
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  avatar: string;
  jobTitle: string;
  department: string;
  hireDate: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  address: Address;
  contact: Contact;
  employment: Employment;
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  performanceReviews: PerformanceReview[];
}