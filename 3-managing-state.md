# Managing State

## Reacting-to-input-with-state

- React는 선언형 UI 라이브러리
- 택시기사에게 목적지만 말하면 알아서 가는 것처럼, React는 상태에 따라 UI를 자동으로 업데이트

### Thinking about UI declaratively

- 컴포넌트의 다양한 시각적 상태를 식별한다.
- 상태 변화를 촉발하는 요소를 파악한다.
- useState를 사용하여 메모리의 상태를 표현한다.
- 비필수적인 state 변수를 제거한다.
- 이벤트 핸들러를 연결하여 state를 설정한다.

#### Step 1: Identify your component’s different visual states

> Displaying many visual states at once

컴포넌트에 시각적 상태가 많은 경우 한 페이지에 모두 표시해보는 것이 편리할 수 있다.(개인적으로 간단하게 손으로만 작업해두는 게 좋다고 생각한다.)
이런 페이지를 'living style guide' 혹은 'storybook'이라고 한다.

```jsx
import Form from './Form.js';

let statuses = [
  'empty',
  'typing',
  'submitting',
  'success',
  'error',
];

export default function App() {
  return (
    <>
      {statuses.map(status => (
        <section key={status}>
          <h4>Form ({status}):</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}
```

#### Step 2: Determine what triggers those state changes

상태 변경을 일으키는 요소를 파악해야한다. 크게 2가지로 나눌 수 있다.

- 사람의 입력 : 버튼 클릭, 필드 입력, 링크 이동 등
- 컴퓨터의 입력 : 네트워크에서 응답 도착, 시간 초과, 이미지 로딩 등

> 사람의 입력에는 종종 이벤트 핸들러가 필요하다!(`handleXXX`)

#### Step 3: Represent the state in memory with useState

이제 각 컴포넌트에서의 메모리 역할을 하는 `state`를 useState로 정의해야한다. 이 때, 가장 최소한의 state를 정의하는 것이 좋다.
반드시 필요한 state부터 정의하도록 하자! 즉시 state가 정리되지 않는다면, 일단 가능한 state를 다 적어보고 하나씩 쳐내면 된다.

#### Step 4: Remove any non-essential state variables

이 단계에서의 목표는 state가 사용자에게 보여주기를 원하는 UI를 보여주지 않는 경우를 제거하는 것이다. 아래의 3가지를 고려해보자.

- state가 모순을 야기하는지?(ex. `isSubmitting`과 `isSuccess`가 동시에 true인 경우)
- 다른 state에 이미 같은 정보가 있는지?
- 다른 state를 뒤집으면 같은 정보를 얻을 수 있는지?

> Eliminating “impossible” states with a reducer

- `useReducer`를 사용하면 state를 더 잘 관리할 수 있다.
- 조금 더 정확하게 state를 모델링하기 위해 `useReducer`를 사용할 수 있다.

#### Step 5: Connect the event handlers to set state

이제 이벤트 핸들러를 연결하여 state를 설정해보자. 이벤트 핸들러는 `handleXXX`와 같은 이름을 사용하는 것이 좋다.

## Choosing the State Structure

### Principles for structuring state

state를 구조화하는 방법에는 여러 가지가 있다. 이 때, state를 구조화하는 데 있어서 몇 가지 원칙을 지키는 것이 좋다.

- 관련 state를 그룹화해라. 항상 두 개 이상의 state 변수를 동시에 업데이트하는 경우 단일 state 변수로 병합하는 것이 좋다.
- state의 모순을 피해라.
- 불필요한 state를 피해라.
- state 중복을 피해라.
- 깊게 중첩된 state는 피해라.

위의 과정은 DB 엔지니어가 버그를 줄이기 위해 DB를 정규화하는 것과 유사한 작업이다.

> 아래와 같이 `handleXXX`의 함수에서 event 인자는 항상 마지막에 위치해야한다.

```jsx
function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }
```

## Sharing State Between Components

### Lifting state up

두 개의 컴포넌트가 동일한 state를 공유해야하는 경우, state를 두 컴포넌트의 공통 부모 컴포넌트로 옮기는 것이 좋다. 그 절차는 아래와 같다.

- 자식 컴포넌트에서 state를 제거한다.
- 공통 부모 컴포넌트에 하드 코딩된 데이터를 전달한다.
- 공통 부모 컴포넌트에 state를 추가하고 이벤트 핸들러와 함께 자식 컴포넌트에 전달한다.

