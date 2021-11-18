import React, { useEffect, useState } from 'react';
import { bridge } from './dappletBridge';
import { IStickerTransform } from './types';
import cn from 'classnames';

interface IPlayerProps {
  from: number
  to: number
  currentTime: number
  addingStickerTransform?: IStickerTransform
  doUpdateCCTimeline: boolean
  setDoUpdateCCTimeline: any
}

export default (props: IPlayerProps) => {
  const {
    from,
    to,
    currentTime,
    addingStickerTransform,
    doUpdateCCTimeline,
    setDoUpdateCCTimeline,
  } = props;

  const [isPlaying, setIsPlaying] = useState(true);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (active && isPlaying) {
      if (currentTime >= to) {
        bridge.pauseVideo();
        bridge.setCurrentTime(currentTime);
      }
    }
  });
  
  useEffect(() => {
    bridge.isVideoPlaying().then(setIsPlaying);
  });

  return (
    <div className='dp-player-container'>
      <div className='dp-player'>
        <div
          className='dp-arrow-to-from'
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setActive(true);
            if (isPlaying) bridge.pauseVideo();
            doUpdateCCTimeline && setDoUpdateCCTimeline(false);
            bridge.setCurrentTime(from);
          }}
        />
        <div
          className='dp-arrow-to-prev'
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setActive(true);
            if (isPlaying) bridge.pauseVideo();
            doUpdateCCTimeline && setDoUpdateCCTimeline(false);
            const nearestLowerPointTime = addingStickerTransform && Object.values(addingStickerTransform).map(({ time }) => time).sort((a, b) => b - a).find((trTime) => trTime < currentTime);
            bridge.setCurrentTime(nearestLowerPointTime ?? from);
          }}
        />
        <div
          className={cn(isPlaying ? 'dp-pause' : currentTime >= to ? 'dp-repeat' : 'dp-play')}
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            setActive(true);
            doUpdateCCTimeline && setDoUpdateCCTimeline(false);
            if (isPlaying) {
              bridge.pauseVideo();
            } else {
              if (currentTime >= to) bridge.setCurrentTime(from);
              const a = await bridge.playVideo();
            }
          }}
        />
        <div
          className='dp-arrow-to-next'
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setActive(true);
            if (isPlaying) bridge.pauseVideo();
            doUpdateCCTimeline && setDoUpdateCCTimeline(false);
            const nearestHigherPointTime = addingStickerTransform && Object.values(addingStickerTransform).map(({ time }) => time).sort((a, b) => a - b).find((trTime) => trTime > currentTime);
            bridge.setCurrentTime(nearestHigherPointTime ?? to);
          }}
        />
        <div
          className='dp-arrow-to-to'
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setActive(true);
            if (isPlaying) bridge.pauseVideo();
            doUpdateCCTimeline && setDoUpdateCCTimeline(false);
            bridge.setCurrentTime(to);
          }}
        />
      </div>
    </div>
  );
}