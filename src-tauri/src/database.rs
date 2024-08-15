use diesel::prelude::*;
use dotenvy::dotenv;
use std::env;
use crate::models::*;


pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL is not set");
    SqliteConnection::establish(&database_url)
                        .unwrap_or_else(|_| panic!("Failed to connect to database {}", database_url))
}
