# Reacting to Input with State

## Describing the UI for each visual state
- a **declarative** way to manipulate the UI : describe the different states that your component can be in, and switch between them in response to the user input.
- NOT imperative : NOT manipulating UI directly
- “state machine” 유한 상태 머신(Finite State Mode, FSM) 이론을 기반으로 한다.

## Steps
1. **Identify** your component’s different visual states
	- visualize all the different “states” of the UI the user might see
1. **Determine** what triggers those state changes: Human inputs? Computer inputs?
2. **Represent** the state in memory using `useState`
3. **Remove** any non-essential state variables
4. **Connect** the event handlers to set the state

- 꼭 필요한 상태만, 기능에 필요한 최소한의 상태
```ts
// BEFORE
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);

// AFTER
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', or 'success'

```

> a non-null `error` doesn’t make sense when `status` is `'success'`

> To model the state more precisely, you can extract it into a reducer. Reducers let you unify multiple state variables into a single object and consolidate all the related logic!

- 위의 예시에서 error, status state도 관련이 있는 것처럼, 관련된 상태에 대한 로직을 통합적으로 관리해야할 때는 reducer로 단일 object로 통합하여 관리

# Choosing the State Structure

## Principles for structuring state 

1. **Group related state.** 
2. **Avoid contradictions in state.** 
3. **Avoid redundant state.**
   - If you can calculate some information from the component’s props or its existing state variables during rendering, you **should not** put that information into that component’s state.
4. **Avoid duplication in state.** < 마침 뉴스스탠드 리스트 보기 데이터로 고민하던 부분인데 조언을 구해보자
5. **Avoid deeply nested state.**

# Sharing State Between Components

- 하위 컴포넌트들끼리 상태를 공유해야 하는 경우 -> Controlled components (driven by props)
- Uncontrolled Component (driven by state)

1. **Remove** state from the child components.
2. **Pass** hardcoded data from the common parent.
3. **Add** state to the common parent and pass it down together with the event handlers.

# Preserving and resetting state

- when to preserve state and when to reset it between re-renders.
- React preserves the parts of the tree that “match up” with the previously rendered component tree.
- 다시 말하면 렌더링이 변경되어야 하면 리액트가 변화를 감지할 상태가 있어야 한다는 의미

> When you give a component state, you might think the state “lives” inside the component. But the state is actually held inside React. React associates each piece of state it’s holding with the correct component by where that component sits in the UI tree.

> React will keep the state around for as long as you render the same component at the same position

1. Same component at the same position preserves state 
1. Different components at the same position reset state
	> As a rule of thumb, **if you want to preserve the state between re-renders, the structure of your tree needs to “match up”** from one render to another. 
	> If the structure is different, the state gets destroyed because React destroys state when it removes a component from the tree.
	
### Resetting State
1. Render components in different positions

```jsx
// BEFORE
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

// 1. Render components in different positions
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

// 2. Resetting state with a key
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
```

```jsx
{isPlayerA && <Counter person="Taylor" />}
{!isPlayerA && <Counter person="Sarah" />}
```

- 위의 둘을 각각의 위치로 인식
![[Pasted image 20230611090934.png]]


```jsx
// BEFORE
<Chat contact={to} />

// AFTER
<Chat key={to.email} contact={to} />
```

### Preserving state for removed components 

1. Render all chats instead of just the current one, but hide all the others with CSS
2. Lift the state up and hold the pending message for each recipient in the parent component. 
3. Use a different source (ex. LocalStorage)

> No matter which strategy you pick, a chat _with Alice_ is conceptually distinct from a chat _with Bob_, so it makes sense to give a `key` to the `<Chat>` tree based on the current recipient.

- 내용은 맞는데 수신자 설정만 다르게 하는 경우 -> 그럼 그냥 그대로

> Remember that keys are not globally unique. They only specify the position _within the parent_.
- 같은 계층(동일한 부모 컴포넌트를 가진 자식 컴포넌트들 간)에서는 key가 고유해야 함.