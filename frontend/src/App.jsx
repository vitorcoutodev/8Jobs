// contém a Home, incluindo cabeçalho, busca, cartões de vagas, área para empresas e rodapé. O array jobs contém quatro vagas fictícias.
// Importa dois recursos do React: useState guarda dados que mudam na tela; useMemo memoriza um resultado calculado.
import { useMemo, useState } from 'react'



// Lista de vagas fictícias usada como fonte de dados da tela. Cada objeto representa uma vaga; futuramente, os dados podem vir da API.
const jobs = [

  { id: 1, role: 'Product Designer', company: 'Nubank', place: 'São Paulo, SP', type: 'Remoto', area: 'Design', salary: 'R$ 8.000 – R$ 12.000', color: 'bg-violet-100 text-violet-700', initials: 'Nu', posted: 'há 2 horas', featured: true },

  { id: 2, role: 'Desenvolvedor Front-end Jr.', company: 'Loft', place: 'São Paulo, SP', type: 'Híbrido', area: 'Tecnologia', salary: 'R$ 4.500 – R$ 6.000', color: 'bg-orange-100 text-orange-700', initials: 'L', posted: 'há 5 horas' },

  { id: 3, role: 'Analista de Marketing', company: 'iFood', place: 'Osasco, SP', type: 'Remoto', area: 'Marketing', salary: 'R$ 5.000 – R$ 7.000', color: 'bg-red-100 text-red-700', initials: 'iF', posted: 'ontem', featured: true },

  { id: 4, role: 'Assistente Administrativo', company: 'Localiza', place: 'Belo Horizonte, MG', type: 'Presencial', area: 'Administrativo', salary: 'R$ 2.800 – R$ 3.500', color: 'bg-emerald-100 text-emerald-700', initials: 'Lo', posted: 'ontem' },

]



// Componente reutilizável: ao escrever <Mark />, exibimos a marca 8Jobs sem repetir todo esse JSX.
function Mark() {

  return <a href="#inicio" className="flex items-center gap-2.5 font-extrabold tracking-tight text-slate-900" aria-label="8Jobs, início"><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500 text-lg text-white">8</span><span className="text-xl">jobs<span className="text-emerald-500">.</span></span></a>

}



// Componente de cartão que apresenta uma vaga. O parâmetro { job } recebe, via props, um objeto de vaga enviado por quem usa <JobCard />.
function JobCard({ job }) {

  return (

    <article className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg hover:shadow-slate-200/60 sm:p-6">

      <div className="flex items-start justify-between gap-3">

        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-sm font-bold ${job.color}`}>{job.initials}</div>

        <div className="flex items-center gap-2">

          {/* Só mostra o selo “Destaque” se a propriedade featured for verdadeira. */}
          {job.featured && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">Destaque</span>}

          {/* Botão visual para salvar a vaga; ainda precisa de lógica para realmente guardar a vaga. */}
          <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-emerald-600" aria-label={`Salvar vaga ${job.role}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-3.5L6 21V4.75Z" /></svg></button>

        </div>

      </div>
      
      <div className="mt-5"> 
        {/* Mostra o cargo como link; ainda não leva a lugar nenhum, mas poderia abrir uma página com detalhes da vaga.*/}
        <a href="#detalhes" className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-emerald-700">{job.role}</a>
        {/* Mostra a empresa e a localidade da vaga, separados por um ponto. A classe text-slate-300 deixa o ponto mais discreto.*/} 
        <p className="mt-1 text-sm text-slate-600">{job.company} <span className="px-1 text-slate-300">·</span> {job.place}</p>

      </div>
      {/* Mostra o tipo e a área da vaga como selos arredondados. A classe gap-2 adiciona espaçamento entre eles. A classe flex-wrap permite que os selos quebrem linha se não couberem lado a lado. A classe text-xs deixa a fonte menor, e font-medium dá peso médio à fonte. */}
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
      {/* Mostra o tipo da vaga (Remoto, Híbrido, Presencial) como selo arredondado. A classe bg-slate-100 dá um fundo cinza claro, e px-3 py-1.5 adiciona espaçamento interno horizontal e vertical. */}
        <span className="rounded-full bg-slate-100 px-3 py-1.5">{job.type}</span>
        {/* Mostra a área da vaga (Design, Tecnologia, Marketing, Administrativo) como selo arredondado. A classe bg-slate-100 dá um fundo cinza claro, e px-3 py-1.5 adiciona espaçamento interno horizontal e vertical. */}
        <span className="rounded-full bg-slate-100 px-3 py-1.5">{job.area}</span>

      </div>

      {/* Mostra a faixa salarial e a data de publicação da vaga. */}
      <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4">

        {/* Mostra a faixa salarial da vaga. */}
        <div><p className="text-xs text-slate-500">Faixa salarial</p><p className="mt-1 text-sm font-semibold text-slate-800">{job.salary}</p></div>

        {/* Mostra a data de publicação da vaga. */}
        <span className="text-xs text-slate-400">{job.posted}</span>

      </div>

    </article>

  )

}



