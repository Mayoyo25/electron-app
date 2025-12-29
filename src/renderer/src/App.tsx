import { useState } from 'react'

function App(): React.JSX.Element {
  const [count, setCount] = useState(0)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'
      }`}
    >
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div
          className={`max-w-2xl w-full ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300`}
        >
          {/* Header */}
          <div
            className={`${
              darkMode
                ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                : 'bg-gradient-to-r from-blue-600 to-purple-600'
            } p-8 text-white`}
          >
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-4xl font-bold">Electron + Tailwind v3</h1>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
            <p className="text-blue-100">Testing all the awesome features! 🚀</p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Counter Section */}
            <div
              className={`${
                darkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-blue-50 to-purple-50'
              } rounded-xl p-6 transition-colors duration-300`}
            >
              <h2
                className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}
              >
                Interactive Counter
              </h2>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setCount(count - 1)}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 active:scale-95"
                >
                  -
                </button>
                <span
                  className={`text-5xl font-bold min-w-[100px] text-center ${
                    darkMode ? 'text-purple-400' : 'text-purple-600'
                  }`}
                >
                  {count}
                </span>
                <button
                  onClick={() => setCount(count + 1)}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 active:scale-95"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => setCount(0)}
                className={`mt-4 w-full py-2 ${
                  darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
                } rounded-lg font-semibold transition-colors`}
              >
                Reset
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`${
                  darkMode ? 'bg-gray-700' : 'bg-blue-100'
                } p-4 rounded-lg transition-colors duration-300`}
              >
                <div className="text-3xl mb-2">⚡</div>
                <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Fast</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Lightning-fast development
                </p>
              </div>

              <div
                className={`${
                  darkMode ? 'bg-gray-700' : 'bg-purple-100'
                } p-4 rounded-lg transition-colors duration-300`}
              >
                <div className="text-3xl mb-2">🎨</div>
                <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Beautiful
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Stunning Tailwind styles
                </p>
              </div>

              <div
                className={`${
                  darkMode ? 'bg-gray-700' : 'bg-pink-100'
                } p-4 rounded-lg transition-colors duration-300`}
              >
                <div className="text-3xl mb-2">🔧</div>
                <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Flexible
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Easy to customize
                </p>
              </div>

              <div
                className={`${
                  darkMode ? 'bg-gray-700' : 'bg-green-100'
                } p-4 rounded-lg transition-colors duration-300`}
              >
                <div className="text-3xl mb-2">✨</div>
                <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Modern</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Latest tech stack
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-semibold shadow-lg">
                <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
                Setup Working Perfectly!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
