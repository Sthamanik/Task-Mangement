import React from 'react';

// Helper function to group tasks by completion date
const groupTasksByDate = (tasks) => {
  return tasks.reduce((acc, task) => {
    const completionDate = new Date(task.scheduledAt).toLocaleDateString();
    if (!acc[completionDate]) {
      acc[completionDate] = [];
    }
    acc[completionDate].push(task);
    return acc;
  }, {});
};

const Completed = ({ completedTasks, completedCount }) => {
  const today = new Date();
  const groupedTasks = groupTasksByDate(completedTasks);

  // Sort completed tasks so most recent dates are at the top
  const sortedDates = Object.keys(groupedTasks).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  return (
    <div className="w-4/5 h-full p-4 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6">Completed Tasks</h1>

      {/* Timeline in Grid View */}
      <div className="grid grid-cols-1 gap-8">
        {completedCount === 0 ? (
          <p className="text-gray-600">No completed tasks found</p>
        ) : (
          sortedDates.map((date, index) => (
            <div key={index} className="relative border-l-2 border-gray-300">
              {/* Date Header */}
              <div className="mb-4 ml-4">
                <h2 className="text-xl font-semibold text-green-600">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h2>
              </div>

              {/* Tasks for the Date - Use grid layout here */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pl-8 relative">
                {groupedTasks[date].map((task, taskIndex) => (
                  <div
                    key={taskIndex}
                    className="bg-green-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <h3 className="text-lg font-semibold text-gray-800">
                      {task.title}
                    </h3>
                    <p className="text-gray-700 mt-2">{task.description}</p>
                  </div>
                ))}

                {/* Timeline Dot */}
                <span className="absolute top-0 left-[-9px] h-4 w-4 bg-green-600 rounded-full"></span>
              </div>

              {/* Vertical Divider (vrads) between different date sections */}
              {index < sortedDates.length - 1 && (
                <div className="w-full h-1 border-t border-gray-300 mt-6"></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Completed;
