// Lista de vagas fictícias. Depois, estes dados virão da API.
const vagas = [
  { id: 1, titulo: 'Desenvolvedor Node.js', empresa: 'Acme Tecnologia', cidade: 'Porto Alegre', modalidade: 'Híbrido', salario: 'R$ 4.500', status: 'ABERTA' },
  { id: 2, titulo: 'Designer de Produto', empresa: 'Studio Pixel', cidade: 'São Leopoldo', modalidade: 'Remoto', salario: 'R$ 5.200', status: 'ABERTA' },
  { id: 3, titulo: 'Assistente Administrativo', empresa: 'Loja Central', cidade: 'Novo Hamburgo', modalidade: 'Presencial', salario: 'R$ 2.800', status: 'FECHADA' },
]

// Cartão de UMA vaga. Recebe a vaga por props e mostra os dados dela.
function VagaCard({ vaga }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-300 hover:shadow-lg">

      {/* Título da vaga */}
      <h2 className="text-lg font-bold text-slate-900">{vaga.titulo}</h2>

      {/* Empresa e cidade */}
      <p className="mt-1 text-sm text-slate-600">{vaga.empresa} · {vaga.cidade}</p>

      {/* Selos: modalidade e status */}
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-600">{vaga.modalidade}</span>

        {/* Verde se estiver aberta, cinza se estiver fechada */}
        <span className={`rounded-full px-3 py-1.5 ${vaga.status === 'ABERTA' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
          {vaga.status}
        </span>
      </div>

      {/* Salário */}
      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-500">Salário</p>
        <p className="mt-1 text-sm font-semibold text-slate-800">{vaga.salario}</p>
      </div>
    </article>
  )
}

// Página: título e a grade com os cartões.
export default function listarVagas() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Vagas disponíveis</h1>

      {/* Grade: 1 coluna no celular, 2 no tablet, 3 no computador */}
      <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vagas.map((vaga) => (
          // key ajuda o React a identificar cada cartão
          <VagaCard key={vaga.id} vaga={vaga} />
        ))}
      </section>
    </main>
  )
}