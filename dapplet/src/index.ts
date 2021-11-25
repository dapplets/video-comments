import { IFeature } from '@dapplets/dapplet-extension';
import {
  IData,
  ISticker,
  IRemarkComment,
  IVideoCtx,
  ISharedData,
  IStickerTransform,
  IStickerTransformParams,
  IChangeAddingStickerImageProps,
} from './types';
import abi from './abi';
import { getRandomInt, parseCSS, roundToMultiple } from './utils';
import update from 'immutability-helper';
import MENU_ICON from './icons/white-menu-icon.svg';

import ORANGE_ARROW from './icons/arrow_001.png';
import RED_ARROW from './icons/vector.svg';
import GLASSES_1 from './icons/glasses_1.png';
import GLASSES_2 from './icons/glasses_2.png';
import GLASSES_3 from './icons/glasses_3.svg';
import MUSTACHE_1 from './icons/mustache_1.svg';
import MUSTACHE_2 from './icons/mustache_2.svg';
import MUSTACHE_3 from './icons/mustache_3.svg';

import ARROW_001 from './icons/arrows/arrow-001.svg';
import ARROW_001_BLUE from './icons/arrows/arrow-001-blue.svg';
import ARROW_001_GREEN from './icons/arrows/arrow-001-green.svg';
import ARROW_001_PURPLE from './icons/arrows/arrow-001-purple.svg';
import ARROW_001_RED from './icons/arrows/arrow-001-red.svg';
import ARROW_001_YELLOW from './icons/arrows/arrow-001-yellow.svg';

import ARROW_002 from './icons/arrows/arrow-002.svg';
import ARROW_002_BLUE from './icons/arrows/arrow-002-blue.svg';
import ARROW_002_GREEN from './icons/arrows/arrow-002-green.svg';
import ARROW_002_PURPLE from './icons/arrows/arrow-002-purple.svg';
import ARROW_002_RED from './icons/arrows/arrow-002-red.svg';
import ARROW_002_YELLOW from './icons/arrows/arrow-002-yellow.svg';

import ARROW_003 from './icons/arrows/arrow-003.svg';
import ARROW_003_BLUE from './icons/arrows/arrow-003-blue.svg';
import ARROW_003_GREEN from './icons/arrows/arrow-003-green.svg';
import ARROW_003_PURPLE from './icons/arrows/arrow-003-purple.svg';
import ARROW_003_RED from './icons/arrows/arrow-003-red.svg';
import ARROW_003_YELLOW from './icons/arrows/arrow-003-yellow.svg';

import ARROW_004 from './icons/arrows/arrow-004.svg';
import ARROW_004_BLUE from './icons/arrows/arrow-004-blue.svg';
import ARROW_004_GREEN from './icons/arrows/arrow-004-green.svg';
import ARROW_004_PURPLE from './icons/arrows/arrow-004-purple.svg';
import ARROW_004_RED from './icons/arrows/arrow-004-red.svg';
import ARROW_004_YELLOW from './icons/arrows/arrow-004-yellow.svg';

import ARROW_005 from './icons/arrows/arrow-005.svg';
import ARROW_005_BLUE from './icons/arrows/arrow-005-blue.svg';
import ARROW_005_GREEN from './icons/arrows/arrow-005-green.svg';
import ARROW_005_PURPLE from './icons/arrows/arrow-005-purple.svg';
import ARROW_005_RED from './icons/arrows/arrow-005-red.svg';
import ARROW_005_YELLOW from './icons/arrows/arrow-005-yellow.svg';

import ARROW_006 from './icons/arrows/arrow-006.svg';
import ARROW_006_BLUE from './icons/arrows/arrow-006-blue.svg';
import ARROW_006_GREEN from './icons/arrows/arrow-006-green.svg';
import ARROW_006_PURPLE from './icons/arrows/arrow-006-purple.svg';
import ARROW_006_RED from './icons/arrows/arrow-006-red.svg';
import ARROW_006_YELLOW from './icons/arrows/arrow-006-yellow.svg';

