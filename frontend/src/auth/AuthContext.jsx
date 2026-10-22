// Importa as ferramentas do React para manter a sessão compartilhada na interface.
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { requisitarApi, enviarJson } from '../services/api.js';

// Cria o contexto que disponibiliza o usuário atual para as páginas.
const AuthContext = createContext(null);

// Busca e atualiza a sessão atual do navegador.
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);

  // Verifica no servidor se existe uma sessão válida ao abrir ou recarregar o site.
  useEffect(() => {
    requisitarApi('/auth/me')
      .then((dados) => setUsuario(dados.usuario))
      .catch(() => setUsuario(null))
      .finally(() => setCarregandoSessao(false));
  }, []);

  // Cria uma sessão no servidor e atualiza a interface com a conta autenticada.
  const entrar = async (credenciais) => {
    const dados = await enviarJson('/auth/login', 'POST', credenciais);
    setUsuario(dados.usuario);
    return dados.usuario;
  };

  // Encerra a sessão no servidor e limpa o usuário da interface.
  const sair = async () => {
    await enviarJson('/auth/logout', 'POST', {});
    setUsuario(null);
  };

  // Mantém estável o objeto entregue às páginas que usam o contexto.
  const valor = useMemo(() => ({ usuario, carregandoSessao, entrar, sair }), [usuario, carregandoSessao]);

  // Disponibiliza as informações de sessão para os componentes filhos.
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

// Retorna as funções de sessão para uma página React.
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth precisa ser usado dentro de AuthProvider');
  return contexto;
}
