# 컴포넌트를 그냥 함수로 호출하면 안되나..?

## 실험

```jsx
import './App.css';
import Header from "./components/Header.jsx";
import Title from "./components/Title.jsx";
import Content from "./components/Content.jsx";

function App() {
  return (
    <div className="App">
      <Header>
        <Title color='tomato'>
          <Content></Content>
        </Title>
        {Title({children: Content(), color: 'tomato'})}
      </Header>
    </div>
  );
}

export default App;
```

위의 코드에서 Title 컴포넌트를 JSX가 아닌 일반 함수로 호출해도 잘 작동한다.

## 둘의 차이가 있을까?

어떤 배열을 만들고 그 배열의 개수만큼 컴포넌트를 호출하는 경우를 생각해보자.

### 1. 함수로 호출하는 경우

```jsx
function App() {
  return (
    <div className="App">
      <Header>
        {[1, 2, 3, 4, 5].map((num) => Title({children: Content(), color: 'tomato'}))}
      </Header>
    </div>
  );
}
```


### 2. JSX로 호출하는 경우

```jsx
function App() {
  return (
    <div className="App">
      <Header>
        {[1, 2, 3, 4, 5].map((num) => <Title color='tomato'><Content></Content></Title>)}
      </Header>
    </div>
  );
}
```

# 참고

- [dont-call-a-react-function-component](https://kentcdodds.com/blog/dont-call-a-react-function-component)