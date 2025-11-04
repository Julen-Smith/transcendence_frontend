

export async function sendGameResult(winner,loser,winner_score,loser_score)
{
    //console.log(winner);
    //console.log(loser);
    //console.log(winner_score);
    //console.log(loser_score);
    fetch('https://trascendence.tech:4242/api/game_result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
                winner: winner,
                loser: loser,
                winner_score: winner_score,
                loser_score: loser_score,
        })
        
    }).then(response => response.json())
        .then(data => console.log('Game result sent:', data))
        .catch(error => console.log('Error sending game result:', error));
    //console.log("------------------------------------------------------");
    
    //console.log("Enviando Game Result \n",
     //       winner, "\n",  
      //      loser, "\n",
       //     winner_score, "\n",
        //    loser_score, "\n");
    //console.log("------------------------------------------------------");
}