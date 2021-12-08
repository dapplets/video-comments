import React, { useEffect } from 'react';
import { Progress } from 'semantic-ui-react';
import { bridge } from '../dappletBridge';
import { IStickerTransform } from '../types';
import { formatTime, roundToMultiple } from '../utils';
import TimeInput from './TimeInput'; 

interface ICCTimelineTimeScopeProps {
  videoLength: number
  currentTime: number
  updateCurrentTime: any
  from: number
  setFrom: any
  to: number
  setTo: any
  doUpdateCCTimeline: boolean
  setDoUpdateCCTimeline: any
  isMoving: boolean
  setIsMoving: any
  addingStickerTransform?: IStickerTransform
};

export default (props: ICCTimelineTimeScopeProps) => {
  const {
    videoLength,
    currentTime,
    updateCurrentTime,
    from,
    setFrom,
    to,
    setTo,
    doUpdateCCTimeline,
    setDoUpdateCCTimeline,
    isMoving,
    setIsMoving,
    addingStickerTransform,
  } = props;

  useEffect(() => {
    addPropTimestampStart(formatTime(from));
    addPropTimestampFinish(formatTime(to));
  });

  const stopTimeChanging = async (ev: any) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (!isMoving) return;
    ev.target.style.display = 'none';
    setIsMoving(false);
  };

  const nearestLowerPointTime = addingStickerTransform
  && Object.entries(addingStickerTransform)
    .map(([transformPointId, transformPointParams]) => transformPointParams.time)
    .sort((a, b) => b - a)[0];

  const nearestHigherPointTime = addingStickerTransform
    && Object.entries(addingStickerTransform)
      .map(([transformPointId, transformPointParams]) => transformPointParams.time)
      .sort((a, b) => a - b)[0];

  return (
    <div className='dapplet-double-timeline cc'>
      <div className='time-labels cc timescope'>
        <div>00:00</div>
        <div>{formatTime(videoLength)}</div>
      </div>
      <Progress
        className='dapplet-timeline-comments progressbar cc-base timescope'
        percent={0}
        size='tiny'
      />
      <Progress
        className='dapplet-timeline-comments point cc cc-finish timescope'
        percent={100 * to / videoLength}
        size='tiny'
        onMouseDown={(e: any) => {
          const el: any = document.querySelector('.timeline-touch-area.cc-finish');
          if (el === null) return;
          doUpdateCCTimeline && setDoUpdateCCTimeline(false);
          el.style.display = 'block';
          bridge.pauseVideo();
          const newTime = e.target.offsetWidth * videoLength / (e.target.parentElement.offsetWidth - 2);
          const roundedTime = roundToMultiple(newTime);
          const newCurrentTime = nearestLowerPointTime
            ? roundedTime < nearestLowerPointTime ? nearestLowerPointTime : roundedTime > videoLength ? videoLength : roundedTime
            : roundedTime < from + 1 ? from + 1 : roundedTime > videoLength ? videoLength : roundedTime;
          updateCurrentTime(newCurrentTime);
          setTo(newCurrentTime);
          bridge.setCurrentTime(newCurrentTime);
          setIsMoving(true);
        }}
      />
      <Progress
        className='dapplet-timeline-comments point cc cc-start timescope'
        percent={100 * from / videoLength}
        size='tiny'
        onMouseDown={(e: any) => {
          const el: any = document.querySelector('.timeline-touch-area.cc-start');
          if (el === null) return;
          doUpdateCCTimeline && setDoUpdateCCTimeline(false);
          el.style.display = 'block';
          bridge.pauseVideo();
          const newTime = e.target.offsetWidth * videoLength / (e.target.parentElement.offsetWidth - 2);
          const roundedTime = roundToMultiple(newTime);
          const newCurrentTime = nearestHigherPointTime
            ? roundedTime >= nearestHigherPointTime ? nearestHigherPointTime : roundedTime < 0 ? 0 : roundedTime
            : roundedTime >= to - 1 ? to - 1 : roundedTime < 0 ? 0 : roundedTime;
          updateCurrentTime(newCurrentTime);
          setFrom(newCurrentTime);
          bridge.setCurrentTime(newCurrentTime);
          setIsMoving(true);
        }}
      />
      <Progress
        className={`dapplet-timeline-comments timestamp cc cc-finish ${to >= 3600 ? 'dp-big' : 'dp-small'}`}
        percent={100 * to / videoLength}
        size='tiny'
      >
        <TimeInput
          time={to}
          updateCurrentTime={updateCurrentTime}
          doUpdateCCTimeline={doUpdateCCTimeline}
          setDoUpdateCCTimeline={setDoUpdateCCTimeline}
          min={nearestLowerPointTime ?? from + 1}
          max={videoLength}
          percent={100 * to / videoLength}
          changeTimestamp={setTo}
        />
      </Progress>
      <Progress
        className='dapplet-timeline-comments progressbar cc-finish'
        percent={100 * to / videoLength}
        size='tiny'
      />
      <Progress
        className={`dapplet-timeline-comments timestamp cc cc-start ${from >= 3600 ? 'dp-big' : 'dp-small'}`}
        percent={100 * from / videoLength}
        size='tiny'
      >
        <TimeInput
          time={from}
          updateCurrentTime={updateCurrentTime}
          doUpdateCCTimeline={doUpdateCCTimeline}
          setDoUpdateCCTimeline={setDoUpdateCCTimeline}
          min={0}
          max={nearestHigherPointTime ?? to - 1}
          percent={100 * from / videoLength}
          changeTimestamp={setFrom}
        />
      </Progress>
      <Progress
        className='dapplet-timeline-comments progressbar cc-start timescope'
        percent={100 * from / videoLength}
        size='tiny'
      />
      <div
        className='timeline-touch-area cc-finish'
        onMouseMove={async (ev: any) => {
          ev.preventDefault();
          ev.stopPropagation();
          if (!isMoving || ev.pageX < 52 || ev.pageX > ev.target.parentElement.offsetWidth + 52) return;
          const newTime = (ev.pageX - 52) * videoLength / ev.target.parentElement.offsetWidth;
          const roundedTime = roundToMultiple(newTime);
          const newCurrentTime = nearestLowerPointTime
            ? roundedTime <= nearestLowerPointTime ? nearestLowerPointTime : roundedTime > videoLength ? videoLength : roundedTime
            : roundedTime <= from + 1 ? from + 1 : roundedTime > videoLength ? videoLength : roundedTime;
          updateCurrentTime(newCurrentTime);
          setTo(newCurrentTime);
          bridge.setCurrentTime(newCurrentTime);
          bridge.changeTo(newCurrentTime);
        }}
        onMouseUp={stopTimeChanging}
        onMouseLeave={stopTimeChanging}
      />
      <div
        className='timeline-touch-area cc-start'
        onMouseMove={async (ev: any) => {
          ev.preventDefault();
          ev.stopPropagation();
          if (!isMoving || ev.pageX < 52 || ev.pageX > ev.target.parentElement.offsetWidth + 52) return;
          const newTime = (ev.pageX - 52) * videoLength / ev.target.parentElement.offsetWidth;
          const roundedTime = roundToMultiple(newTime);
          const newCurrentTime = nearestHigherPointTime
            ? roundedTime >= nearestHigherPointTime ? nearestHigherPointTime : roundedTime < 0 ? 0 : roundedTime
            : roundedTime >= to - 1 ? to - 1 : roundedTime < 0 ? 0 : roundedTime;
          updateCurrentTime(newCurrentTime);
          setFrom(newCurrentTime);
          bridge.setCurrentTime(newCurrentTime);
          bridge.changeFrom(newCurrentTime);
        }}
        onMouseUp={stopTimeChanging}
        onMouseLeave={stopTimeChanging}
      />
    </div>
  );
};

const addPropTimestampFinish = (value: string) => {
  const el = document.querySelector('.dapplet-timeline-comments.timestamp.cc-finish >.bar');
  el?.setAttribute('data-timestamp', value);
};

const addPropTimestampStart = (value: string) => {
  const el = document.querySelector('.dapplet-timeline-comments.timestamp.cc-start >.bar');
  el?.setAttribute('data-timestamp', value);
};
