import React, { useEffect, useState } from 'react';
import { Progress } from 'semantic-ui-react';
import { bridge } from './dappletBridge';
import { formatTime } from './utils';

interface ICCTimelineProps {
  videoLength: number
  currentTime: number
  updateCurrentTime: any
  startTime: number
  setStartTime: any
  finishTime: number
  setFinishTime: any
  doUpdateCCTimeline: boolean
  setDoUpdateCCTimeline: any
};

export default (props: ICCTimelineProps) => {
  const {
    videoLength,
    currentTime,
    updateCurrentTime,
    startTime,
    setStartTime,
    finishTime,
    setFinishTime,
    doUpdateCCTimeline,
    setDoUpdateCCTimeline,
  } = props;
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    if (doUpdateCCTimeline) {
      setStartTime(currentTime);
      setFinishTime(currentTime + 30 > videoLength ? videoLength : currentTime + 30);
    }
  }, [currentTime]);

  useEffect(() => {
    addPropTimestampFinish(formatTime(finishTime));
    addPropTimestampStart(formatTime(startTime));
  });

  const stopTimeChanging = async (ev: any) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (!isMoving) return;
    ev.target.style.display = 'none';
    setIsMoving(false);
  };

  return (
    <div className='dapplet-double-timeline cc'>
      <div className='time-labels cc'>
        <div>00:00</div>
        <div>{formatTime(videoLength)}</div>
      </div>
      <Progress
        className='dapplet-timeline-comments progressbar cc-base'
        percent={0}
        size='tiny'
      />
      <Progress
        className='dapplet-timeline-comments point cc cc-finish'
        percent={100 * finishTime / videoLength}
        size='tiny'
        onMouseDown={(e: any) => {
          const el: any = document.querySelector('.timeline-touch-area.cc-finish');
          if (el === null) return;
          doUpdateCCTimeline && setDoUpdateCCTimeline(false);
          el.style.display = 'block';
          bridge.pauseVideo();
          const newTime = e.target.offsetWidth * videoLength / (e.target.parentElement.offsetWidth - 2);
          const newCurrentTime = newTime > videoLength - 1 ? videoLength - 1 : newTime;
          setFinishTime(newCurrentTime);
          updateCurrentTime(newCurrentTime);
          bridge.setCurrentTime(newCurrentTime);
          setIsMoving(true);
        }}
      />
      <Progress
        className='dapplet-timeline-comments point cc cc-start'
        percent={100 * startTime / videoLength}
        size='tiny'
        onMouseDown={(e: any) => {
          const el: any = document.querySelector('.timeline-touch-area.cc-start');
          if (el === null) return;
          doUpdateCCTimeline && setDoUpdateCCTimeline(false);
          el.style.display = 'block';
          bridge.pauseVideo();
          const newTime = e.target.offsetWidth * videoLength / (e.target.parentElement.offsetWidth - 2);
          const newCurrentTime = newTime > videoLength - 1 ? videoLength - 1 : newTime;
          setStartTime(newCurrentTime);
          updateCurrentTime(newCurrentTime);
          bridge.setCurrentTime(newCurrentTime);
          setIsMoving(true);
        }}
      />
      <Progress
        className='dapplet-timeline-comments timestamp cc cc-finish'
        percent={100 * finishTime / videoLength}
        size='tiny'
      />
      <Progress
        className='dapplet-timeline-comments progressbar cc-finish'
        percent={100 * finishTime / videoLength}
        size='tiny'
      />
      <Progress
        className='dapplet-timeline-comments timestamp cc cc-start'
        percent={100 * startTime / videoLength}
        size='tiny'
      />
      <Progress
        className='dapplet-timeline-comments progressbar cc-start'
        percent={100 * startTime / videoLength}
        size='tiny'
      />
      <div
        className='timeline-touch-area cc-finish'
        onMouseMove={(ev: any) => {
          ev.preventDefault();
          ev.stopPropagation();
          if (!isMoving || ev.pageX < 52 || ev.pageX > ev.target.parentElement.offsetWidth + 52) return;
          const newTime = (ev.pageX - 52) * videoLength / ev.target.parentElement.offsetWidth;
          const newCurrentTime = newTime <= startTime + 1 ? startTime + 1 : newTime > videoLength ? videoLength : newTime;
          setFinishTime(newCurrentTime);
          updateCurrentTime(newCurrentTime);
          bridge.setCurrentTime(newCurrentTime);
        }}
        onMouseUp={stopTimeChanging}
        onMouseLeave={stopTimeChanging}
      />
      <div
        className='timeline-touch-area cc-start'
        onMouseMove={(ev: any) => {
          ev.preventDefault();
          ev.stopPropagation();
          if (!isMoving || ev.pageX < 52 || ev.pageX > ev.target.parentElement.offsetWidth + 52) return;
          const newTime = (ev.pageX - 52) * videoLength / ev.target.parentElement.offsetWidth;
          const newCurrentTime = newTime >= finishTime - 1 ? finishTime - 1 : newTime < 0 ? 0 : newTime;
          setStartTime(newCurrentTime);
          updateCurrentTime(newCurrentTime);
          bridge.setCurrentTime(newCurrentTime);
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
