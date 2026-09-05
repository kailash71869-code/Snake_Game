import React, { Component } from 'react';
import Snake from './components/Snake.js';
import Food from './components/Food.js';
import Button from './components/Button.js';
import Menu from './components/Menu.js';
import Leaderboard from './components/Leaderboard.js';
import './App.css';

const getRandomFood = () => {
  let  min =1;
  let max =98;

  let x = Math.floor((Math.random()*(max-min+1)+min)/2)*2;
  let y = Math.floor((Math.random()*(max-min+1)+min)/2)*2;
  return [x,y];
};

const initialState = {
  food: getRandomFood(),
  direction: "RIGHT",
  speed: 120,
  route: "menu",
  snakeDots: [ [0,0], [0,2],],
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    fetch('http://localhost:5000/api/scores')
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error('Error:',error);
    });

    this.interval = setInterval(this.moveSnake, this.state.speed);
    document.onkeydown = this.onKeyDown;
  }

  componentDidUpdate() {
    this.onSnakeOutofBounds();
    this.onSnakeEatFood();
  }

  onKeyDown = (e) => {
    e.preventDefault();
    e = e || window.event;
    switch(e.keyCode) {
      case 37:
        this.setState({ direction: "LEFT"});
        break;
      case 38:
        this.setState({ direction: "UP"});
        break;
      case 39:
        this.setState({ direction: "RIGHT"});
        break;
      case 40:
        this.setState({ direction: "DOWN"});
        break;
      default:
        break;
    }
  };

  moveSnake = () => {
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length-1];
    let newhead;
    if(this.state.route === "game"){
      switch(this.state.direction){
      case "RIGHT":
        newhead = [head[0]+2, head[1]];
        break;
      case "LEFT":
        newhead = [head[0]-2, head[1]];
        break;
      case "DOWN":
        newhead = [head[0], head[1]+2];
        break;
      case "UP":
        newhead = [head[0], head[1]-2];
        break;
      default:
          break;
    }
    dots.push(newhead);
    dots.shift();
    this.setState({
      snakeDots: dots,
    });
  }
};

  onSnakeOutofBounds() {
    let head = this.state.snakeDots[this.state.snakeDots.length-1];
    if(this.state.route === "game") {
      if(head[0]>=100 ||
         head[1]>=100 ||
         head[0]<0 ||
         head[1]<0
       ){
        this.gameOver();
       }
    }
  }

  onSnakeEatFood() {
    let head = this.state.snakeDots[this.state.snakeDots.length-1];
    let food = this.state.food;
    if(head[0] === food[0] && head[1] === food[1]){
      this.setState({
        food: getRandomFood(),
      });
      this.increaseSnake();
      this.increaseSpeed();
    }
  }

  increaseSnake() {
    let newSnake = [...this.state.snakeDots];
    newSnake.unshift(newSnake[0]);

    this.setState({
      snakeDots: newSnake,
    });
  }

  increaseSpeed() {
    if(this.state.speed > 10){
      const newSpeed=this.state.speed-5;

      clearInterval(this.interval);

      this.setState(
        {
          speed: newSpeed
        },
        () => {
          this.interval = setInterval(
            this.moveSnake,
            this.state.speed
          );
        }
      );
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    document.onkeydown = null;
  }

  onRouteChange = (route) => {
    this.setState({route: "game"});
  };

  gameOver() {
    const score = this.state.snakeDots.length-2;
    alert(`Game over, your score is ${score}`);

    fetch('http://localhost:5000/api/scores', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        player: "KAILASH",
        score: score
      })
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("Score saved",data);

      this.setState({
        ...initialState, route: 'leaderboard'
      });
    })
    .catch((error) => {
      console.error("Error",error);
    });
    alert(`Game Over, your score is ${score}`);
    this.setState(initialState);
  }

  onDown=() =>{
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length-1];

    head = [head[0], head[1]+2];
    dots.push(head);
    dots.shift();
    this.setState({
      direction: "DOWN",
      snakeDots: dots,
    });
  };

  onUp = () => {
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length-1];

    head = [head[0], head[1]-2];
    dots.push(head);
    dots.shift();
    this.setState({
      direction: "UP",
      snakeDots: dots,
    });
  };

  onRight = () => {
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length-1];

    head = [head[0]+2 ,head[1]];
    dots.push(head);
    dots.shift();
    this.setState({
      direction: "RIGHT",
      snakeDots: dots,
    });
  };

  onLeft = () => {
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length-1];

    head = [head[0]-2, head[1]];
    dots.push(head);
    dots.shift();
    this.setState({
      direction: "LEFT",
      snakeDots: dots,
    });
  };

  render() {
      const { route, snakeDots, food } = this.state;
      return (
        <div>
           {route ==='menu' && (<Menu onRouteChange={this.onRouteChange} />)
           }

           {route ==='game' && (
               <div>
                  <div className="game-area">
                    <Snake snakeDots={snakeDots} />
                    <Food dot={food} />
                  </div>

                  <Button
                      onDown={this.onDown}
                      onUp={this.onUp}
                      onLeft={this.onLeft}
                      onRight={this.onRight}
                  />
               </div>
           )}

           {
            route === 'leaderboard' && (
              <Leaderboard 
                onPlayAgain={() =>this.setState({
                  ...initialState,
                  route: "game"
                })}
                onMainMenu={() => this.setState({
                  ...initialState,
                  route: "menu"
                })}/>
            )
           }
          </div>
      );
    }
}
export default App;
  