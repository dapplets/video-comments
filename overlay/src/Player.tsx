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
  isPlaying: boolean
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
}

export default (props: IPlayerProps) => {
  const {
    from,
    to,
    currentTime,
    addingStickerTransform,
    doUpdateCCTimeline,
    setDoUpdateCCTimeline,
    isPlaying,
    setIsPlaying,
  } = props;
  
  useEffect(() => {
    bridge.isVideoPlaying().then(setIsPlaying);
  });

  return (
    <div className='dp-player-container'>
      <div className='dp-player'>
        <button
          className='dp-arrow-to-from'
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isPlaying) bridge.pauseVideo();
            doUpdateCCTimeline && setDoUpdateCCTimeline(false);
            bridge.setCurrentTime(from);
          }}
        >
          <svg className='player-svg' width="22" height="19" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
              <path className='arrays-color' d="M19.9379 18.2645L22 16.2039L15.2917 9.49556L22 2.79743L19.9379 0.735352L11.1719 9.49994L19.9365 18.2645L19.9379 18.2645ZM4.91709 18.2499L7.83375 18.2499L7.83375 0.749937L4.91708 0.749938L4.91709 18.2499Z"/>
              <path className='arrays-color' d="M0.543292 18.2498L3.45996 18.2498L3.45996 0.749803L0.543289 0.749804L0.543292 18.2498Z"/>
            </g>
          </svg>
        </button>
        <button
          className='dp-arrow-to-prev'
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isPlaying) bridge.pauseVideo();
            doUpdateCCTimeline && setDoUpdateCCTimeline(false);
            const nearestLowerPointTime = addingStickerTransform && Object.values(addingStickerTransform).map(({ time }) => time).sort((a, b) => b - a).find((trTime) => trTime < currentTime);
            bridge.setCurrentTime(nearestLowerPointTime ?? from);
          }}
        >
          <svg className='player-svg' width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
              <path className='arrays-color' d="M15.978 0.735481L18.04 2.79611L11.3317 9.50444L18.04 16.2026L15.978 18.2646L7.21191 9.50006L15.9765 0.735481L15.978 0.735481ZM0.957124 0.750063L3.87379 0.750064L3.87379 18.2501L0.957123 18.2501L0.957124 0.750063Z"/>
            </g>
          </svg>
        </button>
        <button
          autoFocus
          className={cn(isPlaying ? 'dp-pause' : currentTime >= to ? 'dp-repeat' : 'dp-play')}
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            doUpdateCCTimeline && setDoUpdateCCTimeline(false);
            if (isPlaying) {
              bridge.pauseVideo();
            } else {
              if (currentTime >= to) bridge.setCurrentTime(from);
              const a = await bridge.playVideo();
            }
          }}
        >
          {isPlaying ? ( // pause
            <svg width="53" height="53" viewBox="8 1 53 53" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g className='player-svg'>
                <g>
                  <circle className="central-first-color" cx="34.5" cy="27.5" r="26.5"/>
                </g>
                <path className="central-back-color" d="M34.5002 45.2744C24.6882 45.2636 16.7366 37.3121 16.7258 27.5V27.1445C16.9212 17.3767 24.9635 9.59756 34.7325 9.72718C44.5014 9.8568 52.3345 17.8465 52.2707 27.6161C52.2068 37.3857 44.27 45.2724 34.5002 45.2744ZM34.4718 41.7195H34.5002C42.3507 41.7117 48.7094 35.3433 48.7055 27.4929C48.7016 19.6425 42.3364 13.2805 34.486 13.2805C26.6356 13.2805 20.2704 19.6425 20.2665 27.4929C20.2626 35.3433 26.6213 41.7117 34.4718 41.7195ZM39.8325 34.6098H36.2777V20.3903H39.8325V34.6098ZM32.7228 34.6098H29.1679V20.3903H32.7228V34.6098Z"/>
              </g>
            </svg>
          ) : currentTime >= to ? ( // repeat
            <svg width="53" height="53" viewBox="8 1 53 53" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g className='player-svg'>
                <g>
                  <circle className="central-first-color" cx="34.5" cy="27.5" r="26.5"/>
                </g>
                <path className="central-back-color" d="M45.1663 13.2805H41.6115V17.8256C39.4963 16.1635 36.8291 15.1722 33.9304 15.1722C27.0588 15.1722 21.4883 20.7428 21.4883 27.6143C21.4883 34.4859 27.0588 40.0564 33.9304 40.0564C37.7527 40.0564 41.1725 38.3328 43.4549 35.6203L40.5766 33.5144C38.9487 35.3469 36.5743 36.5015 33.9304 36.5015C29.0221 36.5015 25.0432 32.5226 25.0432 27.6143C25.0432 22.7061 29.0221 18.7271 33.9304 18.7271C35.8622 18.7271 37.65 19.3435 39.1079 20.3903L34.5017 20.3903V23.9452H45.1663V13.2805Z"/>
              </g>
            </svg>
          ) : ( // play
            <svg width="53" height="53" viewBox="8 1 53 53" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g className='player-svg'>
                <g>
                  <circle className="central-first-color" cx="34.5" cy="27.5" r="26.5"/>
                </g>
                <path className="central-back-color" d="M34.5 45.2744C24.6835 45.2744 16.7256 37.3165 16.7256 27.5C16.7256 17.6835 24.6835 9.72559 34.5 9.72559C44.3165 9.72559 52.2744 17.6835 52.2744 27.5C52.2636 37.312 44.312 45.2636 34.5 45.2744ZM20.2805 27.8057C20.3646 35.6286 26.7523 41.9142 34.5756 41.8723C42.3989 41.8301 48.7187 35.4762 48.7187 27.6528C48.7187 19.8294 42.3989 13.4756 34.5756 13.4333C26.7523 13.3915 20.3646 19.677 20.2805 27.5V27.8057ZM30.9451 35.4985V19.5015L41.6097 27.5L30.9451 35.4985Z"/>
              </g>
            </svg>
          )}
        </button>
        <button
          className='dp-arrow-to-next'
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isPlaying) bridge.pauseVideo();
            doUpdateCCTimeline && setDoUpdateCCTimeline(false);
            const nearestHigherPointTime = addingStickerTransform && Object.values(addingStickerTransform).map(({ time }) => time).sort((a, b) => a - b).find((trTime) => trTime > currentTime);
            bridge.setCurrentTime(nearestHigherPointTime ?? to);
          }}
        >
          <svg className='player-svg' width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
              <path className='arrays-color' d="M3.02204 18.2645L0.959958 16.2039L7.66829 9.49556L0.959961 2.79744L3.02204 0.735352L11.7881 9.49994L3.0235 18.2645L3.02204 18.2645ZM18.0429 18.2499L15.1262 18.2499L15.1262 0.749937L18.0429 0.749938L18.0429 18.2499Z"/>
            </g>
          </svg>
        </button>
        <button
          className='dp-arrow-to-to'
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isPlaying) bridge.pauseVideo();
            doUpdateCCTimeline && setDoUpdateCCTimeline(false);
            bridge.setCurrentTime(to);
          }}
        >
          <svg className='player-svg' width="22" height="19" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
              <path className='arrays-color' d="M2.06208 18.2645L-2.70461e-06 16.2039L6.70833 9.49556L-3.60546e-07 2.79743L2.06208 0.735352L10.8281 9.49994L2.06354 18.2645L2.06208 18.2645ZM17.0829 18.2499L14.1662 18.2499L14.1663 0.749937L17.0829 0.749938L17.0829 18.2499Z"/>
              <path className='arrays-color' d="M21.4567 18.2498L18.54 18.2498L18.54 0.749803L21.4567 0.749804L21.4567 18.2498Z"/>
            </g>
          </svg>
        </button>
      </div>
    </div>
  );
}