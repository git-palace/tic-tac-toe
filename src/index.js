import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square( props ) {
	let color = props.bold ? 'red' : '';
	return (
		<button className="square" onClick={ props.onClick } style={ { 'color' : color } }>
			{ props.value }
		</button>
	);
}

function calculateWinner( squares ) {
	const lines = [
		[ 0, 1, 2 ],
		[ 3, 4, 5 ],
		[ 6, 7, 8 ],
		[ 0, 3, 6 ],
		[ 1, 4, 7 ],
		[ 2, 5, 8 ],
		[ 0, 4, 8 ],
		[ 2, 4, 6 ]
	];

	for ( let line of lines ) {	
		const [ a, b, c ] = line;

		if ( squares[a] && squares[a] === squares[b] && squares[a] === squares[c] ) {
			return {
				'player': squares[a],
				'line': line
			};
		}
	}

	return null;
}

class Board extends React.Component {
	renderSquare( i ) {
		let bold = null;
		if ( this.props.winner_line )
			bold = this.props.winner_line.includes( i );
		return <Square value={ this.props.squares[i] } onClick={ () => this.props.onClick( i ) } bold={ bold } />;
	}

	render() {
		const board_list = Array(3).fill(true).map( (val, index) => {
			return (
				<div key={ index } className="board-row">
					{ this.renderSquare( index * 3 ) }
					{ this.renderSquare( index * 3 + 1 ) }
					{ this.renderSquare( index * 3 + 2 ) }
				</div>
			)
		} );

		return (
			<div>{ board_list }</div>
		);
	}
}

class Game extends React.Component {
	constructor() {
		super()

		this.state = {
			history: [{
				squares: Array(9).fill( null )
			}],
			xIsNext: true,
			stepNumber: 0,
			reverseOrder: false
		}
	}

	jumpTo( step ) {
		this.setState( {
			stepNumber: step,
			xIsNext: (step % 2) === 0
		} );
	}

	handleClick( i ) {
		const history = this.state.history.slice( 0, this.state.stepNumber + 1 );
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		
		if ( calculateWinner( squares ) || squares[ i ] )
			return;

		squares[i] = this.state.xIsNext ? 'X' : 'O';

		this.setState( { 
			history: history.concat([{
				squares: squares,
			}]),
			xIsNext: !this.state.xIsNext,
			stepNumber: history.length
		} );
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner( current.squares );

		const moves = history.map( ( step, move ) => {
			const desc = move ? 'Move (' + ( move % 2 === 1 ? '1' : '2' ) + ', ' + Math.ceil( move / 2 ) + ')' : 'Game Start';

			return (
				<li key={move} style={ move === this.state.stepNumber ? {fontWeight: 'bold'} : {} }>
					<a href="#" onClick={ () => this.jumpTo( move ) }>{desc}</a>
				</li>
			)
		} );

		let status;

		if ( winner ) {
			status = 'Winner : ' + winner.player;
		} else
			status = 'Next player : ' + ( this.state.xIsNext ? 'X' : 'O' );

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares = { current.squares } 
						onClick = { (i) => this.handleClick( i ) }
						winner_line = { winner ? winner.line : null }
					/>
				</div>
				<div className="game-info">
					<div>{ status }</div>
					<button className="reverse-order" onClick = { () => { this.setState( { reverseOrder: !this.state.reverseOrder } ) } }>Reverse</button>
					<ol>{ this.state.reverseOrder ? moves.reverse() : moves }</ol>
				</div>
			</div>
		);
	}
}

// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);
