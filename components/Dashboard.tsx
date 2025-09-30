
import React, { useState, useEffect, useCallback } from 'react';
import { Student, LogEntry, StudentStatus } from '../types';
import { getStudents, getLogs, processScan } from '../services/studentService';
import Scanner from './Scanner';
import StatusSummary from './StatusSummary';
import LogTable from './LogTable';

interface DashboardProps {
  onLogout: () => void;
}

const Header: React.FC<{onLogout: () => void}> = ({onLogout}) => (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.79-2.73 9.563M12 11c0-3.517.009-6.79 2.73-9.563m-5.46 19.126c-2.16-1.76-3.73-4.32-3.73-7.563 0-3.243 1.57-5.803 3.73-7.563m10.92 15.126c2.16-1.76 3.73-4.32 3.73-7.563 0-3.243-1.57-5.803-3.73-7.563M12 3v18"></path>
            </svg>
            <h1 className="text-2xl font-bold text-gray-800">Hostel Tracking Dashboard</h1>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
    </header>
);

const ScanNotification: React.FC<{ message: string; type: 'success' | 'error'; onDismiss: () => void }> = ({ message, type, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    const bgColor = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700';
    return (
        <div className={`border px-4 py-3 rounded relative ${bgColor}`} role="alert">
            <span className="block sm:inline">{message}</span>
        </div>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setStudents(getStudents());
    setLogs(getLogs());
  }, []);

  const handleScanSuccess = useCallback((decodedText: string) => {
    try {
      const { student, log } = processScan(decodedText);
      
      setStudents(prevStudents => 
        prevStudents.map(s => s.id === student.id ? student : s)
      );

      setLogs(prevLogs => [log, ...prevLogs]);

      const actionText = log.type === 'ENTRY' ? 'checked IN' : 'checked OUT';
      setNotification({ message: `${student.name} successfully ${actionText}.`, type: 'success' });

    } catch (error: any) {
      setNotification({ message: error.message || 'An unknown error occurred.', type: 'error' });
    }
  }, []);

  const handleScanError = useCallback((errorMessage: string) => {
    // We can ignore common errors or log them if needed.
    // console.warn(errorMessage);
  }, []);

  const dismissNotification = useCallback(() => setNotification(null), []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onLogout={onLogout} />
      <main className="p-4 sm:p-6 lg:p-8">
        <StatusSummary students={students} />
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">QR Code Scanner</h2>
            <Scanner 
              onScanSuccess={handleScanSuccess} 
              onScanError={handleScanError} 
            />
            <div className="mt-4 h-16">
              {notification && <ScanNotification message={notification.message} type={notification.type} onDismiss={dismissNotification} />}
            </div>
          </div>
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
             <h2 className="text-xl font-semibold text-gray-800 mb-4">Live Movement Log</h2>
             <LogTable logs={logs} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
