function updateFunc(items, id, newData) {
  const productIndex = items.findIndex((product) => product.id === id);
  if (productIndex === -1) {
    return null;
  }

  items[productIndex] = {
    ...items[productIndex],
    ...newData,
  };

  return items[productIndex];
}

module.exports = { updateFunc };
