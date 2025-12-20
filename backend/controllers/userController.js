export const getAllUsers = (req, res) => {
  res.json({ message: "User listing endpoint" });
};

export const createUser = (req, res) => {
  const { userId, name, email } = req.body;
  res.json({ success: true, message: "User created successfully" });
};
