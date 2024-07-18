const nextReviewCalc = (previousInterval, meter, rating) =>
  Math.round(100 * (previousInterval * (1 + Math.exp(-rating + meter)) - 1)) /
  100;

const nextDate = (interval, meter, rating) =>
  `DATEADD(MILLISECOND, ${
    nextReviewCalc(interval, meter, rating) * 24 * 60 * 60 * 1000
  }, GETDATE())`;

const allDecks = () => "SELECT * FROM Deck";
const studentData = (studentCode) =>
  `SELECT * FROM student s WHERE s.code = '${studentCode}'`;
const cardsToStudy = (studentCode, deckId) =>
  `SELECT TOP (12) sch.ID AS schId, c.ID AS cardId, sch.Difficulty_rating AS rating, d.category as category, sch.meter as meter, sch.interval as interval from student_card_history sch JOIN card c ON sch.Card_id = c.ID JOIN Students s ON sch.Student_code = s.ID JOIN deck d ON c.Deck_id = d.ID WHERE s.code = '${studentCode}' AND c.Deck_id = ${deckId} AND sch.active = 1 AND sch.next_study_date < GETDATE() ORDER BY sch.Next_study_date`;
const deactiveCardToStudy = (cardHistoryId) =>
  `UPDATE student_card_history SET active = 0 WHERE student_card_history.ID = ${cardHistoryId}`;
const insertNewCardHistory = (
  studentCode,
  cardId,
  newRating,
  meter,
  interval
) =>
  `INSERT INTO student_card_history (Student_code, Card_id, Difficulty_rating, Next_study_date, active, meter, interval) VALUES (${studentCode}, ${cardId}, ${newRating}, ${nextDate(
    interval,
    meter,
    newRating
  )}, 1,  ${meter + 1}, ${nextReviewCalc(interval, meter, newRating)})`;

const decksInfo = [
  {
    id: 1,
    length: 26,
    initialId: 1,
    finalId: 26,
  },
  {
    id: 2,
    length: 17,
    initialId: 27,
    finalId: 43,
  },
  {
    id: 3,
    length: 58,
    initialId: 44,
    finalId: 101,
  },
  {
    id: 4,
    length: 44,
    initialId: 102,
    finalId: 145,
  },
  {
    id: 5,
    length: 52,
    initialId: 146,
    finalId: 197,
  },
  {
    id: 6,
    length: 47,
    initialId: 198,
    finalId: 244,
  },
  {
    id: 7,
    length: 28,
    initialId: 245,
    finalId: 272,
  },
  {
    id: 8,
    length: 42,
    initialId: 273,
    finalId: 314,
  },
  {
    id: 9,
    length: 29,
    initialId: 315,
    finalId: 343,
  },
  {
    id: 10,
    length: 21,
    initialId: 344,
    finalId: 364,
  },
  {
    id: 11,
    length: 34,
    initialId: 365,
    finalId: 398,
  },
  {
    id: 12,
    length: 33,
    initialId: 399,
    finalId: 431,
  },
  {
    id: 13,
    length: 23,
    initialId: 432,
    finalId: 454,
  },
  {
    id: 14,
    length: 34,
    initialId: 455,
    finalId: 488,
  },
  {
    id: 15,
    length: 24,
    initialId: 489,
    finalId: 512,
  },
  {
    id: 16,
    length: 33,
    initialId: 513,
    finalId: 545,
  },
  {
    id: 17,
    length: 23,
    initialId: 546,
    finalId: 568,
  },
];

const reqs = {
  allDecks,
  studentData,
  cardsToStudy,
  deactiveCardToStudy,
  insertNewCardHistory,
};

module.exports = reqs;
