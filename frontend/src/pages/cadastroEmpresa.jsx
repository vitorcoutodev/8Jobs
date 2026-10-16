
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Importa a função responsável por cadastrar empresas na API.
import { cadastrarEmpresa } from '../services/empresasService.js';

export default function CadastroEmpresa() {
  const navigate = useNavigate();

  // Guarda os dados digitados no formulário.
  const [formulario, setFormulario] = useState({
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    cidade: '',
  });

  // Controla o envio e as mensagens apresentadas ao usuário.
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  // Atualiza somente o campo que o usuário modificou.
  function handleChange(event) {
    const { name, value } = event.target;

    setFormulario((dadosAnteriores) => ({
      ...dadosAnteriores,
      [name]: value,
    }));
  }

  // Envia os dados para o microserviço de empresas.
  async function handleSubmit(event) {
    event.preventDefault();
    setErro('');
    setSucesso('');
    setCarregando(true);

    try {
      // Chama a função do empresasService.js.
      await cadastrarEmpresa(formulario);

      setSucesso('Empresa cadastrada com sucesso!');

      // Limpa o formulário após o cadastro.
      setFormulario({
        nome: '',
        cnpj: '',
        email: '',
        telefone: '',
        cidade: '',
      });

      // Aguarda brevemente antes de voltar ao início.
      // Remova este bloco se preferir permanecer no formulário.
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      // Mostra o erro caso a API não consiga cadastrar a empresa.
      setErro(error.message || 'Não foi possível cadastrar a empresa.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f8f6] text-slate-900">
      {/* Cabeçalho com a marca e o link para voltar. */}
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/" className="text-xl font-extrabold">
            8jobs<span className="text-emerald-500">.</span>
          </Link>

          <Link
            to="/"
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Voltar ao início
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-xl px-5 py-12 sm:py-16">
        {/* Apresentação do formulário. */}
        <div className="mb-7 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            Para empresas
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Cadastre sua empresa
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Prepare sua empresa para publicar vagas e encontrar talentos.
          </p>
        </div>

        {/* Formulário de cadastro. */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div>
            <label htmlFor="nome" className="mb-1.5 block text-sm font-semibold">
              Nome da empresa
            </label>
            <input
              id="nome"
              name="nome"
              value={formulario.nome}
              onChange={handleChange}
              required
              maxLength={120}
              placeholder="Ex.: Empresa Tecnologia Ltda."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label htmlFor="cnpj" className="mb-1.5 block text-sm font-semibold">
              CNPJ
            </label>
            <input
              id="cnpj"
              name="cnpj"
              value={formulario.cnpj}
              onChange={handleChange}
              required
              placeholder="00.000.000/0000-00"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">
              E-mail corporativo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formulario.email}
              onChange={handleChange}
              required
              placeholder="contato@empresa.com"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label htmlFor="telefone" className="mb-1.5 block text-sm font-semibold">
              Telefone
            </label>
            <input
              id="telefone"
              name="telefone"
              type="tel"
              value={formulario.telefone}
              onChange={handleChange}
              required
              placeholder="(51) 99999-9999"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
            />
          </div>

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
              placeholder="Ex.: São Paulo"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          {/* Mensagens de retorno da API. */}
          {erro && (
            <p role="alert" className="text-sm text-red-600">
              {erro}
            </p>
          )}

          {sucesso && (
            <p role="status" className="text-sm text-emerald-700">
              {sucesso}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-xl bg-emerald-500 px-4 py-3 font-bold text-[#102b25] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {carregando ? 'Cadastrando...' : 'Cadastrar empresa'}
          </button>

          <p className="text-center text-sm text-slate-500">
            É candidato?{' '}
            <Link
              to="/cadastro-candidato"
              className="font-semibold text-emerald-700 hover:underline"
            >
              Cadastre-se aqui
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
