require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

function getItemsContainingText(searchTerm) {
  knexInstance
    //.select('product_id', 'name', 'price', 'category')
    .select('*')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result)
    });
};

//getItemsContainingText('burger');

function paginateItems(page) {
  const itemsPerPage = 6;
  const offset = itemsPerPage * (page -1);
  knexInstance
    .select('*')
    .from('shopping_list')
    .limit(itemsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result)
    });
};

//paginateItems(2);

function getItemsAddedAfterDate(daysAgo) {
  knexInstance
    .select('*')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .from('shopping_list')
    .then(result => {
      console.log(result)
    });
};

//getItemsAddedAfterDate(5);

function totalCostEachCategory() {
  knexInstance
    .select('category')
    .count('price AS total')
    .from('shopping_list')
    .groupBy('category')
    .orderBy('total', 'DESC')
    .then(result => {
      console.log(result)
    });
};

totalCostEachCategory();