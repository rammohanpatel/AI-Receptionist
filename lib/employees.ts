import { Employee } from '@/types';

// Hard-coded employee directory (Demo data)
export const EMPLOYEES: Employee[] = [
  {
    id: 'emp001',
    name: 'Ahmed Al Mansoori',
    department: 'Engineering',
    title: 'Senior Software Engineer',
    email: 'ahmed.almansoori@company.com',
    avatar: '/avatars/ahmed.jpg',
    isAvailable: true,
    meetings: [
      {
        start: '09:00',
        end: '10:00',
        title: 'Team Standup'
      }
    ],
    fallbackEmployee: 'emp002'
  },
  {
    id: 'emp002',
    name: 'Fatima Al Zarooni',
    department: 'Engineering',
    title: 'Engineering Manager',
    email: 'fatima.alzarooni@company.com',
    avatar: '/avatars/fatima.jpg',
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
    name: 'Mohammed Al Falasi',
    department: 'Engineering',
    title: 'Lead Developer',
    email: 'mohammed.alfalasi@company.com',
    avatar: '/avatars/mohammed.jpg',
    isAvailable: true,
    meetings: [],
    fallbackEmployee: 'emp002'
  },
  {
    id: 'emp004',
    name: 'Aisha Al Hashimi',
    department: 'Product',
    title: 'Product Manager',
    email: 'aisha.alhashimi@company.com',
    avatar: '/avatars/aisha.jpg',
    isAvailable: false,
    meetings: [
      {
        start: '09:00',
        end: '12:00',
        title: 'Client Workshop'
      }
    ],
    fallbackEmployee: 'emp005'
  },
  {
    id: 'emp005',
    name: 'Omar Al Mazrouei',
    department: 'Product',
    title: 'Senior Product Manager',
    email: 'omar.almazrouei@company.com',
    avatar: '/avatars/omar.jpg',
    isAvailable: true,
    meetings: [],
    fallbackEmployee: 'emp004'
  },
  {
    id: 'emp006',
    name: 'Mariam Al Suwaidi',
    department: 'Design',
    title: 'UX Designer',
    email: 'mariam.alsuwaidi@company.com',
    avatar: '/avatars/mariam.jpg',
    isAvailable: true,
    meetings: [],
    fallbackEmployee: 'emp007'
  },
  {
    id: 'emp007',
    name: 'Khalid Al Naqbi',
    department: 'Design',
    title: 'Design Lead',
    email: 'khalid.alnaqbi@company.com',
    avatar: '/avatars/khalid.jpg',
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
    name: 'Noura Al Kaabi',
    department: 'Sales',
    title: 'Sales Manager',
    email: 'noura.alkaabi@company.com',
    avatar: '/avatars/noura.jpg',
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
    name: 'Saeed Al Dhaheri',
    department: 'Sales',
    title: 'Account Executive',
    email: 'saeed.aldhaheri@company.com',
    avatar: '/avatars/saeed.jpg',
    isAvailable: true,
    meetings: []
  },
  {
    id: 'emp010',
    name: 'Hessa Al Maktoum',
    department: 'Human Resources',
    title: 'HR Manager',
    email: 'hessa.almaktoum@company.com',
    avatar: '/avatars/hessa.jpg',
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
