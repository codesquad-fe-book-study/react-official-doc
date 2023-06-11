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

## State: A Component's Memory

컴포넌트는 상호 작용의 결과로 화면의 내용을 변경한다. 이 때, 컴포넌트는 이전에 어떤 상호 작용이 있었는지 기억해야 한다.
이런 종류의 컴포넌트 별 메모리를 `state`라고 부른다.

### When a regular variable isn’t enough

```jsx
import { sculptureList } from './data.js';

export default function Gallery() {
  let index = 0;

  function handleClick() {
    index = index + 1;
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i> 
        by {sculpture.artist}
      </h2>
      <h3>  
        ({index + 1} of {sculptureList.length})
      </h3>
      <img 
        src={sculpture.url} 
        alt={sculpture.alt}
      />
      <p>
        {sculpture.description}
      </p>
    </>
  );
}
```

위 예제에서 버튼을 클릭해도 화면이 변하지 않는다.

- 지역 변수는 렌더링 간에 유지되지 않는다. React가 이 컴포넌트를 두번째로 렌더링할 때 지역 변수에 대한 변경 사항을 고려하지 않는다.
- 지역 변수를 변경해도 렌더링을 발동시키지 않는다. 단순 지역변수의 변경으로 React는 컴포넌트를 다시 렌더링할 것을 인지하지 못한다.

이 때, 컴포넌트를 새 데이터로 업데이트하려면 2가지의 작업이 필요하다.

- 렌더링 사이, 데이터를 유지해야한다.
- 새로운 데이터로 컴포넌트를 다시 렌더링해야 한다.

위의 2가지를 제공하는 것이 `useState` 훅이다.

### Meet your first Hook

React에서는 `use`로 시작하는 함수를 훅(hook)이라고 부른다.
훅은 렌더링 중일 때만 사용할 수 있는 특별한 함수이다.

> 훅은 컴포넌트의 최상위 레벨 혹은 커스텀 훅에서만 호출할 수 있다.<br/>
> 훅은 함수이지만 컴포넌트의 필요에 대한 무조건적인 선언으로 생각하면 편하다.<br/>
> 파일 상단에서 모듈을 `import`하는 것과 유사하게 컴포넌트 상단에서 React 기능을 사용한다.

### Anatomy of useState

`useState`를 호출한다는 건, React 컴포넌트가 무언가를 기억하도록 요청하는 것이다.

```jsx
import { useState } from 'react';

const [index, setIndex] = useState(0);
```

위의 경우, React가 `index`를 기억하기를 원하는 것이다.

컴포넌트가 렌더링될 때마다 `useState`는 2개의 값을 포함하는 배열을 제공한다.

- 저장한 값을 가진 state 변수
- state 변수를 업데이트 및 React가 컴포넌트를 다시 렌더링하도록 트리거할 수 있는 setter 함수

useState의 동작 원리!

위의 index state를 예제로 들도록 해보자

1. 컴포넌트가 처음 렌더링된다. index의 초기값으로 0을 useState에 전달되었으므로 `[0, setIndex]`가 반한된다. 이 때, React는 0을 최신 state로 기억한다.
2. state를 업데이트한다. react는 이제 1을 최신 state로 기억한다.
3. 컴포넌트가 리렌더링된다. 물론 여전히 useState(0)인 코드가 있지만, index를 1로 설정한 것을 기억해서 [1, setIndex]를 반환한다.

### Giving a component multiple state variables

하나의 컴포넌트에 여러개의 state 변수를 사용할 수 있다. 이 때, 서로 연관이 있는(두개의 state 변수를 자주 함께 변경하는) 경우 하나의 state 변수로 관리하는 것이 좋다.

어떤 state를 반환할지 React는 어떻게 알 수 있을까?

> `useState`호출이 어떤 state 변수를 참조하는지에 대한 정보를 받지 못한다. 이런 '식별자'가 없는데 어떤 state 변수를 반환할지 어떻게 알 수 있을까?
> 훅은 `동일한 컴포넌트의 모든 렌더링에서 안정적이고 동일한 순서로 호출되어야 한다.` 즉, 훅은 항상 같은 순서로 호출되어야 하기 때문에 최상위 계층에서 호출되어야 하는 것이다.(eslint-plugin-react-hooks이 이를 잘 잡아준다.)

> React는 내부적으로 모든 컴포넌트에 대한 한 쌍의 state의 배열을 갖는다. 또한 렌더링 전에 `0`으로 설정된 현재 쌍 인덱스를 유지한다. `useState`를 호출할 때마다 React는 다음 state 쌍을 제공하면서 index를 1 증가시킨다.

```jsx
let componentHooks = [];
let currentHookIndex = 0;

// How useState works inside React (simplified).
function useState(initialState) {
  let pair = componentHooks[currentHookIndex];
  if (pair) {
    // This is not the first render,
    // so the state pair already exists.
    // Return it and prepare for next Hook call.
    currentHookIndex++;
    return pair;
  }

  // This is the first time we're rendering,
  // so create a state pair and store it.
  pair = [initialState, setState];

  function setState(nextState) {
    // When the user requests a state change,
    // put the new value into the pair.
    pair[0] = nextState;
    updateDOM();
  }

  // Store the pair for future renders
  // and prepare for the next Hook call.
  componentHooks[currentHookIndex] = pair;
  currentHookIndex++;
  return pair;
}
```

