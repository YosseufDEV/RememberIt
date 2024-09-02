use std::fs::File; use std::io::Error;
use std::path::Path;

use diesel_migrations::{ EmbeddedMigrations, MigrationHarness, embed_migrations };
use diesel::prelude::*;
use dotenvy::dotenv;

const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

pub fn check_if_database_exists(path: &str) -> Result<(), Error> {
    let path = Path::new(path);

    if !path.exists() {
        File::create(path)?;
        create_tables();
    } 
    Ok(())
}

pub fn create_tables() {
    let connection: &mut SqliteConnection = &mut establish_connection();
    connection.run_pending_migrations(MIGRATIONS).unwrap();
}

pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();
    let database_url = "../database/database.db";
    SqliteConnection::establish(database_url)
                        .unwrap_or_else(|_| panic!("Failed to connect to database {}", database_url))
}
