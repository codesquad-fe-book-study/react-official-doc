import React, {useState} from 'react';
const Title = (props) => {
  const [state, setState] = useState(0); // [상태값, 상태를 변경하는 함수
  const {children, color} = props;
  return (
    <div>
      <h2 style={{color}}>타이틀 컴포넌트입니당</h2>
      <div>{state}</div>
      <button onClick={() => setState(state + 1)}></button>
      {children}
    </div>
  );
};

export default Title;