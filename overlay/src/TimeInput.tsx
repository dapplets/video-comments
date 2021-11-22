import React, { useEffect, useState } from 'react';
import { formatTime } from './utils';
import { bridge } from './dappletBridge';

interface ITimeInputProps {
  time: number
  updateCurrentTime: React.Dispatch<React.SetStateAction<number>>
  doUpdateCCTimeline: boolean
  setDoUpdateCCTimeline: any
  min: number
  max: number
  percent: number
  changeTimestamp?: any
}

export default (props: ITimeInputProps) => {
  const {
    time,
    updateCurrentTime,
    doUpdateCCTimeline,
    setDoUpdateCCTimeline,
    min,
    max,
    percent,
    changeTimestamp,
  } = props;
  const [newCurrentTimeByInput, setNewCurrentTimeByInput] = useState(formatTime(time));

  useEffect(() => setNewCurrentTimeByInput(formatTime(time)), [time]);

  const handleFocusInput =(e: React.FocusEvent<HTMLInputElement>) => {
    doUpdateCCTimeline && setDoUpdateCCTimeline(false);
    bridge.pauseVideo();
  }

  const handleChangeNewCurrentTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    let newTime = newCurrentTimeByInput;
    if (/^(\d*:)?[0-5]?\d?:[0-5]?\d?$/.test(e.target.value)) {
      newTime = e.target.value;
    }
    setNewCurrentTimeByInput(newTime);
  };

  const handleKeyDownOnArrow = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      const timeByInput = parseTime(newCurrentTimeByInput)
      const newTimeByInput = timeByInput + 1;
      const newTime = newTimeByInput < min ? min : newTimeByInput > max ? max : newTimeByInput; 
      updateCurrentTime(newTime);
      changeTimestamp && changeTimestamp(newTime);
      bridge.setCurrentTime(newTime);
    } else if (e.key === 'ArrowDown') {
      const timeByInput = parseTime(newCurrentTimeByInput)
      const newTimeByInput = timeByInput - 1;
      const newTime = newTimeByInput < min ? min : newTimeByInput > max ? max : newTimeByInput; 
      updateCurrentTime(newTime);
      changeTimestamp && changeTimestamp(newTime);
      bridge.setCurrentTime(newTime);
    }
  };
  
  const handleSetNewCurrentTime = (e: any) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      e.preventDefault();
      const newTimeByInput = parseTime(newCurrentTimeByInput)
      const newTime = newTimeByInput < min ? min : newTimeByInput > max ? max : newTimeByInput; 
      updateCurrentTime(newTime);
      changeTimestamp && changeTimestamp(newTime);
      bridge.setCurrentTime(newTime);
      const playButton: HTMLElement | null = document.querySelector('.dp-play');
      if (playButton) {
        playButton.focus();
      } else {
        e.target.blur();
      }
      return false;
    }
  };

  return (
    <form
      onKeyPress={handleSetNewCurrentTime}
      style={{ width: `${percent}%` }}
    >
      <input
        type='text'
        name='time'
        autoComplete='off'
        value={newCurrentTimeByInput}
        onFocus={handleFocusInput}
        onChange={handleChangeNewCurrentTime}
        onKeyDown={handleKeyDownOnArrow}
      />
    </form>
  );
};

const parseTime = (t: string): number => {
  const arr = t.split(':');
  return arr.length === 2
    ? +arr[0] * 60 + (+arr[1])
    : +arr[0] * 3600 + (+arr[1]) * 60 + (+arr[2]);
};