import ARROW_007 from './icons/arrows/arrow-007.svg';
import ARROW_007_BLUE from './icons/arrows/arrow-007-blue.svg';
import ARROW_007_GREEN from './icons/arrows/arrow-007-green.svg';
import ARROW_007_PURPLE from './icons/arrows/arrow-007-purple.svg';
import ARROW_007_RED from './icons/arrows/arrow-007-red.svg';
import ARROW_007_YELLOW from './icons/arrows/arrow-007-yellow.svg';

import ARROW_008 from './icons/arrows/arrow-008.svg';
import ARROW_008_BLUE from './icons/arrows/arrow-008-blue.svg';
import ARROW_008_GREEN from './icons/arrows/arrow-008-green.svg';
import ARROW_008_PURPLE from './icons/arrows/arrow-008-purple.svg';
import ARROW_008_RED from './icons/arrows/arrow-008-red.svg';
import ARROW_008_YELLOW from './icons/arrows/arrow-008-yellow.svg';

import ARROW_009 from './icons/arrows/arrow-009.svg';
import ARROW_009_BLUE from './icons/arrows/arrow-009-blue.svg';
import ARROW_009_GREEN from './icons/arrows/arrow-009-green.svg';
import ARROW_009_PURPLE from './icons/arrows/arrow-009-purple.svg';
import ARROW_009_RED from './icons/arrows/arrow-009-red.svg';
import ARROW_009_YELLOW from './icons/arrows/arrow-009-yellow.svg';

import ARROW_SMILE_001 from './icons/arrows/arrow-smile-001.svg';
import ARROW_SMILE_002 from './icons/arrows/arrow-smile-002.svg';
import ARROW_SMILE_003 from './icons/arrows/arrow-smile-003.svg';
import ARROW_SMILE_004 from './icons/arrows/arrow-smile-004.svg';
import ARROW_SMILE_005 from './icons/arrows/arrow-smile-005.svg';
import ARROW_SMILE_006 from './icons/arrows/arrow-smile-006.svg';
import ARROW_SMILE_007 from './icons/arrows/arrow-smile-007.svg';
import ARROW_SMILE_008 from './icons/arrows/arrow-smile-008.svg';
import ARROW_SMILE_009 from './icons/arrows/arrow-smile-009.svg';
import ARROW_SMILE_010 from './icons/arrows/arrow-smile-010.svg';
import ARROW_SMILE_011 from './icons/arrows/arrow-smile-011.svg';
import ARROW_SMILE_012 from './icons/arrows/arrow-smile-012.svg';
import ARROW_SMILE_013 from './icons/arrows/arrow-smile-013.svg';
import ARROW_SMILE_014 from './icons/arrows/arrow-smile-014.svg';
import ARROW_SMILE_015 from './icons/arrows/arrow-smile-015.svg';
import ARROW_SMILE_016 from './icons/arrows/arrow-smile-016.svg';
import ARROW_SMILE_017 from './icons/arrows/arrow-smile-017.svg';
import ARROW_SMILE_018 from './icons/arrows/arrow-smile-018.svg';
import ARROW_SMILE_019 from './icons/arrows/arrow-smile-019.svg';
import ARROW_SMILE_020 from './icons/arrows/arrow-smile-020.svg';

import SMILE_BR_001 from './icons/arrows/smile-br-001.svg';
import SMILE_BR_002 from './icons/arrows/smile-br-002.svg';
import SMILE_BR_003 from './icons/arrows/smile-br-003.svg';
import SMILE_BR_004 from './icons/arrows/smile-br-004.svg';
import SMILE_BR_005 from './icons/arrows/smile-br-005.svg';
import SMILE_BR_006 from './icons/arrows/smile-br-006.svg';
import SMILE_BR_007 from './icons/arrows/smile-br-007.svg';
import SMILE_BR_008 from './icons/arrows/smile-br-008.svg';
import SMILE_BR_009 from './icons/arrows/smile-br-009.svg';

