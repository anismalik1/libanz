import {
    trigger,
    transition,
    style,
    query,
    group,
    animateChild,
    animate,
    keyframes,
  } from '@angular/animations';


// Basic

// export const transformer =
//   trigger('fadeOut', [
//     transition('* => isTrue', translateTo({ x: -100, y: -100, rotate: -720 }) ),
//     // transition('* => isRight', translateTo({ x: 100, y: -100, rotate: 90 }) ),
//     // transition('isRight => *', translateTo({ x: -100, y: -100, rotate: 360 }) ),
//     transition('isTrue => *', translateTo({ x: 100, y: -100, rotate: -360 }) )
// ]);


export const stepper =
  
trigger('fadeOut', [
    transition(':enter', [
      query('.splash-box', [
        style({
          left: '35%',
          top: '30%',
        }),
      ],{optional: true}),
      group([
        query('img', [
          animate('3000ms ease', keyframes([
            //style({ transform: 'scale(.5) translate(300%,500%)',offset: 0.20}),
           //style({ transform: 'scale(.5) translateY(500%)',offset: 0.21}),
           style({
            left: '35%',
            top: '30%'
            , offset: 0.1}),
            style({ transform: 'scale(0.5) rotate(0)', offset: 0.5}),
            style({ opacity: 0, transform: 'rotate(180deg) scale(5)', offset: 1 }),
          ])),
        ],{optional: true}),
      ]),
    ])
]);
