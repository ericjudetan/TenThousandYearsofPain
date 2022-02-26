//computer option will be Math.random x3 and Math.ceil, with values 1, 2, 3 as scissors paper stone.
//The characters Kakashi, Might Guy and Lee are from the manga series 'Naruto'. This game plays on Kakashi's and Might Guy's rivalry, and their love for Janken and duels.
// A Thousand Years of Pain is Kakashi's special technique, even more special that Chidori.
//typing out scissors beat paper then paper beat stone etc. seems so tedious, so we will do it mathematically. then either -1 or 2 wil be the win condition, 0 is the tie and the rest is the lose condition.
//This new game will be called Kakashi Rival. It's your turn to be Kakashi's rival because Might Guy is handicapped, and you've been selected as his new CHAMPION! (Lee is out of the village). You can choose to challenge Kakashi on Janken or a Jutsu battle, and whoever delivers the superior jutsu element or the Kakashi signature move "Thousand Years of Pain" wins.
// first game is Janken, second game is Jutsu Battle.
//Janken starts with normal Scissors, Paper or Stone, and if it's a draw, it triggers a shuriken battle. User types in "SHURIKEN" and a random number generator attempts to throw a shuriken to beat Kakashi's shuriken throw. If you have the higher number, you overwhelm Kakashi - leaving him open to your Thousand Years of Pain.
//Jutsu Battle will have 2 stages - Element Clash & another shuriken battle (got lazy). if e.g. Water beats Fire, then the opponent loses and suffers unique damage. If the elements are not vulnerable to each other, it's just another distraction to do a shuriken battle.. leading to the final blow. Original plan was to dodge a final blow and restart jutsu fight.... (or lose), but i got lazy.
//going to try out (array.length -1) or -1 as the win condition, for any length of options. lose condition is (1-array.length) or 1.

//Define global variables
//global variables and states
var usernameState = 0; // game stops if username state is 0.
var currentName; //create a variable to store username
var originalName; //store previous name
var outputUsernameString; //outputValue of the username narrative
var myOutputValue; //the string
var nameChangeCount = 0; //num of times user changes their name
var nameChangeLimit = 4; //default value
var gameChoiceArray = [0, "janken", "jutsu"]; //select from game option 0, 1, 2, ... n game options
var gameState = 0; // set default game state as 0, indicating that user hasn't chosen a challenge.
var jankenSigns = ["choki", "paa", "guu"]; //all avail options in Janken
var jankenSignsIcon = ["✌", "✋", "✊"]; // all icons for Janken game, must match Janken option index. ordered in 1>2>3>1
var jutsuElements = ["fire", "wind", "lightning", "earth", "water"]; //all Jutsu options in Naruto game
var jutsuElementsIcon = ["☄️", "🌀", "⚡", "🗿", "🌊"]; // all Jutsu icons in Naruto game
var jutsuCast = "🙏";
var jutsuDeclare = [
  //jutsu casting for posterity's sake
  "Katon: Gōka Mekkyaku (Great Fire Annhilation)",
  "Fūton: Shinkū Renpa (Vacuum Blast Barrage)",
  "Raiton: Raikiri (Lightning Cutter)",
  "Doton: Gōremu no Jutsu (Golem Technique)",
  "Suiton: Dai Bakusui Shōha (Great Colliding Tidal Wave)",
];
var jutsuDamage = [
  "the intense burn",
  "a thousand paper cuts",
  "a twitching stab wound",
  "blunt force trauma",
  "nearly being drowned",
];
var drawState = 0; //indicates whether the user has temporarily drawn against Kakashi.
var userWinCounter = 0; // user win counter
var kkWinCounter = 0; // kakashi win counter
var totalMatches = 0; // total matches won.
var noShuriken = 0; // number of times user types shuriken wrongly. when noShuriken is 1, punish if user types shuriken incorrectly again

//Game Icon retrieval function
var getJutsuElementIcon = function (element) {
  var elementIndex = jutsuElements.indexOf(element);
  var elementIcon = jutsuElementsIcon[elementIndex];
  return elementIcon;
};
var getJankenIcon = function (jankenChoice) {
  var jankenIndex = jankenSigns.indexOf(jankenChoice);
  var jankenIcon = jankenSignsIcon[jankenIndex];
  return jankenIcon;
};

//helper function for win percentage
var percentage = function (winCounter) {
  var winPercent = ((Number(winCounter) / Number(totalMatches)) * 100).toFixed(
    1
  );
  return winPercent;
};

