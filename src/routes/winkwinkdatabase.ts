import { Reason, type QuestionsCollection } from "./types"

let DATABASE = [ ]

function updateDatabase(newDatabase: QuestionsCollection[]) {
    DATABASE = newDatabase;
}

export { DATABASE, updateDatabase };

