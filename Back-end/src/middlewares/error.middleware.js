function notFoundHandler(req, res, next) {
    res.status(404).json({ error: "Ruta no encontrada" });
}

function errorHandler(err, req, res, next) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
}

module.exports = { notFoundHandler, errorHandler };