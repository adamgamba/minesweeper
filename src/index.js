import React from "react";
import ReactDOM, { render } from "react-dom";
import "./index.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class GameSetup extends React.Component {
  constructor(props) {
    super(props);
    this.chooseDifficulty = this.chooseDifficulty.bind(this);
    this.state = {
      isCustomGame: false,
      length: 0,
      height: 0,
      numMines: 0,
    };
    this.chooseDifficulty = this.chooseDifficulty.bind(this);
    this.chooseCustomValues = this.chooseCustomValues.bind(this);
  }

  chooseDifficulty(difficulty) {
    this.setState({ isCustomGame: false });
    // Set up game with [length, height, numMines]
    if (difficulty === "beginner") {
      this.props.chooseGameSetup([8, 8, 10]);
    } else if (difficulty === "intermediate") {
      this.props.chooseGameSetup([16, 16, 40]);
    } else if (difficulty === "expert") {
      this.props.chooseGameSetup([26, 26, 100]);
    }
    // else difficulty is custom
    else {
      this.setState({ isCustomGame: true });
      this.props.chooseGameSetup([
        this.state.length,
        this.state.height,
        this.state.numMines,
      ]);
      return;
    }
  }

  // Gathers data from custom game setup inputs
  chooseCustomValues(e) {
    // Deal with asynchronous state updating (using callback function)
    this.setState(
      {
        [e.target.name]: e.target.value,
      },
      function () {
        console.log(`state completed`);
        this.chooseDifficulty("custom");
      }
    );
  }

  render() {
    let custom = null;
    if (this.state.isCustomGame) {
      custom = (
        <CustomGameInfo chooseCustomValues={this.chooseCustomValues} />
      );
    }
    return (
      <div>
        <GameInfo chooseDifficulty={this.chooseDifficulty} />
        {custom}
        <StartButton onClick={this.props.handleStart} />
      </div>
    );
  }
}

const StartButton = (props) => {
  return (
    <button
      className="startButton font"
      onClick={() => props.onClick()}
    >
      Start Game
    </button>
  );
};
const EndButton = (props) => {
  return (
    <button className="endButton font" onClick={() => props.onClick()}>
      End Game
    </button>
  );
};

const GameInfo = (props) => {
  return (
    // Radio buttons for beginner, intermediate, expert, and custom
    <div className="radioButtons">
      <div>
        <input
          defaultChecked
          type="radio"
          id="beginner"
          name="difficulty"
          value="beginner"
          onClick={() => props.chooseDifficulty("beginner")}
        />
        <label htmlFor="beginner">
          Beginner (8x8, 10 mines - Default)
        </label>
      </div>
      <div>
        <input
          type="radio"
          id="intermediate"
          name="difficulty"
          value="intermediate"
          onClick={() => props.chooseDifficulty("intermediate")}
        />
        <label htmlFor="intermediate">
          Intermediate (16x16, 40 mines)
        </label>
      </div>
      <div>
        <input
          type="radio"
          id="expert"
          name="difficulty"
          value="expert"
          onClick={() => props.chooseDifficulty("expert")}
        />
        <label htmlFor="expert">Expert (26x26, 100 mines)</label>
      </div>
      <div>
        <input
          type="radio"
          id="custom"
          name="difficulty"
          value="custom"
          onClick={() => props.chooseDifficulty("custom")}
        />
        <label htmlFor="custom">Custom Game</label>
      </div>
    </div>
  );
};

const CustomGameInfo = (props) => {
  return (
    // Custom game length, height, and numMines inputs
    <div className="customGame">
      <div>
        <label htmlFor="length">Length:</label>
        <input
          type="number"
          id="length"
          name="length"
          min={1}
          max={26}
          onChange={props.chooseCustomValues}
        />
      </div>
      <div>
        <label htmlFor="height">Height:</label>
        <input
          type="number"
          name="height"
          id="height"
          min={1}
          max={100}
          onChange={props.chooseCustomValues}
        />
      </div>
      <div>
        <label htmlFor="numMines">Number of Mines:</label>
        <input
          type="number"
          name="numMines"
          id="numMines"
          min={1}
          max={500}
          onChange={props.chooseCustomValues}
        />
      </div>
    </div>
  );
};

// ! not active
// const FlagButton = (props) => {
//   return (
//     <div>
//       <input
//         type="checkbox"
//         className="flagButton"
//         id="flagButton"
//         onChange={props.onChange}
//       />
//       <label htmlFor="flagButton">Place Flags?</label>
//     </div>
//   );
// };

