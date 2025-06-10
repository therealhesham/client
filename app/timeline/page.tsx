'use client';
import { useState } from 'react';
import { CheckCircleIcon, TruckIcon,  ClockIcon } from '@heroicons/react/24/solid';
const orderStatuses = [
  { id: 1, status: 'Order Placed', date: '2025-06-01 10:30 AM', icon: CheckCircleIcon, complete: true },
  { id: 2, status: 'Processing', date: '2025-06-01 12:00 PM', icon: ClockIcon, complete: true },
  { id: 3, status: 'Shipped', date: '2025-06-02 09:00 AM', icon: TruckIcon, complete: true },
  { id: 4, status: 'Delivered', date: '2025-06-03 03:00 PM', icon: ClockIcon, complete: false },
];

export default function OrderTimeline() {
  const [expanded, setExpanded] = useState(null);

  const handleToggle = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Order Timeline</h2>
      
      {/* Desktop Timeline */}
      <div className="hidden md:block">
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200"></div>
          {orderStatuses.map((status, index) => (
            <div key={status.id} className="mb-8 flex items-center">
              <div className={`w-1/2 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                <div className="flex items-center justify-end">
                  {index % 2 === 0 && (
                    <>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{status.status}</h3>
                        <p className="text-sm text-gray-500">{status.date}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white border-4 border-indigo-600 flex items-center justify-center z-10">
                        <status.icon className={`h-6 w-6 ${status.complete ? 'text-indigo-600' : 'text-gray-400'}`} />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="w-1/2">
                {index % 2 !== 0 && (
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white border-4 border-indigo-600 flex items-center justify-center z-10">
                      <status.icon className={`h-6 w-6 ${status.complete ? 'text-indigo-600' : 'text-gray-400'}`} />
                    </div>
                    <div className="flex-1 pl-8">
                      <h3 className="text-lg font-semibold text-gray-900">{status.status}</h3>
                      <p className="text-sm text-gray-500">{status.date}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Timeline */}
      <div className="md:hidden space-y-4">
        {orderStatuses.map((status) => (
          <div
            key={status.id}
            className="bg-white shadow-md rounded-lg p-4 cursor-pointer"
            onClick={() => handleToggle(status.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <status.icon className={`h-8 w-8 ${status.complete ? 'text-indigo-600' : 'text-gray-400'}`} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{status.status}</h3>
                  <p className="text-sm text-gray-500">{status.date}</p>
                </div>
              </div>
              <svg
                className={`h-5 w-5 transform ${expanded === status.id ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {expanded === status.id && (
              <div className="mt-4 text-sm text-gray-600">
                <p>Details about {status.status.toLowerCase()} stage...</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}