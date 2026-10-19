let contador = 0;

export const unico = () => `${Date.now().toString(36)}${(contador++).toString(36)}`;

export const novoCandidato = (extra = {}) => ({
  nome: 'Maria Souza',
  email: `maria.${unico()}@teste.com`,
  telefone: '(51) 99999-0000',
  cidade: 'São Leopoldo',
  habilidades: 'React, Node.js',
  ...extra,
});
