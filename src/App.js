import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import './App.css'

class App extends Component {
  /*
   lifecycle hooks they are hit only once:
   note: render runs each time a change occurs
   componentWillMount() { }
   componentDidMount() { }
   componentWillUnmount() { }

   state lifecycle hooks
   componentWillReceiveProps (fired once if props are specified)
   shouldComponentUpdate   (fired on update state setState, if return false, then no new render)
   componentDidUpdate (fired after render - wont fire if shouldComponentUpdate returned false)

  */
  constructor() {
    super()
    this.state = {
      txt: 'this is the state txt',
      currentEvent: '---',
      input: '',
      subComponent: '',
      items: [],
      filter: null,
      red: 0,
      green: 0
    }
    this.update = this.update.bind(this)
    this.updateNums = this.updateNums.bind(this)
  }
  componentWillMount() {
    fetch('https://swapi.co/api/people/?format=json')
      .then( response => response.json() )
      .then( ({results: items}) => this.setState({items}))
  }
  update(e) {
    this.setState({ currentEvent: e.type })
  }
  updateValue() {
    this.setState({
      input: this.refs.input.value,
      subComponent: this.subComponent.refs.input.value
    })
  }
  updateNums(e) {
    this.setState({
      red: ReactDOM.findDOMNode(this.refs.red.refs.inp).value,
      green: ReactDOM.findDOMNode(this.refs.green.refs.inp).value
    })
  }
  filter(e) {
    this.setState({filter: e.target.value})
  }
  render() {
    let items = this.state.items
    if(this.state.filter){
      items = items.filter( item =>
        item.name.toLowerCase().includes(this.state.filter.toLowerCase())
      )
    }
    return (
      <div className="App">
        <Transpiler />
        <header className="App-header">
          <Title text="123456" />
          <h1 className="App-title">Here is the txt prop: {this.props.txt}</h1>
        </header>
        <h1>event: { this.state.currentEvent }</h1>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
          <textarea
            onKeyPress={this.update}
            onCopy={this.update}
            onCut={this.update}
            onPaste={this.update}
            onDoubleClick={this.update}
            onTouchStart={this.update}
            onTouchMove={this.update}
            onTouchEnd={this.update}
            cols="30"
            rows="10" />
          { /*also get the regular events too mouse over/keydown/focus etc*/ }
          <Button>I <Heart /> React</Button>
        </p>
        <input
          ref="input"
          type="text"
          onChange={this.updateValue.bind(this)}
        /> { this.state.input }
        <Input
          ref={ component => this.subComponent = component }
          update={this.updateValue.bind(this)}
        /> { this.state.subComponent }

        <div>
          <Input  update={this.filter.bind(this)} />
          { items.map(item => <h4 key={item.name}>{item.name}</h4>) }
        </div>
        <Button>button</Button>
        <Label>label</Label>
        <LabelHoc>label2</LabelHoc>
        <Parent><a>b</a></Parent>
        <Buttons>
          <button value="A">A</button>
          <button value="B">B</button>
          <button value="C">C</button>
        </Buttons>
        <NumInput
          ref="red"
          val={ +this.state.red }
          update={ this.updateNums }
          label="red"
        />
        <NumInput
          ref="green"
          val={ +this.state.green }
          type="number"
          update={ this.updateNums }
          label="green"
        />
      </div>

    );
  }
}

App.propTypes = {
  txt: PropTypes.string,
  cat: PropTypes.number
}

App.defaultProps = {
  txt: 'testing 123'
}

// re-usable/composable component
class NumInput extends Component {
  render() {
    let label = this.props.label !== '' ? 
      <label>{this.props.label} = { this.props.val }</label> : ''
    return (
      <div>
        <input
          ref="inp"
          type={this.props.type}
          min={this.props.min}
          max={this.props.max}
          step={this.props.step}
          value={this.props.val}
          onChange={this.props.update}
        />
        { label }
      </div>
    )
  }
}

NumInput.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  val: PropTypes.number,
  label: PropTypes.string,
  update: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['number', 'range'])
}

NumInput.defaultProps = {
  min: 0,
  max: 255,
  step: 1,
  val: 0,
  label: '',
  type: 'range'
}

class Buttons extends Component {
  constructor() {
    super()
    this.state = { selected: 'None' }
  }
  selectItem(selected) {
    this.setState({selected})
  }
  render() {
    let items = React.Children.map(this.props.children, (child) => {
      // we can't just interact with the children, we have to clone them in order to modify
      return React.cloneElement(child, {
        onClick: this.selectItem.bind(this, child.props.value)
      })
    })
    return (
      <div>
        <h2>You have Selected: {this.state.selected}</h2>
        { items }
      </div>
    )
  }
}

// test higher order components
const HOC = (InnerComponent) => class extends Component {
  constructor(){
    super()
    this.state = { count: 0 }
  }
  update() {
    this.setState({count: this.state.count + 1})
  }
  render() {
    return (
      <InnerComponent
        {...this.props}
        {...this.state}
        update={ this.update.bind(this) }
      />
    )
  }
}
const Button = (props) => <button>{props.children}</button>

class Label extends Component {
  // notice that state.count received from the higher order component is used here as a prop when we pass it in via spread
  render() {
    return (
      <label
        onMouseMove={this.props.update}
      >{this.props.children} - { this.props.count }</label>
    )
  }
}

// jsx transpiler

class Transpiler extends Component {
  constructor() {
    super()
    this.state = {
      input: '/* add your jsx here */',
      output: '',
      err: ''
    }
  }
  update (e) {
    let code = e.target.value
    try {
      this.setState({
        output: window.Babel.transform(code, { presets: ['es2017', 'react']}).code,
        err: ''
      })
    }
    catch(err) {
      this.setState({ err: err.message })
    }
  }
  render() {
    return (
      <div>
        <header>{this.state.err}</header>
        <div className="container">
          <textarea
            onChange={this.update.bind(this)}
            defaultValue={this.state.input}
          />
          <pre>
            {this.state.output}
          </pre>
        </div>
      </div>
    )
  }
}

class Parent extends Component {
  render() {
    //let items = React.Children.map(this.props.children, child => child)
    let items = React.Children.toArray(this.props.children)
    console.log(items)
    return null;
  }
}

const LabelHoc = HOC(Label)

const Title = (props) => <h1>Title: { props.text }</h1>

class Input extends Component {
  render() {
    return (
      <div>
        <input
          ref="input"
          type="text"
          onChange={this.props.update}
        />
      </div>
    )
  }
}

Title.propTypes = {
  text(props, propName, component){
    if(!(propName in props)) { return new Error(`missing ${propName}`) }
    if(props[propName].length < 6) { return new Error(`${propName} was too short`) }
  }
}

class Heart extends Component {
  render() {
    return (
      <span>&hearts;</span>
    )
  }
}

export default App;
