export interface ISticker {
  id: string
  vertical: number
  horizontal: number
  widthCo: number
  heightCo: number
  rotated: number
}

export interface IData {
  id: string
  name: string
  time: string
  text: string
  from: number
  to?: number
  image?: string
  selected?: boolean
  hidden?: boolean
  url: string
  sticker: ISticker
}

export interface ISendingData {
  accountId: string
  videoId: string
  text: string
  from: number
  to: number
  sticker: ISticker
}
