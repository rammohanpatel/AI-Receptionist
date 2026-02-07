import { Employee } from '@/types';

// Hard-coded employee directory (Demo data)
export const EMPLOYEES: Employee[] = [
  {
    id: 'emp001',
    name: 'Rahul Kumar',
    department: 'Engineering',
    title: 'Senior Software Engineer',
    email: 'rahul.kumar@company.com',
    isAvailable: false,
    meetings: [
      {
        start: '09:00',
        end: '10:30',
        title: 'Sprint Planning'
      },
      {
        start: '14:00',
        end: '15:00',
        title: 'Code Review'
      }
    ],
    fallbackEmployee: 'emp002'
  },
  {
    id: 'emp002',
    name: 'Anita Sharma',
    department: 'Engineering',
    title: 'Engineering Manager',
    email: 'anita.sharma@company.com',
    isAvailable: true,
    meetings: [
      {
        start: '11:00',
        end: '12:00',
        title: '1:1 with Team'
      }
    ],
    fallbackEmployee: 'emp003'
  },
  {
    id: 'emp003',
    name: 'Vikram Patel',
    department: 'Engineering',
    title: 'Lead Developer',
    email: 'vikram.patel@company.com',
    isAvailable: true,
    meetings: [],
    fallbackEmployee: 'emp002'
  },
  {
    id: 'emp004',
    name: 'Priya Singh',
    department: 'Product',
    title: 'Product Manager',
    email: 'priya.singh@company.com',
    isAvailable: true,
    meetings: [
      {
        start: '10:00',
        end: '11:00',
        title: 'Product Review'
      }
    ],
    fallbackEmployee: 'emp005'
  },
  {
    id: 'emp005',
    name: 'Amit Verma',
    department: 'Product',
    title: 'Senior Product Manager',
    email: 'amit.verma@company.com',
    isAvailable: false,
    meetings: [
      {
        start: '09:00',
        end: '17:00',
        title: 'Customer Visits'
      }
    ],
    fallbackEmployee: 'emp004'
  },
  {
    id: 'emp006',
    name: 'Sneha Reddy',
    department: 'Design',
    title: 'UX Designer',
    email: 'sneha.reddy@company.com',
    isAvailable: true,
    meetings: [],
    fallbackEmployee: 'emp007'
  },
  {
    id: 'emp007',
    name: 'Arjun Mehta',
    department: 'Design',
    title: 'Design Lead',
    email: 'arjun.mehta@company.com',
    isAvailable: true,
    meetings: [
      {
        start: '15:00',
        end: '16:00',
        title: 'Design Critique'
      }
    ]
  },
  {
    id: 'emp008',
    name: 'Kavita Gupta',
    department: 'Sales',
    title: 'Sales Manager',
    email: 'kavita.gupta@company.com',
    isAvailable: false,
    meetings: [
      {
        start: '13:00',
        end: '14:30',
        title: 'Client Meeting'
      }
    ],
    fallbackEmployee: 'emp009'
  },
  {
    id: 'emp009',
    name: 'Rohan Das',
    department: 'Sales',
    title: 'Account Executive',
    email: 'rohan.das@company.com',
    isAvailable: true,
    meetings: []
  }
];

// Helper function to find employee by name (fuzzy matching)
export function findEmployeeByName(name: string): Employee | null {
  const searchName = name.toLowerCase().trim();
  
  // Exact match
  let employee = EMPLOYEES.find(emp => 
    emp.name.toLowerCase() === searchName
  );
  
  if (employee) return employee;
  
  // First name match
  employee = EMPLOYEES.find(emp => 
    emp.name.toLowerCase().split(' ')[0] === searchName
  );
  
  if (employee) return employee;
  
  // Partial match
  employee = EMPLOYEES.find(emp => 
    emp.name.toLowerCase().includes(searchName)
  );
  
  return employee || null;
}

// Helper function to check availability
export function checkAvailability(employee: Employee): {
  isAvailable: boolean;
  reason?: string;
  nextAvailable?: string;
} {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  // Check if in a meeting
  for (const meeting of employee.meetings) {
    const [startHour, startMin] = meeting.start.split(':').map(Number);
    const [endHour, endMin] = meeting.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    if (currentTime >= startTime && currentTime < endTime) {
      return {
        isAvailable: false,
        reason: meeting.title,
        nextAvailable: meeting.end
      };
    }
  }
  
  return {
    isAvailable: employee.isAvailable
  };
}

// Get fallback employee
export function getFallbackEmployee(employeeId: string): Employee | null {
  const employee = EMPLOYEES.find(emp => emp.id === employeeId);
  if (!employee?.fallbackEmployee) return null;
  
  return EMPLOYEES.find(emp => emp.id === employee.fallbackEmployee) || null;
}

// Get employees by department
export function getEmployeesByDepartment(department: string): Employee[] {
  return EMPLOYEES.filter(emp => 
    emp.department.toLowerCase() === department.toLowerCase()
  );
}