// Basic square tile in the game
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  // Calls props handleClick func with correct args
  handleClick(side) {
    console.log(`index=${this.props.index}`);
    side === "r"
      ? this.props.handleClick(this.props.index, "r")
      : this.props.handleClick(this.props.index, "l");
  }

  render() {
    let className = "square";
    if (this.props.isRevealed) className = "clickedSquare";
    if (!this.props.gameOver) className += " squareActive";

    return (
      <button
        className={className}
        onClick={this.handleClick}
        onContextMenu={(e) => {
          console.log("clicked");
          e.preventDefault();
          this.handleClick("r");
        }}
      >
        <SquareText
          value={this.props.value}
          isRevealed={this.props.isRevealed}
          isFlagged={this.props.isFlagged}
        />
      </button>
    );
  }
}

// Returns correct text to display on square, or &nbsp; for none
const SquareText = (props) => {
  if (props.isFlagged) return <span style={{ color: "red" }}>F</span>;
  if (!props.isRevealed || props.value === 0)
    return <span>&nbsp;</span>;
  switch (props.value) {
    case "B":
      return <span style={{ color: "black" }}>B</span>;
    case 1:
      return <span style={{ color: "blue" }}>1</span>;
    case 2:
      return <span style={{ color: "green" }}>2</span>;
    case 3:
      return <span style={{ color: "red" }}>3</span>;
    case 4:
      return <span style={{ color: "purple" }}>4</span>;
    case 5:
      return <span style={{ color: "maroon" }}>5</span>;
    case 6:
      return <span style={{ color: "turquoise" }}>6</span>;
    case 7:
      return <span style={{ color: "black" }}>7</span>;
    case 8:
      return <span style={{ color: "darkgrey" }}>8</span>;
  }
};

