import React, { useEffect, useState } from 'react';
import { Progress } from 'semantic-ui-react';
import { bridge } from './dappletBridge';

interface ICCTimelineProps {
  currentTime: number
  videoLength: number
  activeCommentCount: number
  updateCurrentTime: any
};

export const CCTimeline = (props: ICCTimelineProps) => {
  const { currentTime, videoLength, activeCommentCount, updateCurrentTime } = props;
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    addPropTimestamp(formatTime(currentTime));
    addPropActiveComments(activeCommentCount.toString());
  });

  return (
    <div className='dapplet-double-timeline'>
      <div className='time-labels'>
        <div>
          00:00
        </div>
        <div>
          {formatTime(Math.ceil(videoLength))}
        </div>
      </div>
      <Progress 
        className='dapplet-timeline-comments activecomments'
        percent={100 * currentTime / videoLength}
        size='tiny'
      />
      <Progress 
        className='dapplet-timeline-comments timestamp'
        percent={100 * currentTime / videoLength}
        size='tiny'
      />
      <Progress 
        className='dapplet-timeline-comments progressbar'
        percent={100 * currentTime / videoLength}
        size='tiny'
      />
      <Progress 
        className='dapplet-timeline-comments progressbar touch'
        percent={100 * currentTime / videoLength}
        onMouseDown={(e: any) => {
          const el: any = document.querySelector('.timeline-touch-area');
          if (el === null) return;
          el.style.display = 'block';
          bridge.pauseVideo();
          const newCurrentTime = (e.pageX - 20) <= 0 ? 0 : (e.pageX - 20) * videoLength / (e.target.parentElement.offsetWidth - 2);
          updateCurrentTime(newCurrentTime);
          bridge.setCurrentTime(newCurrentTime);
          setIsMoving(true);
        }}
      />
      <div
        className='timeline-touch-area cc'
        onMouseMove={(ev: any) => {
          ev.preventDefault();
          ev.stopPropagation();
          if (!isMoving || ev.pageX < 20 || ev.pageX > 410) return;
          const newTime = (ev.pageX - 20) * videoLength / ev.target.parentElement.offsetWidth;
          const newCurrentTime = newTime < 0 ? 0 : newTime > videoLength ? videoLength : newTime;
          updateCurrentTime(newCurrentTime);
          bridge.setCurrentTime(newCurrentTime);
        }}
        onMouseUp={async (ev: any) => {
          ev.preventDefault();
          ev.stopPropagation();
          if (!isMoving) return;
          ev.target.style.display = 'none';
          await bridge.playVideoIfWasPlayed();
          setIsMoving(false);
        }}
        onMouseLeave={async (ev: any) => {
          ev.preventDefault();
          ev.stopPropagation();
          if (!isMoving) return;
          ev.target.style.display = 'none';
          await bridge.playVideoIfWasPlayed();
          setIsMoving(false);
        }}
      />
    </div>
  );
};

const formatTime = (time: number) => {
  const seconds = Math.ceil(time);
  const s = (seconds % 60).toString();
  const m = Math.floor(seconds / 60 % 60).toString();
  const h = Math.floor(seconds / 60 / 60 % 60).toString();
  return h !== '0'
    ? `${h.padStart(2,'0')}:${m.padStart(2,'0')}:${s.padStart(2,'0')}`
    : `${m.padStart(2,'0')}:${s.padStart(2,'0')}`;
};

const addPropTimestamp = (value: string) => {
  const el = document.querySelector('.dapplet-timeline-comments.timestamp>.bar');
  el?.setAttribute('data-timestamp', value);
};

const addPropActiveComments = (value: string) => {
  const el = document.querySelector('.dapplet-timeline-comments.activecomments>.bar');
  el?.setAttribute('data-activecomments', value);
};
