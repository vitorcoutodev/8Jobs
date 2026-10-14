
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Importa a função que consulta o microserviço de candidatos.
import { listarCandidatos } from '../services/candidatosService.js';

// Importa os componentes reutilizáveis.
import Navbar from '../components/navBar.jsx';
import Footer from '../components/footer.jsx';

export default function ListarCandidatos() {
  // Armazena os candidatos recebidos da API.
  const [candidatos, setCandidatos] = useState([]);

  // Controla o estado de carregamento.
  const [carregando, setCarregando] = useState(true);

  // Armazena possíveis mensagens de erro.
  const [erro, setErro] = useState('');

  // Busca os candidatos quando a página é aberta.
  useEffect(() => {
    async function carregarCandidatos() {
      try {
        setCarregando(true);
        setErro('');

        // Solicita os dados ao serviço do frontend.
        const dados = await listarCandidatos();

        // Aceita uma lista direta ou um objeto com a propriedade candidatos.
        const lista = Array.isArray(dados)
          ? dados
          : Array.isArray(dados.candidatos)
            ? dados.candidatos
            : [];

        setCandidatos(lista);
      } catch (error) {
        // Registra e apresenta o erro da requisição.
        console.error('Erro ao carregar candidatos:', error);
        setErro(
          error.message || 'Não foi possível carregar os candidatos.'
        );
      } finally {
        // Encerra o carregamento mesmo se ocorrer um erro.
        setCarregando(false);
      }
    }

    carregarCandidatos();
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f8f6] text-slate-900">
      {/* Menu de navegação compartilhado. */}
      <Navbar />

      <main className="mx-auto min-h-[70vh] max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        {/* Título da página. */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Gestão de candidatos
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Candidatos cadastrados
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Consulte os candidatos registrados na plataforma.
            </p>
          </div>

          {/* Atalho para o formulário de cadastro. */}
          <Link
            to="/cadastro-candidato"
            className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-[#102b25] transition hover:bg-emerald-400"
          >
            Cadastrar candidato
          </Link>
        </div>

        {/* Exibe o estado atual da consulta à API. */}
        {carregando ? (
          <p className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            Carregando candidatos...
          </p>
        ) : erro ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-white p-8 text-center">
            <p className="font-semibold text-red-700">
              Não foi possível carregar os candidatos.
            </p>
            <p className="mt-2 text-sm text-slate-500">{erro}</p>
          </div>
        ) : candidatos.length === 0 ? (
          // Mensagem apresentada quando não existem registros.
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="font-semibold">
              Nenhum candidato cadastrado.
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Os candidatos cadastrados aparecerão nesta página.
            </p>
          </div>
        ) : (
          // Renderiza um cartão para cada candidato retornado pela API.
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {candidatos.map((candidato, indice) => (
              <article
                key={candidato._id || candidato.id || indice}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-300 hover:shadow-md"
              >
                {/* Iniciais para identificar visualmente o candidato. */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 font-bold text-emerald-800">
                  {(candidato.nome || candidato.name || 'C')
                    .trim()
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                {/* Informações básicas do candidato. */}
                <h2 className="mt-4 text-lg font-bold">
                  {candidato.nome || candidato.name || 'Nome não informado'}
                </h2>

                <p className="mt-2 break-words text-sm text-slate-600">
                  {candidato.email || 'E-mail não informado'}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {candidato.telefone || 'Telefone não informado'}
                </p>

                {/*
                  Mostra a área de interesse se esse campo existir
                  nos documentos retornados pela API.
                */}
                {(candidato.areaInteresse || candidato.area) && (
                  <span className="mt-4 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                    {candidato.areaInteresse || candidato.area}
                  </span>
                )}
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Rodapé compartilhado. */}
      <Footer />
    </div>
  );
}
