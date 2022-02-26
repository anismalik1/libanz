import {
    trigger,
    transition,
    style,
    query,
    group,
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
           style({opacity : 1,
            left: '35%',
            top: '30%'
            , offset: 0.1}),
            style({ opacity: .6, transform: 'rotate(180deg) scale(2)', offset: .5 }),
            style({ opacity : 1, transform: 'scale(1) rotate(0)', offset: 1})
          ])),
          
        ],{optional: true}),
        
      ]),
    ]),
    
]);
