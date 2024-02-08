import { useState, useCallback, useEffect } from "react";
var CryptoJS = require("crypto-js");
import LineChart from "./components/line-chart-1";

const Dice = () => {
  //temporary
  const [overAllSeedStreak, setOverAllSeedStreak] = useState([]);


  // editable
  const enableBalanceLimit = true;
  const [balance, setBalance] = useState(0.00087);
  const server_seed_list = [
    "261b258294aff473a6b15b600355f48305fa5e42b5efeb0e8b4860f06be1f090",
    "edeac22fd0b9106bcd4434aaf98dc7928ecc1adc67836f225b89d86ab8fec28b",
    "01d0e9d50209534f502673d1c091264c3263c87fc51b01cb10eff7dd967ca489",
    "59a5c430b3fcc67201ee29c477d5e176d2aa5a8badf1dcc4cbbefbb35184bfc8",
    "2c526f898013be9d73342f3473bbc22cb04d3f33f6d45547a0a66ebe4235e3cc",
    "c325439230db7ddacf0a14ea3fd90ee28d92bfe65fa8d504a5a95283c14ecbfa",
    "c19d9763e1698de0a5239fb255d0a6473dd1fd6beb1327d22cd273b203b6c98f",
    "2315a164766f0e2a476bb6c269a216031883eeefa31850e708810ac500597fb6",
    "45d6bd351e7b2c046d944f1c526cf2e06243121b862c94f139e9445f5871964f",
    "2f34962a70411b63d57d16b5ca122d14fafb2bceb6ea8c0261d8d033373d4f99", //9
    "35eb72d8d7748d808eec07eb9a37fbcff2a2a400096f016dc214257d7e60072d",
    "28c2ea51bd44304f7d5fbd21f694d9b279524c19225a342b141fc827a74094f1",
    "1c0b3b5bc08fffe2e4fc5fd02ef0d3a1bde8fb812dccc77add6f8e5f9278b9d9",
    "ba3a7c5b87997f019956738fa6fbe0c19a552913a0c19470981b33877257709f",
    "14abfa2008f44b295416285d8ecc2ce5b80cb8170f289501b14afec2dd76b244",
    "b3daa61da871799e59ebeecd9634a399833c0872f5a3680d49a820f4019f233a",
    "eddac33dd618c49fbb544d9830a5b2fd3291d6629584d29b990b2d602226a9aa",
    "ea9b991b099357b24a9802356dba77d80c7e625d67a63ccd01260946829f3c3b",
    "383bab71af035f0d70a7b0fe6f88e374606f812599596e1c3a7d3e5fc86596bf",
    "e2594bc63c3c43c9af88842d653a0eb909231700a2e7e2d0dc66717a981c305b",
    "22042aff21f34e95c2f21c45f7aa33ffb7e84d09e2b557cc4ed48db6a394b560", // 20 
    "5c227a4df589d281d7750b01bab1c43187734c8f686c8d126d2c53b94f13b849",
    "66da8c38b04b4d5153cda176209f35714597dcbfa25257b30d3ce69b009fcc3c",
    "3facb999e72c8fc4c3377e6ee3320f73a4582f506ad983e20f91d1e72adcec8e",
    "8986298e47b9aae49a9e05a6d3145f225a3b8c0c8b7d94c7e7af791b5ede1ea4",
    "9fbe389895c7b12562a2e6a29dbd1527842cf0b3f1c512cfb35a4155c5a347cd",
    "4b1df7d0a4bebdfda5984b03a6d413435d08f2d7975806dd93956eaa4a6bc664",
    "43c2d2e0db5d77c0de22cf6324dbec49576ca0ec63db7e1797e2e8012b1fe46a",
    "5aada5cd245601abfa3f591a64f722fdee728c904b96c17da131863f732f5373",
    "3b12d9d4e31e9b32843a12570134d3f7d7d7f697f03b209a2fd9e086bebcb2c2",
    "44493301b7c565ff14479f147af5e74087f1694c7bb851a5dd385f8b872d4c42", // 30
  ];
  const [activeServerSeed, setActiveServerSeed] = useState(0);
  const [server_seed, setServer_seed] = useState(server_seed_list[activeServerSeed]);
  const client_seed = "emoemoemoemo";
  const [payout, setPayout] = useState(2);
  const [chance, setChance] = useState(49.5);
  const [roll, setRoll] = useState('over'); // under/over
  const maxNonce = 50000;
  const maxDataToShow = 300;
  const [nonce, setNonce] = useState(0);
  const startingBetAmount = 0.00000005;

  // fixed
  const [profit, setProfit] = useState(0);
  const [results, setResults] = useState([]);
  const [rollUnder, setRollUnder] = useState(99 / payout);
  const [rollOver, setRollOver] = useState((100 - rollUnder) - 0.01);
  const [isStarted, setIsStarted] = useState(false);
  const [betAmount, setBetAmount] = useState(startingBetAmount);
  const [maxBetAmount, setMaxBetAmount] = useState(0.0000000);
  const [loseStreak, setLoseStreak] = useState(0);
  const [winStreak, setWinStreak] = useState(0);
  const [maxLoseStreak, setMaxLoseStreak] = useState(0);
  const [maxWinStreak, setMaxWinStreak] = useState(0);
  const [totalLose, setTotalLose] = useState(0);
  const [totalWin, setTotalWin] = useState(0);

  const byPayout = [
    {
      payout: 1.9412,
      loseStreak: 0,
      winStreak: 0,
      maxLoseStreak: 0,
      maxWinStreak: 0
    },
    {
      payout: 2,
      loseStreak: 0,
      winStreak: 0,
      maxLoseStreak: 0,
      maxWinStreak: 0
    },
    {
      payout: 3,
      loseStreak: 0,
      winStreak: 0,
      maxLoseStreak: 0,
      maxWinStreak: 0
    }
  ];
  const [maxStreakByPayout, setMaxStreakByPayout] = useState(byPayout);
  

  const start = () => {
    if(isStarted){
      setIsStarted(false);
    } else {
      setIsStarted(true);
      rollADice();
    }
  }

  const rollADice = useCallback((backToZero = false) => {
    const value = verify(server_seed, client_seed, nonce);
    const win = verifyWinLose(value, roll, rollUnder, rollOver);
    let resultProfit = 0;
    const userProfit = backToZero ? 0 : profit;

    if(win){
      resultProfit = userProfit + ((betAmount * payout) - betAmount);
      setBalance(balance => balance + ((betAmount * payout) - betAmount));
    } else {
      resultProfit = userProfit - betAmount;
      setBalance(balance => balance - betAmount);
    }
    setProfit(resultProfit);

    const result = {
      nonce,
      betAmount,
      result: value,
      win,
      profit: resultProfit.toFixed(8),
      loseStreak,
      winStreak
    }
    setResults(results => [...results, result]);
  }, [nonce, results, profit, setProfit, setBalance, betAmount, payout]);

  useEffect(() => {
    setPayout(Number(Number(99 / chance).toFixed(4)));
  }, [chance]);

  useEffect(() => {
    const rollUnderTemp = Number((Number(99 / payout).toFixed(4)));
    setRollUnder(rollUnderTemp);
    setRollOver(Number(Number((100 - rollUnderTemp) - 0.01).toFixed(2)));
  }, [payout]);

  useEffect(() => {
    if(results.length){
      const lastResult = results[results.length  - 1];

      if(isStarted && nonce <= maxNonce){
        setBetHistory(lastResult);
      } else if(nonce > maxNonce){
        // if(profit < 0){
        //   setBetHistory(lastResult);
        //   console.log('Max nonce reach but profit is losing, will continue playing');
        // } else {
          console.log('Max nonce reach');


          // move to next server seed
          console.table({
            activeServerSeed:activeServerSeed,
            profit: profit.toFixed(8),
            maxBet: maxBetAmount.toFixed(8),
            maxLose: maxLoseStreak
          });
          

          // console.log('_____________________');
          if(activeServerSeed <= 30){
            const nextActiveServerSeed = activeServerSeed + 1;
            setActiveServerSeed(nextActiveServerSeed);
            setServer_seed(server_seed_list[nextActiveServerSeed]);
            setResults([]);
            setPayout(2);
            setChance(49.5);
            setNonce(0);
            setBalance(0.00047);
            setBetAmount(startingBetAmount);
            setLoseStreak(0);
            setWinStreak(0);
            setMaxLoseStreak(0);
            setMaxWinStreak(0);
            setMaxBetAmount(0);
            setProfit(0);
            setMaxStreakByPayout(byPayout);
            setTimeout(() => {
              // console.log('start profit is ' + profit.toFixed(8));
              rollADice(true);
            }, 1000);
          }
        // }
      }
    }
  }, [results]);

  useEffect(() => {
    if(nonce > 0){
      if(enableBalanceLimit){
        if((balance - betAmount) > 0){
          //setTimeout(() => {
            rollADice();
          // }, 100)
        } else {
          console.log('Not enough balance', maxStreakByPayout);
        }
      } else {
        rollADice();
      }
    }
  }, [nonce]);

  const setBetHistory = (lastResult) => {
    // max bet amount
    if(betAmount > maxBetAmount){
      setMaxBetAmount(betAmount);
    }
    // win and lose streak
    if(lastResult.win) {
      setTotalWin(totalWin => totalWin + 1);
      const temp = winStreak + 1;
      setWinStreak(temp);
      setLoseStreak(0);
      if(temp > maxWinStreak){
        setMaxWinStreak(temp);
      }
    } else {
      setTotalLose(totalLose => totalLose + 1);
      const temp = loseStreak + 1;
      setWinStreak(0);
      setLoseStreak(temp);
      if(temp > maxLoseStreak){
        setMaxLoseStreak(temp);
      }
    }

    // win and lose streak by payout
    let itemPayout = maxStreakByPayout.find(streak => streak.payout == payout);
    if(lastResult.win){
      itemPayout.winStreak = itemPayout.winStreak + 1;
      itemPayout.loseStreak = 0;
      if(itemPayout.winStreak > itemPayout.maxWinStreak){
        itemPayout.maxWinStreak = itemPayout.winStreak;
      }
    } else {
      itemPayout.loseStreak = itemPayout.loseStreak + 1;
      itemPayout.winStreak = 0;
      if(itemPayout.loseStreak > itemPayout.maxLoseStreak){
        itemPayout.maxLoseStreak = itemPayout.loseStreak;
      }
    }
    const datas = JSON.parse(JSON.stringify(maxStreakByPayout));
    const item = datas.find(data => data.payout == itemPayout.payout);
    const index = datas.indexOf(item);
    datas[index] = itemPayout;
    setMaxStreakByPayout(datas);

    myRulesNextRoll(lastResult);
  }

  const myRulesNextRoll = (lastResult) => {
    let continueBet = true;
    // editable below here
    
    if(lastResult.win){
      if(winStreak == 0 || winStreak == 3){
        setBetAmount(0.00000005 * 2);
      } else if(winStreak == 1 || winStreak == 2){
        setBetAmount(0.00000005 * 3);
      } else {
        setBetAmount(0.00000005);
      }
    } else {
      if(loseStreak <= 3){
        setBetAmount(betAmount => betAmount * 2);
      } else if(loseStreak >= 10){
        setBetAmount(betAmount => betAmount * 2);
      } else {
        setBetAmount(0.00000005);
      }
    }
    

    // editable above here
    if(continueBet){
      setNonce(nonce => nonce + 1);
    }
  }
  


  return <div>
    <button className="buttonStart" onClick={start}>Start</button>
    <div className="flex">
      <table border={1}>
        <tbody>
          <tr>
            <td>Balance</td>
            <td>{ balance.toFixed(8) }</td>
            <td></td>
            <td></td>
            <td>Payout</td>
            <td>{ payout }</td>
          </tr>
          <tr>
            <td>Bet Amount</td>
            <td>{ betAmount.toFixed(8) }</td>
            <td>Lose Streak</td>
            <td>{ loseStreak }</td>
            <td>Roll</td>
            <td>{ roll == 'under' ? rollUnder : rollOver }</td>
          </tr>
          <tr>
            <td>Nonce</td>
            <td>{ nonce }</td>
            <td>Win Streak</td>
            <td>{ winStreak }</td>
            <td>Chance</td>
            <td>{ chance }%</td>
          </tr>
          <tr>
            <td>Profit</td>
            <td>{ profit.toFixed(8) }</td>
            <td>Max Lose Streak</td>
            <td>{ maxLoseStreak }</td>
          </tr>
          <tr>
            <td>Max Bet Amount</td>
            <td>{ maxBetAmount.toFixed(8) }</td>
            <td>Max Win Streak</td>
            <td>{ maxWinStreak }</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>Total Lose</td>
            <td>{ totalLose }</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>Total Win</td>
            <td>{ totalWin }</td>
          </tr>
        </tbody>
      </table>
      <table border={1}>
        <thead>
          <tr>
            <th>Payout</th>
            <th>maxLoseStreak</th>
            <th>maxWinStreak</th>
          </tr>
        </thead>
        <tbody>
          {
            maxStreakByPayout.map(streakPayout => {
              return <tr key={'po' + streakPayout.payout}>
                <td>{streakPayout.payout}</td>
                <td>{streakPayout.maxLoseStreak}</td>
                <td>{streakPayout.maxWinStreak}</td>
              </tr>
            })
          }
        </tbody>
      </table>
    
    </div>
    

    <div className="flex">
      <table>
        <thead>
          <tr>
            <th>nonce</th>
            <th>result</th>
            <th>betAmount</th>
            <th>profit</th>
            <th>loseStreak</th>
          </tr>
        </thead>
        <tbody>
          {
            tableData(results, maxDataToShow).map((result, index) => <tr key={index} className={result.betAmount <= 0 ? 'none' : result.win ? 'win' : 'lose'}>
              <td>{ result.nonce }</td>
              <td>{ result.result }</td>
              <td>{ (result.betAmount).toFixed(8) }</td>
              <td>{ result.profit }</td>
              <td>{ result.loseStreak}</td>
            </tr>)
          }
        </tbody>
      </table>  
      <LineChart data={{
        labels: graphLabels(nonce, maxDataToShow),
        datasets: [
          {
            data: graphData(results, maxDataToShow),
            backgroundColor: "purple",
          },
        ],
        options: {
          animation: false,
        }
      }} />
    </div>
    
  </div>
}

export default Dice;


// COMPONENTS




// HELPERS
const verify = (server_seed, client_seed, nonce) => {
  const hash = CryptoJS.HmacSHA256(
    server_seed,
    `${client_seed}_${nonce}`,
  ).toString()
  let index = 0;
  let lucky = parseInt(hash.substr(index, 5), 16);
  while (lucky >= 1000000) {
    lucky = parseInt(hash.substr(index, 5), 16);
    index += 5;
  }
  return (lucky % 10000 / 100).toFixed(2);
}
const graphLabels = (nonce, maxDataToShow) => {
  let value = 0;
  if(nonce > maxDataToShow){
    value = nonce - maxDataToShow;
  }
  let temp = [];
  for(let i=value; i<=nonce; i++){
    temp.push(i);
  }
  return temp;
}
const graphData = (results, maxDataToShow) => {
  let newArr = results.slice(-maxDataToShow);
  return newArr.map(result => result.profit);
}
const tableData = (results, maxDataToShow) => {
  let newArr = results.slice(-30);
  return newArr;
}
const verifyWinLose = (result, roll, rollUnder, rollOver) => {
  if(roll === 'under'){
    return result <= rollUnder ? true : false;
  } else {
    return result >= rollOver ? true : false;
  }
}