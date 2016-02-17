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
		console.log('----------DAO-retrieve--'+order_id);
		Order.find({where: {id: order_id}}, {raw: true})
			.then(onSuccess).error(onError);	
	  },
      add: function(onSuccess, onError) {
		var userId = this.userId;
		var productId = this.productId;
		var	unitPrice = this.unitPrice;
		var	quantity = this.quantity;
		var	orderTotal = this.orderTotal;
			
		Order.build({ userId: userId,
			productId: productId,
			unitPrice: unitPrice,
			quantity: quantity,
			orderTotal: orderTotal })
			.save().then(onSuccess).error(onError);
	   },
	  updateById: function(order_id, onSuccess, onError) {
		var userId = this.userId;
		var unitPrice = this.unitPrice;
		var orderTotal = this.orderTotal;
		console.log('----------DAO-update-order_id-'+order_id);
		console.log('----------DAO-update-orderTotal-'+orderTotal);
		console.log('----------DAO-update-userId-'+userId);
		console.log('----------DAO-update-unitPrice-'+unitPrice);
		Order.update({id : order_id, user_id : userId, unitPrice : unitPrice, orderTotal : orderTotal}, { where :{id : order_id}})
			.then(onSuccess).error(onError);
	   },
      removeById: function(order_id, onSuccess, onError) {
	    console.log('----------DAO-destroy-order_id-'+order_id);
		Order.destroy({ where :{id: order_id}}).then(onSuccess).error(onError);
	  }
    }
  });
	return Order;
}