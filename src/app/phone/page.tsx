'use client'

import { useEffect, useState } from 'react'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

export default function PhonePage() {
  const [visitorId, setVisitorId] = useState('')
  const [numeroLinea, setNumeroLinea] = useState('')
  const [resultado, setResultado] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    const initFingerprint = async () => {
      const fp = await FingerprintJS.load()
      const result = await fp.get()
      setVisitorId(result.visitorId)
    }
    initFingerprint()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setResultado(null)
    setCargando(true)

    try {
      const res = await fetch('http://localhost:3000/api/validar-linea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numeroLinea, visitorId })
      })

      const data = await res.json()
      setResultado(data?.error || data?.message || JSON.stringify(data))
    } catch (err: Error | unknown) {
      setResultado(
        `Error al conectar con el servidor: ${
          err instanceof Error ? err.message : 'Desconocido'
        }`
      )
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className='min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6'>
      <div className='bg-white rounded-2xl shadow-xl p-8 w-full max-w-md'>
        <h1 className='text-2xl font-bold mb-6 text-center text-blue-700'>
          Recargas
        </h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            type='text'
            placeholder='Ej: 1123456789'
            value={numeroLinea}
            onChange={(e) => setNumeroLinea(e.target.value)}
            className='border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700'
          />
          <button
            type='submit'
            disabled={cargando}
            className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50'
          >
            {cargando ? 'Validando...' : 'Validar'}
          </button>
        </form>

        {resultado && (
          <div
            id='resultado'
            className='mt-6 text-sm text-center text-gray-700 bg-gray-100 p-3 rounded-lg border border-gray-200'
          >
            {resultado}
          </div>
        )}
      </div>
    </main>
  )
}
