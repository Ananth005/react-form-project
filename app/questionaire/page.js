"use client"
import React, { useState } from 'react';

const Questionnaire = ({ questions, options }) => {
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [visitedQuestions, setVisitedQuestions] = useState(Array(questions.length).fill(false));

  const handleResponseChange = (questionId, option) => {
    const newResponses = [...responses];
    const currentPairId = questions[currentPairIndex].quesionpairid;
    const pairResponses = newResponses.find(pair => pair.questionpairid === currentPairId) || { questionpairid: currentPairId };
    pairResponses[`response${questionId}`] = option;

    const pairIndex = newResponses.findIndex(pair => pair.questionpairid === currentPairId);
    if (pairIndex === -1) {
      newResponses.push(pairResponses);
    } else {
      newResponses[pairIndex] = pairResponses;
    }

    setResponses(newResponses);
    markQuestionAsVisited(currentPairIndex);
  };

  const handleNext = () => {
    if (currentPairIndex < questions.length - 1) {
      setCurrentPairIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPairIndex > 0) {
      setCurrentPairIndex(prevIndex => prevIndex - 1);
    }
  };

  const handleFinish = () => {
    console.log(responses)
    const deltas = [];
    responses.forEach(pair => {
      const importanceScore = parseInt(pair.response1);
      const performanceScore = parseInt(pair.response2);
      const delta = importanceScore - performanceScore;
      deltas.push({ questionpairid: pair.questionpairid, delta });
    });
  
    deltas.sort((a, b) => b.delta - a.delta);
  
    console.log("Strengths and Weaknesses:");
  
    // Display the higher two delta disciplines as weaknesses
    console.log("Weaknesses:");
    deltas.slice(0, 2).forEach((item, index) => {
      console.log(`${index + 1}. Question Pair ID: ${item.questionpairid}, Delta: ${item.delta}`);
    });
  
    // Display the lower two delta disciplines as strengths
    console.log("Strengths:");
    deltas.slice(-2).reverse().forEach((item, index) => {
      console.log(`${index + 1}. Question Pair ID: ${item.questionpairid}, Delta: ${item.delta}`);
    });
  };
  

  const handleQuestionChange = (index) => {
    setCurrentPairIndex(index);
    markQuestionAsVisited(index);
  };

  const markQuestionAsVisited = (index) => {
    const updatedVisitedQuestions = [...visitedQuestions];
    updatedVisitedQuestions[index] = true;
    setVisitedQuestions(updatedVisitedQuestions);
  };

  const getButtonColor = (pairId, index) => {
    const pairResponses = responses.find(pair => pair.questionpairid === pairId);
    if (!visitedQuestions[index]) {
      return 'bg-gray-500';
    } else if (!pairResponses || (!pairResponses[`response1`] && !pairResponses[`response2`])) {
      return 'bg-red-500';
    } else if (pairResponses[`response1`] && pairResponses[`response2`]) {
      return 'bg-green-500';
    } else {
      return 'bg-yellow-500';
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Question Pair ID: {questions[currentPairIndex].quesionpairid}</h2>
      <h3 className="text-lg font-semibold mb-2">{questions[currentPairIndex].TopicStatement}</h3>
      {questions[currentPairIndex].questionpair.map(question => (
        <div key={question.id} className="mb-4">
          <h4 className="text-md font-medium mb-2">{question.TopicStatement}</h4>
          <div className="flex flex-col space-y-2">
            {[1, 2, 3, 4, 5].map(choice => (
              <label key={choice} className=" border-gray-600 flex bg-gray-200 text-gray-700 rounded-md px-3 py-2 active:bg-green-300  hover:bg-indigo-200 cursor-pointer ">
                <input
                  type="radio"
                  value={choice}
                  checked={responses[currentPairIndex]?.[`response${question.id}`] === choice}
                  onChange={() => handleResponseChange(question.id, choice)}
                  className="form-radio h-5 w-5 text-indigo-600"
                />
                <span className="ml-2">{options.find(opt => opt.id === question.id)[choice]}</span>
              </label>
            ))}
          </div>
          {responses[currentPairIndex]?.[`response${question.id}`] && (
            <p className="mt-2 text-gray-600">Your answer for this question: {options.find(opt => opt.id === question.id)[responses[currentPairIndex][`response${question.id}`]]}</p>
          )}
        </div>
      ))}
      <div className="flex justify-between mb-4">
        <button onClick={handlePrevious} disabled={currentPairIndex === 0} className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed">Previous</button>
        {currentPairIndex !== questions.length - 1 && (
          <button onClick={handleNext} className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed">Next</button>
        )}
      </div>
      {currentPairIndex === questions.length - 1 && (
        <button onClick={handleFinish} className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Finish</button>
      )}

      <div className="flex space-x-2">
        {questions.map((question, index) => (
          <button
            key={question.quesionpairid}
            className={`px-3 py-1 rounded-md ${getButtonColor(question.quesionpairid, index)}`}
            onClick={() => handleQuestionChange(index)}
          >
            {question.quesionpairid}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Questionnaire;
