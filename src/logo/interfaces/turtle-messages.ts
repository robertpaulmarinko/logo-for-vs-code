/**
 * High level commands that direct the turtle to move.
 */

/**
 * Types used to tell the Logo WebView what graphics to draw.
 */
 export type TurtleCommandValues = 
 'error' |
 'forward' | 
 'right' | 
 'left';

 export interface TurtleMessage {
     command: TurtleCommandValues;

     /**
      * The distance to move
      */
     distance?: number;

     /**
      * Angle to turn left or right
      */
     angle?: number;

     /**
      * Used when invalid syntax is found
      */
     errorMessage?: string;
 }