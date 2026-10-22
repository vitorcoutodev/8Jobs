import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import Navbar from '../components/navBar.jsx';
import Footer from '../components/footer.jsx';
import { listarCandidaturas } from '../services/candidaturasService.js';
import { buscarCandidato } from '../services/candidatosService.js';
import { listarVagas } from '../services/vagasService.js';

const STATUS = {
  ENVIADA: { rotulo: 'Enviada', estilo: 'bg-sky-50 text-sky-700' },
  EM_ANALISE: { rotulo: 'Em análise', estilo: 'bg-amber-50 text-amber-700' },
  APROVADA: { rotulo: 'Aprovada', estilo: 'bg-emerald-50 text-emerald-700' },
  REJEITADA: { rotulo: 'Rejeitada', estilo: 'bg-red-50 text-red-700' },
};

function comoLista(dados, chave) {
  if (Array.isArray(dados)) return dados;
  return Array.isArray(dados?.[chave]) ? dados[chave] : [];
}

function idDe(valor) {
  if (valor && typeof valor === 'object') return String(valor._id || valor.id || '');
  return String(valor || '');
}

function formatarData(valor) {
  if (!valor) return 'Data não informada';
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? 'Data não informada' : data.toLocaleDateString('pt-BR');
}

export default function ListarCandidaturas() {
  const [candidaturas, setCandidaturas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [vagaSelecionada, setVagaSelecionada] = useState('todas');
  const [statusSelecionado, setStatusSelecionado] = useState('todos');

  useEffect(() => {
    let ativa = true;

    async function carregarCandidaturas() {
      try {
        setCarregando(true);
        setErro('');
        setAviso('');

        // O gateway devolve somente candidaturas das vagas da empresa logada.
        const [dadosCandidaturas, dadosVagas] = await Promise.all([
          listarCandidaturas(),
          listarVagas().catch(() => null),
        ]);
        const listaCandidaturas = comoLista(dadosCandidaturas, 'candidaturas');
        const listaVagas = comoLista(dadosVagas, 'vagas');
        const vagasPorId = new Map(listaVagas.map((vaga) => [idDe(vaga), vaga]));
        let mensagemAviso = dadosVagas ? '' : 'Não foi possível carregar os títulos das vagas.';

        // Busca cada perfil uma vez, mesmo quando a pessoa se candidatou a várias vagas.
        const idsCandidatos = [...new Set(
          listaCandidaturas.map((candidatura) => idDe(candidatura.candidatoId)).filter(Boolean),
        )];
        const resultadosCandidatos = await Promise.allSettled(
          idsCandidatos.map((id) => buscarCandidato(id)),
        );
        const candidatosPorId = new Map();

        resultadosCandidatos.forEach((resultado, indice) => {
          if (resultado.status === 'fulfilled') {
            candidatosPorId.set(idsCandidatos[indice], resultado.value?.candidato || resultado.value);
          } else {
            mensagemAviso = 'Alguns perfis de candidato não puderam ser carregados.';
          }
        });

        const listaCompleta = listaCandidaturas.map((candidatura) => {
          const vagaId = idDe(candidatura.vagaId);
          const candidatoId = idDe(candidatura.candidatoId);
          return {
            ...candidatura,
            vagaId,
            vaga: vagasPorId.get(vagaId),
            candidato: candidatosPorId.get(candidatoId),
          };
        });

        if (ativa) {
          setCandidaturas(listaCompleta);
          setAviso(mensagemAviso);
        }
      } catch (falha) {
        if (ativa) setErro(falha.message || 'Não foi possível carregar as candidaturas.');
      } finally {
        if (ativa) setCarregando(false);
      }
    }

    carregarCandidaturas();
    return () => { ativa = false; };
  }, []);

  const vagas = useMemo(() => {
    const unicas = new Map();
    candidaturas.forEach((candidatura) => {
      if (candidatura.vagaId) {
        unicas.set(candidatura.vagaId, candidatura.vaga?.titulo || 'Vaga sem título');
      }
    });
    return [...unicas.entries()];
  }, [candidaturas]);

  const filtradas = candidaturas.filter((candidatura) => (
    (vagaSelecionada === 'todas' || candidatura.vagaId === vagaSelecionada)
    && (statusSelecionado === 'todos' || candidatura.status === statusSelecionado)
  ));

  return (
    <div className="min-h-screen bg-[#f7f8f6] text-slate-900">
      <Navbar />

      <main className="mx-auto min-h-[70vh] max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            Gestão de vagas
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Candidaturas recebidas</h1>
          <p className="mt-2 text-sm text-slate-500">
            Veja quem se candidatou às vagas da sua empresa.
          </p>
        </div>

        {!carregando && !erro && candidaturas.length > 0 && (
          <section aria-label="Filtros de candidaturas" className="mt-7 flex flex-wrap gap-4 rounded-2xl border border-slate-200 bg-white p-4">
            <label className="text-sm font-semibold text-slate-700">
              Vaga
              <select
                value={vagaSelecionada}
                onChange={(evento) => setVagaSelecionada(evento.target.value)}
                className="mt-1 block min-w-56 rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal"
              >
                <option value="todas">Todas as vagas</option>
                {vagas.map(([id, titulo]) => <option key={id} value={id}>{titulo}</option>)}
              </select>
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Status
              <select
                value={statusSelecionado}
                onChange={(evento) => setStatusSelecionado(evento.target.value)}
                className="mt-1 block min-w-48 rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal"
              >
                <option value="todos">Todos os status</option>
                {Object.entries(STATUS).map(([valor, dados]) => <option key={valor} value={valor}>{dados.rotulo}</option>)}
              </select>
            </label>
          </section>
        )}

        {aviso && !carregando && (
          <p role="status" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {aviso} Os demais dados continuam disponíveis abaixo.
          </p>
        )}

        {carregando ? (
          <p className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            Carregando candidaturas...
          </p>
        ) : erro ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-white p-8 text-center">
            <h2 className="font-semibold text-red-700">Não foi possível carregar as candidaturas.</h2>
            <p role="alert" className="mt-2 text-sm text-slate-500">{erro}</p>
          </div>
        ) : candidaturas.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="font-semibold">Você ainda não recebeu candidaturas.</h2>
            <p className="mt-2 text-sm text-slate-500">
              Quando alguém se candidatar às suas vagas, as informações aparecerão aqui.
            </p>
            <Link to="/vagas/cadastrar" className="mt-5 inline-flex rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-[#102b25] transition hover:bg-emerald-400">
              Publicar uma vaga
            </Link>
          </div>
        ) : filtradas.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="font-semibold">Nenhuma candidatura corresponde aos filtros.</h2>
            <button type="button" onClick={() => { setVagaSelecionada('todas'); setStatusSelecionado('todos'); }} className="mt-4 text-sm font-semibold text-emerald-700 hover:text-emerald-800">
              Limpar filtros
            </button>
          </div>
        ) : (
          <>
            <p className="mt-7 text-sm text-slate-500">
              {filtradas.length} {filtradas.length === 1 ? 'candidatura' : 'candidaturas'}
              {filtradas.length !== candidaturas.length ? ` de ${candidaturas.length}` : ''}
            </p>

            <section aria-label="Lista de candidaturas" className="mt-4 grid gap-4 lg:grid-cols-2">
              {filtradas.map((candidatura, indice) => {
                const candidato = candidatura.candidato || {};
                const status = STATUS[candidatura.status] || {
                  rotulo: candidatura.status || 'Status não informado',
                  estilo: 'bg-slate-100 text-slate-700',
                };
                const nome = candidato.nome || 'Perfil de candidato indisponível';
                const iniciais = nome.split(/\s+/).slice(0, 2).map((parte) => parte[0]).join('').toUpperCase();
                const tituloVaga = candidatura.vaga?.titulo || 'Vaga sem título';

                return (
                  <article key={candidatura._id || candidatura.id || `${candidatura.vagaId}-${indice}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 font-bold text-emerald-800">
                          {iniciais || 'C'}
                        </div>
                        <div>
                          <h2 className="font-bold">{nome}</h2>
                          <p className="mt-1 text-sm text-slate-500">Candidatou-se a</p>
                        </div>
                      </div>
                      <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${status.estilo}`}>
                        {status.rotulo}
                      </span>
                    </div>

                    <div className="pt-4">
                      {candidatura.vagaId ? (
                        <Link to={`/vagas/${encodeURIComponent(candidatura.vagaId)}`} className="font-semibold text-emerald-800 hover:text-emerald-900">
                          {tituloVaga}
                        </Link>
                      ) : <p className="font-semibold">{tituloVaga}</p>}
                      {candidatura.vaga?.cidade && <p className="mt-1 text-sm text-slate-500">{candidatura.vaga.cidade}</p>}
                    </div>

                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="font-semibold text-slate-700">E-mail</dt>
                        <dd className="mt-1 break-words text-slate-600">{candidato.email || 'Não disponível'}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-700">Telefone</dt>
                        <dd className="mt-1 text-slate-600">{candidato.telefone || 'Não disponível'}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-700">Cidade</dt>
                        <dd className="mt-1 text-slate-600">{candidato.cidade || 'Não informada'}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-700">Data da candidatura</dt>
                        <dd className="mt-1 text-slate-600">{formatarData(candidatura.data || candidatura.createdAt)}</dd>
                      </div>
                    </dl>

                    {Array.isArray(candidato.habilidades) && candidato.habilidades.length > 0 && (
                      <div className="mt-4 border-t border-slate-100 pt-4">
                        <p className="text-sm font-semibold text-slate-700">Habilidades</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {candidato.habilidades.map((habilidade, habilidadeIndice) => (
                            <span key={`${habilidade}-${habilidadeIndice}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                              {habilidade}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
