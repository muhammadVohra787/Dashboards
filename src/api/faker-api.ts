import { faker } from '@faker-js/faker'

export interface EmployeeData {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  hoursWorked: number
  dailyEarning: number

  department: string
  role: string
  performanceRating: number
  tasksCompleted: number
  attendanceRate: number  // e.g. 0.95 for 95%
  lastLogin: Date
  dateOfJoining: Date
  leaveDaysUsed: number
  projectsAssigned: number
}

export function generateFakeEmployeeData(count = 10): EmployeeData[] {
  const departments = ['Engineering','Sales','Marketing','HR','Support']
  const roles = [
    'Frontend Developer','Account Manager',
    'UX Designer','QA Engineer','Product Owner'
  ]

  const employees: EmployeeData[] = []
  for (let i = 0; i < count; i++) {
    const hours = faker.number.int({ min: 1, max: 8 })
    const joinDate = faker.date.past({ years: 5 })
    const lastLogin = faker.date.recent({ days: 7 })
    const saleEarings = faker.number.int({ min: 10, max: 40 })
    const tasksAssigned  = faker.number.int({ min: 1, max: 10 });
    const tasksCompleted = faker.number.int({ min: 0, max: tasksAssigned });
    employees.push({
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),

      hoursWorked: hours,
      dailyEarning: hours * saleEarings,

      department: faker.helpers.arrayElement(departments),
      role: faker.helpers.arrayElement(roles),
      performanceRating: faker.number.int({ min: 1, max: 5 }) / 5 * 100,
      attendanceRate: parseFloat(faker.number.float({ min: 0.8, max: 1, fractionDigits: 2 }).toFixed(2)),
      lastLogin,
      dateOfJoining: joinDate,
      leaveDaysUsed: faker.number.int({ min: 1, max: 5 }),
      tasksCompleted,
      projectsAssigned: tasksAssigned,
    })
  }
  return employees
}
