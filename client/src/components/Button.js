import React from 'react'
import './Button.css'

const Button = ( { onUp, onDown, onLeft, onRight}) => {
  return (
    <div className="buttons">

        <div className="upwards">
            <button className="up" onClick={onUp}>UP</button>
        </div>

        <div className="sideway">
            <button className="left" onClick={onLeft}>LEFT</button>

            <button className="right" onClick={onRight}>RIGHT</button>
        </div>

        <div className="downwards">

                        <button className="down" onClick={onDown}>DOWN</button>
        </div>
    </div>
  );
};

export default Button;
