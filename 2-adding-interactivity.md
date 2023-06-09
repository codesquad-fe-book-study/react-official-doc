# Learn React - Adding Interactivity

리액트에서는 `시간이 지남에 따라 변하는 데이터`를 모두 `state`라고 한다.

## Responding to events

React를 통해 JSX에 이벤트 핸들러를 추가할 수 있다. 이때, 이벤트 핸들러는 클릭, 마우스오, input에 초점 맞추기 사용자 상호작용에 의해 실행되는 콜백함수를 의미한다.

## State: a component’s memory

컴포넌트는 상호 작용의 결과로 화면의 내용을 변경해야 하는 경우가 많다. 이 때, 컴포넌트는 이런 변하는 내용을 `기억`하고 있어야 한다. React에서는 이런 종류의 컴포넌트별 메모리를 state라고 부른다.

컴포넌트에 state를 추가하려면 useState 훅을 사용하면 된다. 훅들은 컴포넌트가 React 기능을 사용할 수 있게 해주는 특수한 함수들이다.
useState 훅을 사용하면 state 변수를 선언할 수 있다. 초기 state를 받아 현재 state와 이를 업데이트할 수 있는 state 설정자 함수의 값 쌍을 반환한다.

## Render and commit

컴포넌트가 화면에 표시되기 전에, 컴포넌트들은 리액트에서 렌더링되어야 한다. 아래의 과정을 거친다.

- 렌더링 발동
- 컴포넌트 렌더링
- DOM에 커밋

## State as a snapshot

일반 JavaScript 변수와 달리 React state는 스냅샷처럼 동작한다. state 변수를 설정해도 이미 가지고 있는 state 변수는 변경되지 않고 대신 리렌더링된다.

```jsx
console.log(count);  // 0
setCount(count + 1); // Request a re-render with 1
console.log(count);  // Still 0!
```

## Queueing a series of state updates

```jsx
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(score + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Score: {score}</h1>
    </>
  )
}

// '+3' 버튼을 클릭해도 숫자는 1씩만 증가한다.
```

setState를 실행하면 새로운 렌더링을 요청하지만 이미 실행 중인 코드에서는 변경하지 않는다. 위 로직을 아래와 같이 수정하면 원하는 결과를 얻을 수 있다.

```jsx
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(s => s + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Score: {score}</h1>
    </>
  )
}
```

## Updating objects in state

state에는 객체를 포함한 JS에서의 모든 `값`을 할당할 수 있다. state에 객체를 할당했을 때는, 해당 객체 내부 값을 변경해서는 안된다.
대신 객체를 업데이트하려면 새 객체를 생성하거나 기존 객체의 복사본을 만든 다음 해당 복사본을 사용하도록 state를 업데이트해야 한다.

> 일반적으로 `...`와 같은 스프레드 연산자를 사용해 객체나 배열을 복사하여 사용한다. <br/>
> (추가) 불변성을 유지하면서 객체를 복사하는 것이 싫다면 [Immer](https://github.com/immerjs/use-immer)와 같은 라이브러리를 사용하여 반복되는 코드의 양을 줄일 수 있다.

## Updating arrays in state

객체와 마찬가지로 배열 또한 state에 할당한 후, 그 state(배열이 할당된)의 내부를 직접 변경해서는 안된다. 새로운 배열로 업데이트하기 위해 새 배열 혹은 기존 배열의 복사본을 생성한 후 setState로 업데이트한다.

---

## Responding to Events

### Adding event handlers

리액트는 jsx 내부에 이벤트 핸들러를 추가할 수 있다.
- 이벤트 핸들러 함수는 일반적으로 컴포넌트 안에 정의된다.
- 이벤트 핸들러 함수는 일반적으로 `handleXXX`와 같은 이름을 가진다.

```jsx
export default function Button() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

> 주의! 이벤트 핸들러에 전달하는 것은 호출된 함수(리턴값)이 아닌 함수 자체이다.

### Passing event handlers as props

부모 컴포넌트가 자식의 이벤트 핸들러를 지정해야할 때가 있다. 이때, 자식 컴포넌트에게 이벤트 핸들러를 전달하는 것이 좋다.

```jsx
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`Playing ${movieName}!`);
  }

  return (
    <Button onClick={handlePlayClick}>
      Play "{movieName}"
    </Button>
  );
}

function UploadButton() {
  return (
    <Button onClick={() => alert('Uploading!')}>
      Upload Image
    </Button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="Kiki's Delivery Service" />
      <UploadButton />
    </div>
  );
}
```

- 이 때 컴포넌트의 props 명은 `onXXX`로 하고 이벤트 핸들러의 이름은 `handleXXX`로 하는 것이 관례이다.

### Naming event handler props

관례상 이벤트 핸들러 props은 on으로 시작하고 그 뒤에 대문자가 와야한다. 예를 들어, `onClick`, `onSmash`와 같은 이름을 가진다.

```jsx
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Playing!')}
      onUploadImage={() => alert('Uploading!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Play Movie
      </Button>
      <Button onClick={onUploadImage}>
        Upload Image
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

`App` 컴포넌트는 `Toolbar`컴포넌트가 `onPlayMovie` 또는 `onUploadImage`로 어떤 작업을 수행할지 알 필요가 없다.
즉, 해당 부분은 `Toolbar`가 맡은 일이다.

> 이벤트 핸들러에 적절한 HTML 태그를 사용하도록 하자! ex) `<div onClick={handleClick></div>`도 가능하지만 `<button onClick={handleClick></button>`이 더 명확하다.

### Event propagation

이벤트 핸들러는 컴포넌트에 있을 수 있는 모든 하위 컴포넌트의 이벤트도 포착한다. 즉, 버블링이 일어나는 것이다.

```jsx
export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <button onClick={() => alert('Playing!')}>
        Play Movie
      </button>
      <button onClick={() => alert('Uploading!')}>
        Upload Image
      </button>
    </div>
  );
}
```

- Toolbar를 클릭하면 `Playing!`이 먼저 출력되고, 그 다음에 Toolbar의 이벤트 핸들러가 실행된다.

> JSX 태그에서만 작동하는 `onScroll`을 제외한 모든 이벤트는 전파된다.

### Stopping propagation

이벤트 핸들러는 이벤트 객체를 유일한 인수로 받는다. 관례상 이벤트 객체는 `e` 또는 `event`라는 이름으로 사용한다.
이 때, `e.stopPropagation()`을 호출하면 이벤트 전파를 막을 수 있다.

```jsx
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <Button onClick={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onClick={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

> Capture phase events

- 리액트의 이벤트를 버블링이 아닌 캡처링으로 처리하고 싶다면, `onXXXCapture`를 사용하면 된다.

### Preventing default behavior

일부 브라우저 이벤트에는 연결된 기본 동작이 있다. ex) `<form>`의 `onSubmit`은 페이지를 새로고침한다.
이 때, `e.preventDefault()`를 호출하면 기본 동작을 막을 수 있다.

```jsx
export default function Signup() {
  return (
    <form onSubmit={() => alert('Submitting!')}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

> e.stopPropagation(): 이벤트의 전파를 막는다.<br/>
> e.preventDefault(): 몇 가지 이벤트에 대한 브라우저의 기본 동작을 막는다.

### Can event handlers have side effects?

이벤트 핸들러에서는 수많은 side effect가 발생할 수 있다. 
렌더링 함수(컴포넌트)와 달리 이벤트 핸들러는 순수할 필요가 없다! 하지만 이런 이벤트에 따라 일부 정보를 변경하려면 먼저
정보를 저장할 방법이 필요하다. 이 때, `state`를 사용하면 된다.