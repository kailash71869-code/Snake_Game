import React, { Component } from "react";

class Leaderboard extends Component {
    state = {
        scores: [],
        loading: true
    };

    componentDidMount() {
        fetch('http://localhost:5000/api/scores')
        .then((response) => response.json())
        .then((data) =>{
            this.setState({
                scores: data,
                loading: false
            });
        })
        .catch((error) => {
            console.error("Error fetching scores:",error);
            this.setState({
                loading: false
            });
        });
    }

    render() {
        const { scores, loading } =this.state;

        return(
            <div>
                <h2>Leaderboard</h2>

                {loading ?(
                    <p>Loading...</p>):
                    scores.length===0 ? (
                        <p>No Scores yet..</p>):
                        (<ol>{
                            scores.map((item) =>(
                                <li key={item._id}>
                                    {item.player}-{item.score}
                                </li>)
                            )
                            }
                        </ol>
                        )
                }
            </div>
        )
    }
}

export default Leaderboard;
                            