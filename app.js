const express = require("express");
const app = express();

const fs = require("fs");

const body_parser = require("body-parser");
app.use(body_parser.json());

const { updateFunc } = require("./helper");
const PORT = 3002;

// create products
app.post("/products", (req, res) => {
  try {
    const { id, name, description, price } = req.body;
    if (
      !id?.trim() ||
      !name?.trim() ||
      !description?.trim() ||
      !price?.trim()
    ) {
      return res.status(400).send("doesnt exist");
    }

    let current_product = {
      id,
      name,
      description,
      price,
    };

    const products_data = fs.readFileSync("products.json");
    const products = JSON.parse(products_data);
    products.push(current_product);

    fs.writeFileSync("products.json", JSON.stringify(products));

    res.send(current_product);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// get products
app.get("/products", (req, res) => {
  try {
    const products_data = fs.readFileSync("products.json");
    const products = JSON.parse(products_data);

    res.send(products);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// get only one product
app.get("/products/:id", (req, res) => {
  try {
    const id = req.params.id;
    const products_data = fs.readFileSync("products.json");
    const products = JSON.parse(products_data);

    const currentProduct = products.find((product) => product.id == id);

    if (!currentProduct) {
      return res.status(404).send("Product not found");
    }
    res.send(currentProduct);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// update product
app.put("/products/:id", (req, res) => {
  try {
    const { name, description, price } = req.body;
    const id = req.params.id;
    const products_data = fs.readFileSync("products.json");
    const products = JSON.parse(products_data);

    const updatedProduct = updateFunc(products, id, {
      name,
      description,
      price,
    });

    if (!updatedProduct) {
      return res.status(404).send("Product not found");
    }

    fs.writeFileSync("products.json", JSON.stringify(products));

    res.send(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// delete product
app.delete("/products/:id", (req, res) => {
  try {
    const id = req.params.id;
    const products_data = fs.readFileSync("products.json");
    const products = JSON.parse(products_data);
    const productToDelete = products.find((product) => product.id == id);

    if (!productToDelete) {
      return res.status(404).send("Product not found");
    }
    const updatedProducts = products.filter((product) => product.id != id);
    fs.writeFileSync("products.json", JSON.stringify(updatedProducts));

    res.send(productToDelete);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// create order
app.post("/orders", (req, res) => {
  try {
    const { userId, id, name, description, price } = req.body;
    if (
      !id?.trim() ||
      !name?.trim() ||
      !description?.trim() ||
      !price?.trim()
    ) {
      return res.status(400).send("doesnt exist");
    }

    let current_order = {
      userId,
      id,
      name,
      description,
      price,
    };

    const orders_data = fs.readFileSync("orders.json");
    const orders = JSON.parse(orders_data);
    orders.push(current_order);

    fs.writeFileSync("orders.json", JSON.stringify(orders));

    res.send(current_order);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// get orders
app.get("/orders", (req, res) => {
  try {
    const orders_data = fs.readFileSync("orders.json");
    const orders = JSON.parse(orders_data);

    res.send(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// get only one order
app.get("/orders/:id", (req, res) => {
  try {
    const id = req.params.id;
    const orders_data = fs.readFileSync("orders.json");
    const orders = JSON.parse(orders_data);

    const currentOrder = orders.find((order) => order.id == id);

    if (!currentOrder) {
      return res.status(404).send("Order not found");
    }
    res.send(currentOrder);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// update order
app.put("/orders/:id", (req, res) => {
  try {
    const { name, description, price } = req.body;
    const id = req.params.id;
    const orders_data = fs.readFileSync("orders.json");
    const orders = JSON.parse(orders_data);

    const updatedOrder = updateFunc(orders, id, {
      name,
      description,
      price,
    });

    if (!updatedOrder) {
      return res.status(404).send("Product not found");
    }

    fs.writeFileSync("orders.json", JSON.stringify(orders));

    res.send(updatedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// delete order
app.delete("/orders/:id", (req, res) => {
  try {
    const id = req.params.id;
    const orders_data = fs.readFileSync("orders.json");
    const orders = JSON.parse(orders_data);
    const orderToDelete = orders.filter((order) => order.id == id);

    if (!orderToDelete) {
      return res.status(404).send("Product not found");
    }
    const updatedOrders = orders.filter((product) => product.id != id);
    fs.writeFileSync("orders.json", JSON.stringify(updatedOrders));

    res.send(orderToDelete);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/orders/:id/items", (req, res) => {
  try {
    const id = req.params.id;
    const { count, total } = req.body;
    const order_data = fs.readFileSync("orders.json");
    const orders = JSON.parse(order_data);
    const currentOrderInd = orders.findIndex((order) => order.id == id);

    if (currentOrderInd === -1) {
      return res.status(404).send("Order not found");
    }

    const exist = orders[currentOrderInd] || {};

    const currentOrder = { ...exist, items: { count, total } };
    const updatedOrder = updateFunc(orders, id, currentOrder);

    fs.writeFileSync("orders.json", JSON.stringify(orders));

    res.send(updatedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/orders/:id/items", (req, res) => {
  try {
    const id = req.params.id;
    const order_data = fs.readFileSync("orders.json");
    const orders = JSON.parse(order_data);
    const currentOrder = orders.find((order) => order.id == id);

    if (!currentOrder) {
      return res.status(404).send("order not found");
    }

    res.send(currentOrder);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post('/orders/:id/status', (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const order_data = fs.readFileSync("orders.json");
    const orders = JSON.parse(order_data);
    const currentOrderInd = orders.findIndex((order) => order.id == id);

    if (currentOrderInd === -1) {
      return res.status(404).send("Order not found");
    }

    const exist = orders[currentOrderInd] || {};
    const currentOrder = { ...exist, status };

    const updatedOrder = updateFunc(orders, id, currentOrder);

    fs.writeFileSync("orders.json", JSON.stringify(orders));

    res.send(updatedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.put('/orders/:id/status', (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const order_data = fs.readFileSync("orders.json");
    const orders = JSON.parse(order_data);
    const currentOrderInd = orders.find((order) => order.id == id);

    if (currentOrderInd == -1) {
      return res.status(404).send("Order not found");
    }

    const updatedOrder = updateFunc(orders, id, {status});

    fs.writeFileSync("orders.json", JSON.stringify(orders));

    res.send(updatedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/users/:userId/orders', (req, res) => {
  try {
    const userId = req.params.userId;
    const order_data = fs.readFileSync("orders.json");
    const orders = JSON.parse(order_data);

    const userOrders = orders.filter(order => order.userId == userId);
    res.send(userOrders);

  } catch(err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT);