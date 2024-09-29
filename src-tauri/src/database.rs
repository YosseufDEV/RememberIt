use std::fs::File;
use std::io::Error;
use std::path::Path;

use dotenvy::dotenv;
use std::env;

use diesel::prelude::*;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};

const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

#[tauri::command]
pub fn is_dev_build() -> bool {
    dotenv().ok();
    let is_build = env::var("BUILD_TYPE");

    match is_build {
        Ok(r) => {
            r.eq("dev")
        },
        Err(_) => false,
    }

}

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
    let mut database_url = "./database.db";

    if is_dev_build() {
        database_url = "../database/database.db" 
    }

    SqliteConnection::establish(database_url)
        .unwrap_or_else(|_| panic!("Failed to connect to database {}", database_url))
}
