## Referencing values with Refs
- 해결하려는 문제: 컴포넌트가 변화된 data를 기억은 해야 하는데, setState처럼 렌더링을 유발하지는 않도록
- ref는 current라는 프로퍼티를 가지는 일반적인 Object이다.
- a regular state variable without a setter: UI에 필요하지 않은 변수를 저장하기 위함

### When to use refs
> If your component needs to store some value, but it doesn’t impact the rendering logic, choose refs.

- Storing timeout IDs
- Storing and manipulating [DOM elements](https://developer.mozilla.org/docs/Web/API/Element)
- Storing other objects that aren’t necessary to calculate the JSX.

## Manipulating the DOM with Refs
> `<input ref={inputRef}>`. 
- This tells React to **put this `<input>`’s DOM node into `inputRef.current`.**
- 언제 필요할까? For calling browser APIs that React does not expose.

### [ref callback](https://react-ko.dev/reference/react-dom/components/common#ref-callback)

> Unless you pass the same function reference for the `ref` callback on every render, the callback will get temporarily detached and re-attached during every re-render of the component.

- ? 무슨 소리지?

### useImperativeHandle
- 해결하려는 문제: DOM Element를 노출하되, 원하는 동작에만 제한하도록 하기 위해서 (아래에선 focus만!)

```jsx
// 1번
import { forwardRef, useRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}

// 2번
import {
  forwardRef, 
  useRef, 
  useImperativeHandle
} from 'react';

const MyInput = forwardRef((props, ref) => {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // Only expose focus and nothing else
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input {...props} ref={realInputRef} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}

```

> React sets `ref.current` during the commit.
- ref.current는 실제 DOM에 반영할 때 설정된다.

### Flushing state updates synchronously with flushSync
- DOM에 commit 시점과 ref.current를 참조하는 시점을 동기화시키기 위해서 (DOM에 반영된 후에, DOM API를 사용하고 싶을 때)
```jsx
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```