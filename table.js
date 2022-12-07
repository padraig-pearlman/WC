function fix(match) {
    if (match.id == 38) {
        match.away_team.goals = 0;
        match.winner_code = "TUN";
        match.winner = "Tunisia";
    }

    return match;
}

const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

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

const groups = {
    "QAT": "A",
    "ECU": "A",
    "SEN": "A",
    "NED": "A",
    "ARG": "C",
    "KSA": "C",
    "MEX": "C",
    "POL": "C",
    "ESP": "E",
    "CRC": "E",
    "GER": "E",
    "JPN": "E",
    "BRA": "G",
    "SRB": "G",
    "SUI": "G",
    "CMR": "G",
    "ENG": "B",
    "IRN": "B",
    "USA": "B",
    "WAL": "B",
    "FRA": "D",
    "AUS": "D",
    "DEN": "D",
    "TUN": "D",
    "BEL": "F",
    "CAN": "F",
    "MAR": "F",
    "CRO": "F",
    "POR": "H",
    "GHA": "H",
    "URU": "H",
    "KOR": "H"
}

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
                try {
                    tabulateResults(JSON.parse(this.responseText));
                    populateRecentMatches(JSON.parse(this.responseText));
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        alert("Something is wrong with the response from my server, most likely because of too many requests. I recommend waiting two minutes then reloading. If that doesn't work tell me!");
                    } else {
                        alert("You found a bug that's stopping this site from calculating the results. Tell me ASAP!");
                    }
                }
        }
        };
        xhttp.open("GET", "https://wcm.herokuapp.com/https://worldcupjson.net/matches/?by_date=desc", true);
        xhttp.send();
    }
}

function tabulateResults (matches) {
    let i = 0;
    for (i = 0; i < matches.length; i++) {
        let match = fix(matches[i]);
        if (match.status == "completed") {
            let home_team = match.home_team.country; let home_team_goals = match.home_team.goals;
            let away_team = match.away_team.country; let away_team_goals = match.away_team.goals;
            
            let home_team_owner = teams[home_team]; let away_team_owner = teams[away_team];
            let winner = null;

            if (match.winner_code == home_team) winner = home_team;
            else if (match.winner_code == away_team) winner = away_team;

            if (winner == null) {
                if (match.home_team.penalties > match.away_team.penalties) {
                    winner = home_team;
                } else if (match.away_team.penalties > match.home_team.penalties) {
                    winner = away_team;
                }
            }

            let points_for_home_team_owner;
            let points_for_away_team_owner;

            if (winner != null) {
                points_for_home_team_owner = (winner == home_team) ? 3 : 0;
                points_for_away_team_owner = (winner == away_team) ? 3 : 0;
            } else {
                points_for_home_team_owner = 1;
                points_for_away_team_owner = 1;
            }

            match.points_for_home_team_owner = points_for_home_team_owner;
            match.points_for_away_team_owner = points_for_away_team_owner;

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

        if (a.win > b.win) {
            return -1;
        } else if (b.win > a.win) {
            return 1;
        }
        
        if (a.matches_played > b.matches_played) {
            return 1;
        } else if (b.matches_played > a.matches_played) {
            return -1;
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
let tmv = document.getElementById("tomorrow-view");

function populateRecentMatches(matches) {
    let i = 0;

    let today = new Date();
    let n=0;

    for (i = 0; i < matches.length; i++) {
        if (n>=6) break;
        let match = fix(matches[i]);
        let pens = null;
        if (match.home_team.penalties + match.away_team.penalties > 0) pens = `<p>Penalties: ${match.home_team.penalties} - ${match.away_team.penalties}</p>`;
        if (match.status == "completed" && Date.parse(match.datetime) <= today) {
            matchesView.innerHTML += `
            <div class="match">
                <p>${match.stage_name} match${(match.stage_name == "First stage") ? " (Group " + groups[match.home_team.country] + ")" : ""}</p>
                <h2>${match.home_team.name} (${teams[match.home_team.country]})<br>${match.home_team.goals}</h2>
                <h2>${match.away_team.name} (${teams[match.away_team.country]})<br>${match.away_team.goals}</h2>
                ${pens == null ? "" : pens}
            </div>`;
            n++;
        }
    }
}

function populateTomorrowMatches(matches) {
    let i = 0;
    for (i = 0; i < matches.length; i++) {
        let match = matches[i];
        if (match.status == "future_scheduled") {
            let matchDay = new Date(match.datetime);
            tmv.innerHTML += `
                <div class="match">
                    <p>${match.stage_name} match${(match.stage_name == "First stage") ? " (Group " + groups[match.home_team.country] + ")" : ""}<br>${days[matchDay.getDay()]} ${matchDay.toLocaleString("en-US")}</p>
                    <h2>${match.home_team.name} (${teams[match.home_team.country]})</h2>
                    <h2>${match.away_team.name} (${teams[match.away_team.country]})</h2>
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
        let pens = null;
        if (match.home_team.penalties + match.away_team.penalties > 0) pens = `<p>Penalties: ${match.home_team.penalties} - ${match.away_team.penalties}</p>`;
        smv.innerHTML += `
            <div class="match">
                <p>${match.stage_name} match${(match.stage_name == "First stage") ? " (Group " + groups[match.home_team.country] + ")" : ""}</p>
                <h2>${match.home_team.name} (${teams[match.home_team.country]})<br>${match.home_team.goals}</h2>
                <h2>${match.away_team.name} (${teams[match.away_team.country]})<br>${match.away_team.goals}</h2>
                ${pens == null ? "" : pens}
            </div>`;
    }
}

function tomorrowMatches() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            try {
                populateTomorrowMatches(JSON.parse(this.responseText));
            } catch(e) {
                if (!(e instanceof SyntaxError)) {
                    alert("You found a bug that's stopping this site from calculating the results. Tell me ASAP!");
                }
            }
        }
    };

    let today = new Date();
    let tomorrow = new Date(); tomorrow.setDate(today.getDate() + 4);

    let dateRange = `start_date=2022-${today.getMonth() + 1}-${today.getDate()}&end_date=2022-${tomorrow.getMonth() + 1}-${tomorrow.getDate()}`;

    xhttp.open("GET", `https://wcm.herokuapp.com/https://worldcupjson.net/matches/?${dateRange}`, true);
    xhttp.send();
}

function currentMatch() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            try {
                match = JSON.parse(this.responseText);
                if (match.length > 0) {
                    let currentBanner = document.getElementById("currentMatch");
                    currentBanner.innerText = `Current Match${match.length > 1 ? "es" : ""}: `;
                    for (let i = 0; i < match.length; i++) {
                        if (i != 0) { currentBanner.innerText += "   /   "}
                        currentBanner.innerText += `${match[i].home_team.name} (${teams[match[i].home_team.country]}) ${match[i].home_team.goals}-${match[i].away_team.goals} ${match[i].away_team.name} (${teams[match[i].away_team.country]})`
                    }
                    currentBanner.classList.remove("hidden");
    
                }
            } catch(e) {
                console.log("Current match error", e);
            }
        }
    };

    xhttp.open("GET", `https://wcm.herokuapp.com/https://worldcupjson.net/matches/current`, true);
    xhttp.send();
}

getResults();
tomorrowMatches();
currentMatch();