import { IFeature } from '@dapplets/dapplet-extension';
import ORANGE_ARROW from './icons/arrow_001.png';
import RED_ARROW from './icons/vector.svg';
import MENU_ICON from './icons/floatingButton.svg'

@Injectable
export default class VideoFeature implements IFeature {
  @Inject('video-adapter.dapplet-base.eth')
  public adapter: any;
  private _overlay: any;

  async activate(): Promise<void> {

    const overlayUrl = await Core.storage.get('overlayUrl');
    this._overlay = Core.overlay({ url: overlayUrl, title: 'Video Comments' });

    /*Core.onAction(async () => {
      this.openOverlay();
    });*/

    const { /*stickerPane,*/ sticker, label } = this.adapter.exports;
    this.adapter.attachConfig({
      VIDEO: async (ctx: any) => [
        /*stickerPane({
          stickers: server.stickers()
          stickers: [{
            img: DAPPLETS_IMG,
            from: 0,
            to: 13,
            //vertical: '50',
            //horizontal: '30',
            //width: '100px',
            exec: () => {
              console.log('ctx:', ctx)
              //ctx.setCurrentTime(20)
            }
          ] 
        }),*/
        label({
          DEFAULT: {
            img: MENU_ICON,
            vertical: 10,
            horizontal: 0,
            //exec: () => this._overlay.isOpen() ? this._overlay.close() : this.openOverlay(),
          },
        }),
        sticker({
          DEFAULT: {
            img: RED_ARROW,
            exec: () => {
              //console.log('ctx:', ctx)
              //ctx.setCurrentTime(20)
            },
          },
        }),
        sticker({
          DEFAULT: {
            img: ORANGE_ARROW,
            vertical: 10, // %
            horizontal: 30, // %
            heightCo: 0.5, // coefficient for the sticker height
            widthCo: 0.5, // coefficient for the sticker width
            exec: () => {
              //console.log('ctx:', ctx)
              //ctx.setCurrentTime(20)
            },
          },
        }),
      ],
    });
  }

  openOverlay(props?: any): void {
    this._overlay.send('data', props ?? {});
  }
}
