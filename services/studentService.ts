
import { Student, LogEntry, StudentStatus, ProcessedScan } from '../types';

const STUDENTS_KEY = 'hostel_students';
const LOGS_KEY = 'hostel_logs';

const initialStudents: Student[] = [
  { id: 'STU001', name: 'Adebayo Aminat', matricNo: 'FPU/CSC/21/001', department: 'Computer Science', roomNo: 'A101', status: StudentStatus.OUT, lastSeen: null },
  { id: 'STU002', name: 'Okafor Chiamaka', matricNo: 'FPU/SLT/21/015', department: 'Science Lab Tech', roomNo: 'A102', status: StudentStatus.OUT, lastSeen: null },
  { id: 'STU003', name: 'Etim Grace', matricNo: 'FPU/ACC/21/023', department: 'Accountancy', roomNo: 'B201', status: StudentStatus.OUT, lastSeen: null },
  { id: 'STU004', name: 'Suleiman Fatima', matricNo: 'FPU/BUS/21/008', department: 'Business Admin', roomNo: 'B202', status: StudentStatus.OUT, lastSeen: null },
  { id: 'STU005', name: 'Okoro Blessing', matricNo: 'FPU/EEP/21/011', department: 'Electrical Eng.', roomNo: 'C301', status: StudentStatus.OUT, lastSeen: null },
];

const initializeData = () => {
  if (!localStorage.getItem(STUDENTS_KEY)) {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(initialStudents));
  }
  if (!localStorage.getItem(LOGS_KEY)) {
    localStorage.setItem(LOGS_KEY, JSON.stringify([]));
  }
};

export const getStudents = (): Student[] => {
  initializeData();
  const students = localStorage.getItem(STUDENTS_KEY);
  return students ? JSON.parse(students) : [];
};

export const getLogs = (): LogEntry[] => {
  initializeData();
  const logs = localStorage.getItem(LOGS_KEY);
  return logs ? JSON.parse(logs) : [];
};

export const processScan = (studentId: string): ProcessedScan => {
  const students = getStudents();
  const logs = getLogs();

  const studentIndex = students.findIndex(s => s.id === studentId);
  if (studentIndex === -1) {
    throw new Error('Student not found.');
  }

  const student = students[studentIndex];
  const newStatus = student.status === StudentStatus.IN ? StudentStatus.OUT : StudentStatus.IN;
  const logType = newStatus === StudentStatus.IN ? 'ENTRY' : 'EXIT';
  
  const updatedStudent: Student = {
    ...student,
    status: newStatus,
    lastSeen: new Date().toISOString(),
  };

  students[studentIndex] = updatedStudent;

  const newLog: LogEntry = {
    id: `LOG_${Date.now()}`,
    studentId: student.id,
    studentName: student.name,
    matricNo: student.matricNo,
    timestamp: Date.now(),
    type: logType,
  };

  const updatedLogs = [newLog, ...logs];

  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  localStorage.setItem(LOGS_KEY, JSON.stringify(updatedLogs));

  return { student: updatedStudent, log: newLog };
};
