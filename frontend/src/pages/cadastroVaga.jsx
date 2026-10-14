import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Importa a função que envia uma nova vaga para a API.
import { cadastrarVaga } from '../services/vagasService.js';

// Importa os componentes compartilhados do projeto.
import Navbar from '../components/navBar.jsx';
import Footer from '../components/footer.jsx';

export default function CadastroVaga() {
  // Permite navegar para outra página depois do cadastro.
  const navigate = useNavigate();

  // Guarda os valores digitados no formulário.
  const [formulario, setFormulario] = useState({
    titulo: '',
    empresa: '',
    descricao: '',
    requisitos: '',
    cidade: '',
    modalidade: 'Presencial',
    salario: '',
    status: 'ABERTA',
  });

  // Controla o carregamento e as mensagens de retorno.
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  // Atualiza no estado somente o campo que foi alterado.
  function handleChange(event) {
    const { name, value } = event.target;

    setFormulario((dadosAnteriores) => ({
      ...dadosAnteriores,
      [name]: value,
    }));
  }

  // Envia os dados preenchidos para o microserviço de vagas.
  async function handleSubmit(event) {
    event.preventDefault();

    // Limpa mensagens anteriores e inicia o carregamento.
    setErro('');
    setSucesso('');
    setCarregando(true);

    try {
      // Converte os campos em branco de requisitos para texto vazio e envia o cadastro.
      await cadastrarVaga({
        ...formulario,
        requisitos: formulario.requisitos.trim(),
      });

      // Informa que a API aceitou o cadastro.
      setSucesso('Vaga cadastrada com sucesso!');

      // Aguarda brevemente e retorna à listagem de vagas.
      setTimeout(() => navigate('/vagas'), 1200);
    } catch (error) {
      // Mostra a mensagem retornada pelo serviço caso o cadastro falhe.
      console.error('Erro ao cadastrar vaga:', error);
      setErro(error.message || 'Não foi possível cadastrar a vaga.');
    } finally {
      // Encerra o indicador de carregamento.
      setCarregando(false);
    }
  }

  return (
    // Mantém o fundo e as cores padronizados na plataforma.
    <div className="min-h-screen bg-[#f7f8f6] text-slate-900">
      {/* Menu de navegação compartilhado. */}
      <Navbar />

      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        {/* Apresentação da página de cadastro. */}
        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            Para empresas
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Cadastrar vaga
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Preencha as informações da oportunidade que será publicada na plataforma.
          </p>
        </div>

        {/* Formulário responsável por enviar os dados da nova vaga. */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          {/* Campo de título da oportunidade. */}
          <div>
            <label htmlFor="titulo" className="mb-1.5 block text-sm font-semibold">
              Título da vaga
            </label>
            <input
              id="titulo"
              name="titulo"
              value={formulario.titulo}
              onChange={handleChange}
              required
              maxLength={120}
              placeholder="Ex.: Desenvolvedor Node.js"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          {/* Campo para identificar a empresa que oferece a vaga. */}
          <div>
            <label htmlFor="empresa" className="mb-1.5 block text-sm font-semibold">
              Empresa
            </label>
            <input
              id="empresa"
              name="empresa"
              value={formulario.empresa}
              onChange={handleChange}
              required
              maxLength={120}
              placeholder="Nome da empresa"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          {/* Campo para descrever as atividades e responsabilidades. */}
          <div>
            <label htmlFor="descricao" className="mb-1.5 block text-sm font-semibold">
              Descrição da vaga
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formulario.descricao}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Descreva as atividades e responsabilidades."
              className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          {/* Campo opcional para informar os requisitos da oportunidade. */}
          <div>
            <label htmlFor="requisitos" className="mb-1.5 block text-sm font-semibold">
              Requisitos
            </label>
            <textarea
              id="requisitos"
              name="requisitos"
              value={formulario.requisitos}
              onChange={handleChange}
              rows={3}
              placeholder="Informe os requisitos necessários."
              className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          {/* Organiza localização e modalidade em duas colunas em telas maiores. */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="cidade" className="mb-1.5 block text-sm font-semibold">
                Cidade
              </label>
              <input
                id="cidade"
                name="cidade"
                value={formulario.cidade}
                onChange={handleChange}
                required
                placeholder="Ex.: Campinas"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="modalidade" className="mb-1.5 block text-sm font-semibold">
                Modalidade
              </label>
              <select
                id="modalidade"
                name="modalidade"
                value={formulario.modalidade}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
              >
                <option value="Presencial">Presencial</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Remoto">Remoto</option>
              </select>
            </div>
          </div>

          {/* Organiza salário e status da vaga. */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="salario" className="mb-1.5 block text-sm font-semibold">
                Salário
              </label>
              <input
                id="salario"
                name="salario"
                value={formulario.salario}
                onChange={handleChange}
                placeholder="Ex.: R$ 4.500 ou A combinar"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="status" className="mb-1.5 block text-sm font-semibold">
                Status da vaga
              </label>
              <select
                id="status"
                name="status"
                value={formulario.status}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
              >
                <option value="ABERTA">Aberta</option>
                <option value="FECHADA">Fechada</option>
              </select>
            </div>
          </div>

          {/* Apresenta mensagens de sucesso ou erro do envio. */}
          {erro && (
            <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {erro}
            </p>
          )}

          {sucesso && (
            <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
              {sucesso}
            </p>
          )}

          {/* Botões de ação do formulário. */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            {/* Cancela o cadastro e retorna à listagem. */}
            <Link
              to="/vagas"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancelar
            </Link>

            {/* Envia o formulário e impede cliques repetidos durante o envio. */}
            <button
              type="submit"
              disabled={carregando}
              className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-[#102b25] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando ? 'Cadastrando...' : 'Cadastrar vaga'}
            </button>
          </div>
        </form>
      </main>

      {/* Rodapé compartilhado do projeto. */}
      <Footer />
    </div>
  );
}
