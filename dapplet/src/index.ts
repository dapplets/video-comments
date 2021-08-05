import { IFeature } from '@dapplets/dapplet-extension';
import { IData, ISticker, IRemarkComment } from './types';
import abi from './abi';
import MENU_ICON from './icons/floatingButton.svg';
import MENU_ICON_HOVER from './icons/floatingButton_h.svg';
import MENU_ICON_ACTIVE from './icons/floatingButton_a.svg';
import ORANGE_ARROW from './icons/arrow_001.png';
import RED_ARROW from './icons/vector.svg';
import GLASSES_1 from './icons/glasses_1.png';
import GLASSES_2 from './icons/glasses_2.png';
import GLASSES_3 from './icons/glasses_3.svg';
import MUSTACHE_1 from './icons/mustache_1.svg';
import MUSTACHE_2 from './icons/mustache_2.svg';
import MUSTACHE_3 from './icons/mustache_3.svg';

const allStickers = {
  RED_ARROW,
  ORANGE_ARROW,
  GLASSES_1,
  GLASSES_2,
  GLASSES_3,
  MUSTACHE_1,
  MUSTACHE_2,
  MUSTACHE_3,
};

interface ISetConfigProps {
  forceOpenOverlay?: boolean
  stickerId?: string
}

@Injectable
export default class VideoFeature implements IFeature {
  @Inject('twitter-adapter.dapplet-base.eth')
  public twitterAdapter: any;

  @Inject('video-adapter.dapplet-base.eth')
  public adapter: any;

  private _overlay: any;
  private _videoEl: any;
  private _dontUpdate: boolean = false;
  private _wasPaused: boolean;
  private _config: any;
  private _setConfig: any;
  private _addingStickerId: number;
  private _currentTime: number;

