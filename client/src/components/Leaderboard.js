import React, { Component } from "react";
import "./Leaderboard.css";

class Leaderboard extends Component {
    state = {
        scores: [],
        loading: true
    };

    componentDidMount() {
        this.loadScores();
    }

    loadScores = () => {
        fetch("http://localhost:5000/api/scores")
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    scores: data,
                    loading: false
                });
            })
            .catch((error) => {
                console.log("Error fetching scores:", error);

                this.setState({
                    loading: false
                });
            });
    };

    render() {
        const { scores, loading } = this.state;
        const { onPlayAgain, onMainMenu } = this.props;

        return (
            <div className="leaderboard">

                <h1>Leaderboard</h1>

                {loading ? (
                    <p>Loading.....</p>
                ) : scores.length === 0 ? (
                    <p>No Scores yet.</p>
                ) : (
                    <div className="score-table">

                        <div className="score-header">
                            <span>Rank</span>
                            <span>Player</span>
                            <span>Score</span>
                        </div>

                        {scores.map((item, index) => (
                            <div className="score-row" key={item._id}>
                                <span>{index + 1}</span>
                                <span>{item.player}</span>
                                <span>{item.score}</span>
                            </div>
                        ))}

                    </div>
                )}

                <div className="leaderboard-button">

                    <button onClick={onPlayAgain}>
                        PLAY AGAIN
                    </button>

                    <button onClick={onMainMenu}>
                        Main Menu
                    </button>

                </div>

            </div>
        );
    }
}

export default Leaderboard;