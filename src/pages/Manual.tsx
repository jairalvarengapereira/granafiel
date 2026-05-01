import { useState } from 'react'
import { X, ChevronDown, ChevronRight, BookOpen, ExternalLink } from 'lucide-react'

const faqItems = [
  {
    question: "O que é o Granafiel?",
    answer: "O Granafiel é um sistema de gestão financeira pessoal. Com ele você controla receitas, despesas, vê gráficos e acompanha seu fluxo de caixa."
  },
  {
    question: "Como fazer login?",
    answer: "Digite seu email e senha na tela de login. Na versão mobile, você pode usar biometria para entrar mais rápido."
  },
  {
    question: "Como adicionar uma transação?",
    answer: "Clique no botão + no canto da tela de Transações. Preencha: descrição, valor, categoria, data, tipo (receita/despesa) e status."
  },
  {
    question: "Como usar entrada por voz?",
    answer: "No mobile, clique no microfone flutuante e fale: ex: 'Gastei duzentos no mercado'. O app entende automaticamente!"
  },
  {
    question: "Como ativar biometria?",
    answer: "No mobile, vá em Configurações e ative 'Login biométrico'. Use a impressão digital ou rosto para entrar."
  },
  {
    question: "Onde ver gráficos?",
    answer: "Acesse 'Comparativo' no menu lateral. Lá você vê receitas vs despesas, top 5 categorias e gráfico de pizza."
  }
]

const Manual = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-amber-400" />
            <h1 className="text-2xl font-bold">Manual do Usuário</h1>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-2xl p-6 mb-6 border border-slate-700">
          <h2 className="text-lg font-semibold mb-4 text-amber-400">Perguntas Frequentes</h2>
          
          <div className="space-y-2">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-slate-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="flex items-center justify-between w-full p-4 text-left hover:bg-slate-700/50 transition-colors"
                >
                  <span className="font-medium">{item.question}</span>
                  {openIndex === index ? (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-4 pb-4 text-slate-300">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold mb-4 text-amber-400">Links Úteis</h2>
          
          <div className="space-y-3">
            <a
              href="https://granafiel.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors"
            >
              <ExternalLink className="w-5 h-5 text-sky-400" />
              <span>Acessar Versão Web</span>
            </a>
            <a
              href="https://github.com/jairalvarengapereira/granafiel/raw/main/Granafiel.apk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors"
            >
              <ExternalLink className="w-5 h-5 text-green-400" />
              <span>Baixar APK Android</span>
            </a>
          </div>
        </div>

        <div className="text-center text-slate-500 text-sm mt-8">
          <p>© 2026 Jair Alvarenga Pereira</p>
          <p>Granafiel - Sistema de Gestão Financeira</p>
        </div>
      </div>
    </div>
  )
}

export default Manual