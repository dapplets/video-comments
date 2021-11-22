import React, { useEffect, useRef, useState } from 'react';
import { Progress } from 'semantic-ui-react';
import cn from 'classnames';
import { bridge } from './dappletBridge';
import { IPoint, IStickerTransform } from './types';
import { formatTime, roundToMultiple } from './utils';
import CCTimelinePoint from './CCTimelinePoint';
import TimeInput from './TimeInput'; 

interface ICCTimelineProps {
  videoLength: number
  currentTime: number
  updateCurrentTime: React.Dispatch<React.SetStateAction<number>>
  from: number
  setFrom: any
  to: number
  setTo: any
  doUpdateCCTimeline: boolean
  setDoUpdateCCTimeline: any
  isMoving: boolean
  setIsMoving: any
  addingStickerTransform?: IStickerTransform
  updateAddingStickerTransform: any
};

export default (props: ICCTimelineProps) => {
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
    updateAddingStickerTransform,
  } = props;

  const [isMouseDown, setIsMouseDown] = useState(false);
  const isMouseDownRef = useRef(isMouseDown);
  isMouseDownRef.current = isMouseDown;

  // console.log('currentTime***', currentTime)
  // console.log('addingStickerTransform***', addingStickerTransform)

  useEffect(() => {
    addPropTimestampPoint('start.timestamp', formatTime(from));
    addPropTimestampPoint('finish.timestamp', formatTime(to));
    // addingStickerTransform && Object.entries(addingStickerTransform)
    //   .map(([transformPointId, transformPointParams]) => {
    //     addPropTimestampPoint(transformPointId, formatTime(transformPointParams.time));
    //   });
  });

  useEffect(() => {
    setTimeout(() => {
      if (isMouseDownRef.current) {
        // console.log('inside of setTimeout!')
        const el: any = document.querySelector('.timeline-touch-area.cc-current');
        if (el === null) return;
        el.style.display = 'block';
        setIsMoving(true);
      }
    }, 300);
  }, [isMouseDown]);

  const stopTimeChanging = async (ev: any) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (!isMoving) return;
    ev.target.style.display = 'none';
    setIsMoving(false);
  };

  return (
    <div className='dapplet-double-timeline cc current'>
      <div className='time-labels cc'>
        <div>{formatTime(from)}</div>
        <div>{formatTime(to)}</div>
      </div>
      <Progress
        className='dapplet-timeline-comments progressbar cc-base'
        percent={0}
        size='tiny'
      />
      <Progress
        className='dapplet-timeline-comments point cc cc-finish timescope top-2'
        percent={100}
        size='tiny'
        onClick={(e: any) => {
          e.preventDefault();
          e.stopPropagation();
          doUpdateCCTimeline && setDoUpdateCCTimeline(false);
          bridge.pauseVideo();
          updateCurrentTime(to);
          bridge.setCurrentTime(to);
        }}
      />
      <Progress
        className='dapplet-timeline-comments point cc cc-start timescope top-2'
        percent={0}
        size='tiny'
        onClick={(e: any) => {
          e.preventDefault();
          e.stopPropagation();
          doUpdateCCTimeline && setDoUpdateCCTimeline(false);
          bridge.pauseVideo();
          updateCurrentTime(from);
          bridge.setCurrentTime(from);
        }}
      />
      {addingStickerTransform && Object.entries(addingStickerTransform)
        .sort((a, b) => b[1].time - a[1].time)
        .map(([transformPointId, transformPointParams]) => {
          return <CCTimelinePoint
            key={transformPointId}
            cCPoint={{ id: transformPointId, time: transformPointParams.time }}
            videoLength={videoLength}
            currentTime={currentTime}
            updateCurrentTime={updateCurrentTime}
            from={from}
            to={to}
            doUpdateCCTimeline={doUpdateCCTimeline}
            setDoUpdateCCTimeline={setDoUpdateCCTimeline}
            isMoving={isMoving}
            setIsMoving={setIsMoving}
            updateAddingStickerTransform={updateAddingStickerTransform}
            stopTimeChanging={stopTimeChanging}
            addingStickerTransform={addingStickerTransform}
          />;
        })}
      <Progress 
        className={`dapplet-timeline-comments cc cc-finish current-time ${isMoving ? 'empty' : (addingStickerTransform && Object.values(addingStickerTransform).map((stParam) => stParam.time).includes(roundToMultiple(currentTime))) ? 'delete' : ''}`}
        percent={100 * (currentTime - from) / (to - from)}
        size='tiny'
        onMouseDown={async (e: any) => {
          e.stopPropagation();
          e.preventDefault();
          doUpdateCCTimeline && setDoUpdateCCTimeline(false);
          bridge.pauseVideo();
          setIsMouseDown(true);
          // const t = new Date()
          // console.log(t.getMilliseconds())
        }}
        onClick={(e: any) => {
          e.stopPropagation();
          e.preventDefault();
          if (isMouseDown) {
            // const t = new Date()
            // console.log(t.getMilliseconds())
            doUpdateCCTimeline && setDoUpdateCCTimeline(false);
            bridge.pauseVideo();
            if (addingStickerTransform && Object.values(addingStickerTransform).map((stParam) => stParam.time).includes(roundToMultiple(currentTime))) {
              bridge.deletePoint();
            } else {
              bridge.addPoint();
            }
            setIsMouseDown(false);
          }
        }}
      />
      <Progress 
        className={cn('dapplet-timeline-comments', 'cc', 'cc-finish current-time', 'point-cc', currentTime >= 3600 ? 'big' : 'small')}
        percent={100 * (currentTime - from) / (to - from)}
        size='tiny'
      >
        <TimeInput
          time={currentTime}
          updateCurrentTime={updateCurrentTime}
          doUpdateCCTimeline={doUpdateCCTimeline}
          setDoUpdateCCTimeline={setDoUpdateCCTimeline}
          min={from}
          max={to}
          percent={100 * (currentTime - from) / (to - from)}
        />
      </Progress>
      <div
        className='timeline-touch-area cc-current'
        onMouseMove={(ev: any) => {
          ev.preventDefault();
          ev.stopPropagation();
          if (!isMoving || ev.pageX < 57 || ev.pageX > ev.target.parentElement.offsetWidth + 57) return;
          const newTime = (ev.pageX - 57) * (to - from) / ev.target.parentElement.offsetWidth + from;
          const roundedTime = roundToMultiple(newTime);
          const newCurrentTime = roundedTime < from ? from : roundedTime > to ? to : roundedTime;
          updateCurrentTime(newCurrentTime);
          bridge.setCurrentTime(newCurrentTime);
        }}
        onMouseUp={(e) => {
          stopTimeChanging(e);
          setIsMouseDown(false);
        }}
        onMouseLeave={(e) => {
          stopTimeChanging(e);
          setIsMouseDown(false);
        }}
      />
    </div>
  );
};

const addPropTimestampPoint = (id: string, value: string) => {
  const el = document.querySelector(`.dapplet-timeline-comments.cc-${id} >.bar`);
  el?.setAttribute('data-timestamp', value);
};