// Main Game Board component that holds the states of squares
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFlagged: Array(this.props.length * this.props.height).fill(
        false
      ),
      isRevealed: Array(this.props.length * this.props.height).fill(
        false
      ),
      numRevealed: 0,
      isFlagging: false,
      squareValues: this.setUpBoard(this.props.numMines),
      currentClick: 0,
      gameOver: false,
      gameWon: false,
    };
    this.setUpBoard = this.setUpBoard.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.assignNumbers = this.assignNumbers.bind(this);
  }

  // Set up board with n randomly placed bombs, and corresponding nums
  setUpBoard(n) {
    console.log(`bombs away`);
    const NUM_SQUARES = this.props.length * this.props.height;

    if (n < 1 || n > NUM_SQUARES) return null;
    let squareValues = new Array(NUM_SQUARES).fill(null);
    //  Randomly determine bomb positions
    for (let bombs = 0; bombs < n; ) {
      let rand = Math.floor(Math.random() * NUM_SQUARES);
      console.log(typeof squareValues);
      // If not yet filled with a bomb, add bomb
      if (squareValues[rand] === null) {
        squareValues[rand] = "B";
        bombs++;
      }
    }
    return this.assignNumbers(squareValues);
  }
  // Helper function that assigns the rest of the numbers [1-8]
  assignNumbers(squareValues) {
    const BOARD_LENGTH = this.props.length;
    const NUM_SQUARES = BOARD_LENGTH * this.props.height;
    // Determine numbers for the rest of the squares
    for (let i in squareValues) {
      i = parseInt(i);
      if (squareValues[i] === "B") continue;
      // Count how many bombs this square is touching (8 cases)
      let bombsTouching = 0;
      // top-left neighbor
      if (
        i > BOARD_LENGTH &&
        i % BOARD_LENGTH !== 0 &&
        squareValues[i - BOARD_LENGTH - 1] === "B"
      ) {
        bombsTouching++;
      }
      // top-middle neighbor
      if (i >= BOARD_LENGTH && squareValues[i - BOARD_LENGTH] === "B") {
        bombsTouching++;
      }
      // top-right neighbor
      if (
        i >= BOARD_LENGTH &&
        (i + 1) % BOARD_LENGTH !== 0 &&
        squareValues[i - BOARD_LENGTH + 1] === "B"
      ) {
        bombsTouching++;
      }
      // left neighbor
      if (i % BOARD_LENGTH !== 0 && squareValues[i - 1] === "B") {
        bombsTouching++;
      }
      // right neighbor
      if ((i + 1) % BOARD_LENGTH !== 0 && squareValues[i + 1] === "B") {
        bombsTouching++;
      }
      // bottom-left neighbor
      if (
        i < NUM_SQUARES - BOARD_LENGTH &&
        i % BOARD_LENGTH !== 0 &&
        squareValues[i + BOARD_LENGTH - 1] === "B"
      ) {
        bombsTouching++;
      }
      // bottom-middle neighbor
      if (
        i < NUM_SQUARES - BOARD_LENGTH &&
        squareValues[i + BOARD_LENGTH] === "B"
      ) {
        bombsTouching++;
      }
      // bottom-right neighbor
      if (
        i < NUM_SQUARES - BOARD_LENGTH - 1 &&
        (i + 1) % BOARD_LENGTH !== 0 &&
        squareValues[i + BOARD_LENGTH + 1] === "B"
      ) {
        bombsTouching++;
      }

      squareValues[i] = bombsTouching;
    }
    return squareValues;
  }

  // handleFlagButton() {
  //   this.setState({ isFlagging: !this.state.isFlagging });
  // }

  // Called when an unclicked square is clicked, reacts appropriately
  // whether it is a mine, number, or flag
  handleClick(i, side) {
    if (this.state.gameOver) return;
    const BOARD_LENGTH = this.props.length;
    const NUM_SQUARES = BOARD_LENGTH * this.props.height;
    console.log(i);

    // Case where you are placing down a flag
    // ! removed isFlagging checkbox
    if (
      !this.state.isRevealed[i] &&
      (side === "r" || this.state.isFlagging)
    ) {
      const isFlagged = this.state.isFlagged;
      isFlagged[i] = !isFlagged[i];
      this.setState({ isFlagged: isFlagged });
    }
    // Case where you click a flagged square (do nothing)
    else if (this.state.isFlagged[i]) {
      return;
    }
    // Case where you click a bomb, call handleLoss() function
    else if (this.state.squareValues[i] === "B") {
      this.handleLoss();
    }
    // Case where you need to reveal a clicked square
    else {
      const isRevealed = this.state.isRevealed;
      const isFlagged = this.state.isFlagged;
      if (!isRevealed[i]) {
        isRevealed[i] = true;
        isFlagged[i] = false;
        console.log(this.state.squareValues[i]);
        this.setState({
          isRevealed: isRevealed,
          isFlagged: isFlagged,
        });
        // Deal with asynchronous state updating
        this.setState((state) => ({
          numRevealed: state.numRevealed + 1,
        }));
      }

      // Recursive step to reveal all 0s (and numbers on edge of zeros)
      if (this.state.squareValues[i] !== 0) return;
      // top-middle neighbor
      if (
        //   this.state.squareValues[i - BOARD_LENGTH] <= 1 &&
        !this.state.isRevealed[i - BOARD_LENGTH] &&
        i >= BOARD_LENGTH
      ) {
        this.handleClick(i - BOARD_LENGTH);
      }
      // left neighbor
      if (
        //   this.state.squareValues[i - 1] <= 1 &&
        !this.state.isRevealed[i - 1] &&
        i % BOARD_LENGTH !== 0
      ) {
        this.handleClick(i - 1);
      }
      // right neighbor
      if (
        //   this.state.squareValues[i + 1] <= 1 &&
        !this.state.isRevealed[i + 1] &&
        (i + 1) % BOARD_LENGTH !== 0
      ) {
        this.handleClick(i + 1);
      }
      // bottom-middle neighbor
      if (
        //   this.state.squareValues[i + BOARD_LENGTH] <= 1 &&
        !this.state.isRevealed[i + BOARD_LENGTH] &&
        i < NUM_SQUARES - BOARD_LENGTH
      ) {
        this.handleClick(i + BOARD_LENGTH);
      }
      // top-left neighbor
      if (
        !this.state.isRevealed[i - BOARD_LENGTH - 1] &&
        i > BOARD_LENGTH &&
        i % BOARD_LENGTH !== 0
      ) {
        this.handleClick(i - BOARD_LENGTH - 1);
      }
      // top-right neighbor
      if (
        !this.state.isRevealed[i - BOARD_LENGTH + 1] &&
        i >= BOARD_LENGTH &&
        (i + 1) % BOARD_LENGTH !== 0
      ) {
        this.handleClick(i - BOARD_LENGTH + 1);
      }
      // bottom-left neighbor
      if (
        !this.state.isRevealed[i + BOARD_LENGTH - 1] &&
        i < NUM_SQUARES - BOARD_LENGTH &&
        i % BOARD_LENGTH !== 0
      ) {
        this.handleClick(i + BOARD_LENGTH - 1);
      }
      // bottom-right neighbor
      if (
        !this.state.isRevealed[i + BOARD_LENGTH + 1] &&
        i < NUM_SQUARES - BOARD_LENGTH - 1 &&
        (i + 1) % BOARD_LENGTH !== 0
      ) {
        this.handleClick(i + BOARD_LENGTH + 1);
      }
    }
  }

  handleLoss() {
    let NUM_SQUARES = this.props.length * this.props.height;
    const isRevealed = this.state.isRevealed;
    let correctlyFlagged = 0,
      incorrectlyFlagged = 0;

    // Sees how many bombs were correctly/incorrectly flagged
    for (let i = 0; i < NUM_SQUARES; i++) {
      if (
        this.state.squareValues[i] === "B" &&
        this.state.isFlagged[i]
      ) {
        correctlyFlagged++;
      }
      if (
        this.state.squareValues[i] !== "B" &&
        this.state.isFlagged[i]
      ) {
        incorrectlyFlagged++;
      }
      // Reveals all bomb locations
      if (
        this.state.squareValues[i] === "B" &&
        !this.state.isFlagged[i]
      ) {
        isRevealed[i] = true;
      }
      this.setState((state) => ({
        isRevealed: isRevealed,
        gameOver: true,
      }));
    }
    alert(
      `BOOM!\n
      You correctly revealed ${this.state.numRevealed} of the 
      ${NUM_SQUARES} squares.\n
      You correctly flagged ${correctlyFlagged} of the 
      ${this.props.numMines} mines and incorrectly flagged 
      ${incorrectlyFlagged} mines.
      `
    );
  }

  render() {
    let row = [];
    let board = [];

    // create length x height grid of squares
    for (let i = 0; i < this.props.height; i++) {
      row = [];
      for (let j = 0; j < this.props.length; j++) {
        let index = i * this.props.length + j;
        row.push(
          <Square
            index={index}
            key={index.toString()}
            value={this.state.squareValues[index]}
            isRevealed={this.state.isRevealed[index]}
            isFlagged={this.state.isFlagged[index]}
            handleClick={this.handleClick}
            gameOver={this.state.gameOver}
          />
        );
      }
      board.push(<div>{row}</div>);
    }
    // If game is over, display an "End Game" button
    if (this.state.gameOver) {
      board.push(<EndButton onClick={this.props.handleLoss} />);
    }

    // Check for win
    if (
      this.state.numRevealed + this.props.numMines ===
      this.props.length * this.props.height
    ) {
      alert(`Congrats, you won the game!`);
      board.push(<EndButton onClick={this.props.handleLoss} />);
    }
    return <div className="board">{board}</div>;
  }
}

