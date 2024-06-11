const allDecks = () => "Select * FROM Deck";
const studentData = (studentCode) =>
  `SELECT * FROM students s WHERE s.code = '${studentCode}'`;
const cardsToStudy = (studentCode, deckId) =>
  `SELECT TOP (12) c.ID AS cardId, sch.Difficulty_rating AS actualRating from student_card_history sch JOIN card c ON sch.Card_id = c.ID JOIN Students s ON sch.Student_code = s.ID WHERE s.code = '${studentCode}' AND c.Deck_id = ${deckId} AND sch.active = 1 ORDER BY sch.Next_study_date`;
const reqs = {
  allDecks,
  studentData,
  cardsToStudy,
};

module.exports = reqs;
