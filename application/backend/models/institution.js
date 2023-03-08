const db = require('../config/database').pool;

const getByDomain = async function(domain) {
  // Construct sql query to find institutions by keyword
  const sql = `
    SELECT *
    FROM institution
    WHERE domain = ?
  `;
  // Construct data to be passed to sql query
  const data = [domain];

  // Query database and return instiutions
  const [institutions, fields] = await db.query(sql, data);
  return (institutions.length > 0 ? institutions[0] : null);
};


module.exports = {
  getByDomain,
}