const allStickers = {
  RED_ARROW,
  ORANGE_ARROW,
  GLASSES_1,
  GLASSES_2,
  GLASSES_3,
  MUSTACHE_1,
  MUSTACHE_2,
  MUSTACHE_3,

  ARROW_001,
  ARROW_001_BLUE,
  ARROW_001_GREEN,
  ARROW_001_PURPLE,
  ARROW_001_RED,
  ARROW_001_YELLOW,

  ARROW_002,
  ARROW_002_BLUE,
  ARROW_002_GREEN,
  ARROW_002_PURPLE,
  ARROW_002_RED,
  ARROW_002_YELLOW,

  ARROW_003,
  ARROW_003_BLUE,
  ARROW_003_GREEN,
  ARROW_003_PURPLE,
  ARROW_003_RED,
  ARROW_003_YELLOW,

  ARROW_004,
  ARROW_004_BLUE,
  ARROW_004_GREEN,
  ARROW_004_PURPLE,
  ARROW_004_RED,
  ARROW_004_YELLOW,

  ARROW_005,
  ARROW_005_BLUE,
  ARROW_005_GREEN,
  ARROW_005_PURPLE,
  ARROW_005_RED,
  ARROW_005_YELLOW,

  ARROW_006,
  ARROW_006_BLUE,
  ARROW_006_GREEN,
  ARROW_006_PURPLE,
  ARROW_006_RED,
  ARROW_006_YELLOW,

  ARROW_007,
  ARROW_007_BLUE,
  ARROW_007_GREEN,
  ARROW_007_PURPLE,
  ARROW_007_RED,
  ARROW_007_YELLOW,

  ARROW_008,
  ARROW_008_BLUE,
  ARROW_008_GREEN,
  ARROW_008_PURPLE,
  ARROW_008_RED,
  ARROW_008_YELLOW, 

  ARROW_009,
  ARROW_009_BLUE,
  ARROW_009_GREEN,
  ARROW_009_PURPLE,
  ARROW_009_RED,
  ARROW_009_YELLOW,

  ARROW_SMILE_001,
  ARROW_SMILE_002,
  ARROW_SMILE_003,
  ARROW_SMILE_004,
  ARROW_SMILE_005,
  ARROW_SMILE_006,
  ARROW_SMILE_007,
  ARROW_SMILE_008,
  ARROW_SMILE_009,
  ARROW_SMILE_010,
  ARROW_SMILE_011,
  ARROW_SMILE_012,
  ARROW_SMILE_013,
  ARROW_SMILE_014,
  ARROW_SMILE_015,
  ARROW_SMILE_016,
  ARROW_SMILE_017,
  ARROW_SMILE_018,
  ARROW_SMILE_019,
  ARROW_SMILE_020,

  SMILE_BR_001,
  SMILE_BR_002,
  SMILE_BR_003,
  SMILE_BR_004,
  SMILE_BR_005,
  SMILE_BR_006,
  SMILE_BR_007,
  SMILE_BR_008,
  SMILE_BR_009,
};

interface ISetConfigProps {
  forceOpenOverlay?: boolean
  stickerName?: string
}

@Injectable
export default class VideoFeature implements IFeature {

  @Inject('video-adapter.dapplet-base.eth')
  public adapter: any

  private _overlay: any
  private _videoEl: HTMLMediaElement
  private _wasPaused: boolean
  private _config: any
  private _setConfig: any
  private _currentTime: number
  private _commentsData: any
  private _duration: number
  private _videoId: string
  private _$: any
  private _ctx: any
  private _selectedCommentId: string
  private _sharedData: any

  private _addingStickerId: string
  private _addingStickerTransform: IStickerTransform
  private _from: number
  private _to: number