  async activate(): Promise<void> {
    if (!this._overlay) {
      this._overlay = Core
        .overlay({ name: 'video-comments-overlay', title: 'Video Comments' })
        .listen({
          connectWallet: async () => {
            try {
              const wallet = await Core.wallet({ type: "ethereum", network: "rinkeby" });
              await wallet.connect();
              this._overlay.send('connectWallet_done', '');
            } catch (err) {
              this._overlay.send('connectWallet_undone', err);
            }
          },
          isWalletConnected: async () => {
            try {
              const wallet = await Core.wallet({ type: "ethereum", network: "rinkeby" });
              const isWalletConnected = await wallet.isConnected();
              this._overlay.send('isWalletConnected_done', isWalletConnected);
            } catch (err) {
              this._overlay.send('isWalletConnected_undone', err);
            }
          },
          getCurrentEthereumAccount: async () => {
            try {
              const wallet = await Core.wallet({ type: "ethereum", network: "rinkeby" });
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
          getAddingStickerParams: () => {
            const stickerElement: HTMLElement | null = document.querySelector(`.dapplet-sticker-${this._addingStickerId}`);
            console.log('stickerElemen', stickerElement);
            const width = stickerElement!.style.width;
            const height = stickerElement!.style.height;
            const transform = stickerElement!.style.transform;
            console.log('width', width);
            console.log('height', height);
            console.log('transform', transform);
            this._overlay.send('getAddingStickerParams_done', { width, height, transform });
          },
          pauseVideo: () => {
            try {
              this._wasPaused = this._videoEl.paused;
              if (!this._videoEl.paused) this._videoEl.pause();
              this._dontUpdate = true;
            } catch (err) {
              console.log('Cannot pause the video.', err);
            }
          },
          playVideoIfWasPlayed: async () => {
            try {
              if (!this._wasPaused) await this._videoEl.play();
              this._dontUpdate = false;
            } catch (err) {
              console.log('Cannot start to play the video.', err);
            }
          },
          setCurrentTime: (op: any, { type, message }: { type?: any, message: { time: number } }) => {
            try {
              this._videoEl.currentTime = message.time;
            } catch (err) {
              console.log('Cannot set new currentTime.', err);
            }
          },
          updateData: () => {
            this.adapter.detachConfig(this._config);
            this._addingStickerId = undefined;
            this.adapter.attachConfig(this._setConfig({ forceOpenOverlay: true }));
          },
          addSticker: (op: any, { type, message }: { type?: any, message: { stickerId: string } }) => {
            this.adapter.detachConfig(this._config);
            if (message) {
              this.adapter.attachConfig(this._setConfig({ stickerId: message.stickerId }));
            } else {
              this._addingStickerId = undefined;
              this.adapter.attachConfig(this._setConfig());
            }
          },
        });
    }

    const { sticker, label } = this.adapter.exports;

    this._setConfig = (props: ISetConfigProps | undefined) => {
      this._config = {
        VIDEO: async (ctx: any) => {
          this._videoEl = ctx.element;
          const commentsRemarkData = await this.getData(ctx.element!.baseURI!);
          const structuredComments: Promise<IData>[] = commentsRemarkData.comments
            .map(async (commentData: any): Promise<IData> => {
              const comment: IRemarkComment = commentData.comment;
              const ensNames = await this.getEnsNames([comment.user.name]);
              const name = ensNames !== undefined && ensNames.length !== 0 && ensNames[0] !== ''  ? ensNames[0] : comment.user.name;
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
                time: comment.time,
                text: comment.text,
                image: comment.user.picture,
                from,
                to,
                sticker,
                hidden: localStorage.getItem(comment.id) === 'hidden',
                url: comment.locator.url,
              };
              return structuredComment;
            });
          const commentsData = await Promise.all(structuredComments);

          if (props && props.forceOpenOverlay) this.openOverlay({ commentsData, ctx, videoId: ctx.element.baseURI })

          ctx.onTimeUpdate(() => {
            if (this._overlay.isOpen() && !this._dontUpdate) {
              this._overlay.send('time', { time: ctx.currentTime });
            }
            this._currentTime = ctx.currentTime;
          });

          const stickersOpacity = props && props.stickerId ? .3 : 1;

          const stickers = commentsData
            .map((commentData) => sticker({
              DEFAULT: {
                img: allStickers[commentData.sticker.id],
                vertical: commentData.sticker.vertical, // %
                horizontal: commentData.sticker.horizontal, // %
                transform: commentData.sticker.transform,
                from: commentData.from,
                to: commentData.to,
                mutable: false,
                opacity: stickersOpacity,
                exec: () => {
                  console.log('ctx:', ctx)
                },
              },
            }));

          const widgets = [
            label({
              DEFAULT: {
                img: {
                  main: MENU_ICON,
                  hover: MENU_ICON_HOVER,
                  active: MENU_ICON_ACTIVE,
                },
                vertical: 10,
                horizontal: 0,
                exec: () => this._overlay.isOpen() ? this._overlay.close() : this.openOverlay({ commentsData, ctx, videoId: ctx.element.baseURI }),
              },
            }),
            ...stickers,
          ];

          if (props && props.stickerId) {
            if (this._addingStickerId === undefined) this._addingStickerId = Math.trunc(Math.random() * 1_000_000_000);
            widgets.push(sticker({
              DEFAULT: {
                stickerId: this._addingStickerId,
                img: allStickers[props.stickerId],
              },
            }));
          }

          return widgets;
        },
      };
      return this._config;
    }
    this.adapter.attachConfig(this._setConfig());
  }

  openOverlay(props?: any): void {
    this._overlay.send('data', { ...props, images: allStickers });
    this._overlay.send('time', { time: this._currentTime });
  }

  async getData(uri: string) {
    try {
      const response = await fetch(`https://comments.dapplets.org/api/v1/find?site=remark&url=${uri}&sort=fld&format=tree`);
      return await response.json();
    } catch (e) {
      console.log('Error in getData():', e);
    }
  }

  getEnsNames = async ( eths: string[] ): Promise<string[] | undefined> => {
    const contract = Core.contract('ethereum', '0x196eC7109e127A353B709a20da25052617295F6f', abi);
    try {
      const ensNames = await contract.getNames(eths);
      return ensNames;
    } catch (err) {
      console.log('Error getting ens names.', err)
    }
  }
}
