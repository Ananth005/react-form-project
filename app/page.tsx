import React from 'react';
import Questionnaire from './questionaire/page';
import RecordView from './home/page';
// import Questionnaire from './home/page'

const questions = [
  { quesionpairid:1,
    TopicStatement: "I distinguish my capacity to recognise factors beyond my control from my ability to intellectually pinpoint the reasons for such limitations understanding that true acceptance hinges on cognitive comprehension rather than emotional reactions.",
    questionpair:[
  {
    id: 1,
    QuestionType: "Importance",
    TopicName: "Acceptance",
  },
  {
    id: 2,
    QuestionType: "Performance",
    TopicName: "Acceptance",
  }]},
  { quesionpairid:2,
    TopicStatement: "I closely assess my drive to embrace challenges as avenues for growth, my ability to manage my fear of failure, and my consistent commitment to self-care, recognising that true ambition balances aspiration with well-being to fortify self-confidence and mental resilience.",
    questionpair:[
  {
    id: 1,
    QuestionType: "Importance",
    TopicName: "Ambition",
  },
  {
    id: 2,
    QuestionType: "Performance",
    TopicName: "Ambition",
  } ] },
  { quesionpairid:3,
    TopicStatement: "I have the agency and authority to make and act on my thoughts and decisions, undeterred by competing personal circumstances, external pressures or societal expectations.",
    questionpair:[
  {
    id: 1,
    QuestionType: "Importance",
    TopicName: "Autonomy",
  },
  {
    id: 2,
    QuestionType: "Performance",
    TopicName: "Autonomy",
  } ] }

];
const options = [
  {
    id:1,
    1: "Not a Priority",
    2: "Low Priority",
    3: "Priority",
    4: "High Priority",
    5: "Critical"
  },
  {
    id:2,
    1: "I am terrible at this",
    2: "I am poor at this",
    3: "I am average at this",
    4: "I am good at this",
    5: "I am excellent at this"
  },

]
const responses = [
  {
    quesionpairid:1,
    response1:1,
    response2:1,
    englishtext:'"The true entrepreneur is a doer, not a dreamer." - Nolan Bushnell'

  },
  {
    quesionpairid:1,
    response1:1,
    response2:2,
    englishtext:"It's easier to ask forgiveness than it is to get permission.- Grace Hopper"

  },
  {
    quesionpairid:1,
    response1:1,
    response2:3,
    englishtext:"It's easier to ask forgiveness than it is to get permission.- Grace Hopper"

  }
]

const App = () => {
  return (
    <div>
      <h1>Questionnaire</h1>
      <Questionnaire questions={questions} options={options} />
      {/* <Questionnaire /> */}
      {/* <RecordView /> */}
    </div>
  );
};

export default App;