  async activate(): Promise<void> {

    const core: any = Core;
    core.onShareLink((sharedData: ISharedData) => this._sharedData = sharedData);

    if (!this._overlay) {
      this._overlay = Core
        .overlay({ name: 'video-comments-overlay', title: 'Video Comments' })
        .listen({
          connectWallet: async () => {
            try {
              const wallet = await core.wallet({ type: "ethereum", network: "goerli" });
              await wallet.connect();
              this._overlay.send('connectWallet_done', '');
            } catch (err) {
              this._overlay.send('connectWallet_undone', err);
            }
          },
          disconnectWallet: async () => {
            try {
              const wallet = await core.wallet({ type: "ethereum", network: "goerli" });
              await wallet.disconnect();
              this._overlay.send('disconnectWallet_done', '');
            } catch (err) {
              this._overlay.send('disconnectWallet_undone', err);
            }
          },
          isWalletConnected: async () => {
            try {
              const wallet = await core.wallet({ type: "ethereum", network: "goerli" });
              const isWalletConnected = await wallet.isConnected();
              this._overlay.send('isWalletConnected_done', isWalletConnected);
            } catch (err) {
              this._overlay.send('isWalletConnected_undone', err);
            }
          },
          getCurrentEthereumAccount: async () => {
            try {
              const wallet = await core.wallet({ type: "ethereum", network: "goerli" });
              wallet.sendAndListen('eth_accounts', [], {
                result: (op, { data }) => {
                  const currentAddress = data[0];
                  this._overlay.send('getCurrentEthereumAccount_done', currentAddress);
                },
              });
            } catch (err) {
              this._overlay.send('getCurrentEthereumAccount_undone', err);
            }
          },
          getEnsNames: async (op: any, { type, message }: { type?: any, message: { name: string } }) => {
            try {
              const ensNames = await this.getEnsNames([message.name]);
              this._overlay.send('getEnsNames_done', ensNames);
            } catch (err) {
              console.log('Cannot get ens names.', err);
              this._overlay.send('getEnsNames_undone', err);
            }
          },
          isVideoPlaying: () => {
            const video: HTMLMediaElement = this._videoEl;
            this._overlay.send('isVideoPlaying_done', !video.paused)
          },
          pauseVideo: () => {
            try {
              this._wasPaused = this._videoEl.paused;
              if (!this._videoEl.paused) this._videoEl.pause();
              this._overlay.send('pauseVideo_done')
            } catch (err) {
              console.log('Cannot pause the video.', err);
              this._overlay.send('pauseVideo_undone')
            }
          },
          playVideo: async () => {
            try {
              this._wasPaused = this._videoEl.paused;
              if (this._videoEl.paused) await this._videoEl.play();
              this._overlay.send('playVideo_done')
            } catch (err) {
              console.log('Cannot play the video.', err);
              this._overlay.send('playVideo_undone')
            }
          },
          playVideoIfWasPlayed: async () => {
            try {
              if (!this._wasPaused) await this._videoEl.play();
              this._overlay.send('playVideoIfWasPlayed_done')
            } catch (err) {
              console.log('Cannot start to play the video.', err);
              this._overlay.send('playVideoIfWasPlayed_undone')
            }
          },
          setCurrentTime: (op: any, { type, message }: { type?: any, message: { time: number } }) => {
            try {
              this._videoEl.currentTime = message.time;
            } catch (err) {
              console.log('Cannot set new currentTime.', err);
            }
          },
          hideItem: (op: any, { type, message }: { type?: any, message?: { props: any } }) => {
            const id = message.props.itemToHideId
            if (localStorage.getItem(id) === 'hidden') {
              localStorage.removeItem(id);
              const commentIndex = this._commentsData.findIndex((comment) => comment.id === id);
              this._commentsData = update(this._commentsData, { [commentIndex]: { hidden: { $set: false } } });
              this._$(this._ctx, id).state = 'DEFAULT';
            } else {
              localStorage.setItem(id, 'hidden');
              const commentIndex = this._commentsData.findIndex((comment) => comment.id === id);
              this._commentsData = update(this._commentsData, { [commentIndex]: { hidden: { $set: true } } });
              this._$(this._ctx, id).state = 'HIDDEN';
            }
            this.openOverlay({
              commentsData: this._commentsData,
              duration: this._duration,
              videoId: this._videoId,
            });
            return;
          },
          updateData: () => {
            this.adapter.detachConfig(this._config);
            this._addingStickerId = undefined;
            this._addingStickerTransform = undefined;
            this._from = undefined;
            this._to = undefined;
            const { $ } = this.adapter.attachConfig(this._setConfig({ forceOpenOverlay: true }));
            this._$ = $;
          },
          addSticker: (op: any, { type, message }: { type?: any, message: { from: number, to: number } }) => {
            this._from = message.from;
            this._to = message.to;
            this._overlay.send('addSticker_done');
          },
          getAddingStickerParams: () => {
            this._overlay.send('getAddingStickerParams_done', { transform: this._addingStickerTransform });
          },
          changeAddingStickerImage: (op: any, { message }: { type?: any, message?: IChangeAddingStickerImageProps }) => {
            if (message === undefined) {
              this._$(this._ctx, this._addingStickerId).state = 'HIDDEN';
            } else {
              if (this._$(this._ctx, this._addingStickerId).state === 'HIDDEN') {
                this._commentsData.filter((commentData) => !commentData.hidden).forEach((commentData) => {
                  this._$(this._ctx, commentData.id).state = 'INACTIVE';
                });
                this._$(this._ctx, this._addingStickerId).state = 'ACTIVE';
              }
              this.updateFromTo(message.from, message.to);
              this._$(this._ctx, this._addingStickerId).img = allStickers[message.stickerName];
            }
            this._overlay.send('changeAddingStickerImage_done');
          },
          changeStickerTransformPointTime: (
            op: any,
            { type, message }: { type?: any, message: { transformPointId: string, time: number } }
          ) => {
            const { transformPointId, time } = message;
            this._addingStickerTransform = this._$(this._ctx, this._addingStickerId).transform = {
              ...this._addingStickerTransform,
              [transformPointId]: { ...this._addingStickerTransform[transformPointId], time },
            };
            this._overlay.send('changeStickerTransformPointTime_done', this._addingStickerTransform);
          },
          changeFrom: (op: any, { type, message }: { type?: any, message: { time: number } }) => {
            this._from = this._$(this._ctx, this._addingStickerId).from = message.time;
            this._overlay.send('changeFrom_done', '');
          },
          changeTo: (op: any, { type, message }: { type?: any, message: { time: number } }) => {
            this._to = this._$(this._ctx, this._addingStickerId).to = message.time;
            this._overlay.send('changeTo_done', '');
          },
          addPoint: () => {
            // console.log('here')
            const sticker: HTMLElement = document.querySelector(`.dapplet-sticker-${this._addingStickerId}`);
            console.log('this._addingStickerId', this._addingStickerId)
            console.log('sticker', sticker)
            const currentCSSTransform = sticker
              ? parseCSS('transform', sticker.style.transform)
              : {
                scale: 1,
                translateX: 0, 
                translateY: 0,
                rotate: 0,
              };
            const time = roundToMultiple(this._ctx.currentTime);
            if (!this._addingStickerTransform) {
              this._addingStickerTransform = this._$(this._ctx, this._addingStickerId).transform = {
                [String(getRandomInt())]: { ...currentCSSTransform, time },
              };
            } else {
              const sortedPoints = Object.entries(this._addingStickerTransform).sort((a, b) => a[1].time - b[1].time);
              const oldAnimationPointAtSameTime = sortedPoints
                .find(([key, value]: [a: string, b: IStickerTransformParams]) => value.time === time);
              if (oldAnimationPointAtSameTime) return;
              this._addingStickerTransform = this._$(this._ctx, this._addingStickerId).transform = {
                ...this._addingStickerTransform,
                [String(getRandomInt())]: { ...currentCSSTransform, time },
              };
            }
            // console.log('this._addingStickerTransform', this._addingStickerTransform)
            this._overlay.send('transform', this._addingStickerTransform);
          },
          deletePoint: () => {
            const time = roundToMultiple(this._ctx.currentTime);
            if (Object.keys(this._addingStickerTransform).length === 1) {
              this._addingStickerTransform = undefined;
              this._$(this._ctx, this._addingStickerId).transform = 'scale(1) translate(0%, 0%) rotate(0rad)';
              this._$(this._ctx, this._addingStickerId).reset = true;
            } else {
              const sortedPoints = Object.entries(this._addingStickerTransform).sort((a, b) => a[1].time - b[1].time);
              const oldAnimationPointAtSameTime = sortedPoints
                .find(([key, value]: [a: string, b: IStickerTransformParams]) => value.time === time);
              if (!oldAnimationPointAtSameTime) return;
              delete this._addingStickerTransform[oldAnimationPointAtSameTime[0]];
              this._$(this._ctx, this._addingStickerId).transform = this._addingStickerTransform;
            }
            // console.log('this._addingStickerTransform', this._addingStickerTransform)
            this._overlay.send('transform', this._addingStickerTransform);
          },
          highlightSticker: (op: any, { type, message }: { type?: any, message: { stickerID: string } }) => {
            if (message) {
              const id = this._selectedCommentId = message.stickerID;
              this._commentsData.filter((commentData) => !commentData.hidden).forEach((commentData) => {
                this._$(this._ctx, commentData.id).state = commentData.id === id ? 'ACTIVE' : 'MUTED';
              });
              if (localStorage.getItem(id) === 'hidden') {
                localStorage.removeItem(id);
                const commentIndex = this._commentsData.findIndex((comment) => comment.id === id);
                this._commentsData = update(this._commentsData, { [commentIndex]: { hidden: { $set: false } } });
                this._$(this._ctx, id).hidden = false;
              }
              this.openOverlay({
                commentsData: this._commentsData,
                duration: this._duration,
                videoId: this._videoId,
                selectedCommentId: id,
              });
            } else {
              this._commentsData.filter((commentData) => !commentData.hidden).forEach((commentData) => {
                this._$(this._ctx, commentData.id).state = 'DEFAULT';
                this._selectedCommentId = undefined;
              });
            }
            this._overlay.send('highlightSticker_done');
          },
          createShareLink: async (op: any, { type, message }: { type?: any, message: string }) => {
            const core: any = Core;
            const url = document.location.href;
            const sharedData: ISharedData = { ctxId: this._ctx.id, commentId: message };
            const link = core.createShareLink(url, sharedData);
            await navigator.clipboard.writeText(link);
            this._overlay.send('createShareLink_done', '');
          },
        });
    }

    const { sticker, control } = this.adapter.exports;

    this._setConfig = (props: ISetConfigProps | undefined) => {
      this._config = {
        VIDEO: async (ctx: IVideoCtx ) => {
          if (!ctx.element) return;
          this._videoEl = <HTMLMediaElement>ctx.element;
          const videoId = ctx.id;

          const wallet = await core.wallet({ type: "ethereum", network: "goerli" });
          const isWalletConnected = await wallet.isConnected();

          let commentsRemarkData: any;
          try {
            commentsRemarkData = await this.getData(videoId, isWalletConnected);
          } catch (err) {
            console.log('Error getting data from Remark.', err);
          }
          if (commentsRemarkData === undefined || Object.keys(commentsRemarkData).length === 0) return;
          const { comments } = commentsRemarkData;
          const structuredComments: Promise<IData>[] = comments
            .map(async (commentData: any): Promise<IData> => {
              const comment: IRemarkComment = commentData.comment;
              const name = comment.user.name
              const ensNames = await this.getEnsNames([comment.user.name]);
              const ensName = ensNames !== undefined && ensNames.length !== 0 && ensNames[0] !== '' && ensNames[0];
              let from = 0;
              let to: number;
              let sticker: ISticker;
              if (comment.title !== undefined) { 
                const title: { from: number, to: number, sticker: ISticker } = JSON.parse(comment.title);
                from = title.from;
                to = title.to;
                sticker = title.sticker;
              }
              const structuredComment: IData = {
                id: comment.id,
                name: name,
                ensName,
                time: comment.time,
                text: comment.text,
                image: comment.user.picture,
                from,
                to,
                sticker,
                hidden: localStorage.getItem(comment.id) === 'hidden',
                selected: false,
                url: comment.locator.url,
                score: comment.score,
                vote: comment.vote,
              };
              return structuredComment;
            });
          const commentsData = await Promise.all(structuredComments);

          // console.log('commentsData', commentsData)

          this._commentsData = commentsData;
          this._duration = ctx.duration;
          this._videoId = videoId;
          this._ctx = ctx;

          if ((props && props.forceOpenOverlay) || this._overlay.isOpen()) {
            this.openOverlay({
              commentsData,
              duration: ctx.duration,
              videoId: videoId,
              selectedCommentId: this._selectedCommentId,
            });
          }

          ctx.onTimeUpdate(() => {
            if (this._overlay.isOpen()) {
              this._overlay.send('time', { time: ctx.currentTime });
            }
            this._currentTime = ctx.currentTime;
          });

          if (this._sharedData) {
            if (commentsData.map((commentData) => commentData.id).includes(this._sharedData.commentId)) {
              const selectedCommentData = commentsData.find((commentData) => commentData.id === this._sharedData.commentId);
              this._videoEl.currentTime = selectedCommentData.from + 0.1; // +0.1 sec to make sure the sticker is shown
              this._wasPaused = this._videoEl.paused;
              if (!this._videoEl.paused) this._videoEl.pause();

              const id = this._selectedCommentId = this._sharedData.commentId;
              if (localStorage.getItem(id) === 'hidden') {
                localStorage.removeItem(id);
                const commentIndex = this._commentsData.findIndex((comment) => comment.id === id);
                this._commentsData = update(this._commentsData, { [commentIndex]: { hidden: { $set: false } } });
              }

              this.openOverlay({
                commentsData: this._commentsData,
                duration: this._duration,
                videoId: this._videoId,
                selectedCommentId: id,
              });
            }
          }

          const displayedStickersData = commentsData.filter((commentData) => !commentData.hidden);
          const stickers = commentsData
            .map((commentData) => sticker({
              id: commentData.id,
              initial: commentData.hidden ? 'HIDDEN' : (props && props.stickerName ? 'MUTED' : 'DEFAULT'),
              DEFAULT: {
                img: allStickers[commentData.sticker.id],
                vertical: commentData.sticker.vertical,
                horizontal: commentData.sticker.horizontal,
                transform: commentData.sticker.transform,
                from: commentData.from,
                to: commentData.to,
                mutable: false,
                opacity: '1',
                init: (_, me) => {
                  if (this._sharedData && this._sharedData.ctxId === ctx.id) {
                    me.state = commentData.id !== this._sharedData.commentId ? 'MUTED' : 'ACTIVE';
                  }
                },
                exec: () => {
                  displayedStickersData.forEach((dispStDt) => {
                    this._$(ctx, dispStDt.id).state = dispStDt.id === commentData.id ? 'ACTIVE' : 'MUTED';
                  });
                  this.openOverlay({
                    commentsData,
                    duration: ctx.duration,
                    videoId: videoId,
                    selectedCommentId: commentData.id,
                  });
                },
              },
              ACTIVE: {
                img: allStickers[commentData.sticker.id],
                vertical: commentData.sticker.vertical,
                horizontal: commentData.sticker.horizontal,
                transform: commentData.sticker.transform,
                from: commentData.from,
                to: commentData.to,
                mutable: false,
                opacity: '1',
                exec: () => {
                  displayedStickersData.forEach((dispStDt) => {
                    this._$(ctx, dispStDt.id).state = 'DEFAULT';
                  });
                  this.openOverlay({
                    commentsData,
                    duration: ctx.duration,
                    videoId: videoId,
                  });
                },
              },
              MUTED: {
                img: allStickers[commentData.sticker.id],
                vertical: commentData.sticker.vertical,
                horizontal: commentData.sticker.horizontal,
                transform: commentData.sticker.transform,
                from: commentData.from,
                to: commentData.to,
                mutable: false,
                opacity: '.3',
                exec: () => {
                  displayedStickersData.forEach((dispStDt) => {
                    this._$(ctx, dispStDt.id).state = dispStDt.id === commentData.id ? 'ACTIVE' : 'MUTED';
                  });
                  this.openOverlay({
                    commentsData,
                    duration: ctx.duration,
                    videoId: videoId,
                    selectedCommentId: commentData.id,
                  });
                },
              },
              INACTIVE: {
                img: allStickers[commentData.sticker.id],
                vertical: commentData.sticker.vertical,
                horizontal: commentData.sticker.horizontal,
                transform: commentData.sticker.transform,
                from: commentData.from,
                to: commentData.to,
                mutable: false,
                opacity: '.3',
              },
              HIDDEN: {
                img: allStickers[commentData.sticker.id],
                vertical: commentData.sticker.vertical,
                horizontal: commentData.sticker.horizontal,
                transform: commentData.sticker.transform,
                from: commentData.from,
                to: commentData.to,
                mutable: false,
                opacity: '0',
              },
            }));

          this._addingStickerId = String(Math.trunc(Math.random() * 1_000_000_000));
          stickers.push(sticker({
            id: this._addingStickerId,
            initial: 'HIDDEN',
            ACTIVE: {
              stickerId: this._addingStickerId,
              reset: false,
              opacity: '1',
              disabled: false,
              onChange: (e: any) => {
                const movingStickerElement = e.target
                if (!movingStickerElement) return;
                const currentCSSTransform = parseCSS('transform', movingStickerElement.style.transform);
                const time = roundToMultiple(this._ctx.currentTime);
  
                if (!this._addingStickerTransform) {
                  this._addingStickerTransform = this._$(this._ctx, this._addingStickerId).transform = {
                    [String(getRandomInt())]: { ...currentCSSTransform, time },
                  };
                } else {
                  const sortedPoints = Object.entries(this._addingStickerTransform).sort((a, b) => a[1].time - b[1].time);
                  const oldAnimationPointAtSameTime = sortedPoints
                    .find(([key, value]: [a: string, b: IStickerTransformParams]) => value.time >= time - 0.03 && value.time < time + 0.03);
                  this._addingStickerTransform = this._$(this._ctx, this._addingStickerId).transform = {
                    ...this._addingStickerTransform,
                    [oldAnimationPointAtSameTime ? oldAnimationPointAtSameTime[0] : String(getRandomInt())]: { ...currentCSSTransform, time },
                  };
                }

                this._overlay.send('transform', this._addingStickerTransform);
              }
            },
            HIDDEN: {
              stickerId: this._addingStickerId,
              reset: true,
              opacity: '0',
              disabled: true,
            },
          }));

          return stickers;
        },
        RIGHT_CONTROLS: () =>
          control({
            DEFAULT: {
              img: MENU_ICON,
              tooltip: 'Video Comments',
              exec: () => {
                if (this._overlay.isOpen()) {
                  this._overlay.close();
                } else {
                  this.openOverlay({
                    commentsData: this._commentsData,
                    duration: this._duration,
                    videoId: this._videoId,
                  });
                }
              },
            },
          }),
      };
      return this._config;
    }
    const { $ } = this.adapter.attachConfig(this._setConfig());
    this._$ = $;
  }

