
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

// Importa o serviço que faz a comunicação com a API de vagas.
import { listarVagas } from '../services/vagasService.js';

// Importa os componentes reutilizáveis do frontend.
import Navbar from '../components/navBar.jsx';
import Footer from '../components/footer.jsx';
import JobCard from '../components/jobCard.jsx';

// Cores utilizadas nos cartões das vagas.
const CORES_VAGAS = [
  'bg-violet-100 text-violet-700',
  'bg-orange-100 text-orange-700',
  'bg-red-100 text-red-700',
  'bg-emerald-100 text-emerald-700',
];

// Converte os dados da API para o formato utilizado pelo JobCard.
// Confira os nomes dos campos no seu microserviço e ajuste se necessário.
function formatarVaga(vaga, indice) {
  // Algumas APIs retornam a empresa como um objeto relacionado.
  const empresa =
    typeof vaga.empresa === 'object' && vaga.empresa !== null
      ? vaga.empresa.nome || vaga.empresa.razaoSocial || ''
      : vaga.empresa || vaga.company || '';

  return {
    // MongoDB normalmente utiliza _id como identificador.
    id: vaga._id || vaga.id,

    // Aceita alguns nomes comuns para os campos da vaga.
    role: vaga.titulo || vaga.cargo || vaga.role || vaga.title || 'Vaga sem título',
    company: empresa,
    place:
      vaga.localizacao ||
      vaga.local ||
      vaga.cidade ||
      vaga.place ||
      'Local não informado',
    type:
      vaga.modalidade ||
      vaga.tipo ||
      vaga.type ||
      'Não informada',
    area: vaga.area || vaga.departamento || 'Geral',
    salary:
      vaga.salario ||
      vaga.faixaSalarial ||
      vaga.salary ||
      'A combinar',
    posted: vaga.createdAt
      ? new Date(vaga.createdAt).toLocaleDateString('pt-BR')
      : 'Disponível',
    featured: Boolean(vaga.featured || vaga.destaque),

    // Campos visuais utilizados pelo JobCard.
    color: CORES_VAGAS[indice % CORES_VAGAS.length],
    initials: empresa
      ? empresa.substring(0, 2).toUpperCase()
      : '8J',
  };
}

