export interface ISticker {
  id: string
  vertical?: number
  horizontal?: number
  transform?: string | IStickerTransform
}

export interface IStickerTransform {
  [name: string]: IStickerTransformParams
}

export interface IStickerTransformParams extends ICSSTransform {
    time: number
}

export interface ICSSTransform {
  scale: number
  translateX: number
  translateY: number
  rotate: number
}

export interface IVideoCtx {
  id: string
  pause: any
  play: any
  setCurrentTime: any
  onTimeUpdate: any
  onResize: any
  onTranslate: any
  element: HTMLElement
  height: number
  width: number
  poster?: string
  duration: number | any
  loop: boolean
  muted: boolean
  currentTime: number
  src: string
  volume: number
  paused: boolean
  parent: any
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

export interface ISharedData {
  ctxId: string
  commentId: string
}

export interface IRemarkUser {
  id: string         //  ID
  name: string       //  Name
  picture: string    //  Picture
  admin: boolean     //  Admin
  site_id?: string   //  
  block?: boolean    //  Blocked
  verified?: boolean //  Verified
}

export interface IRemarkComment {
  id: string             // ID: comment ID, read only
  pid: string            // ParentID: parent ID
  text: string           // Text: comment text, after md processing
  orig: string           // Orig: original comment text
  user: IRemarkUser             // User: user info, read only
  locator: IRemarkLocator       // Locator: post locator
  score: number          // Score: comment score, read only
  vote: number           // Vote: vote for the current user, -1/1/0.
  controversy?: number   // Controversy: comment controversy, read only
  omitempty?: number | IRemarkEdit     // Controversy: comment controversy, read only
  time: string             // Timestamp: time stamp, read only
  edit?: IRemarkEdit            // Edit: pointer to have empty default in json response
  pin?: boolean           // Pin: pinned status, read only
  delete?: boolean        // Delete: delete status, read only
  title?: string          // PostTitle: post title
}

export interface IRemarkLocator {
  site: string           // SiteID: site id
  url: string            // URL: post url
}

export interface IRemarkEdit {
  time: string             // Timestamp
  summary: string        // Summary
}

export interface IChangeAddingStickerImageProps {
  stickerName: string
  from: number
  to: number
}