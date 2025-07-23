import React from 'react';

function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <button 
        className="px-4 py-2 font-semibold text-white bg-blue-500 rounded shadow-lg hover:bg-blue-600"
        onClick={() => setCount(count + 1)}
      >
        Count: {count}
      </button>
    </div>
  );
}

export default App;
