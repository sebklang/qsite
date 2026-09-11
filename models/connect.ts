import { Client } from 'pg'

export async function connect() {
    return new Client({database: 'qsite'}).connect()
}
