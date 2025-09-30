
export enum StudentStatus {
  IN = 'IN',
  OUT = 'OUT',
}

export interface Student {
  id: string;
  name: string;
  matricNo: string;
  department: string;
  roomNo: string;
  status: StudentStatus;
  lastSeen: string | null;
}

export interface LogEntry {
  id: string;
  studentId: string;
  studentName: string;
  matricNo: string;
  timestamp: number;
  type: 'ENTRY' | 'EXIT';
}

export interface ProcessedScan {
    student: Student;
    log: LogEntry;
}
