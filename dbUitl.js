

async function checkIfListingExists(db, username, url) {
    return new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) AS count FROM listings WHERE username = ? AND url = ?', [username, url], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row.count > 0);
            }
        });
    });
}

async function insertListing(db, username, url) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO listings (username, url) VALUES (?, ?)', [username, url], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

module.exports = {checkIfListingExists, insertListing};