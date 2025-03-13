export function adminMiddleware(req, res, next) {
  if (req.user.role !== 'admin' && req.user.role !== 'teamLeader') {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  next();
}