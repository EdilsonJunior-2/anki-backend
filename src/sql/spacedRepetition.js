const nextReviewCalc = (previousInterval, meter, rating, repetitions) =>
  Math.round(
    100 *
      ((1 + previousInterval) *
        (1 + Math.exp(-(rating * repetitions) + meter)) -
        1)
  ) / 100;

const login = (studentCode) =>
  `SELECT * FROM student s WHERE s.code = '${studentCode}'`;

const nextDate = (interval, meter, rating, repetitions) =>
  `DATEADD(MILLISECOND, ${
    nextReviewCalc(interval, meter, rating, repetitions) * 24 * 60 * 60 * 1000
  }, GETDATE())`;

const allDecks = () => "SELECT * FROM Deck";
const getCard = (schId) =>
  `SELECT * FROM student_card_history sch WHERE sch.id = ${schId}`;
const updateStudyRecord = (studyRecord, schId) =>
  `UPDATE student_card_history SET study_record = '${JSON.stringify(
    studyRecord
  )}' WHERE id = ${schId};`;
const studentData = (studentCode) =>
  `SELECT * FROM student s WHERE s.code = '${studentCode}'`;
const cardsToStudy = (studentCode, deckId) =>
  `SELECT sch.id AS sch_id, c.id AS card_id, sch.study_record as study_record, d.category as category from student_card_history sch JOIN card c ON sch.card_id = c.id JOIN student s ON sch.student_code = s.code JOIN deck d ON c.deck_id = d.id WHERE s.code = '${studentCode}' AND c.deck_id = ${deckId};`;
const deactiveCardToStudy = (cardHistoryId) =>
  `UPDATE student_card_history SET active = 0 WHERE student_card_history.ID = ${cardHistoryId}`;
const insertNewCardHistory = (
  studentCode,
  cardId,
  newRating,
  meter,
  interval,
  repetitions
) =>
  `INSERT INTO student_card_history (Student_code, Card_id, Difficulty_rating, Next_study_date, active, meter, interval) VALUES (${studentCode}, ${cardId}, ${newRating}, ${nextDate(
    interval,
    meter,
    newRating,
    repetitions
  )}, 1,  ${meter + 1}, ${nextReviewCalc(
    interval,
    meter,
    newRating,
    repetitions
  )})`;

const getAllCards = (studentCode) =>
  `SELECT sch.id AS id, c.Deck_id as deck, sch.Card_id as card, sch.study_record as study_record FROM student_card_history sch JOIN card c ON c.id = sch.Card_id WHERE sch.Student_code = '${studentCode}' ORDER BY c.Deck_id;`;

const reqs = {
  login,
  allDecks,
  getAllCards,
  studentData,
  cardsToStudy,
  deactiveCardToStudy,
  insertNewCardHistory,
  nextReviewCalc,
  getCard,
  updateStudyRecord,
};

module.exports = reqs;