> Controlled and uncontrolled components

일반적으로 일부 로컬 state를 가진 컴포넌트를 'uncontrolled component'라고 한다. 반면, 모든 state를 부모 컴포넌트로 옮긴 컴포넌트를 'controlled component'라고 한다.
대표적으로 `<input />`의 value가 state에 의해 결정되는 경우 controlled component라고 할 수 있다. 그렇지 않으면 uncontrolled component라고 할 수 있다.

### A single source of truth for each state

state를 공유하는 컴포넌트가 많아질수록 state를 관리하기가 어려워진다. 이 때, 각 고유한 state들에 대해 해당 state를 “소유”하는 컴포넌트를 선택하게 되는데, 이 컴포넌트를 'single source of truth'라고 한다.
이 때, state를 관리하는 컴포넌트는 state를 변경하는 함수를 자식 컴포넌트에 전달해야한다. 이 때, 자식 컴포넌트는 state를 변경하는 함수를 호출하여 state를 변경할 수 있다.

단순하게 말하면 각 state에 대한 공급원 역할을 하는 컴포넌트를 결정해야한다는 의미이다. 이 때, state 끌어올리기 기법이 사용되는 것이다.

## Preserving and Resetting State

state는 컴포넌트 간에 격리된다. React는 UI 트리에서 어떤 컴포넌트가 어떤 state에 속하는지를 추적한다.
state를 언제 보존하고 언제 초기화할지를 제어할 수 있다.

### The UI tree

브라우저는 UI를 모델링하기 위해 수많은 `트리`를 사용한다.  DOM은 HTML 요소를 나타내고, CSSOM은 CSS에 대해 동일한 역할을 한다. 심지어 접근성 트리도 존재한다!

마찬가지로 리액트도 트리 구조를 사용하여 개발자가 작성한 UI를 관리하고 모델링한다. 리액트는 JSX로부터 UI 트리를 구성한다. 그 다음 리액트 DOM이 해당 UI 트리와 일치하도록
브라우저 DOM 엘리먼트들을 업데이트한다.(React Native는 트리를 모바일 플랫폼에 맞는 엘리먼트로 변환한다.)

### State is tied to a position in the tree

흔히 state가 `해당 컴포넌트 내부`에 위치한다고 생각할 수 있다. 그러나 state는 `리액트 내부`에 위치한다. 즉, state는 리액트가 `해당 컴포넌트의 위치`에 따라 결정하는 것이다.
아래와 같은 예제 코드에서 각각의 Counter 컴포넌트의 score를 증가시킨 후, 2번째 컴포넌트를 제거했다가 다시 생성하면 2번째 컴포넌트의 score가 초기화된 것을 확인할 수 있다.

리액트는 컴포넌트가 UI 트리의 해당 위치에서 렌더링되는 동안 컴포넌트의 state를 유지한다. 
그러나 컴포넌트가 제거되거나 같은 위치에 다른 컴포넌트가 렌더링되면 리액트는 해당 컴포넌트의 state를 삭제한다.

