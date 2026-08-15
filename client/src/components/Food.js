import React from 'react'

export const Food = (props) => {
   const style = {
     left: `${props.dot[0]}%`,
     top: `${props.dot[1]}%`,
   };
   return <div className="food" style={style} />;
};

export default Food;
