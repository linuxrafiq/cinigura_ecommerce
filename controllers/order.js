const { Order, CartItem } = require("../models/order");
const { errorHandler } = require("../helpers/dbErrorHandler");
exports.orderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((error, order) => {
      if (error || !order) {
        return res.status(400).json({
          error: errorHandler(error),
        });
      }

      req.order = order;
    });   
    next();
};
exports.create = (req, res) => {
  //  console.log('create order', JSON.parse(req.body.order.products))
   console.log('create order user', req.profile)
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  console.log("order ppp", order);
  order.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error: errorHandler(error),
      });
    }

    res.json(data);
  });
};

exports.listOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name address")
    .sort("-created")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(error),
        });
      }

      res.json(orders);
    });
};

exports.getStatusValues = (req, res) => {
  console.log("eeeee", Order.schema.path("status").enumValues);
  res.json(Order.schema.path("status").enumValues);
};

exports.updateOrderStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (error, order)=>{
        if (error){
            return res.status(400).json({
                error: errorHandler(error)
            })
        }
        res.json(order);
    }
  );
};
