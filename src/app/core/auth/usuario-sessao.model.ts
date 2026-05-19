import { Permissao } from './permissao.enum';

export interface UsuarioSessao {
  id: string;
  nome: string;
  email: string;
  perfil: 'ADMINISTRADOR' | 'OPERADOR';
  permissoes: Permissao[];
}