즉, `[[state1, setState1], [state2, setState2], ...]` 이런식으로 저장되어있는 것이다.

### State is isolated and private

state는 컴포넌트에 의해 완전히 캡슐화된다. 즉, state는 컴포넌트 외부에서 접근할 수 없다.<br/>
이 부분이 바로 `모듈 상단에 선언하는 일반 변수`와 `state`의 차이점이다. state는 특정 함수 호출에 묶이지 않고, 코드의 특정 위치에도 묶이지 않으면서 화면상의 특정 위치에 지역적이다.
또한, state는 이를 선언한 컴포넌트 외에는 완전히 비공개되고, 부모 컴포넌트는 이를 변경할 수 없다. 

만약 state를 두개의 컴포넌트가 공유하고 동기화하려면 가장 가까운 부모 컴포넌트에 두어 props로 전달해야 한다.

## Render and Commit

컴포넌트를 화면에 표시하기 전에 React에서 렌더링을 해야 한다. <br/>
리액트가 고객들의 요청을 받고 주문을 가져오는 웨이터라고 생각해보자. 그리고 주방에서는 컴포넌트를 재료로 요리를 하고 있다. UI를 요청하고 서빙하는 과정은 아래 3단계로 이루어진다.

1. Triggering a render: 컴포넌트가 렌더링을 시작하도록 트리거한다. => 손님의 주문을 주방으로 전달한다.
2. Rendering the component: 컴포넌트가 렌더링을 수행한다. => 주방 주문을 받아 요리한다.
3. Committing to the DOM: DOM에 커밋한다. => 손님에게 요리를 내놓는다.

### Step 1: Trigger a render

컴포넌트의 렌더링이 일어나는 데에는 2가지의 이유가 있다.

- 컴포넌트가 처음으로 렌더링되는 경우

> 앱을 시작하기 위해서는 첫 렌더링을 해야 한다. 

```jsx
import Image from './Image.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Image />); // 첫 번째 렌더링
```

- 컴포넌트의 state나 props(부모 컴포넌트를 통해 전달된 state)가 변경되어 다시 렌더링되는 경우

> `setState`로 state를 변경하여 추가로 렌더링할 수 있다. 컴포넌트의 state를 업데이트하면 자동으로 렌더링이 대기열에 추가된다.
> (식당에서 손님이 첫 주문 이후에 추가 주문을 하는 것과 같다.)

### Step 2: React renders your components

렌더링을 trigger하면, 리액트는 함수 컴포넌트를 호출하여 화면에 표시할 내용을 파악한다. 즉, `렌더링`은 리액트에서 함수 컴포넌트를 호출하는 것이다.

- 첫 렌더링에서는 루트 컴포넌트를 호출한다.
- 이후 렌더링에서는 state의 업데이트에 의해 렌더링이 발동된 함수 컴포넌트를 호출한다.

위의 과정 자체는 `재귀적`으로 동작한다. 업데이트된 컴포넌트가 다른 컴포넌트(자식 컴포넌트)를 번환하면 다음으로 해당 컴포넌트를 렌더링하고 또 그 컴포넌트가 다른
컴포넌트를 반환하면 해당 컴포넌트를 렌더링한다. 중첩된 컴포넌트가 더이상 존재하지 않고 화면에 표시되어야 하는 내용을 정확히 알 때까지 계속된다.

> 렌더링은 항상 순수 계산이어야 한다.<br/>
> 1. 동일한 입력에 대해서 동일한 출력이 반환되어야 한다.<br/>
> 2. 함수 외부의 어떤 것도 변경해서는 안된다.<br/>

> Optimizing performance<br/>
> 업데이트된 컴포넌트 내에 있는 모든 컴포넌트를 렌더링하는 행위는 비효율적이다.(특히 업데이트된 컴포넌트가 상위에 있을수록!)<br/>
> 성급하게 최적화하지 않도록 해라!

### Step 3: React commits changes to the DOM

리액트는 컴포넌트를 렌더링(호출)한 후, DOM을 수정한다.

1. 첫 렌더링의 경우, 리액트는 `appendChild()` DOM api를 사용하여 생성한 모든 DOM 노드를 화면에 표시한다.
2. 이후 렌더링(리렌더링)의 경우, 리액트는 필요한 최소한의 작업(렌더링 중 계산된 작업)을 적용하여 DOM이 최신 렌더링 출력과 일치시킨다.

리액트는 렌더링 사이에 차이가 있는 경우에만 DOM 노드를 변경한다. 아래와 같이 매초마다 time이 변경될 때(리렌더링이 발생), input의 내부에 있는 value state는
그 값이 사라지지 않고 유지된다.

```jsx
export default function Clock({ time }) {
  return (
    <>
      <h1>{time}</h1>
      <input />
    </>
  );
}
```