```jsx
import { useState } from 'react';

export default function App() {
  const [showB, setShowB] = useState(true);
  return (
    <div>
      <Counter />
      {showB && <Counter />} 
      <label>
        <input
          type="checkbox"
          checked={showB}
          onChange={e => {
            setShowB(e.target.checked)
          }}
        />
        Render the second counter
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

### Same component at the same position preserves state

위의 예제와 다르게 동일한 위치에 있는 동일한 컴포넌트는 state를 보존한다.

```jsx
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} /> 
      ) : (
        <Counter isFancy={false} /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

체크박스를 선택하거나 선택 취소해도 카운터 state는 재설정되지 않는다.
isFancy가 true이든 false이든, 루트 App 컴포넌트에서 반환된 div의 첫 번째 자식에는 항상 <Counter />가 있기 때문이다.

> 리액트에서 `컴포넌트의 위치`가 의미하는 것은 `컴포넌트가 렌더링되는 위치`이다. 즉, 컴포넌트가 렌더링되는 위치가 동일하다면 state를 보존한다.(JSX 마크업이 중요한 것이 아니다!)

```jsx
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={e => {
              setIsFancy(e.target.checked)
            }}
          />
          Use fancy styling
        </label>
      </div>
    );
  }
  return (
    <div>
      <Counter isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

위 예제에서 checkbox를 선택하면 state가 재설정될 것으로 예상할 수 있지만 그렇지 않다.
이 두 <Counter /> 태그가 모두 같은 위치에 렌더링되기 때문이다. React는 함수에서 조건을 어디에 배치했는지 알지 못하고 단지 여러분이 반환하는 트리만 볼 수 있다.
두 경우 모두 App 컴포넌트는 <Counter />를 첫 번째 자식으로 가진 <div>를 반환한다.
React에서 이 두 카운터는 루트의 첫 번째 자식의 첫 번째 자식이라는 동일한 “주소”를 갖는다.
React는 JSX 로직을 어떻게 구성하든 상관없이 이전 렌더링과 다음 렌더링 사이에서 이 방법으로 이들을 일치시킬 수 있다.

### Different components at the same position reset state

반면 동일한 위치더라도 다른 컴포넌트를 렌더링하면 state가 재설정된다.(너무 당연한 이야기 같기도..?)

```jsx
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <div>
          <Counter isFancy={true} /> 
        </div>
      ) : (
        <section>
          <Counter isFancy={false} />
        </section>
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

위의 코드에서는 <Counter />를 <div>와 <section>으로 감싸고 있다. 즉, 서로 다른 컴포넌트로 취급된다. 그러므로 체크박스를 선택하면 state가 재설정된다.

> 위의 이유로 함수 컴포넌트의 정의를 중첩해서는 안된다.

```jsx
import { useState } from 'react';

export default function MyComponent() {
  const [counter, setCounter] = useState(0);

  function MyTextField() {
    const [text, setText] = useState('');

    return (
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
    );
  }

  return (
    <>
      <MyTextField />
      <button onClick={() => {
        setCounter(counter + 1)
      }}>Clicked {counter} times</button>
    </>
  );
}
```

MyTextField가 MyComponent 내부에 정의되어있기 때문에 MyComponent가 렌더링될 때마다 MyTextField가 재정의된다. 그러면 state가 계속 재설정된다.

### Resetting state at the same position

동일한 위치에서 state를 재설정하는 방법은 크게 2가지가 있다.

먼저 아래 예제는 Counter 컴포넌트가 동일한 위치에 있으므로 state가 보존되는 것을 볼 수 있다.

```jsx
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter person="Taylor" />
      ) : (
        <Counter person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

그렇다면 state를 reset하려면 어떻게 할 수 있을까?

#### Option 1: Rendering a component in different positions

```jsx
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA &&
        <Counter person="Taylor" />
      }
      {!isPlayerA &&
        <Counter person="Sarah" />
      }
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

위와 비슷한 예제같지만, Counter 컴포넌트를 렌더링하는 방법이 다르다. 이렇게 하면 Counter 컴포넌트가 동일한 위치에 렌더링되지 않으므로 state가 재설정된다.
예제와 같이 위치가 2개일 때는 괜찮지만, 3개 이상일 때는 코드가 복잡해진다.

#### Option 2: Resetting state with a key

목록을 렌더링할 때 key를 사용한다. key는 목록에만 사용되는 것이 아니다.
key를 사용해 React가 모든 컴포넌트를 구분하도록 할 수 있다. 기본적으로 React는 부모 내의 순서(“첫 번째 counter”, “두 번째 counter”)를 사용해 컴포넌트를 구분한다.
하지만 key를 사용하면 이것이 첫 번째 counter나 두 번째 counter가 아니라 특정 counter(예: Taylor의 counter)임을 React에 알릴 수 있다. 즉, 순서에 대해 좀더 명시적으로 전달할 수 있는 것이다.

```jsx
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter key="Taylor" person="Taylor" />
      ) : (
        <Counter key="Sarah" person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

Counter 컴포넌트가 동일한 위치에 존재하지만 key 값을 다르게 줌으로써 동일한 위치에 있더라도 다른 컴포넌트로 인식하게 할 수 있는 것이다.

> key는 전역으로 공유하는 것이 아닌, 해당 부모 컴포넌트에서만 공유한다.

### Resetting a form with a key

```jsx
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.id} contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

input을 담고 있는 Chat 컴포넌트에 key를 전달함으로써 input의 state를 reset할 수 있다.

> Preserving state for removed components

만약 각 key에 해당하는 컴포넌트마다 이전 값을 기억하게 하고 싶다면 어떻게 해야할까?

