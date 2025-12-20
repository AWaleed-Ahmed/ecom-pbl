let carts = {};

export const getCart = (req, res) => {
  const userId = req.params.userId;
  const cart = carts[userId] || { items: [], total: 0 };
  res.json(cart);
};

export const addToCart = (req, res) => {
  const userId = req.params.userId;
  const { productId, quantity } = req.body;

  if (!carts[userId]) {
    carts[userId] = { items: [], total: 0 };
  }

  const existingItem = carts[userId].items.find(
    (item) => item.productId === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    carts[userId].items.push({ productId, quantity });
  }

  res.json({ success: true, cart: carts[userId] });
};

export const removeFromCart = (req, res) => {
  const userId = req.params.userId;
  const productId = parseInt(req.params.productId);

  if (carts[userId]) {
    carts[userId].items = carts[userId].items.filter(
      (item) => item.productId !== productId
    );
  }

  res.json({ success: true, cart: carts[userId] });
};
