// Importa a navegação e o contexto de autenticação.
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

// Protege uma página e pode restringir o acesso a um tipo de conta.
export default function RequireAuth({ children, role }) {
  const { usuario, carregandoSessao } = useAuth();
  const localizacao = useLocation();

  // Aguarda a verificação da sessão antes de decidir para onde navegar.
  if (carregandoSessao) return <p className="p-8 text-center">Verificando seu acesso...</p>;

  // Guarda a página desejada para retornar a ela depois do login.
  if (!usuario) return <Navigate to="/login" replace state={{ from: localizacao }} />;

  // Impede que um tipo de conta abra páginas reservadas a outro tipo.
  if (role && usuario.role !== role) return <Navigate to="/" replace />;

  // Renderiza o conteúdo quando a sessão tem a permissão necessária.
  return children;
}