### Epilogue: Browser paint

렌더링이 완료되고 리액트가 DOM을 업데이트한 후, 브라우저는 화면을 다시 그린다. 이 부분을 `브라우저 렌더링`이라고 하지만, 현재 공식문서에서는 혼동을 피하고자 `페인팅`이라고 부른다.

## State as a Snapshot

state는 스냅샷처럼 동작한다. state 변수를 설정해도 이미 가지고 있는 state 변수는 변경되지 않고, 그 대신 리렌더링이 실행된다.

```jsx
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Hi!');
  if (isSent) {
    return <h1>Your message is on its way!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}
```

- onSubmit 이벤트 핸들러가 실행된다.
- setIsSent(true)가 isSent를 true로 설정하고 새 렌더링을 큐에 대기시킨다..
- 리액트는 isSent 값에 따라서 컴포넌트를 다시 렌더링한다.

### Rendering takes a snapshot in time

`렌더링`이란 리액트가 컴포넌트, 즉 함수를 호출한다는 의미이다. 해당 함수에서 반환하는 JSX는 그 순간의 UI 스냅샷과 같다.

React가 컴포넌트를 리렌더링할 때,

- 리액트가 함수를 다시 호출한다.
- 함수가 새로운 JSX 스냅샷을 반환한다.
- 이후, 리액트는 이전 스냅샷과 새 스냅샷을 비교하고 일치하도록 화면을 업데이트한다.

컴포넌트의 메모리로서 state는 함수가 반환된 후 사라지는 일반 변수와는 다르다. state는 함수 외부에 존재하는 변수처럼 React 자체에 존재한다.

<img src="https://react-ko.dev/images/docs/illustrations/i_state-snapshot2.png" width=200 alt="리액트가 state를 메모">

아래의 코드를 보면 버튼을 1번 클릭할 때마다, number는 3씩 증가할 것 같다. 하지만 number는 1씩 증가한다.

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        console.log(number);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

`setState`를 실행하면 `이전 렌더링`에 대해서만 state가 변경된다. 즉, 아무리 setNumber를 호출했어도 이전 렌더링에서 number는 0이기 때문에 1만 증가하는 것이다.
그렇기 때문에 중간에 console.log를 찍어보면 0이 찍히는 것을 확인할 수 있다.

### State over time

아래 코드를 실행해보면 3초 뒤 alert 값으로도 0이 찍히는 것을 확인할 수 있다.

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

왜 그럴까? 이는 사용자가 버튼을 클릭하는 시점에서 number는 0이기 때문이다. setTimeout은 3초 뒤에 실행되기 때문에, 3초 뒤에 실행되는 alert에서도 number가 0이다.(3초 뒤에 number가 0인 스냅샷이 사용하기 때문이다.)<br/>
리액트는 하나의 렌더링 이벤트 핸들러 내에서 state값을 `고정`으로 유지한다. 즉, 코드가 실행되는 동안 state가 변경되었는지 걱정할 필요가 없다.

## Queueing a Series of State Updates

state 변수를 설정하면 다음 렌더링이 큐에 들어간다. 그러나 경우에 따라서 다음 렌더링을 큐에 전달하기 전에, state에 대해 여러 작업을 수행하고 싶을 수 있다.

### React batches state updates

리액트는 state 업데이트를 하기 전에 이벤트 핸들러의 모든 코드가 실행될 때까지 기다린다. 때문에 리렌더링은 모든 `setState` 호출이 완료된 이후에만 일어난다.
이는 음식점에서 주문을 받는 웨이터와 같다. 우리가 a,b,c라는 음식을 주문한다면 웨이터는 우리가 a를 말하자마자 주문을 전달하지 않는다. 대신에 우리가 주문을 완료할 때까지 기다린다. 그리고 우리가 주문을 완료하면 웨이터는 주문을 전달한다.
심지어 다른 테이블의 주문까지 한번에 받아서 전달한다.

이렇게 하면 여러 컴포넌트에서 나온 여러 state 변수를 업데이트함에 따라 리렌더링을 trigger하지 않을 수 있다. 이 말은 이벤트 핸들러와 그 내부에 있는 코드가 완료될 때까지
UI가 업데이트되지 않는다는 것이다.

반면 리액트는 클릭과 같은 여러 의도적인 이벤트에 대해 일괄 처리 하지 않는다. 각 이벤트는 개별적으로 처리 된다. 

### Updating the same state multiple times before the next render

다음 렌더링 전에 동일한 state 변수를 여러번 업데이트 하고 싶을 때, `setState((prev) => prev + 1)`와 같이 함수를 인자로 넘겨주면 된다.
이는 이전 렌더링에서의 state를 참조하는 것이 아닌 state 큐의 이전 state를 참조하기 때문에 가능하다.

> 참고: setState(5) 또한 setState(prev => 5)처럼 동작한다.

### Naming conventions

업데이터 함수 인수(콜백 함수)의 이름은 해당 state 변수의 첫 글자로 지정하는 것이 일반적이다.

```jsx
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```