- 모든 컴포넌트를 렌더링하되 다른 모든 컴포넌트를 CSS로 숨긴다. 컴포넌트의 갯수가 많으면 성능에 문제가 생길 수 있다. 그러므로 간단한 컴포넌트를 작업할 때 유용하다.
- 부모 컴포넌트에 state를 끌어올려서 보관하는 방법이 있다. 이렇게 하면 자식 컴포넌트가 제거되더라도 중요한 정보를 보관하는 것은 부모 컴포넌트이므로 문제가 되지 않는다.(일반적인 방법)
- React state 외에 다른 소스를 사용할 수도 있다. 예를 들어, 사용자가 실수로 페이지를 닫아도 메시지 초안이 유지되기를 원할 수 있다. 이를 구현하기 위해 localStorage를 사용할 수 있다.

어떤 방법을 사용하든 개념적으로 구분되어야 하는 컴포넌트라면 key를 사용해야 한다.

## Extracting State Logic into a Reducer

여러 개의 state를 업데이트하는 함수들이 여러 이벤트 핸들러에 분산되어있는 컴포넌트는 과부하가 걸릴 수 있다. 이런 경우, reducer라고 하는 하나의 함수를 사용하여 
컴포넌트 외부의 모든 state 업데이트 로직을 통합할 수 있다.

### Consolidate state logic with a reducer

1. state를 설정하는 것에서 action들을 전달하는 것으로 변경하기
2. reducer 함수 작성하기
3. 컴포넌트에서 reducer 사용하기

#### Step 1: Move from setting state to dispatching actions

아래와 같이 state를 업데이트하는 이벤트 핸들러들이 있다.

```jsx
function handleAddTask(text) {
  setTasks([
    ...tasks,
    {
      id: nextId++,
      text: text,
      done: false,
    },
  ]);
}

function handleChangeTask(task) {
  setTasks(
    tasks.map((t) => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    })
  );
}

function handleDeleteTask(taskId) {
  setTasks(tasks.filter((t) => t.id !== taskId));
}
```

- 사용자가 'ADD'를 누르면 `handleAddTask`가 호출되고, 새로운 task가 추가된다.
- 사용자가 task를 토글하거나 'SAVE'를 누르면 `handleChangeTask`가 호출되고, 해당 task가 업데이트된다.
- 사용자가 'DELETE'를 누르면 `handleDeleteTask`가 호출되고, 해당 task가 삭제된다.

reducer를 사용하여 state를 관리하는 것은 state를 직접 설정하는 것과는 조금 다르다. state를 설정하여 react에게 '무엇을 할지'를 지시하는 대신,
`이벤트 핸들러에서 action을 전달하여 사용자가 방금 한 일을 지정한다.`(그리고 state를 업데이트하는 로직은 다른 곳에 있다.) 즉, 이벤트 핸들러를 통해
`task를 ADD, UPDATE, DELETE`하는 `action`을 전달하는 것이다.

```jsx
function handleAddTask(text) {
  dispatch({
    type: 'added',
    id: nextId++,
    text: text,
  });
}

function handleChangeTask(task) {
  dispatch({
    type: 'changed',
    task: task,
  });
}

function handleDeleteTask(taskId) {
  dispatch({
    type: 'deleted',
    id: taskId,
  });
}
```

dispatch에 인자로 전달해준 객체를 `action`이라고 한다. 이 객체에 무엇을 담을지는 자유이지만, 일반적으로는 `무슨 일이 일어날지`에 대한 최소한의 정보를 포함해야 한다.

> action 객체는 정말 어떤 형태든 상관없다.<br/>
> 일반적으로는 `무슨 일이 일어나는지`를 나타내는 `type`을 지정하고 추가적인 정보는 다른 키값으로 전달하는 게 일반적이다.

#### Step 2: Write a reducer function

reducer 함수에 state 관련 로직을 둘 수 있다.

```jsx
function reducer(state, action) {
  // return next state for React to set
}
```

1. 현재의 state(tasks)를 첫 번째 매개변수로 선언하세요.
2. action 객체를 두 번째 매개변수로 선언하세요.
3. 다음 state를 reducer 함수에서 반환하세요. (React가 state로 설정할 것입니다.)

```jsx
function tasksReducer(tasks, action) {
  if (action.type === 'added') {
    return [
      ...tasks,
      {
        id: action.id,
        text: action.text,
        done: false,
      },
    ];
  } else if (action.type === 'changed') {
    return tasks.map((t) => {
      if (t.id === action.task.id) {
        return action.task;
      } else {
        return t;
      }
    });
  } else if (action.type === 'deleted') {
    return tasks.filter((t) => t.id !== action.id);
  } else {
    throw Error('Unknown action: ' + action.type);
  }
}
```

