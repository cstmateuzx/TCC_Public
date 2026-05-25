const authRoutes = require('./auth.routes');
const usuariosRoutes = require('./usuarios.routes');
const admsRoutes = require('./adms.routes');
const servicosRoutes = require('./servicos.routes');
const horariosRoutes = require('./horarios.routes');
const agendamentosRoutes = require('./agendamentos.routes');

function registerRoutes(app) {
  app.use(authRoutes);
  app.use(usuariosRoutes);
  app.use(admsRoutes);
  app.use(servicosRoutes);
  app.use(horariosRoutes);
  app.use(agendamentosRoutes);
}

module.exports = { registerRoutes };
