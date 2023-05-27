# Describing the UI

```js
let guest = 0;

function Cup() {
  // Bad: changing a preexisting variable!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
```

아래와 같은 순수함수로 사이드이펙트를 방지

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

<br>

## Your First Component

```js
export default function Gallery() {
  // 🔴 Never define a component inside another component!
  function Profile() {
    // ...
  }
  // ...
}
```

위 처럼 컴포넌트는 다른 컴포넌트를 렌더링 할 수 있지만, 함수 정의를 중첩하면 안된다.

아래처럼 최상위 레벨에서 모든 컴포넌트를 정의한다.

자식 컴포넌트에 부모 컴포넌트의 일부 데이터가 필요하다면 정의 중첩보다는 props로 전달한다.

```js
export default function Gallery() {
  // ...
}

// ✅ Declare components at the top level
function Profile() {
  // ...
}
```

<br>

## Importing and Exporting Components

### **모든 컴포넌트는 root 컴포넌트 파일에 존재한다.**

Create React App에서는 앱 전체가 src/App.js에서 실행됩니다. 설정에 따라 root 컴포넌트가 다른 파일에 위치할 수도 있습니다. Next.js처럼 파일 기반으로 라우팅하는 프레임워크일 경우 페이지별로 root 컴포넌트가 다를 수 있습니다.

<br>

## Writing Markup with JSX

### Fragment

```js
<div>
  <h1>Hedy Lamarr's Todos</h1>
  <img
    src="https://i.imgur.com/yXOvdOSs.jpg"
    alt="Hedy Lamarr"
    class="photo"
  >
  <ul>
    ...
  </ul>
</div>
```

```js
<>
  <h1>Hedy Lamarr's Todos</h1>
  <img
    src="https://i.imgur.com/yXOvdOSs.jpg"
    alt="Hedy Lamarr"
    class="photo"
  >
  <ul>
    ...
  </ul>
</>
```

Fragment는 브라우저상의 HTML 트리 구조에서 흔적을 남기지 않고 그룹화해줍니다.
<br>

**_왜 JSX태그를 하나로 감싸줘야 하나요??_**
<br>

JSX는 HTML처럼 보이지만 내부적으로는 JavaScript 객체로 변환됩니다. 하나의 배열로 감싸지 않은 하나의 함수에서는 두 개의 객체를 반환할 수 없습니다. 따라서 또 다른 태그나 Fragment로 감싸지 않으면 두 개의 JSX태그를 반환할 수 없습니다.

<br>

## JavaScript in JSX with Curly Braces

### Using “double curlies”: CSS and other objects in JSX

문자열, 숫자 및 기타 JavaScript 표현식 외에도 JSX로 객체를 전달할 수도 있습니다. 객체는 중괄호로 표시할 수도 있습니다(예: { name: "Hedy Lamarr", inventions: 5 }. 따라서 JSX에서 JS 객체를 전달하려면 다른 중괄호 쌍으로 객체를 감싸야 합니다. (person={{ name: "Hedy Lamarr", inventions: 5 }}
<br>

JSX의 인라인 CSS 스타일에서 이것을 볼 수 있습니다. React에서는 인라인 스타일을 사용할 필요가 없습니다(대부분의 경우 CSS 클래스가 잘 작동합니다). 하지만 인라인 스타일이 필요한 경우 style 어트리뷰트에 객체를 전달합니다:

```js
export default function TodoList() {
  return (
    <ul
      style={{
        backgroundColor: "black",
        color: "pink",
      }}
    >
      <li>Improve the videophone</li>
      <li>Prepare aeronautics lectures</li>
      <li>Work on the alcohol-fuelled engine</li>
    </ul>
  );
}
```

**_이중 중괄호는 아래와 같다_**

```js
<ul style={
  {
    backgroundColor: 'black',
    color: 'pink'
  }
}>
```

<br>

## Passing Props to a Component

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

딱 props라는 객체를 인자로 받아서 사용하는 느낌

```js
function Avatar({ person, size }) {
  // ...
}
```

_props를 선언할 때 ( 및 ) 안에 { 및 } 쌍을 꼭 해줘야한다!_

<br>

## Conditional Rendering

### Conditionally assigning JSX to a variable

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name;
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true} className="item"
          name="Space suit"
        />
        <Item
          isPacked={true} className="item"
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}

{name + " ✔"}도 가능
```

중괄호는 “JavaScript로의 창”을 엽니다. 중괄호로 변수를 반환된 JSX 트리에 삽입하여 이전에 계산된 표현식을 JSX 안에 중첩시킵니다:
