// Importa os controles de formulário, navegação e sessão.
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

// Apresenta o formulário de entrada para candidatos e empresas.
export default function Login() {
  const [tipo, setTipo] = useState('candidato');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { entrar } = useAuth();
  const navegar = useNavigate();
  const localizacao = useLocation();

  // Envia as credenciais e devolve a pessoa à página que pediu o login.
  const aoEnviar = async (evento) => {
    evento.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      await entrar({ tipo, email, senha });
      navegar(localizacao.state?.from ? `${localizacao.state.from.pathname}${localizacao.state.from.search || ''}` : '/', { replace: true });
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setEnviando(false);
    }
  };

  // Mostra os campos necessários para autenticar uma conta.
  return (
    <div className="min-h-screen bg-[#f7f8f6] text-slate-900">
      {/* Cabeçalho da página com a marca e a navegação para voltar. */}
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/" className="text-xl font-extrabold">
            8jobs<span className="text-emerald-500">.</span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-700 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 hover:text-emerald-800"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
              <path d="M12.5 4.5 7 10l5.5 5.5M7.5 10H17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Voltar ao início
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-md px-5 py-16">
        <h1 className="text-3xl font-bold">Entrar no 8Jobs</h1>
        <p className="mt-2 text-sm text-slate-600">Acesse sua conta para se candidatar ou publicar vagas.</p>
        {/* Perfil selecionável (padrão candidato); e-mail e senha obrigatórios; o formulário valida o e-mail e exige senha mínima de 8 caracteres. */}
        <form onSubmit={aoEnviar} className="mt-7 space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
          <label className="block text-sm font-semibold">Tipo de conta
            <select aria-label="Tipo de conta" value={tipo} onChange={(evento) => setTipo(evento.target.value)} className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-3">
              <option value="candidato">Candidato</option>
              <option value="empresa">Empresa</option>
            </select>
          </label>
          <label className="block text-sm font-semibold">E-mail
            <input aria-label="E-mail" type="email" autoComplete="email" required value={email} onChange={(evento) => setEmail(evento.target.value)} className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-3" />
          </label>
          <label className="block text-sm font-semibold">Senha
            <input aria-label="Senha" type="password" autoComplete="current-password" minLength={8} required value={senha} onChange={(evento) => setSenha(evento.target.value)} className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-3" />
          </label>
          {erro && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{erro}</p>}
          <button type="submit" disabled={enviando} className="w-full rounded-xl bg-emerald-500 px-4 py-3 font-bold text-slate-900 disabled:opacity-60">{enviando ? 'Entrando...' : 'Entrar'}</button>
        </form>
        <p className="mt-5 text-sm text-slate-600">Ainda não tem conta? <Link to={tipo === 'empresa' ? '/cadastro-empresa' : '/cadastro-candidato'} className="font-semibold text-emerald-700">Cadastre-se</Link></p>
      </main>
    </div>
  );
}
