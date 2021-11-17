export interface ISticker {
  id: string
  widthCo: number
  heightCo: number
  transform: string | IStickerTransform
}

export interface IStickerTransform {
  [name: string]: IStickerTransformParams
}

export interface IStickerTransformParams extends ICSSTransform {
  time: number
}

export interface IPoint {
  id: string
  time: number
}

export interface ICSSTransform {
  scale: number
  translateX: number
  translateY: number
  rotate: number
}

export interface IData {
  id: string
  name: string
  ensName?: string
  time: string
  text: string
  from: number
  to?: number
  image?: string
  selected: boolean
  hidden: boolean
  url: string
  sticker: ISticker
  score: number
  vote: number
}

export interface ISendingData {
  accountId: string
  videoId: string
  text: string
  from: number
  to: number
  sticker: ISticker
}

export enum SortTypes {
  Timeline = 'Timeline',
  Popular = 'Popular',
  Latest = 'Latest',
}

export interface IChangeAddingStickerImageProps {
  stickerName: string
  from: number
  to: number
}