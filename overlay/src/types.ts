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
  sticker?: string
}

export interface ISendingData {
  accountId: string
  videoId: string
  text: string
  from: number
  to: number
  sticker: string
}
