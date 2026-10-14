import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

// Importa o serviço usado para consultar as vagas da API.
import { listarVagas } from '../services/vagasService.js';

// Importa os componentes compartilhados da interface.
import Navbar from '../components/navBar.jsx';
import Footer from '../components/footer.jsx';

export default function DetalhesVaga() {
  // Lê o identificador da vaga presente na URL /vagas/:id.
  const { id } = useParams();

  // Armazena os dados da vaga selecionada.
  const [vaga, setVaga] = useState(null);

  // Controla o estado de carregamento da página.
  const [carregando, setCarregando] = useState(true);

  // Armazena erros da consulta.
  const [erro, setErro] = useState('');

  // Busca os dados sempre que o ID da URL mudar.
  useEffect(() => {
    async function carregarDetalhes() {
      try {
        setCarregando(true);
        setErro('');

        // Consulta a lista de vagas pela função existente no serviço.
        const dados = await listarVagas();

        // Aceita uma lista direta ou uma resposta com a propriedade vagas.
        const lista = Array.isArray(dados)
          ? dados
          : Array.isArray(dados.vagas)
            ? dados.vagas
            : [];

        // Localiza a vaga cujo ID corresponde ao parâmetro da URL.
        const resultado = lista.find(
          (item) => String(item._id || item.id) === String(id)
        );

        // Informa quando o ID não corresponde a nenhuma vaga.
        if (!resultado) {
          setErro('A vaga solicitada não foi encontrada.');
          return;
        }

        // Guarda os dados encontrados para exibição.
        setVaga(resultado);
      } catch (error) {
        // Registra o problema e apresenta uma mensagem ao usuário.
        console.error('Erro ao carregar detalhes da vaga:', error);
        setErro(error.message || 'Não foi possível carregar os detalhes da vaga.');
      } finally {
        // Finaliza o carregamento mesmo em caso de erro.
        setCarregando(false);
      }
    }

    carregarDetalhes();
  }, [id]);

  // Normaliza os campos para aceitar os nomes usados pela API.
  const empresa =
    typeof vaga?.empresa === 'object' && vaga?.empresa !== null
      ? vaga.empresa.nome || vaga.empresa.razaoSocial
      : vaga?.empresa || vaga?.nomeEmpresa;

  const titulo = vaga?.titulo || vaga?.cargo || vaga?.role || 'Vaga sem título';
  const cidade = vaga?.cidade || vaga?.localizacao || vaga?.local || 'Local não informado';
  const modalidade = vaga?.modalidade || vaga?.tipo || 'Não informada';
  const salario = vaga?.salario || vaga?.faixaSalarial || 'A combinar';
  const status = vaga?.status || 'Não informado';
  const descricao = vaga?.descricao || vaga?.description || 'Descrição não informada.';
  const requisitos = vaga?.requisitos || vaga?.requirements;
  const beneficios = vaga?.beneficios;

  return (
    // Mantém o padrão visual utilizado nas outras páginas do 8Jobs.
    <div className="min-h-screen bg-[#f7f8f6] text-slate-900">
      {/* Menu principal de navegação. */}
      <Navbar />

      <main className="mx-auto min-h-[70vh] max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        {/* Link para retornar à listagem de vagas. */}
        <Link
          to="/vagas"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
        >
          <span aria-hidden="true">←</span>
          Voltar para as vagas
        </Link>

        {/* Apresenta o estado de carregamento, erro ou detalhes. */}
        {carregando ? (
          // Mostra uma mensagem enquanto a API responde.
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            Carregando detalhes da vaga...
          </div>
        ) : erro ? (
          // Exibe uma mensagem quando a vaga não existe ou a consulta falha.
          <div className="mt-8 rounded-2xl border border-red-200 bg-white p-8">
            <h1 className="text-xl font-bold text-red-700">
              Não foi possível abrir a vaga
            </h1>
            <p className="mt-2 text-sm text-slate-600">{erro}</p>

            {/* Permite voltar à listagem para escolher outra vaga. */}
            <Link
              to="/vagas"
              className="mt-5 inline-flex rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-[#102b25] transition hover:bg-emerald-400"
            >
              Ver todas as vagas
            </Link>
          </div>
        ) : vaga ? (
          // Exibe as informações da vaga encontrada.
          <article className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Cabeçalho com título, empresa e informações resumidas. */}
            <header className="border-b border-slate-100 p-6 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                Detalhes da oportunidade
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                {titulo}
              </h1>

              <p className="mt-3 text-base text-slate-600">
                {empresa || 'Empresa não informada'}
              </p>

              {/* Mostra localização, modalidade e status em etiquetas. */}
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-600">
                  {cidade}
                </span>

                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">
                  {modalidade}
                </span>

                <span className={`rounded-full px-3 py-1.5 ${
                  String(status).toUpperCase() === 'ABERTA'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {status}
                </span>
              </div>

              {/* Destaca a informação salarial. */}
              <div className="mt-7 rounded-xl bg-[#f7f8f6] p-4">
                <p className="text-xs font-medium text-slate-500">Salário</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{salario}</p>
              </div>
            </header>

            {/* Corpo com descrição, requisitos e benefícios. */}
            <div className="space-y-8 p-6 sm:p-9">
              <section>
                <h2 className="text-lg font-bold">Sobre a vaga</h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                  {descricao}
                </p>
              </section>

              {/* Mostra os requisitos somente quando foram cadastrados. */}
              {requisitos && (
                <section>
                  <h2 className="text-lg font-bold">Requisitos</h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                    {Array.isArray(requisitos) ? requisitos.join('\n') : requisitos}
                  </p>
                </section>
              )}

              {/* Mostra os benefícios somente quando foram informados. */}
              {beneficios && (
                <section>
                  <h2 className="text-lg font-bold">Benefícios</h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                    {Array.isArray(beneficios) ? beneficios.join('\n') : beneficios}
                  </p>
                </section>
              )}

              {/* Permite iniciar o fluxo de candidatura usando o ID da vaga. */}
              <div className="border-t border-slate-100 pt-6">
                <p className="text-sm text-slate-500">Gostou da oportunidade?</p>
                <Link
                  to={`/candidatura/${vaga._id || vaga.id}`}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-[#102b25] transition hover:bg-emerald-400 sm:w-auto"
                >
                  Candidatar-se à vaga
                </Link>
              </div>
            </div>
          </article>
        ) : null}
      </main>

      {/* Rodapé compartilhado do projeto. */}
      <Footer />
    </div>
  );
}
