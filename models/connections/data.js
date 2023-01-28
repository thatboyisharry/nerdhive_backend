const mongoose = require('mongoose');

const conn = mongoose.createConnection(process.env.MONGO_URL);

conn.model('Coach',require('../coach.model'))
conn.model('Job',require('../job.model'))
conn.model('Learner',require('../learner.model'))
conn.model('Lesson',require('../lesson.model'))
conn.model('Parent',require('../parent.model'))
conn.model('Timetable',require('../timetable.model'))
conn.model('Tutor',require('../tutor.model'))
conn.model('User',require('../user.model'))
conn.model('Question',require('../learner.question.model'))
conn.model('Worksheet',require('../worksheet.model'))
conn.model('QuestionPaper',require('../question.paper.model'))
conn.model('StudyNotes',require('../learner.studynotes.model'))
conn.model('Notes',require('../notes.model'))
conn.model('Query',require('../query.model'))
conn.model('Test',require('../test.model'))
conn.model('TopicGuide',require('../topic.guide.model'))
conn.model('Conversation',require('../conversation.model'))
conn.model('Lead',require('../lead.model'))
conn.model('CustomerQuery',require('../support.query.model'))
conn.model('CustomerSupport',require('../customer.support.model'))
module.exports = conn;