class Minesweeper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      // Default game size (beginner difficulty)
      length: 8,
      height: 8,
      numMines: 10,
      difficulty: "beginner",
    };
    this.chooseGameSetup = this.chooseGameSetup.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleLoss = this.handleLoss.bind(this);
  }

  chooseGameSetup(setupArr) {
    this.setState({ length: parseInt(setupArr[0]) });
    this.setState({ height: parseInt(setupArr[1]) });
    this.setState({ numMines: parseInt(setupArr[2]) });
  }
  handleStart() {
    this.setState({ isActive: true });
  }
  handleLoss() {
    this.setState({ isActive: false });
  }

  render() {
    return (
      <div className="font">
        <h1>Welcome to Minesweeper! </h1>
        {this.state.isActive ? (
          <Board
            length={this.state.length}
            height={this.state.height}
            numMines={this.state.numMines}
            handleLoss={this.handleLoss}
          />
        ) : (
          <GameSetup
            handleStart={this.handleStart}
            chooseGameSetup={this.chooseGameSetup}
          />
        )}
      </div>
    );
  }
}
// const FONTS = (
//   <div>
//     <link rel="preconnect" href="https://fonts.gstatic.com" />
//     <link
//       href="https://fonts.googleapis.com/css2?family=VT323&display=swap"
//       rel="stylesheet"
//     />
//   </div>
// );
ReactDOM.render(<Minesweeper />, document.getElementById("root"));
