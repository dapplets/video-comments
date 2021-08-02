import { IFeature } from '@dapplets/dapplet-extension';
import ORANGE_ARROW from './icons/arrow_001.png';
import RED_ARROW from './icons/vector.svg';
import MENU_ICON from './icons/floatingButton.svg';
import MENU_ICON_HOVER from './icons/floatingButton_h.svg';
import MENU_ICON_ACTIVE from './icons/floatingButton_a.svg';
import GLASSES_1 from './icons/glasses_1.png';
import GLASSES_2 from './icons/glasses_2.png';
import GLASSES_3 from './icons/glasses_3.svg';
import MUSTACHE_1 from './icons/mustache_1.svg';
import MUSTACHE_2 from './icons/mustache_2.svg';
import MUSTACHE_3 from './icons/mustache_3.svg';
import abi from './abi';

const allStickers = [RED_ARROW, ORANGE_ARROW, GLASSES_1, GLASSES_2, GLASSES_3, MUSTACHE_1, MUSTACHE_2, MUSTACHE_3];

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

  async activate(): Promise<void> {

    if (!this._overlay) {
      this._overlay = Core
        .overlay({ name: 'video-comments-overlay', title: 'Video Comments' })
        .listen({
          getEnsNames: async (op: any, { type, message }: { type?: any, message: { eths: string[] } }) => {
            const contract = Core.contract('ethereum', '0x196eC7109e127A353B709a20da25052617295F6f', abi);
            try {
              const ensNames = await contract.getNames(message.eths);
              this._overlay.send('getEnsNames_done', ensNames);
            } catch (err) {
              this._overlay.send('getEnsNames_undone', err);
            }
          },
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
            this.adapter.attachConfig(this._setConfig(true));
          },
        });
    }

    const { sticker, label } = this.adapter.exports;

    this._setConfig = (forceOpenOverlay: boolean = false) => {
        this._config = {
        VIDEO: async (ctx: any) => {
          this._videoEl = ctx.element;
          console.log('ctx', ctx)
          const commentsData = await this.getData(ctx.element!.baseURI!);
          console.log('all comments:', commentsData);

          if (forceOpenOverlay) this.openOverlay({ commentsData, ctx, videoId: ctx.element.baseURI })

          ctx.onTimeUpdate(() => this._overlay.isOpen() && !this._dontUpdate && this._overlay.send('time', { time: ctx.currentTime }));

          return [
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
            sticker({
              DEFAULT: {
                img: MUSTACHE_1,
                exec: () => {
                  console.log('ctx:', ctx)
                },
              },
            }),
            sticker({
              DEFAULT: {
                img: GLASSES_1,
                vertical: 10, // %
                horizontal: 30, // %
                heightCo: 0.5, // coefficient for the sticker height
                widthCo: 0.5, // coefficient for the sticker width
                exec: () => {
                  console.log('ctx:', ctx)
                },
              },
            }),
            sticker({
              DEFAULT: {
                img: RED_ARROW,
                horizontal: 65, // %
                from: 10,
                to: 30,
                exec: () => {
                  console.log('ctx:', ctx)
                },
              },
            }),
          ];
        },
      };
      return this._config
    }
    this.adapter.attachConfig(this._setConfig());
  }

  openOverlay(props?: any): void {
    this._overlay.send('data', { ...props, images: allStickers });
  }

  async getData(uri: string) {
    try {
      const response = await fetch(`https://comments.dapplets.org/api/v1/find?site=remark&url=${uri}&sort=fld&format=tree`);
      return await response.json();
    } catch (e) {
      console.log('Error in getData():', e);
    }
  }
}
