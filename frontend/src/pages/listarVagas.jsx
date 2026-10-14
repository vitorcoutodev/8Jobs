import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Importa o serviço que consulta as vagas no microserviço.
import { listarVagas } from '../services/vagasService.js';

// Importa os componentes compartilhados para manter o padrão visual do 8Jobs.
import Navbar from '../components/navBar.jsx';
import Footer from '../components/footer.jsx';
import JobCard from '../components/jobCard.jsx';

// Define as cores utilizadas para identificar visualmente as vagas.
const CORES_VAGAS = [
  'bg-violet-100 text-violet-700',
  'bg-orange-100 text-orange-700',
  'bg-red-100 text-red-700',
  'bg-emerald-100 text-emerald-700',
];

// Converte os campos da API para o formato esperado pelo componente JobCard.
function formatarVaga(vaga, indice) {
  // A empresa pode chegar como texto ou como objeto relacionado.
  const empresa =
    typeof vaga.empresa === 'object' && vaga.empresa !== null
      ? vaga.empresa.nome || vaga.empresa.razaoSocial || ''
      : vaga.empresa || vaga.nomeEmpresa || '';

  // Retorna os campos padronizados usados na interface.
  return {
    // Usa o identificador do MongoDB ou um ID comum.
    id: vaga._id || vaga.id,

    // Aceita os nomes de campo mais comuns para o título.
    role: vaga.titulo || vaga.cargo || vaga.role || vaga.title || 'Vaga sem título',

    // Define o nome da empresa.
    company: empresa || 'Empresa não informada',

    // Obtém a localização informada no cadastro.
    place: vaga.localizacao || vaga.cidade || vaga.local || 'Local não informado',

    // Obtém a modalidade ou o tipo da vaga.
    type: vaga.modalidade || vaga.tipo || 'Modalidade não informada',

    // Obtém a área profissional.
    area: vaga.area || vaga.departamento || 'Geral',

    // Obtém o salário informado.
    salary: vaga.salario || vaga.faixaSalarial || 'A combinar',

    // Formata a data de criação, quando disponível.
    posted: vaga.createdAt
      ? new Date(vaga.createdAt).toLocaleDateString('pt-BR')
      : 'Disponível',

    // Verifica se a vaga está marcada como destaque.
    featured: Boolean(vaga.featured || vaga.destaque),

    // Define a cor e as iniciais usadas no cartão.
    color: CORES_VAGAS[indice % CORES_VAGAS.length],
    initials: empresa ? empresa.substring(0, 2).toUpperCase() : '8J',
  };
}

export default function ListarVagas() {
  // Armazena a lista de vagas recebida da API.
  const [vagas, setVagas] = useState([]);

  // Controla a mensagem de carregamento.
  const [carregando, setCarregando] = useState(true);

  // Armazena uma mensagem caso a consulta falhe.
  const [erro, setErro] = useState('');

  // Consulta a API uma vez quando a página é montada.
  useEffect(() => {
    async function carregarVagas() {
      try {
        setCarregando(true);
        setErro('');

        // Busca as vagas pelo serviço compartilhado.
        const dados = await listarVagas();

        // Aceita tanto uma lista direta quanto um objeto com a propriedade vagas.
        const lista = Array.isArray(dados)
          ? dados
          : Array.isArray(dados.vagas)
            ? dados.vagas
            : [];

        // Padroniza os dados antes de exibi-los.
        setVagas(lista.map(formatarVaga));
      } catch (error) {
        // Registra o erro no console e prepara uma mensagem para a tela.
        console.error('Erro ao carregar vagas:', error);
        setErro(error.message || 'Não foi possível carregar as vagas.');
      } finally {
        // Finaliza o carregamento mesmo quando ocorre um erro.
        setCarregando(false);
      }
    }

    carregarVagas();
  }, []);

  return (
    // Usa as mesmas cores e o mesmo fundo das demais páginas do projeto.
    <div className="min-h-screen bg-[#f7f8f6] text-slate-900">
      {/* Menu de navegação compartilhado. */}
      <Navbar />

      <main className="mx-auto min-h-[70vh] max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        {/* Cabeçalho da listagem e acesso ao formulário de cadastro. */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Oportunidades profissionais
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Vagas disponíveis
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Encontre uma oportunidade para dar o próximo passo na sua carreira.
            </p>
          </div>

        </div>

        {/* Exibe estados diferentes conforme o resultado da consulta. */}
        {carregando ? (
          // Mensagem exibida enquanto a API responde.
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            Carregando vagas...
          </div>
        ) : erro ? (
          // Mensagem exibida quando a API retorna um erro.
          <div className="mt-8 rounded-2xl border border-red-200 bg-white p-8">
            <h2 className="font-semibold text-red-700">
              Não foi possível carregar as vagas.
            </h2>
            <p className="mt-2 text-sm text-slate-600">{erro}</p>
          </div>
        ) : vagas.length === 0 ? (
          // Estado vazio quando ainda não existem vagas cadastradas.
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="font-semibold">Nenhuma vaga cadastrada.</h2>
            <p className="mt-2 text-sm text-slate-500">
              Você pode cadastrar uma vaga usando o botão acima.
            </p>
          </div>
        ) : (
          // Exibe a quantidade encontrada e os cartões das vagas.
          <>
            <p className="mt-8 text-sm text-slate-500">
              {vagas.length} {vagas.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}
            </p>

            {/* Grade responsiva: uma coluna no celular e mais colunas em telas maiores. */}
            <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {vagas.map((vaga) => (
                // A chave ajuda o React a identificar cada cartão.
                <JobCard key={vaga.id} job={vaga} />
              ))}
            </section>
          </>
        )}
      </main>

      {/* Rodapé compartilhado do projeto. */}
      <Footer />
    </div>
  );
}
