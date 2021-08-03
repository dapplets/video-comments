import { ISendingData } from './types';

export const addComment = async (props: ISendingData) => {
  const { accountId, videoId, text, from, to, sticker } = props;
  try {
    const res = await fetch(`https://comments.dapplets.org/auth/anonymous/login?user=${accountId}&site=remark&aud=remark`);
    const token = res.headers.get('X-Jwt');
    const headers: HeadersInit = new Headers();
    if (token) {
      headers.set('X-Jwt', token!);
      const data = {
        text,
        title: JSON.stringify({
          from,
          to,
          sticker,
        }),
        locator: {
          site: 'remark',
          url: videoId,
        },
      };
      const strData = JSON.stringify(data);
      console.log('strData=', strData)
      try {
        const response = await fetch('https://comments.dapplets.org/api/v1/comment', {
          method: 'POST',
          headers,
          body: strData,
        });
        console.log('response.status', response.status)
        const result = await response.json();
        if (response.status !== 201) throw new Error(result)
        console.log('result of POST comment:', result);
      } catch (err) {
        console.log('Error saving the comment.', err)
      }
    }
  } catch (e) {
    console.log('Error connecting to the comment engine.', e)
  }
}

export const deleteComment = async (commentId: string, url: string, accountId: string) => {
  try {
    const res = await fetch(`https://comments.dapplets.org/auth/anonymous/login?user=${accountId}&site=remark&aud=remark`);
    const token = res.headers.get('X-Jwt');
    const headers: HeadersInit = new Headers();
    if (token) {
      headers.set('X-Jwt', token!);
      try {
        const response = await fetch(`https://comments.dapplets.org/api/v1/admin/comment/${commentId}?site=remark&url=${url}`, {
          method: 'DELETE',
          headers,
        });
        console.log('response.status', response.status)
        const result = await response.json();
        console.log('result of DELETE comment:', result);
      } catch (err) {
        console.log('Error deleting the comment.', err)
      }
    }
  } catch (e) {
    console.log('Error connecting to the comment engine.', e)
  }
};

export const getUserInfo = async (accountId: string) => {
  try {
    const res = await fetch(`https://comments.dapplets.org/auth/anonymous/login?user=${accountId}&site=remark&aud=remark`);
    const token = res.headers.get('X-Jwt');
    const headers: HeadersInit = new Headers();
    if (token) {
      headers.set('X-Jwt', token!);
      try {
        const response = await fetch(`https://comments.dapplets.org/api/v1/user`, {
          method: 'GET',
          headers,
        });
        console.log('response.status', response.status)
        const result = await response.json();
        console.log('result of GET user info:', result);
        return result;
      } catch (err) {
        console.log('Error getting the user info.', err)
      }
    }
  } catch (e) {
    console.log('Error connecting to the comment engine.', e)
  }
}

export const formatTime = (time?: number) => {
  if (time === undefined) return 'Infinity';
  const seconds = Math.ceil(time);
  const s = (seconds % 60).toString();
  const m = Math.floor(seconds / 60 % 60).toString();
  const h = Math.floor(seconds / 60 / 60 % 60).toString();
  return h !== '0'
    ? `${h.padStart(2,'0')}:${m.padStart(2,'0')}:${s.padStart(2,'0')}`
    : `${m.padStart(2,'0')}:${s.padStart(2,'0')}`;
};
