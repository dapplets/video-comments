import { IFeature } from '@dapplets/dapplet-extension';
import update from 'immutability-helper';
import abi from './abi';
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
import { getRandomInt, parseCSS, roundToMultiple } from './utils';
import MENU_ICON from './icons/white-menu-icon.svg';
import { allStickers } from './stickerPack';

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
  private _isStableId: boolean
  private _$: any
  private _ctx: any
  private _selectedCommentId: string
  private _sharedData: ISharedData

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
            this._$(this._ctx, this._addingStickerId).state = 'HIDDEN';
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
            // console.log('message.from', message.from)
            // console.log('this._currentTime', this._currentTime)
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
            // console.log('this._addingStickerId', this._addingStickerId)
            // console.log('sticker', sticker)
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
            const sharedData: ISharedData = { ctxId: this._videoId, commentId: message };
            const link = core.createShareLink(url, sharedData);
            await navigator.clipboard.writeText(link);
            this._overlay.send('createShareLink_done', '');
          },
          copyTopicId: async (op: any, { type, message }: { type?: any, message: string }) => {
            await navigator.clipboard.writeText(message);
            this._overlay.send('copyTopicId_done', '');
          },
          changeTopicId: async (op: any, { type, message }: { type?: any, message: string }) => {
            this.adapter.detachConfig(this._config);
            this._addingStickerId = undefined;
            this._addingStickerTransform = undefined;
            this._from = undefined;
            this._to = undefined;
            this._videoId = message;
            const { $ } = this.adapter.attachConfig(this._setConfig({ forceOpenOverlay: true }));
            this._$ = $;
            this._overlay.send('changeTopicId_done', '');
          },
          createShareTopicLink: async (op: any, { type, message }: { type?: any, message: string }) => {
            const core: any = Core;
            const url = document.location.href;
            const sharedData: ISharedData = { ctxId: message };
            console.log('sharedData', sharedData)
            const link = core.createShareLink(url, sharedData);
            await navigator.clipboard.writeText(link);
            this._overlay.send('createShareTopicLink_done', '');
          },
        });
    }

    const { sticker, control, label } = this.adapter.exports;

    this._setConfig = (props: ISetConfigProps | undefined) => {
      this._config = {
        VIDEO: async (ctx: IVideoCtx ) => {
          if (!ctx.element) return;
          this._videoEl = <HTMLMediaElement>ctx.element;
          console.log('ctx', ctx)
          console.log('ctx.id', ctx.id)
          console.log('ctx.isStableLink', ctx.isStableLink)
          const isStableId = !!ctx.parent || ctx.isStableLink;
          console.log('isStableId', isStableId)
          const videoId = isStableId
            ? ctx.id
            : this._ctx?.id === ctx.id
              ? this._videoId
              : [...crypto.getRandomValues(new Uint8Array(15))].map(m=>('0'+m.toString(16)).slice(-2)).join('');
          console.log('videoId', videoId)

          const wallet = await core.wallet({ type: "ethereum", network: "goerli" });
          const isWalletConnected = await wallet.isConnected();

          let commentsRemarkData: any;
          try {
            // if (this._sharedData && this._sharedData.topicId) {
            //   commentsRemarkData = await this.getData(this._sharedData.topicId, isWalletConnected);
            // } else {
              commentsRemarkData = await this.getData(videoId, isWalletConnected);
            // }
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
          console.log('this._sharedData', this._sharedData)

          this._commentsData = commentsData;
          this._duration = ctx.duration;
          this._videoId = videoId;
          this._isStableId = isStableId;
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
            if (this._sharedData.ctxId !== this._videoId) {
              this.adapter.detachConfig(this._config);
              this._addingStickerId = undefined;
              this._addingStickerTransform = undefined;
              this._from = undefined;
              this._to = undefined;
              this._videoId = this._sharedData.ctxId;
              const { $ } = this.adapter.attachConfig(this._setConfig({ forceOpenOverlay: true }));
              this._$ = $;
            }
            if (this._sharedData.commentId && commentsData.map((commentData) => commentData.id).includes(this._sharedData.commentId)) {
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
                const time = roundToMultiple(this._ctx.currentTime);
                if (time > this._to) return;
                const movingStickerElement = e.target;
                if (!movingStickerElement) return;
                const currentCSSTransform = parseCSS('transform', movingStickerElement.style.transform);
                if (!this._addingStickerTransform) {
                  this._addingStickerTransform = this._$(this._ctx, this._addingStickerId).transform = {
                    [String(getRandomInt())]: { ...currentCSSTransform, time },
                  };
                } else {
                  const sortedPoints = Object.entries(this._addingStickerTransform).sort((a, b) => a[1].time - b[1].time);
                  if (sortedPoints.find((point) => point[1].time > time) && !this._videoEl.paused) this._videoEl.pause();
                  const oldAnimationPointAtSameTime = sortedPoints
                    .find(([key, value]: [a: string, b: IStickerTransformParams]) => value.time >= time - 0.2 && value.time < time + 0.2);
                  if (oldAnimationPointAtSameTime) {
                    this._addingStickerTransform[oldAnimationPointAtSameTime[0]] = { ...currentCSSTransform, time: oldAnimationPointAtSameTime[1].time };
                  } else {
                    this._addingStickerTransform[String(getRandomInt())] = { ...currentCSSTransform, time };
                  }
                  this._$(this._ctx, this._addingStickerId).transform = this._addingStickerTransform;
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

          if (!ctx.parent) {
            stickers.push(
              label({
                DEFAULT: {
                  img: MENU_ICON,
                  top: 20,
                  left: 20,
                  width: 48,
                  height: 48,
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
              })
            );
          }

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
    this._overlay.send('data', { ...props, isStableId: this._isStableId, images: allStickers });
    this._overlay.send('time', { time: this._currentTime });
  }

  async getData(topicId: string, isWalletConnected: boolean) {
    if (isWalletConnected) {
      const accountId = await this.getAccountId();
      try {
        const res = await fetch(`https://videocomments.mooo.com/auth/anonymous/login?user=${accountId}&site=remark&aud=remark`);
        const token = res.headers.get('X-Jwt');
        const headers: HeadersInit = new Headers();
        if (token) {
          headers.set('X-Jwt', token!);
          try {
            const response = await fetch(`https://videocomments.mooo.com/api/v1/find?site=remark&url=${topicId}&sort=fld&format=tree`, {
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
        const response = await fetch(`https://videocomments.mooo.com/api/v1/find?site=remark&url=${topicId}&sort=fld&format=tree`);
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
