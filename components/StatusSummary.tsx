// Fix: Changed React import to `import * as React from 'react'` to resolve "Cannot find namespace 'JSX'" error.
import * as React from 'react';
import { Student, StudentStatus } from '../types';

interface StatusSummaryProps {
  students: Student[];
}

const SummaryCard: React.FC<{ title: string; count: number; icon: JSX.Element; color: string }> = ({ title, count, icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{count}</p>
        </div>
    </div>
);

const UsersIcon = () => (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-3-5.197m0 0A4 4 0 004 10.646M12 12.75a4 4 0 110-5.292M12 4.354a4 4 0 010 5.292"></path></svg>
);

const CheckCircleIcon = () => (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);

const ArrowCircleRightIcon = () => (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);


const StatusSummary: React.FC<StatusSummaryProps> = ({ students }) => {
  // Fix: Changed useMemo to React.useMemo to align with the updated React import.
  const summary = React.useMemo(() => {
    const totalStudents = students.length;
    const studentsIn = students.filter(s => s.status === StudentStatus.IN).length;
    const studentsOut = totalStudents - studentsIn;
    return { totalStudents, studentsIn, studentsOut };
  }, [students]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Total Students" count={summary.totalStudents} icon={<UsersIcon/>} color="bg-blue-500" />
        <SummaryCard title="Students In Hostel" count={summary.studentsIn} icon={<CheckCircleIcon />} color="bg-green-500" />
        <SummaryCard title="Students Out of Hostel" count={summary.studentsOut} icon={<ArrowCircleRightIcon />} color="bg-yellow-500" />
    </div>
  );
};

export default StatusSummary;
