let contador = 0;

export const unico = () => `${Date.now().toString(36)}${(contador++).toString(36)}`;

export const novoCandidato = (extra = {}) => ({
  nome: 'Maria Souza',
  // Gera um CPF fictício com 11 dígitos para preencher o formulário de teste.
  cpf: String(contador).padStart(11, '0'),
  email: `maria.${unico()}@teste.com`,
  senha: 'SenhaTeste2026!',
  telefone: '(51) 99999-0000',
  cidade: 'São Leopoldo',
  habilidades: 'React, Node.js',
  ...extra,
});