//Win Messages
var jankenWinMessage = `<br>His eyes widen in fear 👀 as you seize the advantage and shimmer behind him.<br>He pleads "NO!" as you inflict a Thousand Years of Pain 💥💥💥.`;
var jankenLossMessage = `<br>... suddenly you see Kakashi behind you, a moment too late.<br>He whispers: "A Thousand Years of Pain" 💥💥💥.<br>It hurts, it really hurts.`;
var winnerStatsMessage = function (userWinCounter, kkWinCounter) {
  var message = `<br><br>In total, you won ${userWinCounter} matches (${percentage(
    userWinCounter
  )}%) and Kakashi has won ${kkWinCounter} matches (${percentage(
    kkWinCounter
  )}%). Kakashi is butthurt and furious. He wants to battle you again!<br> 
Declare Janken or Jutsu to start the next battle.`;
  return message;
};

var loserStatsMessage = function (userWinCounter, kkWinCounter) {
  var message = `<br><br>In total, Kakashi won ${kkWinCounter} matches (${percentage(
    kkWinCounter
  )}%) and you won ${userWinCounter} matches (${percentage(
    userWinCounter
  )}%). You are a sore loser. Battle Kakashi again to get the upper hand!<br> 
Declare Janken or Jutsu to start the next battle!`;
  return message;
};

//Shuriken Toss Helper Functions
var shurikenToss = function (maxValue) {
  var randomDecimal = Math.random();
  var shurikenSkill = Math.ceil(randomDecimal * maxValue);
  return shurikenSkill;
};
var shurikenTossValue = 0;
var shurikenTossCount = 0;
var shurikenWinMessage = function (shurikenTossCount) {
  var message = `You tossed ${shurikenTossCount} wave(s) of shurikens at Kakashi, most of which clashed with his shurikens and fell to the ground.<br>
One of your Shurikens grazed past his face, tearing off his face mask. Kakashi is caught by surprise! <br>`;
  return message;
};

var shurikenLossMessage = function (shurikenTossCount) {
  var message = `You tossed ${shurikenTossCount} wave(s) of shurikens at Kakashi, but Kakashi nullifies all of them with his own shurikens and *poof* he's gone...`;
  return message;
};

//In order to generate computer choice and win conditions, we need a value for the array length (representing max number of choices in either game). This is a function of the current chosen game state.
var arrayLength = function (gameState) {
  if (gameState == 1) {
    return jankenSigns.length;
  }
  if (gameState == 2) {
    return jutsuElements.length;
  }
};

//* Kakashi Helper Functions*
//We generate Kakashi's action value, and this depends on the array length (max number of choices). For Janken it will generate 1-3, for JutsuBattle it will generate 0-4.
var kkActionValue = function (gameState) {
  var randNum = Math.random();
  var kkValue = Math.floor(randNum * arrayLength(gameState));
  return kkValue;
};

//helper function assigns Kakashi's Action Value as their string value.
var kkActionString = function (kkActionValue) {
  if (gameState == 1) {
    var kkActionGS = jankenSigns[kkActionValue];
    return kkActionGS;
  }
  if (gameState == 2) {
    var kkActionGS = jutsuElements[kkActionValue];
    return kkActionGS;
  }
};

//normal win/loss conditions:
var winCondition = function (gameResultValue, gameState) {
  var win =
    gameResultValue == -1 || gameResultValue == arrayLength(gameState) - 1;
  return win;
};
var lossCondition = function (gameResultValue, gameState) {
  var loss =
    gameResultValue == 1 || gameResultValue == 1 - arrayLength(gameState);
  return loss;
};

// user Helper Functions
//user validation helper functions <- need help on why this wont work
var clean = function (userInput) {
  var userInput = userInput;
  var trimUserInput = userInput.trim(); //(need help on line 129 on why trim won't work.)
  var cleanUserInput = trimUserInput.toLowerCase();
  return cleanUserInput;
};

//user gamestate input validation: returns TRUE boolean value if user input includes either janken or jutsu
var validateGameChoice = function (userInput) {
  // var cleanUserInput = clean(userInput);
  return gameChoiceArray.includes(userInput);
};
//check if input is not a number or if it's not blank - returns true or false
var notString = function (userInput) {
  var booleanValue = isNaN(userInput) == true || userInput == null;
  return booleanValue;
};

