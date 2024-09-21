import React from 'react';

// Helper function to group tasks by their archived date
const groupTasksByDate = (tasks) => {
  return tasks.reduce((acc, task) => {
    const archivedDate = new Date(task.scheduledAt).toLocaleDateString();
    if (!acc[archivedDate]) {
      acc[archivedDate] = [];
    }
    acc[archivedDate].push(task);
    return acc;
  }, {});
};

const Archived = ({ archivedTasks, archivedCount }) => {
  const groupedTasks = groupTasksByDate(archivedTasks);

  // Sort archived tasks so that the most recent archived tasks appear first
  const sortedDates = Object.keys(groupedTasks).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  return (
    <div className="w-4/5 h-full p-4 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6">Archived Tasks</h1>

      {/* Timeline in Grid View */}
      <div className="grid grid-cols-1 gap-8">
        {archivedCount === 0 ? (
          <p className="text-gray-600">No archived tasks found</p>
        ) : (
          sortedDates.map((date, index) => (
            <div key={index} className="relative border-l-2 border-gray-300">
              {/* Date Header */}
              <div className="mb-4 ml-4">
                <h2 className="text-xl font-semibold text-gray-600">
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
                    className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <h3 className="text-lg font-semibold text-gray-800">
                      {task.title}
                    </h3>
                    <p className="text-gray-700 mt-2">{task.description}</p>
                    <span className="text-gray-500 block mt-3 text-sm">
                      Archived on: {new Date(task.scheduledAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))}

                {/* Timeline Dot */}
                <span className="absolute top-0 left-[-9px] h-4 w-4 bg-gray-600 rounded-full"></span>
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

export default Archived;