reducer 함수는 state(tasks)를 매개변수로 갖기 때문에, `컴포넌트 외부에서도 reducer 함수를 선언할 수 있다.`

일반적으로 reducer는 위와 같은 `if~else`보단 `switch`문을 사용한다.

```jsx
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added':
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    case 'changed':
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    case 'deleted':
      return tasks.filter((t) => t.id !== action.id);
    default:
      throw Error('Unknown action: ' + action.type);
  }
}
```

> 왜 `reducer`라고 부르는가???<br/>
> 컴포넌트 내부의 코드 양을 줄여주는(reduce) 것도 있지만 실제로는 고차함수인 `reduce`를 따서 지은 이름이다.<br/>
> `지금까지의 결과와 현재의 아이템을 가지고, 다음 결과를 반환한다.`의 개념<br/>

#### Step 3: Use the reducer from your component

끝으로 여러 컴포넌트에 `reducer`를 연결해야 한다. 이 때 사용도는 게 useReducer이다.

`useReducer` 훅은 `useState`와 굉장히 닮아있다. useReducer 훅은 reducer 함수와 초기 state를 인자로 받는다.

```jsx
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

> 아래는 버튼 카운트를 셀 수 있는 간단한 예제 코드이다.

```jsx
import { useState, useReducer } from "react";
import "./styles.css";

const reducer = (state, action) => {
  if (action.type === "ADD") {
    return state + 1;
  }
};

export default function App() {
  const [count, dispatch] = useReducer(reducer, 0);
  const handleClick = () => {
    dispatch({ type: "ADD" });
  };
  return (
    <div className="App">
      <h1>클릭 수: {count}</h1>
      <button onClick={handleClick}>
        <h2>카운트 증가</h2>
      </button>
    </div>
  );
}
```

### Compoaring useState and useReducer

1. 코드의 크기: reducer는 switch문을 사용하기 때문에 코드의 크기가 useState보다 크다. 하지만 state 관리 로직을 별도로 분리할 수 있고 비슷한 로직으로 state를 업데이트하는 경우 코드를 줄이는 데 도움이 된다.
2. 가독성: 상태관리가 복잡해질수록 reducer를 사용하는 것이 가독성이 좋다.
3. 디버깅: reducer는 state를 업데이트하는 로직을 한 곳에 모아두기 때문에 디버깅이 쉽다.
4. 테스팅: reducer는 순수함수이기 때문에 테스팅이 쉽다.

> 반드시 useState와 useReducer 중에 하나만 골라야 하는 것이 아니니, 상황에 맞게 사용하면 된다. 또한, 동시에 사용해도 된다!

### Writing reducers well

1. reducer는 순수함수여야 한다. reducer는 렌더링 중에 실행된다. action들은 다음 렌더링까지 큐에서 대기한다. 
2. 각 action은 여러 데이터가 변경되더라도, 하나의 사용자 액션에 대응해야 한다.

> Immer 라이브러리 중 `use-immer`의 `useImmerReducer` 훅을 사용하면 불변성을 유지하면서 reducer를 작성할 수 있다.

## Passing Data Deeply with Context

일반적으로 부모에서 자식 컴포넌트로 어떤 정보를 전달할 때, props를 이용한다. 이 때, 중간에 여러 컴포넌트를 거쳐야하는 일이 생기게 되는데,
Context를 사용하면 props를 통하지 않고 정보를 전달할 수 있다.

> props를 전달하지 않고도 트리에서 데이터를 필요한 컴포넌트로 “텔레포트”할 수 있는 방법이 있다면 좋지 않을까? React의 context 기능을 사용하면 가능하다!

### Context: an alternative to passing props

1. context를 생성합니다.
2. 데이터가 필요한 컴포넌트에서 해당 context를 사용합니다.
3. 데이터를 지정하는 컴포넌트에서 해당 context를 제공합니다.

#### Step 1: Create the context

```jsx
import { createContext } from 'react';

export const Context = createContext(null);
```

#### Step 2: Use the context

```jsx
import { useContext } from 'react';
import { Context } from './Context.js';

function Temp() {
  const value = useContext(Context);
  // ...
}
```

