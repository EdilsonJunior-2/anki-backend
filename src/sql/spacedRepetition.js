const nextReviewCalc = (previousInterval, meter, rating, repetitions) =>
  Math.round(
    100 *
      ((1 + previousInterval) *
        (1 + Math.exp(-(rating * repetitions) + meter)) -
        1)
  ) / 100;

const login = (studentCode) =>
  `SELECT * FROM student s WHERE s.code = '${studentCode}'`;
const allStudents = `SELECT * FROM student;`;
const allChapters = `SELECT * FROM chapter;`;
const allDecks = `SELECT * FROM deck;`;
const allCards = `SELECT * FROM card;`;

const createStudentTable = `CREATE TABLE student (Id SERIAL PRIMARY KEY, name VARCHAR(100), code VARCHAR(12) SECONDARY KEY);`;
const createChapterTable = `CREATE TABLE chapter (Id SERIAL PRIMARY KEY, name VARCHAR(100));`;
const createDeckTable = `CREATE TABLE deck (Id SERIAL PRIMARY KEY, name VARCHAR(100), image VARCHAR(20), chapter INT, FOREIGN KEY (chapter) REFERENCES chapter(Id));`;
const createCardTable = `CREATE TABLE card (Id SERIAL PRIMARY KEY, question TEXT, answer TEXT, requiresImage BOOLEAN, deck INT, FOREIGN KEY (deck) REFERENCES deck(Id));`;
const createStudentCardHistoryTable = `CREATE TABLE student_card_history (Id SERIAL PRIMARY KEY, )`;
const createChapter = (name) => `INSERT INTO chapter (name) VALUES ('${name}')`;
const createDeck = (name, chapter, image) =>
  `INSERT INTO deck (name, chapter, image) VALUES ('${name}', ${chapter}, '${image}')`;
const createCards = (deck, cards) => `
INSERT INTO card (deck, question, answer, requiresImage) VALUES ${cards
  .map((card) => {
    return `(${deck}, '${card.question}', '${card.answer}', ${card.requiresImage})`;
  })
  .join(", ")};
`;
const allStudentCardsHistory = (student) =>
  `SELECT * FROM student_card_history sch WHERE sch.student = '${student}`;
const createStudentCardHistory = (
  cards,
  student
) => `INSERT INTO student_card_history (student, card, record) VALUES
       ${cards
         .map((card) => {
           return `('${student}', ${card.id},' ${JSON.stringify([
             {
               interval: 0,
               difficulty_rating: 0,
               rating_date: Date.now(),
               next_study_date: Date.now(),
             },
           ])}')`;
         })
         .join(", ")};`;
const cardsToStudy = (studentCode, deckId) =>
  `SELECT sch.id AS id,
c.id AS card,
sch.record AS record,
d.category AS category
FROM student_card_history sch
JOIN card c ON sch.card = c.id
JOIN student s ON sch.student = s.code
JOIN deck d ON c.deck = d.id
WHERE s.code = '${studentCode}' 
AND c.deck = ${deckId};`;

const updateRecord = (record, schId) =>
  `UPDATE student_card_history SET record = '${JSON.stringify(
    record
  )}' WHERE id = ${schId};`;

const cardHistory = (schId) =>
  `SELECT * FROM student_card_history sch WHERE sch.id = ${schId}`;
const student = (studentCode) =>
  `SELECT * FROM student s WHERE s.code = '${studentCode}'`;

const allCardsByStudent = (studentCode) =>
  `SELECT sch.id AS id, c.deck as deck, sch.card as card, sch.record as record 
FROM student_card_history sch 
JOIN card c ON c.id = sch.card 
WHERE sch.student = '${studentCode}' 
ORDER BY c.deck;`;

const getters = {
  allStudents,
  allChapters,
  allDecks,
  allCards,
  allStudentCardsHistory,
  cardHistory,
  student,
  allCardsByStudent,
  cardsToStudy,
};

const setters = {
  updateRecord,
};

const mutations = {
  createStudentTable,
  createChapterTable,
  createDeckTable,
  createCardTable,
  createStudentCardHistoryTable,
  createStudentCardHistory,
  createChapter,
  createDeck,
  createCards,
};

const reqs = {
  getters,
  setters,
  mutations,
  login,
};

module.exports = reqs;