export default function Home() {
  // Armazena as vagas recebidas do microserviço.
  const [jobs, setJobs] = useState([]);

  // Controla a indicação de carregamento.
  const [carregando, setCarregando] = useState(true);

  // Armazena uma mensagem de erro, se a API falhar.
  const [erro, setErro] = useState('');

  // Guarda o texto utilizado para pesquisar cargo, empresa ou área.
  const [query, setQuery] = useState('');

  // Guarda o filtro de localização ou modalidade.
  const [location, setLocation] = useState('');

  // Busca as vagas na API quando a página é carregada.
  useEffect(() => {
    async function carregarVagas() {
      try {
        setCarregando(true);
        setErro('');

        // Chama a função definida em vagasService.js.
        const dados = await listarVagas();

        // Aceita uma lista direta ou uma resposta no formato { vagas: [] }.
        const listaVagas = Array.isArray(dados)
          ? dados
          : Array.isArray(dados.vagas)
            ? dados.vagas
            : [];

        // Ajusta os dados recebidos para o formato dos cartões.
        setJobs(listaVagas.map(formatarVaga));
      } catch (error) {
        // Registra o erro para informar o usuário na tela.
        console.error('Erro ao carregar vagas:', error);
        setErro(
          error.message || 'Não foi possível carregar as vagas.'
        );
      } finally {
        // Encerra o indicador de carregamento mesmo em caso de erro.
        setCarregando(false);
      }
    }

    carregarVagas();
  }, []);

  // Filtra as vagas recebidas da API conforme os campos de busca.
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Pesquisa por cargo, empresa e área.
      const searchable =
        `${job.role} ${job.company} ${job.area}`.toLowerCase();

      const matchesQuery = searchable.includes(query.toLowerCase());

      // Pesquisa por localização e modalidade.
      const searchableLocation =
        `${job.place} ${job.type}`.toLowerCase();

      const matchesLocation = searchableLocation.includes(
        location.toLowerCase()
      );

      // A vaga precisa corresponder aos dois filtros.
      return matchesQuery && matchesLocation;
    });
  }, [jobs, query, location]);

  // Impede o recarregamento do navegador e rola até as vagas.
  function handleSearch(event) {
    event.preventDefault();

    document.getElementById('vagas')?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  return (
    <div
      id="inicio"
      className="min-h-screen bg-[#f7f8f6] text-slate-900"
    >
      {/* Menu de navegação compartilhado. */}
      <Navbar />

      <main>
        {/* Seção principal de apresentação. */}
        <section className="relative overflow-hidden bg-[#102b25] text-white">
          {/* Elementos decorativos do fundo. */}
          <div className="absolute -right-20 -top-40 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:py-24">
            {/* Apresentação do 8Jobs. */}
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-emerald-100">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Seu próximo passo começa aqui
              </div>

              <h1 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                O trabalho certo muda{' '}
                <span className="text-emerald-400">tudo.</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-emerald-50/75 sm:text-lg">
                Encontre oportunidades que combinam com você e dê o próximo
                passo na sua carreira.
              </p>

              {/* Textos institucionais, sem números fictícios. */}
              <div className="mt-8 flex flex-wrap gap-6 text-sm text-emerald-50/80">
                <span>Encontre novas oportunidades</span>
                <span>Conecte-se com empresas</span>
              </div>
            </div>

            {/* Formulário de pesquisa de vagas. */}
            <div className="rounded-2xl border border-white/10 bg-white p-5 text-slate-900 shadow-2xl shadow-black/20 sm:p-6">
              <p className="text-lg font-bold">
                Encontre sua próxima oportunidade
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Busque por cargo, empresa ou localização.
              </p>

              <form className="mt-5 space-y-3" onSubmit={handleSearch}>
                {/* Pesquisa por cargo, empresa ou área. */}
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                    O que você procura?
                  </span>

                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none focus:border-emerald-500"
                    placeholder="Ex.: desenvolvedor, marketing..."
                  />
                </label>

                {/* Pesquisa por cidade ou modalidade. */}
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Onde?
                  </span>

                  <input
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none focus:border-emerald-500"
                    placeholder="Cidade, estado ou remoto"
                  />
                </label>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-[#102b25] transition hover:bg-emerald-400"
                >
                  Buscar vagas
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Lista de vagas retornadas pela API. */}
        <section
          id="vagas"
          className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700">
                Oportunidades para você
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Vagas disponíveis
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Confira as oportunidades cadastradas na plataforma.
              </p>
            </div>

            <Link
              to="/vagas"
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Ver todas as vagas <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Estado de carregamento da API. */}
          {carregando ? (
            <p className="mt-7 rounded-2xl bg-white p-8 text-center text-slate-500">
              Carregando vagas...
            </p>
          ) : erro ? (
            // Exibe o erro caso a API não responda corretamente.
            <div className="mt-7 rounded-2xl border border-red-200 bg-white p-8 text-center">
              <p className="font-semibold text-red-700">
                Não foi possível carregar as vagas.
              </p>
              <p className="mt-2 text-sm text-slate-500">{erro}</p>
              <p className="mt-2 text-sm text-slate-500">
                Verifique se o microserviço está em execução e se a URL
                configurada em vagasService.js está correta.
              </p>
            </div>
          ) : filteredJobs.length > 0 ? (
            // Exibe um cartão para cada vaga encontrada.
            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {filteredJobs.map((job, indice) => (
                <JobCard
                  key={job.id ?? indice}
                  job={job}
                />
              ))}
            </div>
          ) : (
            // Mensagem para lista vazia ou filtros sem resultados.
            <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <p className="font-semibold">
                {jobs.length === 0
                  ? 'Nenhuma vaga cadastrada ainda.'
                  : 'Não encontramos vagas com esses filtros.'}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {jobs.length === 0
                  ? 'As vagas aparecerão aqui quando forem cadastradas.'
                  : 'Tente buscar por outro cargo ou localização.'}
              </p>
            </div>
          )}
        </section>

        {/* Área de divulgação para empresas. */}
        <section
          id="empresas"
          className="mx-auto max-w-7xl px-5 pb-14 sm:px-8 sm:pb-16"
        >
          <div className="flex flex-col items-start justify-between gap-5 rounded-2xl bg-emerald-100 p-7 sm:flex-row sm:items-center sm:p-9">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.15em] text-emerald-800">
                Sua empresa está contratando?
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                Encontre pessoas incríveis.
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                Cadastre sua empresa e publique oportunidades no 8Jobs.
              </p>
            </div>

            {/* Destino provisório até a criação da página de empresas. */}
            <Link
              to="/empresas"
              className="shrink-0 rounded-xl bg-[#102b25] px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-900"
            >
              Conheça o 8Jobs para empresas{' '}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Rodapé compartilhado. */}
      <Footer />
    </div>
  );
}
