
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Importa a função responsável por cadastrar candidatos na API.
import { cadastrarCandidato } from '../services/candidatosService.js';

export default function CadastroCandidato() {
  const navigate = useNavigate();

  // Guarda as informações preenchidas pelo candidato.
  const [formulario, setFormulario] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    areaInteresse: '',
  });

  // Controla o envio e as mensagens do formulário.
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  // Atualiza o estado conforme o usuário preenche os campos.
  function handleChange(event) {
    const { name, value } = event.target;

    setFormulario((dadosAnteriores) => ({
      ...dadosAnteriores,
      [name]: value,
    }));
  }

  // Envia os dados do candidato para a API.
  async function handleSubmit(event) {
    event.preventDefault();
    setErro('');
    setSucesso('');
    setCarregando(true);

    try {
      // Executa a função de cadastro do candidatosService.js.
      await cadastrarCandidato(formulario);

      setSucesso('Candidato cadastrado com sucesso!');

      // Limpa os campos após o cadastro.
      setFormulario({
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
        areaInteresse: '',
      });

      // Volta à página inicial após uma breve confirmação.
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      // Apresenta o erro retornado pelo serviço.
      setErro(error.message || 'Não foi possível cadastrar o candidato.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f8f6] text-slate-900">
      {/* Cabeçalho com a marca e a navegação de retorno. */}
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
        {/* Apresentação do cadastro de candidatos. */}
        <div className="mb-7 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            Para candidatos
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Crie seu cadastro
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Cadastre seus dados para se conectar a novas oportunidades.
          </p>
        </div>

        {/* Formulário de cadastro do candidato. */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div>
            <label htmlFor="nome" className="mb-1.5 block text-sm font-semibold">
              Nome completo
            </label>
            <input
              id="nome"
              name="nome"
              value={formulario.nome}
              onChange={handleChange}
              required
              maxLength={120}
              autoComplete="name"
              placeholder="Digite seu nome completo"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label htmlFor="cpf" className="mb-1.5 block text-sm font-semibold">
              CPF
            </label>
            <input
              id="cpf"
              name="cpf"
              value={formulario.cpf}
              onChange={handleChange}
              required
              autoComplete="off"
              placeholder="000.000.000-00"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formulario.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder="voce@exemplo.com"
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
              autoComplete="tel"
              placeholder="(51) 99999-9999"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label
              htmlFor="areaInteresse"
              className="mb-1.5 block text-sm font-semibold"
            >
              Área de interesse
            </label>
            <select
              id="areaInteresse"
              name="areaInteresse"
              value={formulario.areaInteresse}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
            >
              <option value="">Selecione uma área</option>
              <option value="Tecnologia">Tecnologia</option>
              <option value="Administrativo">Administrativo</option>
              <option value="Marketing">Marketing</option>
              <option value="Vendas">Vendas</option>
              <option value="Design">Design</option>
              <option value="Outro">Outro</option>
            </select>
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
            {carregando ? 'Cadastrando...' : 'Cadastrar candidato'}
          </button>

          <p className="text-center text-sm text-slate-500">
            Representa uma empresa?{' '}
            <Link
              to="/cadastro-empresa"
              className="font-semibold text-emerald-700 hover:underline"
            >
              Cadastre sua empresa
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
