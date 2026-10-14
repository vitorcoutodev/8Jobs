import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  return (
    // Cartão que apresenta uma vaga individual.
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg hover:shadow-slate-200/60 sm:p-6">
      {/* Linha superior: identificação da empresa e selo de destaque. */}
      <div className="flex items-start justify-between gap-3">
        {/* Iniciais da empresa dentro de um quadrado colorido. */}
        <div
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-sm font-bold ${
            job.color || 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {job.initials || '8J'}
        </div>

        {/* O selo aparece somente quando a vaga está marcada como destaque. */}
        {job.featured && (
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
            Destaque
          </span>
        )}
      </div>

      {/* Apresenta o título, a empresa e a localização. */}
      <div className="mt-5">
        {/* Abre a página de detalhes da vaga selecionada. */}
        <Link
          to={`/vagas/${job.id}`}
          className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-emerald-700"
        >
          {job.role}
        </Link>

        {/* Exibe a empresa e a cidade da oportunidade. */}
        <p className="mt-1 text-sm text-slate-600">
          {job.company}
          <span className="px-1 text-slate-300">·</span>
          {job.place}
        </p>
      </div>

      {/* Selos que mostram a modalidade e a área da vaga. */}
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
        <span className="rounded-full bg-slate-100 px-3 py-1.5">
          {job.type}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1.5">
          {job.area}
        </span>
      </div>

      {/* Área inferior com salário e data de publicação. */}
      <div className="mt-5 flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
        <div>
          <p className="text-xs text-slate-500">Faixa salarial</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            {job.salary || 'A combinar'}
          </p>
        </div>

        <span className="text-xs text-slate-400">{job.posted}</span>
      </div>

      {/* Botão para abrir os detalhes da vaga. */}
      <Link
        to={`/vagas/${job.id}`}
        className="mt-5 flex w-full items-center justify-center rounded-xl border border-emerald-200 px-4 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
      >
        Ver detalhes
      </Link>
    </article>
  );
}
