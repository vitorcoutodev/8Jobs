// Página do formulário de candidatura.
// A pessoa preenche seus dados, escolhe uma vaga aberta e envia.
// Ao enviar, a página cria o candidato (serviço de candidatos) e depois a candidatura (serviço de candidaturas).
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { listarVagas } from '../services/vagasService.js'
import { cadastrarCandidato } from '../services/candidatosService.js'
import { cadastrarCandidatura } from '../services/candidaturasService.js'

// Valores iniciais do formulário. habilidades é digitada separada por vírgula.
const formInicial = { nome: '', email: '', telefone: '', cidade: '', habilidades: '', vagaId: '' }

// Campo de texto reutilizável: rótulo em cima, input embaixo.
function Campo({ rotulo, nome, valor, aoMudar, tipo = 'text', obrigatorio = false, dica, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">{rotulo}</span>
      <input
        name={nome}
        type={tipo}
        value={valor}
        onChange={aoMudar}
        required={obrigatorio}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
      />
      {dica && <span className="mt-1.5 block text-xs text-slate-500">{dica}</span>}
    </label>
  )
}

export default function CandidaturaPage() {
  const [searchParams] = useSearchParams()
  // Vagas abertas que aparecem no seletor.
  const [vagas, setVagas] = useState([])
  const [carregandoVagas, setCarregandoVagas] = useState(true)
  const [erroVagas, setErroVagas] = useState('')

  // Dados digitados no formulário.
  const [form, setForm] = useState(() => ({
    ...formInicial,
    vagaId: searchParams.get('vagaId') || '',
  }))

  // Estado do envio: enviando, mensagem de erro, se já foi enviada e qual vaga foi escolhida.
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [enviada, setEnviada] = useState(false)
  const [vagaEscolhida, setVagaEscolhida] = useState(null)

  // Guarda o ID do candidato já criado. Se a candidatura falhar depois que o candidato foi salvo,
  // o próximo envio reaproveita esse ID em vez de tentar cadastrar o mesmo e-mail de novo.
  const [candidatoId, setCandidatoId] = useState(null)

  // Busca as vagas uma vez, quando a página abre.
  useEffect(() => {
    let ativo = true

    listarVagas()
      .then((lista) => {
        if (ativo) setVagas(lista.filter((vaga) => vaga.status === 'ABERTA'))
      })
      .catch((e) => {
        if (ativo) setErroVagas(e.message)
      })
      .finally(() => {
        if (ativo) setCarregandoVagas(false)
      })

    // Evita atualizar o estado se a pessoa sair da página antes da resposta chegar.
    return () => {
      ativo = false
    }
  }, [])

  // Atualiza o campo que a pessoa está digitando.
  const aoMudar = (evento) => {
    const { name, value } = evento.target
    setForm((atual) => ({ ...atual, [name]: value }))

    // Se mexeu nos dados pessoais, o candidato salvo antes deixa de valer.
    if (name !== 'vagaId') setCandidatoId(null)
  }

  // Envia o formulário.
  const aoEnviar = async (evento) => {
    // Evita o recarregamento padrão da página.
    evento.preventDefault()
    setErro('')
    setEnviando(true)

    try {
      let id = candidatoId

      // 1) Cria o candidato, a não ser que ele já tenha sido criado em uma tentativa anterior.
      if (!id) {
        const candidato = await cadastrarCandidato({
            nome: form.nome,
            email: form.email,
            telefone: form.telefone,
            cidade: form.cidade,
            // "react, node" vira ["react", "node"], sem itens vazios.
            habilidades: form.habilidades.split(',').map((h) => h.trim()).filter(Boolean),
        })
        id = candidato._id
        setCandidatoId(id)
      }

      // 2) Cria a candidatura ligando o candidato à vaga escolhida.
      await cadastrarCandidatura({ candidatoId: id, vagaId: form.vagaId })

      // Guarda a vaga escolhida para mostrar na confirmação.
      setVagaEscolhida(vagas.find((vaga) => vaga._id === form.vagaId) || null)
      setEnviada(true)
    } catch (e) {
      setErro(e.message)
    } finally {
      setEnviando(false)
    }
  }

  // Volta ao formulário vazio para enviar outra candidatura.
  const recomecar = () => {
    setForm(formInicial)
    setCandidatoId(null)
    setErro('')
    setEnviada(false)
    setVagaEscolhida(null)
  }

  return (
    <div className="min-h-screen bg-[#f7f8f6] text-slate-900">
      <header className="border-b border-slate-200/80 bg-white/90">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5 font-extrabold tracking-tight text-slate-900" aria-label="8Jobs, início">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500 text-lg text-white">8</span>
            <span className="text-xl">jobs<span className="text-emerald-500">.</span></span>
          </Link>
          <Link to="/vagas" className="text-sm font-semibold text-slate-600 hover:text-slate-900">Voltar para as vagas</Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        {/* Tela de confirmação, mostrada depois que a candidatura foi enviada. */}
        {enviada ? (
          <div className="rounded-2xl border border-emerald-200 bg-white p-7 text-center sm:p-10" role="status">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-2xl text-emerald-700" aria-hidden="true">✓</div>
            <h1 className="mt-5 text-2xl font-bold tracking-tight">Candidatura enviada</h1>
            <p className="mt-2 text-sm text-slate-600">
              Você se candidatou à vaga <strong>{vagaEscolhida?.titulo || 'selecionada'}</strong>
              {vagaEscolhida?.empresa?.nome ? <> na {vagaEscolhida.empresa.nome}</> : null}. O status inicial é Enviada.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button onClick={recomecar} className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">Enviar outra candidatura</button>
              <Link to="/vagas" className="rounded-xl px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Ver mais vagas</Link>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold tracking-tight">Candidate-se a uma vaga</h1>
            <p className="mt-2 text-sm text-slate-600">Preencha seus dados e escolha a vaga. Todos os campos são obrigatórios, exceto habilidades.</p>

            <form onSubmit={aoEnviar} className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
              {/* Seletor de vaga: só aparecem vagas com status ABERTA. */}
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">Vaga</span>
                <select
                  name="vagaId"
                  value={form.vagaId}
                  onChange={aoMudar}
                  required
                  disabled={carregandoVagas || vagas.length === 0}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-50 disabled:text-slate-400"
                >
                  <option value="">
                    {carregandoVagas ? 'Carregando vagas...' : vagas.length === 0 ? 'Nenhuma vaga aberta no momento' : 'Selecione uma vaga'}
                  </option>
                  {vagas.map((vaga) => (
                    <option key={vaga._id} value={vaga._id}>
                      {vaga.titulo} — {vaga.empresa?.nome || 'Empresa não informada'} ({vaga.cidade}, {vaga.modalidade})
                    </option>
                  ))}
                </select>
                {erroVagas && <span className="mt-1.5 block text-xs text-red-600">Não foi possível carregar as vagas. {erroVagas}</span>}
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <Campo rotulo="Nome completo" nome="nome" valor={form.nome} aoMudar={aoMudar} obrigatorio placeholder="Maria Souza" />
                <Campo rotulo="E-mail" nome="email" tipo="email" valor={form.email} aoMudar={aoMudar} obrigatorio placeholder="maria@email.com" />
                <Campo rotulo="Telefone" nome="telefone" tipo="tel" valor={form.telefone} aoMudar={aoMudar} obrigatorio placeholder="(51) 99999-9999" />
                <Campo rotulo="Cidade" nome="cidade" valor={form.cidade} aoMudar={aoMudar} obrigatorio placeholder="São Leopoldo" />
              </div>

              <Campo
                rotulo="Habilidades (opcional)"
                nome="habilidades"
                valor={form.habilidades}
                aoMudar={aoMudar}
                placeholder="JavaScript, Node.js, React"
                dica="Separe as habilidades por vírgula."
              />

              {/* Mensagem de erro do envio, vinda da API ou de falha de conexão. */}
              {erro && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{erro}</p>}

              <button
                type="submit"
                disabled={enviando || carregandoVagas || vagas.length === 0}
                className="w-full rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-[#102b25] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {enviando ? 'Enviando...' : 'Enviar candidatura'}
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  )
}
