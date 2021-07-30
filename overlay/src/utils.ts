export const formatTime = (time: number) => {
  const seconds = Math.ceil(time);
  const s = (seconds % 60).toString();
  const m = Math.floor(seconds / 60 % 60).toString();
  const h = Math.floor(seconds / 60 / 60 % 60).toString();
  return h !== '0'
    ? `${h.padStart(2,'0')}:${m.padStart(2,'0')}:${s.padStart(2,'0')}`
    : `${m.padStart(2,'0')}:${s.padStart(2,'0')}`;
};
