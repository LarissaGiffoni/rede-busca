import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-red-500 text-4xl font-bold mb-4">
        Rede Busca - Teste Tailwind
      </h1>
      
      <p className="text-gray-700 mb-6 text-lg">
        Se este texto estiver estilizado, o Tailwind está funcionando!
      </p>

      <button
        type="button"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        onClick={() => setCount((count) => count + 1)}
      >
        Contador: {count}
      </button>
    </div>
  )
}

export default App