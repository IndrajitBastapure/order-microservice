module.exports = function(sequelize, DataTypes) {
	var Order = sequelize.define('order', {
    id: {
	type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
	type: DataTypes.BIGINT,
	field: 'user_id'
  },
  productId: {
	type: DataTypes.BIGINT,
	field: 'product_id'
  },
  unitPrice: {
	type: DataTypes.FLOAT,
	field: 'unit_price'
  },
  quantity: {
	type: DataTypes.BIGINT,
	field: 'quantity'
  },
  orderTotal: {
	type: DataTypes.FLOAT,
	field: 'order_total'
  }
  },{
	timestamps: false,
	tableName: 'order',
    instanceMethods: {
	
      retrieveAll: function(onSuccess, onError) {
		Order.findAll({raw: true})
			.then(onSuccess).error(onError);	
	  },
      retrieveById: function(order_id, onSuccess, onError) {
		Order.find({where: {id: order_id}}, {raw: true})
			.then(onSuccess).error(onError);	
	  },
      add: function(onSuccess, onError) {
		var userId = this.userId;
		var productId = this.productId;
		var	unitPrice = this.unitPrice;
		var	quantity = this.quantity;
		var	orderTotal = unitPrice * quantity;
			
		Order.build({ userId: userId,
			productId: productId,
			unitPrice: unitPrice,
			quantity: quantity,
			orderTotal: orderTotal })
			.save().then(onSuccess).error(onError);
	   },
	  updateById: function(order_id, onSuccess, onError) {
		var unitPrice = this.unitPrice;
		var quantity = this.quantity;
		var orderTotal = unitPrice * quantity;
		Order.update({unitPrice : unitPrice, quantity : quantity, orderTotal : orderTotal}, {where: {id: order_id}})
			.then(onSuccess).error(onError);
	   },
      removeById: function(order_id, onSuccess, onError) {	    
		Order.destroy({ where :{id: order_id}}).then(onSuccess).error(onError);
	  }
    }
  });
	return Order;
}