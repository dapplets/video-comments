export interface ISticker {
  id: string
  vertical?: number
  horizontal?: number
  transform?: string
}

export interface IData {
  id: string
  name: string
  time: string
  text: string
  from: number
  to?: number
  image?: string
  selected: boolean
  hidden: boolean
  url: string
  sticker: ISticker
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