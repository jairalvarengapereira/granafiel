import { useState, useRef, useEffect, useCallback } from 'react'
import { Mic, Loader2, X } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Capacitor } from '@capacitor/core'
import { SpeechRecognition } from '@capacitor-community/speech-recognition'
import api from '../services/api'

const isMobile = Capacitor.isNativePlatform()

const CATEGORIAS_KEYWORDS: Record<string, string[]> = {
  'Alimentação': ['padaria', 'supermercado', 'mercado', 'restaurante', 'lanchonete', 'ifood', 'uber eats', 'comida', 'almoço', 'jantar'],
  'Transporte': ['uber', '99', 'gasolina', 'ônibus', 'metrô', 'táxi', 'taxi'],
  'Lazer': ['cinema', 'netflix', 'spotify', 'show', 'teatro', 'fest', 'balada'],
  'Saúde': ['farmacia', 'farmácia', 'médico', 'medico', 'dentista', 'academia'],
  'Moradia': ['aluguel', 'luz', 'água', 'internet', 'condomínio'],
  'Educação': ['curso', 'escola', 'universidade', 'livro', 'material'],
  'Outros': []
}

export default function VoiceFAB() {
  const queryClient = useQueryClient()
  const [mostrarCard, setMostrarCard] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [categorias, setCategorias] = useState<any[]>([])
  const [pressionado, setPressionado] = useState(false)
  const [textoFalado, setTextoFalado] = useState('')
  const textoRef = useRef('')
  const listenerRef = useRef<any>(null)
  const stateListenerRef = useRef<any>(null)

  useEffect(() => {
    api.get('/categories').then(res => setCategorias(res.data)).catch(() => {})
    return () => {
      listenerRef.current?.remove()
      stateListenerRef.current?.remove()
    }
  }, [])

  const processarTransacao = useCallback(async () => {
    const texto = textoRef.current.trim()
    if (!texto) {
      setMensagem('Fale algo primeiro')
      setMostrarCard(true)
      return
    }

    setMensagem('Salvando...')
    setMostrarCard(true)
    
    const lower = texto.toLowerCase()
    
    let tipo: 'receita' | 'despesa' = 'despesa'
    if (lower.includes('receita') || lower.includes('ganho') || lower.includes('recebi') || lower.includes('salário')) tipo = 'receita'
    else if (lower.includes('despesa') || lower.includes('gastei') || lower.includes('paguei') || lower.includes('gasto')) tipo = 'despesa'
    
    let valor = 0
    const numeros = lower.match(/\d+(?:[.,]\d+)?|\d+/g)
    if (numeros) {
      const nums = numeros.map((n: string) => parseFloat(n.replace(',', '.'))).filter((n: number) => !isNaN(n) && n > 0)
      if (nums.length > 0) valor = Math.max(...nums)
    }
    
    if (valor <= 0) {
      setMensagem('Não entendi. Fale: despesa 50 padaria')
      return
    }
    
    const palavras = lower.replace(/despesa|receita|gastei|paguei|recebi|ganho|salário|salario|um|uma|dois|duas|três|\d+/g, ' ')
    const partes = palavras.replace(/[^a-záàâãéèêíìîóòôõúùûç\s]/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(p => p.length > 2)
    
    let desc = tipo === 'receita' ? 'Receita' : 'Despesa'
    let categoriaId: number | undefined
    
    if (partes.length > 0) {
      const ultima = partes[partes.length - 1]
      const catEncontrada = categorias.find(c => c.nome.toLowerCase().includes(ultima) || ultima.includes(c.nome.toLowerCase()))
      if (catEncontrada) {
        categoriaId = catEncontrada.id
        desc = partes.length > 1 ? partes.slice(0, -1).join(' ') : catEncontrada.nome
      } else {
        for (const [catNome, keywords] of Object.entries(CATEGORIAS_KEYWORDS)) {
          if (keywords.some(k => ultima.includes(k))) {
            const cat = categorias.find(c => c.nome.toLowerCase() === catNome.toLowerCase())
            if (cat) { categoriaId = cat.id; break }
          }
        }
        if (!categoriaId) desc = partes.join(' ')
      }
    }
    
    const payload: any = { descricao: desc, valor, data: new Date().toISOString().split('T')[0], tipo, status: 'pago' }
    if (categoriaId) payload.categoriaId = categoriaId
    
    try {
      await api.post('/transactions', payload)
      setMensagem('Salvo!')
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      setTimeout(() => {
        setMostrarCard(false)
        textoRef.current = ''
        setTextoFalado('')
      }, 1500)
    } catch {
      setMensagem('Erro ao salvar')
    }
  }, [categorias, queryClient])

  const iniciarGravacao = useCallback(async () => {
    if (pressionado) return

    setPressionado(true)
    textoRef.current = ''
    setTextoFalado('')
    setMensagem('')
    setMostrarCard(true)

    try {
      const available = await SpeechRecognition.available()
      if (!available.available) {
        setMensagem('Reconhecimento não disponível')
        setPressionado(false)
        return
      }

      const perms = await SpeechRecognition.checkPermissions()
      if (perms.speechRecognition !== 'granted') {
        await SpeechRecognition.requestPermissions()
      }

      listenerRef.current = await SpeechRecognition.addListener('partialResults', (data) => {
        if (data.matches && data.matches.length > 0) {
          textoRef.current = data.matches[0]
          setTextoFalado(textoRef.current)
        }
      })

      stateListenerRef.current = await SpeechRecognition.addListener('listeningState', (data) => {
        if (data.status === 'stopped') {
          setPressionado(false)
          if (textoRef.current.trim()) {
            processarTransacao()
          } else {
            setMensagem('Nenhuma fala detectada')
          }
        }
      })

      await SpeechRecognition.start({
        language: 'pt-BR',
        partialResults: true,
        popup: false
      })
    } catch (e) {
      console.log('Speech error:', e)
      setPressionado(false)
      setMensagem('Erro no reconhecimento')
    }
  }, [pressionado, processarTransacao])

  const pararGravacao = useCallback(async () => {
    if (!pressionado) return

    setPressionado(false)

    try {
      await SpeechRecognition.stop()
    } catch (e) {
      console.log('Stop error:', e)
    }

    if (textoRef.current.trim()) {
      processarTransacao()
    } else {
      setMostrarCard(false)
    }
  }, [pressionado, processarTransacao])

  const fecharCard = useCallback(() => {
    listenerRef.current?.remove()
    stateListenerRef.current?.remove()
    listenerRef.current = null
    stateListenerRef.current = null
    setPressionado(false)
    textoRef.current = ''
    setTextoFalado('')
    setMostrarCard(false)
    SpeechRecognition.stop().catch(() => {})
  }, [])

  if (!isMobile) return null

  return (
    <>
      <button
        onMouseDown={iniciarGravacao}
        onMouseUp={pararGravacao}
        onMouseLeave={pararGravacao}
        onTouchStart={(e) => { e.preventDefault(); iniciarGravacao() }}
        onTouchEnd={(e) => { e.preventDefault(); pararGravacao() }}
        onTouchCancel={pararGravacao}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all z-50`}
        style={{
          backgroundColor: pressionado ? '#ef4444' : '#0ea5e9',
          transform: pressionado ? 'scale(1.1)' : undefined
        }}
      >
        {pressionado ? (
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
      </button>

      {mostrarCard && (
        <div className="fixed bottom-24 right-6 w-72 bg-slate-800 border border-slate-700 rounded-xl p-4 z-50">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-white">Transação por Voz</span>
            <button onClick={fecharCard} className="p-1 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {pressionado ? (
            <div className="flex items-center gap-2 text-rose-400 mb-2">
              <Mic className="w-4 h-4 animate-pulse" />
              <span>Ouvindo...</span>
            </div>
          ) : null}

          {textoFalado && (
            <div className="text-sm text-slate-300 mb-2 bg-slate-900/50 p-2 rounded-lg">
              "{textoFalado}"
            </div>
          )}

          {mensagem && (
            <div className={`text-sm ${
              mensagem.includes('Salvo') ? 'text-emerald-400' : 
              mensagem.includes('Fale') || mensagem.includes('Não') ? 'text-amber-400' : 
              'text-rose-400'
            }`}>
              {mensagem}
            </div>
          )}

          <div className="mt-3 text-xs text-slate-500">
            <span className="text-sky-400">Segure</span> o microfone e fale. <span className="text-sky-400">Solte</span> para confirmar.
          </div>
        </div>
      )}
    </>
  )
}