const ShoppingListService = {
  getAllProducts(knex) {
    return knex 
      .select('*')
      .from('shopping_list')
  },
  insertProduct(knex, newProduct) {
    return knex
      .insert(newProduct)
      .into('shopping_list')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, product_id) {
    return knex
      .from('shopping_list')
      .select('*')
      .where({ product_id })
      .first()
  },
  deleteProduct(knex, product_id) {
    return knex
      .from('shopping_list')
      .where({ product_id} )
      .delete()
  },
  updateProduct(knex, product_id, newProductFields) {
    return knex
      .from('shopping_list')
      .where({ product_id} )
      .update(newProductFields)
  },
}
module.exports = ShoppingListService