// helper function to retrieve array index value from user input
var userArrayValue = function (cleanInput) {
  if (gameState == 1) {
    var userInputValue = jankenSigns.indexOf(cleanInput);
    return userInputValue;
  }
  if (gameState == 2) {
    var userInputValue = jutsuElements.indexOf(cleanInput);
    return userInputValue;
  }
};

//main
var main = function (input, input2) {
  myOutputValue = "error, check console.";
  input = input.trim();
  input2 = clean(input2);
  console.log("username", input, "gameinput", input2);

  //default outputUsername Narrative
  if (input == currentName && usernameState == 1) {
    outputUsernameString = `Kakashi: "Prepare to fight me, ${currentName}!"<br>`;
  }

  //check for name change, warn user
  if (usernameState == 1 && input != currentName) {
    if (nameChangeCount >= nameChangeLimit) {
      outputUsernameString = `You attempt another Genjutsu for the ${nameChangeCount}th time.. but Kakashi appears behind you and says: "I see through your elaborate Genjutsu! You can't trick me, you are ${currentName}, not ${input}. I have caught you and... <br>`;
      kkWinCounter += 1; //introduces suddendeath condition of user changes their name too many times.
      totalMatches += 1;
      console.log(
        "userWin,kkWin,Total",
        userWinCounter,
        kkWinCounter,
        totalMatches,
        outputUsernameString
      );
      myOutputValue = `${outputUsernameString} ${jankenLossMessage}`;
      if (userWinCounter < kkWinCounter) {
        myOutputValue += loserStatsMessage(userWinCounter, kkWinCounter);
      }
      if (userWinCounter >= kkWinCounter) {
        myOutputValue += winnerStatsMessage(userWinCounter, kkWinCounter);
      }
      gameState = 0;
      nameChangeLimit += 2;
      return myOutputValue;
    }

    if (nameChangeCount <= nameChangeLimit) {
      originalName = currentName;
      currentName = input;
      console.log("originalName", originalName, "currentName", currentName);
      outputUsernameString = `Kakashi says: "Ah "${originalName}", my Sharingan sees your true form. You are actually ${currentName} - I see through your disguise!"<br><br>`;
      //add namechangecount
      nameChangeCount += 1;
      console.log("nameChangeCount", nameChangeCount);
    }
  }
  //return responses if username is zero
  if (usernameState == 0) {
    if (input == "" || isNaN(input) == false) {
      myOutputValue = `You must cast a valid Genjutsu!`;
      console.log(myOutputValue);
      return myOutputValue;
    }
    if (input != "" && usernameState == 0) {
      usernameState = 1;
      currentName = input;
      outputUsernameString = `Kakashi says: "So Might Guy has chosen you to be his champion!"<br>"Your Chakra is a little weird, but you appear to be ${currentName}."<br> Even so, you will be my opponent. Be prepared to fight!!<br>`;
      console.log("currentName", currentName);
    }
  }

  //check if the user is currently drawn on Janken or Jutsu and initiate Shuriken battle for tie breaker
  console.log("drawState", drawState);
  if (drawState == 1) {
    if (input2 != "shuriken" && noShuriken == 0) {
      myOutputValue = `${outputUsernameString} Please type Shuriken to quickly strike Kakashi!`;
      noShuriken += 1;
      console.log(myOutputValue, "noShuriken", noShuriken);
      return myOutputValue;
    }
    if (input2 != "shuriken" && noShuriken == 1) {
      myOutputValue = `You are too late. Kakashi tosses a bunch of Shuriken at you. You jump backwards and attempt to dodge.. <br> ${jankenLossMessage}`;
      kkWinCounter += 1;
      totalMatches += 1;
      console.log(
        "userWin,kkWin,Total",
        userWinCounter,
        kkWinCounter,
        totalMatches,
        myOutputValue
      );
      gameState = 0;
      noShuriken = 0;
      drawState = 0;
      if (userWinCounter < kkWinCounter) {
        myOutputValue += loserStatsMessage(userWinCounter, kkWinCounter);
        return myOutputValue;
      }
      if (userWinCounter >= kkWinCounter) {
        myOutputValue += winnerStatsMessage(userWinCounter, kkWinCounter);
        return myOutputValue;
      }
    }
    if (input2 == "shuriken") {
      // shurikenTossValue = shurikenToss(10);
      // shurikenTossCount += 1;
      shurikenTossValue = 5;
      for (
        shurikenTossCount = 0;
        !(shurikenTossValue < 3 || shurikenTossValue > 8);
        shurikenTossCount += 1
      ) {
        shurikenTossValue = shurikenToss(10);
        console.log("shurikenTossValue", shurikenTossValue);
      }
      // while (!(shurikenTossValue < 3 || shurikenTossValue > 8)) {
      //   shurikenTossCount += 1;
      //   shurikenTossValue = shurikenToss(10);
      // }
      if (shurikenTossValue < 3) {
        myOutputValue = `${outputUsernameString} ${shurikenLossMessage(
          shurikenTossCount
        )} ${jankenLossMessage}`;
        kkWinCounter += 1;
        totalMatches += 1;
        gameState = 0;
        drawState = 0;
        console.log(
          "userWin,kkWin,Total",
          userWinCounter,
          kkWinCounter,
          totalMatches,
          myOutputValue
        );
      }
      if (shurikenTossValue > 8) {
        myOutputValue = `${outputUsernameString} ${shurikenWinMessage(
          shurikenTossCount
        )} ${jankenWinMessage}`;
        userWinCounter += 1;
        totalMatches += 1;
        gameState = 0;
        drawState = 0;
        console.log(
          "userWin,kkWin,Total",
          userWinCounter,
          kkWinCounter,
          totalMatches,
          myOutputValue
        );
      }
      if (userWinCounter < kkWinCounter) {
        myOutputValue += loserStatsMessage(userWinCounter, kkWinCounter);
        return myOutputValue;
      }
      if (userWinCounter >= kkWinCounter) {
        myOutputValue += winnerStatsMessage(userWinCounter, kkWinCounter);
        return myOutputValue;
      }
    }
  }

  //Game Selector
  if (gameState == 0) {
    if (!validateGameChoice(input2)) {
      myOutputValue = `${outputUsernameString} Please choose either Janken or Jutsu to start the battle!`;
      return myOutputValue;
    } else {
      gameState = gameChoiceArray.indexOf(input2);
      console.log("gameState", gameState, gameChoiceArray[gameState]);
      if (gameState == 1) {
        return `${outputUsernameString} Choose one of ${jankenSigns[0]}, ${jankenSigns[1]} or ${jankenSigns[2]} to play Janken! <br> They represent ${jankenSignsIcon} respectively.`;
      }
      if (gameState == 2) {
        return `${outputUsernameString} Choose one of the elements ${jutsuElements[0]}, ${jutsuElements[1]}, ${jutsuElements[2]}, ${jutsuElements[3]} or ${jutsuElements[4]} to cast your Jutsu!<br> If you don't know which element beats what, you are a lousy ninja. Go back to the Academy (Google/Wiki) you Genin!`;
      }
    }
  }

  var userChoiceValue = userArrayValue(input2);
  var kkChoiceValue = kkActionValue(gameState);
  var gameResultValue = userChoiceValue - kkChoiceValue;
  console.log(
    "userChoiceValue,kkChoiceValue,gameResultValue",
    userChoiceValue,
    kkChoiceValue,
    gameResultValue
  );

  if (gameState == 1) {
    //if this is the Janken Game
    if (!jankenSigns.includes(input2)) {
      return `${outputUsernameString} Choose one of ${jankenSigns[0]}, ${jankenSigns[1]} or ${jankenSigns[2]} to play Janken! <br> They represent ${jankenSignsIcon} respectively.`;
    }
    //win condition
    if (winCondition(gameResultValue, gameState)) {
      userWinCounter += 1;
      totalMatches += 1;
      var kakashiAction = kkActionString(kkChoiceValue);
      message = `${outputUsernameString} You WIN!! You chose ${getJankenIcon(
        input2
      )} which defeated Kakashi's choice of ${getJankenIcon(kakashiAction)}.`;
      console.log(
        "userWin,kkWin,Total",
        userWinCounter,
        kkWinCounter,
        totalMatches,
        message
      );
      myOutputValue = `${message} ${jankenWinMessage}`;
      if (userWinCounter < kkWinCounter) {
        myOutputValue += loserStatsMessage(userWinCounter, kkWinCounter);
      } else {
        myOutputValue += winnerStatsMessage(userWinCounter, kkWinCounter);
      }
      gameState = 0;
      return myOutputValue;
    }
    //Loss condition
    if (lossCondition(gameResultValue, gameState)) {
      var kakashiAction = kkActionString(kkChoiceValue);
      message = `${outputUsernameString} You gape at your loss. You chose ${getJankenIcon(
        kkActionString(userChoiceValue)
      )} but Kakashi showed you a ${getJankenIcon(kakashiAction)}.<br>
      As you are processing your defeat, you fail to notice Kakashi that has disappeared! `;
      kkWinCounter += 1;
      totalMatches += 1;
      console.log(
        "userWin,kkWin,Total",
        userWinCounter,
        kkWinCounter,
        totalMatches,
        myOutputValue
      );
      myOutputValue = `${message} ${jankenLossMessage}`;
      if (userWinCounter < kkWinCounter) {
        myOutputValue += loserStatsMessage(userWinCounter, kkWinCounter);
      } else {
        myOutputValue += winnerStatsMessage(userWinCounter, kkWinCounter);
      }
      gameState = 0;
      return myOutputValue;
      //Draw Condition
    } else {
      myOutputValue = `${outputUsernameString} It's a tie. Both of you chose ${getJankenIcon(
        input2
      )}. Stunned, you prepare to throw a shuriken at Kakashi! Type in shuriken to see the outcome.`;
      drawState = 1;
      console.log(myOutputValue, "drawState", drawState);
      return myOutputValue;
    }
  }
  if (gameState == 2) {
    //if this is Jutsu Battle
    if (!jutsuElements.includes(input2)) {
      return `${outputUsernameString} Choose one of the elements ${jutsuElements[0]}, ${jutsuElements[1]}, ${jutsuElements[2]}, ${jutsuElements[3]} or ${jutsuElements[4]} to cast your Jutsu!<br> If you don't know which element beats what, you are a lousy ninja. Go back to the Academy (Google/Wiki) you Genin!`;
    }
    //create string for kakashi's element, to call back the jutsu icon.
    var kkElement = kkActionString(kkChoiceValue);
    //wincondition
    if (winCondition(gameResultValue, gameState)) {
      userWinCounter += 1;
      totalMatches += 1;
      myOutputValue = `${outputUsernameString} You fold your hands together and cast ${jutsuCast}${getJutsuElementIcon(
        input2
      )}${jutsuDeclare[userChoiceValue]}.<br>
      Kakashi casts ${getJutsuElementIcon(kkElement)}${
        jutsuDeclare[kkChoiceValue]
      }, which is overwhelmed by your ${input2} technique.<br> You win this fight!! You watch as Kakashi struggles to deal with ${
        jutsuDamage[userChoiceValue]
      }.`;
      console.log(
        "userWin,kkWin,Total",
        userWinCounter,
        kkWinCounter,
        totalMatches,
        myOutputValue
      );
      if (userWinCounter < kkWinCounter) {
        myOutputValue += loserStatsMessage(userWinCounter, kkWinCounter);
      } else {
        myOutputValue += winnerStatsMessage(userWinCounter, kkWinCounter);
      }
      gameState = 0;
      return myOutputValue;
    }
    //Loss condition
    if (lossCondition(gameResultValue, gameState)) {
      myOutputValue = `${outputUsernameString} You fold your hands together and cast ${jutsuCast}${getJutsuElementIcon(
        input2
      )}${jutsuDeclare[userChoiceValue]}.<br>
      Kakashi casts ${getJutsuElementIcon(kkElement)}${
        jutsuDeclare[kkChoiceValue]
      }, which overwhelms your ${input2} technique.<br> You LOSE this fight!! Kakashi watches as you struggle to deal with ${
        jutsuDamage[kkChoiceValue]
      }.`;
      kkWinCounter += 1;
      totalMatches += 1;
      console.log(
        "userWin,kkWin,Total",
        userWinCounter,
        kkWinCounter,
        totalMatches,
        myOutputValue
      );
      if (userWinCounter < kkWinCounter) {
        myOutputValue += loserStatsMessage(userWinCounter, kkWinCounter);
      } else {
        myOutputValue += winnerStatsMessage(userWinCounter, kkWinCounter);
      }
      gameState = 0;
      return myOutputValue;
    } else {
      //draw condition
      myOutputValue = `${outputUsernameString} You fold your hands together and cast ${jutsuCast}${getJutsuElementIcon(
        input2
      )}${jutsuDeclare[userChoiceValue]}.<br>
      Kakashi casts ${getJutsuElementIcon(kkElement)}${
        jutsuDeclare[kkChoiceValue]
      }, which clashes with your ${input2} technique to create mass chaos.<br> 
    The dust settles, and you prepare to throw a shuriken at Kakashi! Type in shuriken to see the outcome.`;
      drawState = 1;
      console.log(myOutputValue, "drawState", drawState);
      return myOutputValue;
    }
  }
};
