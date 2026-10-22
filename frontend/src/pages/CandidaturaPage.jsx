// Importa o estado React, os links e os serviços necessários ao formulário.
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { listarVagas } from '../services/vagasService.js';
import { cadastrarCandidatura } from '../services/candidaturasService.js';
import { useAuth } from '../auth/AuthContext.jsx';

// Permite que a vaga venha pré-selecionada a partir da página de detalhes.
export default function CandidaturaPage() {
  const [parametros] = useSearchParams();
  const { usuario } = useAuth();
  const [vagas, setVagas] = useState([]);
  const [vagaId, setVagaId] = useState(parametros.get('vagaId') || '');
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [vagaEnviada, setVagaEnviada] = useState(null);

  // Carrega somente as vagas abertas para receber uma candidatura.
  useEffect(() => {
    listarVagas()
      .then((lista) => setVagas(lista.filter((vaga) => vaga.status === 'ABERTA')))
      .catch((falha) => setErro(falha.message))
      .finally(() => setCarregando(false));
  }, []);

  // Envia a candidatura; o gateway associa o ID da sessão ao pedido.
  const aoEnviar = async (evento) => {
    evento.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      await cadastrarCandidatura({ vagaId });
      setVagaEnviada(vagas.find((vaga) => vaga._id === vagaId));
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setEnviando(false);
    }
  };

  // Mostra a confirmação após a API registrar a candidatura.
  if (vagaEnviada) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-16 text-center">
        <p className="text-3xl font-bold">Candidatura enviada</p>
        <p className="mt-3 text-slate-600">{usuario.nome}, sua candidatura para {vagaEnviada.titulo} foi registrada.</p>
        <Link to="/vagas" className="mt-7 inline-block rounded-xl bg-emerald-500 px-5 py-3 font-bold">Ver mais vagas</Link>
      </main>
    );
  }

  // Apresenta a vaga e permite que a pessoa autenticada envie sua candidatura.
  return (
    <main className="mx-auto min-h-screen max-w-2xl px-5 py-12">
      <Link to="/vagas" className="text-sm font-semibold text-emerald-700">Voltar para as vagas</Link>
      <h1 className="mt-6 text-3xl font-bold">Candidate-se a uma vaga</h1>
      <p className="mt-2 text-sm text-slate-600">A candidatura será enviada usando seu perfil: {usuario.nome} ({usuario.email || 'conta autenticada'}).</p>
      {/* Exige sessão de candidato; lista vagas abertas e o servidor bloqueia vaga inválida, fechada ou candidatura duplicada. */}
      <form onSubmit={aoEnviar} className="mt-7 space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
        <label className="block text-sm font-semibold">Vaga
          <select aria-label="Vaga" name="vagaId" value={vagaId} onChange={(evento) => setVagaId(evento.target.value)} required disabled={carregando || vagas.length === 0} className="mt-1 block h-12 w-full rounded-xl border border-slate-200 bg-white px-3 disabled:bg-slate-50">
            <option value="">{carregando ? 'Carregando vagas...' : vagas.length ? 'Selecione uma vaga' : 'Nenhuma vaga aberta no momento'}</option>
            {vagas.map((vaga) => <option key={vaga._id} value={vaga._id}>{vaga.titulo} — {vaga.empresa?.nome || 'Empresa'} ({vaga.cidade})</option>)}
          </select>
        </label>
        {erro && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{erro}</p>}
        <button type="submit" disabled={enviando || carregando || !vagas.length} className="w-full rounded-xl bg-emerald-500 py-3 font-bold disabled:opacity-60">{enviando ? 'Enviando...' : 'Enviar candidatura'}</button>
      </form>
    </main>
  );
}