// Componente principal: reúne o cabeçalho, a busca, a lista de vagas e o rodapé da página.
export default function App() {

  // Estado da busca por texto. query contém o que foi digitado e setQuery atualiza esse valor.
  const [query, setQuery] = useState('')

  // Segundo estado: location guarda o texto do filtro de localidade ou modalidade, como “São Paulo” ou “Remoto”.
  const [location, setLocation] = useState('')

  // Calcula quais vagas combinam com os filtros. useMemo refaz o cálculo quando query ou location mudam; caso contrário, reutiliza o resultado anterior.
  const filteredJobs = useMemo(() => jobs.filter((job) => {

    // Junta cargo, empresa e área em uma única string e converte tudo para minúsculas. Assim, “DESIGN” e “design” combinam.
    const searchable = `${job.role} ${job.company} ${job.area}`.toLowerCase()

    // A vaga só passa se combinar com AMBOS os filtros: texto (cargo/empresa/área) E local/modalidade.
    // includes("") retorna true, então um campo vazio não restringe a busca.
    return searchable.includes(query.toLowerCase()) && `${job.place} ${job.type}`.toLowerCase().includes(location.toLowerCase())

  }), [query, location])


// JSX que descreve a interface da página. O React converte isso em elementos HTML reais.
  return (// A div raiz da aplicação, com altura mínima de tela, fundo cinza claro e texto escuro. A id="inicio" permite rolar a tela até o topo quando clicamos no link da marca.

    <div id="inicio" className="min-h-screen bg-[#f7f8f6] text-slate-900">
      {/*Cabeçalho fixo no topo da tela, com borda inferior e fundo branco semitransparente. A classe backdrop-blur aplica um efeito de desfoque no que estiver atrás do cabeçalho.*/}  
      <header className="border-b border-slate-200/80 bg-white/90">
        {/* A div centraliza o conteúdo, define largura máxima e adiciona espaçamento interno. A classe flex cria um layout flexível, e justify-between distribui os elementos com espaço entre eles. */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          {/* Renderiza a marca 8Jobs como link para o topo da página. */}
          <Mark />
          {/* Navegação principal, visível apenas em telas médias ou maiores (md:flex). A classe gap-8 adiciona espaçamento entre os links. A classe text-sm define o tamanho da fonte, e font-medium dá peso médio à fonte. A cor do texto é cinza escuro (text-slate-600). */}
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex" aria-label="Navegação principal">
          {/* Links de navegação para encontrar vagas e para empresas. A classe text-emerald-700 aplica a cor verde ao link de vagas, e hover:text-slate-900 muda a cor do link de empresas ao passar o mouse. */}
            <a className="text-emerald-700" href="#vagas">Encontrar vagas</a><a className="hover:text-slate-900" href="#empresas">Para empresas</a>

          </nav>
          {/* Botões de ação: “Entrar” e “Criar conta”. A classe flex cria um layout flexível, e gap-2 adiciona espaçamento entre os botões. Em telas pequenas, o botão “Entrar” fica oculto (hidden) e só aparece em telas médias ou maiores (sm:inline-flex). O botão “Criar conta” tem fundo verde escuro (bg-slate-900) e muda para verde mais claro ao passar o mouse (hover:bg-slate-700). */}
          <div className="flex items-center gap-2 sm:gap-3"><a href="#entrar" className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:inline-flex">Entrar</a><a href="#cadastro" className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">Criar conta</a></div>

        </div>
      
      </header>

       <main>
        {/* Seção de destaque com fundo verde escuro, texto branco e elementos decorativos. A classe relative permite posicionar elementos filhos de forma absoluta dentro desta seção. A classe overflow-hidden esconde qualquer conteúdo que ultrapasse os limites da seção. */}
        <section className="relative overflow-hidden bg-[#102b25] text-white">
          {/* Elemento decorativo: círculo verde claro com desfoque, posicionado fora da tela para criar efeito visual. A classe absolute posiciona o elemento de forma absoluta em relação à seção pai. As classes -right-20 e -top-40 movem o círculo para fora da tela, e h-96 w-96 define altura e largura. A classe rounded-full cria um círculo perfeito, bg-emerald-400/10 aplica cor verde clara com transparência, e blur-3xl adiciona desfoque. */}
          <div className="absolute -right-20 -top-40 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
          {/* Elemento decorativo: círculo verde escuro com desfoque, posicionado fora da tela para criar efeito visual. A classe absolute posiciona o elemento de forma absoluta em relação à seção pai. As classes -left-20 e -bottom-40 movem o círculo para fora da tela, e h-96 w-96 define altura e largura. A classe rounded-full cria um círculo perfeito, bg-emerald-900/10 aplica cor verde escura com transparência, e blur-3xl adiciona desfoque. */}
          <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:py-24">

            <div>
              {/* Selo de destaque com fundo verde escuro, texto verde claro e ícone. A classe inline-flex cria um layout flexível em linha, e items-center alinha verticalmente os itens. A classe gap-2 adiciona espaçamento entre o ícone e o texto. A classe rounded-full cria bordas arredondadas, border aplica uma borda branca com transparência, bg-white/5 aplica fundo branco com transparência, px-3 py-1.5 adiciona espaçamento interno horizontal e vertical, text-xs define tamanho da fonte pequeno, font-medium dá peso médio à fonte, e text-emerald-100 aplica cor verde clara ao texto. */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-emerald-100"><span className="h-2 w-2 rounded-full bg-emerald-400" />Seu próximo passo começa aqui</div>
              {/* Título principal da página com tamanho de fonte grande, peso de fonte negrito e espaçamento entre letras ajustado. A classe max-w-2xl limita a largura máxima do título, text-4xl define tamanho de fonte grande, font-bold aplica peso de fonte negrito, leading-[1.08] ajusta o espaçamento entre linhas, tracking-tight ajusta o espaçamento entre letras, sm:text-5xl aumenta o tamanho da fonte em telas pequenas ou maiores, e lg:text-6xl aumenta ainda mais o tamanho da fonte em telas grandes ou maiores. O texto “tudo.” é destacado com cor verde clara usando a classe text-emerald-400. */}
              <h1 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">O trabalho certo muda <span className="text-emerald-400">tudo.</span></h1>
              {/* Subtítulo com espaçamento superior, largura máxima, tamanho de fonte base, espaçamento entre linhas e cor de texto com transparência. A classe mt-5 adiciona espaçamento superior, max-w-xl limita a largura máxima do subtítulo, text-base define tamanho de fonte base, leading-7 ajusta o espaçamento entre linhas, text-emerald-50/75 aplica cor verde clara com transparência ao texto, e sm:text-lg aumenta o tamanho da fonte em telas pequenas ou maiores. */}
              <p className="mt-5 max-w-xl text-base leading-7 text-emerald-50/75 sm:text-lg">Encontre oportunidades que combinam com você e dê o próximo passo na sua carreira.</p>
              {/* Informações resumidas sobre vagas e empresas, com espaçamento superior, layout flexível, quebra de linha automática, espaçamento entre itens e tamanho de fonte pequeno. A classe mt-8 adiciona espaçamento superior, flex cria um layout flexível, flex-wrap permite que os itens quebrem linha se não couberem lado a lado, gap-6 adiciona espaçamento entre os itens, text-sm define tamanho de fonte pequeno, e text-emerald-50/80 aplica cor verde clara com transparência ao texto. Cada item contém um número em negrito e uma descrição da informação. */}
              <div className="mt-8 flex flex-wrap gap-6 text-sm text-emerald-50/80"><span><strong className="text-white">1.200+</strong> vagas abertas</span><span><strong className="text-white">350+</strong> empresas</span><span><strong className="text-white">Todos os dias</strong> novas oportunidades</span></div>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white p-5 text-slate-900 shadow-2xl shadow-black/20 sm:p-6">

              <p className="text-lg font-bold">Encontre sua próxima oportunidade</p><p className="mt-1 text-sm text-slate-500">Busque por cargo, empresa ou localização.</p>

              {/* Ao enviar a busca, evita recarregar a página e rola suavemente até a lista de vagas. */}
              {/* onSubmit roda quando o formulário é enviado. preventDefault evita o recarregamento padrão do navegador. */}
              {/* Depois, scrollIntoView leva a tela até o elemento que tem id="vagas"; o ? evita erro se ele não existir. */}
              <form className="mt-5 space-y-3" onSubmit={(event) => { event.preventDefault(); document.getElementById('vagas')?.scrollIntoView({ behavior: 'smooth' }) }}>

                {/* Campo controlado pelo React: value mostra query e onChange atualiza o estado quando o usuário digita. */}
                <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">O que você procura?</span><span className="flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 focus-within:border-emerald-500"><svg className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4 4"/></svg><input value={query} onChange={(event) => setQuery(event.target.value)} className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder="Ex.: designer, marketing..." /></span></label>

                {/* Mesmo princípio do campo anterior, mas ligado ao estado location. */}
                <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">Onde?</span><span className="flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 focus-within:border-emerald-500"><svg className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.2"/></svg><input value={location} onChange={(event) => setLocation(event.target.value)} className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder="Cidade, estado ou remoto" /></span></label>

                <button className="w-full rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-[#102b25] transition hover:bg-emerald-400">Buscar vagas</button>

              </form>

            </div>

          </div>

        </section>



        <section id="vagas" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">

          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700">Oportunidades para você</p><h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Vagas em destaque</h2><p className="mt-2 text-sm text-slate-500">Uma seleção de oportunidades para dar o próximo passo.</p></div><a href="#lista-vagas" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">Ver todas as vagas <span aria-hidden="true">→</span></a></div>

          {/* Se filteredJobs tiver itens, map() cria um JobCard por vaga. key={job.id} ajuda o React a identificar cada cartão; job={job} passa os dados ao componente. Se a lista estiver vazia, aparece a mensagem abaixo. */}
          {filteredJobs.length ? <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{filteredJobs.map((job) => <JobCard key={job.id} job={job} />)}</div> : <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center"><p className="font-semibold">Não encontramos vagas com esses filtros.</p><p className="mt-1 text-sm text-slate-500">Tente buscar por outro cargo ou localização.</p></div>}

          {/* Aviso importante: esta tela ainda usa dados de exemplo, não vagas consultadas na API. */}
          <p className="mt-4 text-center text-xs text-slate-400">Vagas ilustrativas enquanto conectamos o catálogo de oportunidades.</p>

        </section>


        {/* Seção para empresas, com fundo verde claro e texto verde escuro. A classe mx-auto centraliza o conteúdo, max-w-7xl define largura máxima, px-5 adiciona espaçamento interno horizontal, pb-14 adiciona espaçamento interno inferior, sm:px-8 aumenta o espaçamento interno horizontal em telas pequenas ou maiores, e sm:pb-16 aumenta o espaçamento interno inferior em telas pequenas ou maiores. */}
        <section id="empresas" className="mx-auto max-w-7xl px-5 pb-14 sm:px-8 sm:pb-16"><div className="flex flex-col items-start justify-between gap-5 rounded-2xl bg-emerald-100 p-7 sm:flex-row sm:items-center sm:p-9"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-emerald-800">Sua empresa está contratando?</p><h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Encontre pessoas incríveis.</h2><p className="mt-2 text-sm text-slate-600">Cadastre sua empresa e publique oportunidades no 8Jobs.</p></div><a id="cadastro" href="#cadastro-empresa" className="shrink-0 rounded-xl bg-[#102b25] px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-900">Conheça o 8Jobs para empresas <span aria-hidden="true">→</span></a></div></section>

      </main>
      {/* Rodapé da página, com borda superior, fundo branco e texto cinza escuro. A classe mx-auto centraliza o conteúdo, max-w-7xl define largura máxima, flex cria um layout flexível, flex-col organiza os itens em coluna, gap-3 adiciona espaçamento entre os itens, px-5 adiciona espaçamento interno horizontal, py-6 adiciona espaçamento interno vertical, text-xs define tamanho de fonte pequeno, text-slate-500 aplica cor cinza escuro ao texto, sm:flex-row organiza os itens em linha em telas pequenas ou maiores, sm:items-center alinha verticalmente os itens em telas pequenas ou maiores, sm:justify-between distribui os itens com espaço entre eles em telas pequenas ou maiores, e sm:px-8 aumenta o espaçamento interno horizontal em telas pequenas ou maiores. */}
      <footer className="border-t border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8"><Mark /><p>© 2026 8Jobs. Conectando talentos a oportunidades.</p><a href="#candidato" className="font-medium hover:text-emerald-700">Sou candidato</a></div></footer>

    </div>

  )

}