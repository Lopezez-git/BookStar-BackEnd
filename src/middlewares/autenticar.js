import { verificarToken } from '../services/jwt.js';

/**
 * Middleware de autenticação
 * Verifica se o usuário enviou um token JWT válido
 * Se válido, adiciona os dados do usuário em req.usuario
 * Se inválido, bloqueia a requisição com erro 401
 * 
 * Como usar:
 * endPoints.get('/rota-protegida', autenticar, async (req, resp) => {
 *   // req.usuario estará disponível aqui
 * });
 */
export default function autenticar(req, resp, next) {
  try {
    // 1. Pega o header "Authorization" da requisição
    // Exemplo: "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    const authHeader = req.headers['authorization'];
    
    // 2. Verifica se o header foi enviado
    if (!authHeader) {
      return resp.status(401).send({ erro: "Token não fornecido" });
    }

    // 3. Remove a palavra "Bearer " e fica só com o token
    // "Bearer eyJhbGci..." → "eyJhbGci..."
    const token = authHeader.replace('Bearer ', '');

    // 4. Verifica se o token é válido usando a função do service
    // - Decodifica o token usando a SECRET_KEY
    // - Verifica se não expirou
    // - Se inválido ou expirado, lança um erro (vai pro catch)
    const decoded = verificarToken(token);
    // decoded = { id: 5, email: "joao@email.com", iat: 1234567890, exp: 1234654290 }
    
    // 5. ADICIONA os dados do usuário no objeto req
    // Agora todas as rotas que vêm depois podem acessar req.usuario
    req.usuario = decoded;
    
    // 6. Libera para a próxima função (sua rota)
    // É como dizer: "ok, pode passar!"
    next();

  } catch (err) {
    // Se der qualquer erro (token inválido, expirado, adulterado, etc)
    // Bloqueia a requisição e retorna erro 401 (Não autorizado)
    return resp.status(401).send({ 
      erro: "Token inválido ou expirado",
      detalhes: err.message 
    });
  }
}