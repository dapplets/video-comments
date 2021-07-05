import { IFeature } from '@dapplets/dapplet-extension';
import DAPPLETS_IMG from './icons/arrow_001.png';

@Injectable
export default class VideoFeature implements IFeature {
  @Inject('video-adapter.dapplet-base.eth')
  public adapter: any;

  async activate(): Promise<void> {
    const { stickerPane, sticker } = this.adapter.exports;
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
        sticker({
          DEFAULT: {
            img: DAPPLETS_IMG,
            //vertical: '50',
            //horizontal: '30',
            //width: '100px',
            exec: () => {
              console.log('ctx:', ctx)
              //ctx.setCurrentTime(20)
            },
          },
        }),
        sticker({
          DEFAULT: {
            img: DAPPLETS_IMG,
            from: 0, // sec
            to: 10, // sec
            vertical: 10, // %
            horizontal: 30, // %
            width: 0.5, // fraction of the min video metric (X or Y)
            exec: () => {
              console.log('ctx:', ctx)
              //ctx.setCurrentTime(20)
            },
          },
        }),
      ],
    });
  }
}
