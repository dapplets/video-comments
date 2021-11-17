import { ICSSTransform } from './types';

export const parseCSS = (style: string, value: string) => {
    if (!style || !value) return;
    switch (style) {
        case 'transform' :
            const scale = Number(/scale\(([0-9\.?\-?]+)\)/.exec(value)![1]);
            const translate = /translate\(([0-9\.?\-?]+)%?,\s([0-9\.?\-?]+)%?\)/.exec(value);
            const translateX = Number(translate![1]);
            const translateY = Number(translate![2]);
            const rotate = Number(/rotate\(([0-9\.?\-?]+)rad\)/.exec(value)![1]);
            const transform: ICSSTransform = {
                scale,
                translateX, 
                translateY,
                rotate,
            };
            return transform;

        default:
            console.log('Unknown style. Error in parseCSS');
    }
};

export const getRandomInt = () => Math.trunc(Math.random() * 1_000_000_000);

export const roundToMultiple = (num: number, m: number = 2) => {
  const a = Math.pow(10, m);
  return Math.round(num * a) / a;
};
