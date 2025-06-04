const nextReviewCalc = (previousInterval, meter, rating, repetitions) =>
  Math.round(
    100 *
      ((1 + previousInterval) *
        (1 + Math.exp(-(rating * repetitions) + meter)) -
        1)
  ) / 100;

const student = {
  createTable: (key) =>
    `CREATE TABLE ${key}_students (id SERIAL PRIMARY KEY, name VARCHAR(100), code TEXT, admin BOOLEAN, study_timestamp BIGINT, UNIQUE (code));`,
  get: (key) => `SELECT * FROM ${key}_students;`,
  getByCode: (key, studentCode) =>
    `SELECT * FROM ${key}_students s WHERE code = '${studentCode}'`,
  insertMultiple: (key, students) =>
    `INSERT INTO ${key}_students (name, code, admin) VALUES
  ${students
    .map((student) => {
      return `('${student.name}','${student.code}', ${
        student.admin ? "TRUE" : "FALSE"
      })`;
    })
    .join(", ")};`,
  clear: (key, studentCode) =>
    `DELETE FROM ${key}_students s WHERE s.code = '${studentCode}';`,
  clearTable: (key) => `DELETE FROM ${key}_students;`,
  dropTable: (key) => `DROP TABLE ${key}_students;`,
  updateTimestamp: (key, timestamp, studentCode) =>
    `UPDATE ${key}_students SET s.study_timestamp = ${timestamp} WHERE code = ${studentCode}`,
};

const chapter = {
  createTable: (key) =>
    `CREATE TABLE ${key}_chapters (id SERIAL PRIMARY KEY, name TEXT);`,
  get: (key, rules) =>
    `SELECT * FROM ${key}_chapters${
      rules ? ` WHERE ${rules.join("AND ")}` : ""
    };`,
  getCount: (key) => `SELECT COUNT(*) FROM ${key}_chapters`,
  insert: (key, name) =>
    `INSERT INTO ${key}_chapters (name) VALUES ('${name}')`,
  clearTable: (key) => `DELETE FORM ${key}_chapters;`,
  dropTable: (key) => `DROP TABLE ${key}_chapters;`,
};

const deck = {
  createTable: (key) =>
    `CREATE TABLE ${key}_decks (id SERIAL PRIMARY KEY, name TEXT, chapter INT, FOREIGN KEY (chapter) REFERENCES ${key}_chapters(id));`,
  get: (key, rules) =>
    `SELECT * FROM ${key}_decks${rules ? ` WHERE ${rules.join("AND ")}` : ""};`,
  getCount: (key) => `SELECT COUNT(*) FROM ${key}_decks`,
  insert: (key, name, chapter) =>
    `INSERT INTO ${key}_decks (name, chapter) VALUES ('${name}', ${chapter})`,
  clearTable: (key) => `DELETE FORM ${key}_decks;`,
  dropTable: (key) => `DROP TABLE ${key}_decks CASCADE;`,
};

const card = {
  createTable: (key) =>
    `CREATE TABLE ${key}_cards (id SERIAL PRIMARY KEY, question TEXT, answer TEXT, deck INT, FOREIGN KEY (deck) REFERENCES ${key}_decks(id));`,
  get: (key) => `SELECT * FROM ${key}_cards card ORDER BY card.deck;`,
  insert: (key, deck, cards) => `
  INSERT INTO ${key}_cards (deck, question, answer) VALUES ${cards
    .map((card) => {
      return `(${deck}, '${card.question}', '${card.answer}')`;
    })
    .join(", ")};
  `,
  clearTable: (key) => `DELETE FORM ${key}_cards;`,
  dropTable: (key) => `DROP TABLE ${key}_cards CASCADE;`,
};

const studentCardHistory = {
  createTable: (key) =>
    `CREATE TABLE ${key}_student_card_history (id SERIAL PRIMARY KEY, card INT, record TEXT, student TEXT, FOREIGN KEY (card) REFERENCES ${key}_cards(id), FOREIGN KEY (student) REFERENCES ${key}_students(code))`,
  get: (key) => `SELECT * FROM ${key}_student_card_history;`,
  getById: (key, schId) =>
    `SELECT * FROM ${key}_student_card_history sch WHERE sch.id = ${schId};`,
  insert: (key, cards, student) =>
    `INSERT INTO ${key}_student_card_history (student, card, record) VALUES
         ${cards
           .map((card) => {
             return `('${student}', ${card.id}, '${JSON.stringify([
               {
                 interval: 0,
                 difficulty_rating: 0,
                 rating_date: Date.now(),
                 next_study_date: Date.now(),
               },
             ])}')`;
           })
           .join(", ")};`,
  clearTable: (key) => `DELETE FORM ${key}_student_card_history;`,
  dropTable: (key) => `DROP TABLE ${key}_student_card_history;`,
  updateRecord: (key, record, schId) =>
    `UPDATE ${key}_student_card_history SET record = '${JSON.stringify(
      record
    )}' WHERE id = ${schId};`,
  toStudy: (key, studentCode, deckId) =>
    `SELECT sch.id AS id,
    c.id AS card,
    d.name as deck,
    sch.record AS record,
    c.question AS question,
    c.answer AS answer
    FROM ${key}_student_card_history sch
    JOIN ${key}_cards c ON sch.card = c.id
    JOIN ${key}_students s ON sch.student = s.code
    JOIN ${key}_decks d ON c.deck = d.id
    WHERE s.code = '${studentCode}' 
    AND c.deck = ${deckId};`,
  byStudent: (key, studentCode) =>
    `SELECT sch.id AS id,
  c.deck as deck,
  sch.card as card,
  sch.record as record
      FROM ${key}_student_card_history sch
      JOIN ${key}_cards c ON c.id = sch.card
      WHERE sch.student = '${studentCode}'
      ORDER BY c.deck;`,
};

const admin = {
  get: (key, studentCode) =>
    `SELECT s.id AS id,
    s.name AS name,
    s.code AS code,
    sch.record AS record,
    c.id AS card,
    d.id AS deck,
    ch.id AS chapter
    FROM ${key}_student_card_history sch
    JOIN ${key}_students s ON sch.student = s.code
    JOIN ${key}_cards c ON sch.card = c.id
    JOIN ${key}_decks d ON c.deck = d.id
    JOIN ${key}_chapters ch ON d.chapter = ch.id
    WHERE sch.student = '${studentCode}'
    ORDER BY s.id ASC, ch.id ASC, d.id ASC, c.id ASC`,
  getStudents: (key) => `SELECT * FROM ${key}_students s ORDER BY s.name`,
};

const reqs = {
  student,
  chapter,
  deck,
  card,
  studentCardHistory,
  nextReviewCalc,
  admin,
};

module.exports = reqs;
