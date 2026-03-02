import { useState } from 'react';
import { DIFF_DEFAULT, MODE_DEFAULT } from '../components/utils/Options';

function getInitialStates() {
  const difficulty = localStorage.getItem('difficulty') ?? DIFF_DEFAULT;
  const mode_ = localStorage.getItem('mode') ?? MODE_DEFAULT;
  const mode = mode_ === 'passage' ? mode_ : parseInt(mode_);
  const record = JSON.parse(localStorage.getItem('record')) ?? null;

  return { difficulty, mode, record }
};

export function useLocalStorage() {
  const init = getInitialStates();
  const [difficulty, setDifficulty_] = useState(init.difficulty);
  const [mode, setMode_] = useState(init.mode);
  const [record, setRecord_] = useState(init.record);

  const setDifficulty = (value) => {
    setDifficulty_(value);
    localStorage.setItem('difficulty', value);
  }

  const setMode = (value) => {
    setMode_(value);
    localStorage.setItem('mode', value);
  }

  const setRecord = (wpm, accuracy) => {
    const newRecord = { wpm, accuracy };
    setRecord_(newRecord);
    localStorage.setItem('record', JSON.stringify(newRecord));
  }

  return { difficulty, setDifficulty, mode, setMode, record, setRecord };
}
