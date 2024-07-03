const allDecks = () => "SELECT * FROM Deck";
const studentData = (studentCode) =>
  `SELECT * FROM students s WHERE s.code = '${studentCode}'`;
const cardsToStudy = (studentCode, deckId) =>
  `SELECT TOP (12) sch.ID AS schId, c.ID AS cardId, sch.Difficulty_rating AS rating, d.category as category from student_card_history sch JOIN card c ON sch.Card_id = c.ID JOIN Students s ON sch.Student_code = s.ID JOIN deck d ON c.Deck_id = d.ID WHERE s.code = '${studentCode}' AND c.Deck_id = ${deckId} AND sch.active = 1 ORDER BY sch.Next_study_date`;
const deactiveCardToStudy = (cardHistoryId) =>
  `UPDATE student_card_history SET active = 0 WHERE student_card_history.ID = ${cardHistoryId}`;
const insertNewCardHistory = (studentCode, cardId, newRating) =>
  `INSERT INTO student_card_history (Student_code, Card_id, Difficulty_rating, Next_study_date, active) VALUES (${studentCode}, ${cardId}, ${newRating}, GETDATE(), 1)`;

const reqs = {
  allDecks,
  studentData,
  cardsToStudy,
  deactiveCardToStudy,
  insertNewCardHistory,
};

module.exports = reqs;
