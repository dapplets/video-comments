import React, { useEffect, useRef, useState } from 'react';
import { Progress } from 'semantic-ui-react';
import { bridge } from './dappletBridge';
import { formatTime, roundToMultiple } from './utils';
import { IPoint, IStickerTransform, IStickerTransformParams } from './types';

interface ICCTimelinePointProps {
  cCPoint: IPoint
  videoLength: number
  currentTime: number
  updateCurrentTime: any
  from: number
  to: number
  doUpdateCCTimeline: boolean
  setDoUpdateCCTimeline: any
  isMoving: boolean
  setIsMoving: any
  updateAddingStickerTransform: any
  stopTimeChanging: (ev: any) => Promise<void>
  addingStickerTransform: IStickerTransform
};

export default (props: ICCTimelinePointProps) => {
  const {
    cCPoint,
    videoLength,
    currentTime,
    updateCurrentTime,
    from,
    to,
    doUpdateCCTimeline,
    setDoUpdateCCTimeline,
    isMoving,
    setIsMoving,
    updateAddingStickerTransform,
    stopTimeChanging,
    addingStickerTransform,
  } = props;
  const { id, time } = cCPoint;

  const [isMouseDown, setIsMouseDown] = useState(false);
  const isMouseDownRef = useRef(isMouseDown);
  isMouseDownRef.current = isMouseDown;

  useEffect(() => {
    setTimeout(() => {
      if (isMouseDownRef.current) {
        const el: any = document.querySelector(`.timeline-touch-area.cc-${id}`);
        if (el === null) return;
        el.style.display = 'block';
        setIsMoving(true);
      }
    }, 300);
  }, [isMouseDown])

  const sortedPoints = Object.entries(addingStickerTransform).sort((a, b) => a[1].time - b[1].time);
  const pointIndex = sortedPoints.findIndex((sortedPoint) => sortedPoint[0] === id);

  const getNewCurrentTime = (roundedTime: number) => {
    if (sortedPoints.length === 1) {
      if (roundedTime <= from) return from;
      if (roundedTime >= to) return to;
      return roundedTime;
    }
    if (pointIndex === 0) {
      if (roundedTime <= from) return from;
      if (roundedTime >= sortedPoints[pointIndex + 1][1].time - 0.1) {
        return sortedPoints[pointIndex + 1][1].time - 0.1;
      }
      return roundedTime;
    }
    if (pointIndex === sortedPoints.length - 1) {
      if (roundedTime >= to) return to;
      if (roundedTime <= sortedPoints[pointIndex - 1][1].time + 0.1) {
        return sortedPoints[pointIndex - 1][1].time + 0.1;
      }
      return roundedTime;
    }
    if (roundedTime <= sortedPoints[pointIndex - 1][1].time + 0.1) {
      return sortedPoints[pointIndex - 1][1].time + 0.1;
    }
    if (roundedTime >= sortedPoints[pointIndex + 1][1].time - 0.1) {
      return sortedPoints[pointIndex + 1][1].time - 0.1;
    }
    return roundedTime;
  };

  const changeCurrentTime = async (ev: any) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (!isMoving || ev.pageX < 57 || ev.pageX > ev.target.parentElement.offsetWidth + 57) return;
    const time = (ev.pageX - 57) * (to - from) / ev.target.parentElement.offsetWidth + from;
    const roundedTime = roundToMultiple(time);
    const newCurrentTime = getNewCurrentTime(roundedTime);
    updateCurrentTime(newCurrentTime);
    bridge.setCurrentTime(newCurrentTime);
    const newAddingStickerTransform = await bridge.changeStickerTransformPointTime(id, newCurrentTime);
    updateAddingStickerTransform(newAddingStickerTransform);
  };

  return (
    <>
      <Progress
        className={time === currentTime ? 'dapplet-timeline-comments point cc cc-finish active' : 'dapplet-timeline-comments point cc cc-finish'}
        percent={100 * (time - from) / (to - from)}
        size='tiny'
        onMouseDown={(e: any) => {
          e.stopPropagation();
          e.preventDefault();
          doUpdateCCTimeline && setDoUpdateCCTimeline(false);
          bridge.pauseVideo();
          setIsMouseDown(true);
        }}
        onClick={async (e: any) => {
          e.stopPropagation();
          e.preventDefault();
          if (isMouseDown) {
            // console.log("currentTime", currentTime)
            // console.log("point.time", time)
            // console.log("cCPoint.time", cCPoint.time)
            // console.log("addingStickerTransform", addingStickerTransform)
            updateCurrentTime(time);
            bridge.setCurrentTime(time);
            setIsMoving(false);
            setIsMouseDown(false);
          }
        }}
      />
      <div
        className={`timeline-touch-area cc-${id} cc-point`}
        onMouseMove={changeCurrentTime}
        onMouseUp={async (ev: any) => {
          setIsMouseDown(false);
          updateCurrentTime(time);
          bridge.setCurrentTime(time);
          stopTimeChanging(ev);
        }}
        onMouseLeave={async (ev: any) => {
          setIsMouseDown(false);
          updateCurrentTime(time);
          bridge.setCurrentTime(time);
          stopTimeChanging(ev);
        }}
      />
    </>
  );
};
