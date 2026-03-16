export const send404Message = async (req, res) => {
  res.status(404).json({ message: `Cannot ${req.method} ${req.path}` });
};
