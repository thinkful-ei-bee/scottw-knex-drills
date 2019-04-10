const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`Shopping List Service Object`, function() {
  let db
  let testProducts = [
    {
      product_id: 1,
      name: 'Milk',
      price: "1.11",
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      checked: true,
      category: 'Breakfast'
    },
    {
      product_id: 2,
      name: 'Cheese',
      price: "2.22",
      date_added: new Date('2100-05-22T16:28:32.615Z'),
      checked: false,
      category: 'Lunch'
    },
    {
      product_id: 3,
      name: 'Bread',
      price: "3.33",
      date_added: new Date('1919-12-22T16:28:32.615Z'),
      checked: true,
      category: 'Main'
    },
  ]

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
  })

  before(() => db('shopping_list').truncate())

  afterEach(() => db('shopping_list').truncate())

  after(() => db.destroy())

  context(`Given 'shopping_list' has data`, () => {
    beforeEach(() => {
      return db
        .into('shopping_list')
        .insert(testProducts)
    })
    it(`getAllProducts() resolves all products from 'shopping_list' table`, () => {
      //test that ShoppingListService.getAllProducts gets datafrom table
      return ShoppingListService.getAllProducts(db)
        .then(actual => {
          expect(actual).to.eql(testProducts)
        })
    })
    it(`getById() resolves a product by id from 'shopping_list' table`, () => {
      const thirdId = 3
      const thirdTestProduct = testProducts[thirdId - 1]
      return ShoppingListService.getById(db, thirdId)
        .then(actual => {
          expect(actual).to.eql({
            product_id: thirdId,
            name: thirdTestProduct.name,
            price: thirdTestProduct.price,
            date_added: thirdTestProduct.date_added,
            checked: thirdTestProduct.checked,
            category: thirdTestProduct.category,
          })
        })
    })
    it(`deleteProduct() removes a product by id from 'shopping_list' table`, () => {
      const productId = 3
      return ShoppingListService.deleteProduct(db, productId)
        .then(() => ShoppingListService.getAllProducts(db))
        .then(allProducts => {
          // copy the test products array without the "deleted" product
          const expected = testProducts.filter(product => product.product_id !== productId)
          expect(allProducts).to.eql(expected)
        })
    })
    it(`updateProduct() updates a product from the 'shopping_list' table`, () => {
      const idOfProductToUpdate = 3
      const newProductData = {
        name: 'updated name',
        price: "9.99",
        date_added: new Date(),
        checked: false,
        category: 'Snack',
      }
      return ShoppingListService.updateProduct(db, idOfProductToUpdate, newProductData)
        .then(() => ShoppingListService.getById(db, idOfProductToUpdate))
        .then(product => {
          expect(product).to.eql({
            product_id: idOfProductToUpdate,
            ...newProductData,
          })
        })
    })
  })

  context(`Given 'shopping_list' has no data`, () => {
    it(`getAllProducts() resolves an empty array`, () => {
      return ShoppingListService.getAllProducts(db)
        .then(actual => {
          expect(actual).to.eql([])
        })
    })

    it(`insertProduct() inserts a new product and resolves the new product with a 'product_id'`, () => {
      const newProduct = {
        name: 'Test new name',
        price: "9.99",
        date_added: new Date('2020-01-01T00:00:00.000Z'),
        checked: true,
        category: 'Snack',
      }
      return ShoppingListService.insertProduct(db, newProduct)
        .then(actual => {
          expect(actual).to.eql({
            product_id: 1,
            name: newProduct.name,
            price: newProduct.price,
            date_added: newProduct.date_added,
            checked: newProduct.checked,
            category: newProduct.category,
          })
        })
    })
  })
})