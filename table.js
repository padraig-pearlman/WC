const teams = {
    "QAT": "M",
    "ECU": "C",
    "SEN": "M",
    "NED": "M",
    "ARG": "C",
    "KSA": "P",
    "MEX": "P",
    "POL": "L",
    "ESP": "L",
    "CRC": "L",
    "GER": "M",
    "JPN": "P",
    "BRA": "P",
    "SRB": "M",
    "SUI": "P",
    "CMR": "C",
    "ENG": "C",
    "IRN": "M",
    "USA": "C",
    "WAL": "L",
    "FRA": "M",
    "AUS": "C",
    "DEN": "P",
    "TUN": "L",
    "BEL": "P",
    "CAN": "C",
    "MAR": "P",
    "CRO": "C",
    "POR": "L",
    "GHA": "L",
    "URU": "L",
    "KOR": "M"
}

// [mp, win, loss, draw, pts]

var players = {
    "P": {
        code: "P",
        name: "Padraig",
        matches: [],
        matches_played: 0,
        win: 0,
        loss: 0,
        draw: 0,
        points: 0
    },
    "C": {
        code: "C",
        name: "Chris",
        matches: [],
        matches_played: 0,
        win: 0,
        loss: 0,
        draw: 0,
        points: 0
    },
    "M": {
        code: "M",
        name: "Malachy",
        matches: [],
        matches_played: 0,
        win: 0,
        loss: 0,
        draw: 0,
        points: 0
    },
    "L": {
        code: "L",
        name: "Laura",
        matches: [],
        matches_played: 0,
        win: 0,
        loss: 0,
        draw: 0,
        points: 0
    }
}

function getResults (useReq = true) {
    if (useReq) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                tabulateResults(this.responseText);
                populateRecentMatches(this.responseText);
        }
        };
        xhttp.open("GET", "https://worldcupjson.net/matches/?by_date=DESC", true);
        xhttp.send();
    } else {
        let results = [{
            "status": "completed",
            "winner_code": "ESP",
            "stage_name": "First stage",
            "home_team": {
                "country": "Spain",
                "code": "ESP",
                "goals": 5
            },
            "away_team": {
                "country": "Serbia",
                "code": "SRB",
                "goals": 1
            }
        },
        {
            "status": "completed",
            "winner_code": "WAL",
            "stage_name": "First stage",
            "home_team": {
                "country": "Wales",
                "code": "WAL",
                "goals": 4
            },
            "away_team": {
                "country": "England",
                "code": "ENG",
                "goals": 1
            }
        },
        {
            "status": "completed",
            "winner_code": "BRA",
            "stage_name": "First stage",
            "home_team": {
                "country": "Brazil",
                "code": "BRA",
                "goals": 2
            },
            "away_team": {
                "country": "Morocco",
                "code": "MAR",
                "goals": 1
            }
        }];

        tabulateResults(results);
        populateRecentMatches(results);
    }
}

function tabulateResults (matches) {
    let i = 0;
    for (i = 0; i < matches.length; i++) {
        let match = matches[i];
        if (match.status == "completed") {
            let home_team = match.home_team.code; let home_team_goals = match.home_team.goals;
            let away_team = match.away_team.code; let away_team_goals = match.away_team.goals;
            
            let home_team_owner = teams[home_team]; let away_team_owner = teams[away_team];
            let winner = null;

            if (match.winner_code == home_team) winner = home_team;
            else if (match.winner_code == away_team) winner = away_team;

            let points_for_home_team_owner;
            let points_for_away_team_owner;


            if (winner != null) {
                points_for_home_team_owner = (winner == home_team) ? 3 : 0;
                points_for_away_team_owner = (winner == away_team) ? 3 : 0;
            } else {
                points_for_home_team_owner = 1;
                points_for_away_team_owner = 1;
            }

            if (home_team_owner == away_team_owner) {
                players[home_team_owner].matches.push(match);

                players[home_team_owner].matches_played += 2;
                if (winner != null) {
                    players[home_team_owner].win += 1;
                    players[home_team_owner].loss += 1;
                } else {
                    players[home_team_owner].draw += 2;
                }

                players[home_team_owner].points += points_for_home_team_owner + points_for_away_team_owner;
            } else {
                players[home_team_owner].matches.push(match);

                players[home_team_owner].matches_played += 1;
                players[home_team_owner].points += points_for_home_team_owner;

                if (winner != null) {
                    players[home_team_owner].win += (points_for_home_team_owner == 3) ? 1 : 0;
                    players[home_team_owner].loss += (points_for_home_team_owner == 0) ? 1 : 0;

                } else {
                    players[home_team_owner].draw += 1;
                }

                players[away_team_owner].matches.push(match);

                players[away_team_owner].matches_played += 1;
                players[away_team_owner].points += points_for_away_team_owner;

                if (winner != null) {
                    players[away_team_owner].win += (points_for_away_team_owner == 3) ? 1 : 0;
                    players[away_team_owner].loss += (points_for_away_team_owner == 0) ? 1 : 0;

                } else {
                    players[away_team_owner].draw += 1;
                }
            }
        } 
    }

    makeTable();
}


function makeTable() {
    let playerValues = Object.values(players);
    table = document.getElementById("standings");
    playerValues.sort(function (a, b) {
        if (a.points > b.points) {
            return -1;
        } else if (b.points > a.points) {
            return 1;
        }
        return 0;
    });

    let i;
    for (i = 0; i < playerValues.length; i++) {
       table.innerHTML += `<tr onClick="showOnlyMatches('${playerValues[i].code}')"><td>${playerValues[i].name}</td><td>${playerValues[i].matches_played}</td><td>${playerValues[i].win}</td><td>${playerValues[i].loss}</td><td>${playerValues[i].draw}</td><td>${playerValues[i].points}</td>`; 
    }
}

let matchesView = document.getElementById("matches-view");
var showing = null;
let smv = document.getElementById("singular-matches-view");

function populateRecentMatches(matches) {
    let i = 0;
    for (i = 0; i < Math.min(matches.length, 10); i++) {
        let match = matches[i];
        if (match.status == "completed") {
            matchesView.innerHTML += `
            <div class="match">
                <p>${match.stage_name} match</p>
                <h2>${match.home_team.country}<br>${match.home_team.goals}</h2>
                <h2>${match.away_team.country}<br>${match.away_team.goals}</h2>
            </div>`;
        }
    }
}

function showOnlyMatches(code) {
    smv.innerHTML = '<h1 id="whoseMatches"></h1>';

    let person = players[code];

    if (showing == code) {
        showing = null;
        smv.classList.add("hidden");
        matchesView.classList.remove("hidden");
    } else {
        showing = code;
        smv.classList.remove("hidden");
        matchesView.classList.add("hidden");
    }

    document.getElementById("whoseMatches").innerText = `${person.name}'s Matches`;
    
    let i;
    for (i = 0; i < person.matches.length; i++) {
        let match = person.matches[i];
        console.log(match);
        smv.innerHTML += `
            <div class="match">
                <p>${match.stage_name} match</p>
                <h2>${match.home_team.country}<br>${match.home_team.goals}</h2>
                <h2>${match.away_team.country}<br>${match.away_team.goals}</h2>
            </div>`;
    }
}

getResults(false);