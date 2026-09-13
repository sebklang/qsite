import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'

const db = await open({
        filename: 'db/qsite.db',
        driver: sqlite3.Database
})

export default db