  openOverlay(props?: any): void {
    this._overlay.send('data', { ...props, images: allStickers });
    this._overlay.send('time', { time: this._currentTime });
  }

  async getData(uri: string, isWalletConnected: boolean) {
    if (isWalletConnected) {
      const accountId = await this.getAccountId();
      try {
        const res = await fetch(`https://videocomments.mooo.com/auth/anonymous/login?user=${accountId}&site=remark&aud=remark`);
        const token = res.headers.get('X-Jwt');
        const headers: HeadersInit = new Headers();
        if (token) {
          headers.set('X-Jwt', token!);
          try {
            const response = await fetch(`https://videocomments.mooo.com/api/v1/find?site=remark&url=${uri}&sort=fld&format=tree`, {
              method: 'GET',
              headers,
            });
            const res = await response.json();
            return res;
          } catch (err) {
            console.log('Error getting comments.', err)
          }
        }
      } catch (e) {
        console.log('Error connecting to the comment engine.', e)
      }
    } else {
      try {
        const response = await fetch(`https://videocomments.mooo.com/api/v1/find?site=remark&url=${uri}&sort=fld&format=tree`);
        return await response.json();
      } catch (e) {
        console.log('Error in getData():', e);
      }
    }
  }
  
  async getAccountId(): Promise<string> {
    const core: any = Core;
    return new Promise((res, rej) => 
      core.wallet({ type: "ethereum", network: "goerli" })
        .then(w => w.sendAndListen('eth_accounts', [], {
          result: (op, { data }) => {
            const accountId =  data[0];
            res(accountId);
          },
          reject: () => rej('Error getting etherium account.')
        }))
        .catch(() => rej('Error connecting to wallet.'))
    );
  }

  getEnsNames = async ( eths: string[] ): Promise<string[] | undefined> => {
    const contract = await Core.contract('ethereum', '0x3f3d7dc7f0ad3878de67079e07df06b150ac7421', abi);
    try {
      const ensNames = await contract.getNames(eths);
      return ensNames;
    } catch (err) {
      console.log('Error getting ens names.', err)
    }
  }

  updateFromTo = (from = this._from, to = this._to) => {
    this._$(this._ctx, this._addingStickerId).from = this._from = from;
    this._$(this._ctx, this._addingStickerId).to = this._to = to;
  }
}
