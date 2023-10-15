const handleError = (app) => {
  app.use((req, res, next) => {
    console.log("URL original", req.originalUrl);
    res.status(404).json({ msg: "Not Found", url: req.originalUrl });
  });

  app.use((error, req, res, next) => {
    res.status(error.status || 500).json({ msg: error.message || error });
  });
};

export default handleError;
