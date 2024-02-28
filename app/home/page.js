"use client"
import React, { useState, useEffect } from 'react';

const Questionnaire = () => {
  const [questions, setQuestions] = useState([]);
  const [options1, setOptions1] = useState([]);
  const [options2, setOptions2] = useState([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [visitedQuestions, setVisitedQuestions] = useState([]);

  useEffect(() => {
    // Fetch questions and options from API
    fetch('https://script.googleusercontent.com/macros/echo?user_content_key=jM-VC0Zv4NA1zQolw2KVrgzNmuKWWAOAyhHgGO9p1x4kKwaGZD34T6jpIBT63_vBS9cDqYnGUD371Bkg4xH2nydu4cgJ9ASem5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnLKpBbwXZxFdQ-08uPuOGBVzRDfZvC7YzfuX2diNbDVR9yIAWza0eet0WfsL2Bs4Ev0dmYBNtyOxIeD8Y4zwE9Ofwz_yvgK6sA&lib=MGc2WRDSXubm--OZG329GuSUwSkbkzPEX')
      .then(response => response.json())
      .then(data => {
        const { Questions, Options1, Options2 } = data;
        setQuestions(Questions);
        setOptions1(Options1);
        setOptions2(Options2);
        setVisitedQuestions(Array(Questions.length).fill(false));
        setResponses(Array(Questions.length).fill({}));
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  
  const handleResponseChange = (questionId, option) => {
    const newResponses = [...responses];
    newResponses[currentPairIndex] = { ...newResponses[currentPairIndex], [questionId]: option };
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

  const getButtonColor = (pairIndex) => {
    if (!visitedQuestions[pairIndex]) {
      return 'bg-gray-500';
    } else if (!responses[pairIndex] || (!responses[pairIndex][questions[pairIndex].id])) {
      return 'bg-red-500';
    } else {
      return 'bg-green-500';
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      {questions.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Question Pair ID: {questions[currentPairIndex].id}</h2>
          <h3 className="text-lg font-semibold mb-2">{questions[currentPairIndex].name}</h3>
          <div className="flex space-x-4 mb-4">
            {options1.map(option => (
              <label key={option.id} className="inline-flex items-center">
                <input
                  type="radio"
                  value={option.name}
                  checked={responses[currentPairIndex] && responses[currentPairIndex][questions[currentPairIndex].id] === option.name}
                  onChange={() => handleResponseChange(questions[currentPairIndex].id, option.name)}
                  className="form-radio h-5 w-5 text-indigo-600"
                />
                <span className="ml-2">{option.name}</span>
              </label>
            ))}
          </div>
          <div className="flex space-x-4">
            {options2.map(option => (
              <label key={option.id} className="inline-flex items-center">
                <input
                  type="radio"
                  value={option.name}
                  checked={responses[currentPairIndex] && responses[currentPairIndex][questions[currentPairIndex].id] === option.name}
                  onChange={() => handleResponseChange(questions[currentPairIndex].id, option.name)}
                  className="form-radio h-5 w-5 text-indigo-600"
                />
                <span className="ml-2">{option.name}</span>
              </label>
            ))}
          </div>
          {visitedQuestions[currentPairIndex] && !responses[currentPairIndex]?.[questions[currentPairIndex].id] && (
            <p className="mt-2 text-red-500">Please select an option.</p>
          )}
        </div>
      )}
      <div className="flex justify-between mt-4">
        <button onClick={handlePrevious} disabled={currentPairIndex === 0} className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed">Previous</button>
        {currentPairIndex !== questions.length - 1 && (
          <button onClick={handleNext} className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed">Next</button>
        )}
      </div>
      {currentPairIndex === questions.length - 1 && (
        <button onClick={handleFinish} className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Finish</button>
      )}

      <div className="flex space-x-2 mt-4">
        {questions.map((question, index) => (
          <button
            key={question.id}
            className={`px-3 py-1 rounded-md ${getButtonColor(index)}`}
            onClick={() => handleQuestionChange(index)}
          >
            {question.id}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Questionnaire;
