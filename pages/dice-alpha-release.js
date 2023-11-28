import { useState, useCallback, useEffect } from "react";
var CryptoJS = require("crypto-js");
import LineChart from "./components/line-chart-1";
import axios from 'axios';

const Dice = () => {
  // temporaries
  const resetLineBet = 0.00000050;
  const [flag, setFlag] = useState(false);
  const [condition, setCondition] = useState(0);

  // editable
  const enableBalanceLimit = true;
  const [balance, setBalance] = useState(0.0088);
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
    "2f34962a70411b63d57d16b5ca122d14fafb2bceb6ea8c0261d8d033373d4f99" //9
  ];
  const server_seed = server_seed_list[8];
  const client_seed = "emoemoemoemo";
  const [payout, setPayout] = useState(9.9);
  const [chance, setChance] = useState(10);
  const roll = 'over'; // under/over
  const maxNonce = 50000;
  const maxDataToShow = 60;
  const [nonce, setNonce] = useState(0);
  const startingBetAmount = 0.00000001;
  const [cashType, setCashType] = useState('doge');

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
  

  const start = () => {
    if(isStarted){
      setIsStarted(false);
    } else {
      setIsStarted(true);
      rollADice();
    }
  }

  const rollADice = useCallback(() => {
    axios.defaults.headers.common['Authorization'] = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI1IiwianRpIjoiMzY3NzYzODAyMmFiOGQwNTg4ZDZkYWU5ZTA1Nzc0NGM1MDA2MzIwOWZkZWFmNDdmN2I0ZGNhYmUwNzZkN2U2OTFmMWFjY2UxYjY3OWFlN2EiLCJpYXQiOjE2Nzk1ODczOTkuMzQ0MTgsIm5iZiI6MTY3OTU4NzM5OS4zNDQxODUsImV4cCI6MTcxMTIwOTc5OS4zMzg4MDUsInN1YiI6IjI5MDAwNCIsInNjb3BlcyI6W119.gYCITWxFvZrEoxJkphJYTpKesG3FtaD3edlJisjWWqCKzKp9roTFjDBVKX_t2H7CGXZ8aqHcwKtxfsSo7cM7wFpO0sWKVmRCT2zRKHhTG6j3YMGpwnmF_JISYm6PWC_HHGkCXkwqB6TP7WsJj1vo4r4NN0p_BuEp3GM7YNlNGxVQBKFysRPevhxjWL5vwcwnokjGGgN0Ltuln8rcoKQBafUt8Cn3ADzPGeb1_qrDK7-TuXeWleinVX4YUCjh2-ZcH6rvQTVlf1QUrvzI3G8iUnm2oalg0Ta_5P0mssTwahAk_mrO0SWDOUlJRTjNx_rKCR2RI99xkB8nchhCbroAEvonC7hx1DZKPXrXNmTA6zTBpnAZdHeXLUogp0bOMWy2O9iiN-EM6kIl972uLrUeWeRcjymIZQ2bxEC6-WUCwwn074Tgz9TdfrnmrSYLrcMetJyqIlGbm8msUFxjAA_Pi6pTgEtJStMCSTAgI8f3mczcE3101pV7VA5W5GlJEQU_gqGXW9v8L1Yg84IlwcdMaKuCapnjxpc82TZ3bpCEUKSB4P9xC_Re_GQNGcqIvlg0SssnaRfZWTd7d6Z4wP--GUobM8Q3-2DQ2q_f76P1NnV3o5RYt6BkasxwoaS_vImxUA9ZFtfiJXytevmPqw_X69k2rFISP9okWgtuSlpdjTU";
    axios.post('https://wolf.bet/api/v1/dice/manual/play', {
      "currency": cashType,
      "game": "dice",
      "amount": Number(betAmount).toFixed(8),
      "multiplier": payout,
      "rule": "over",
      "bet_value": rollOver,
      "auto": 1
    })
    .then(function (response) {
      const { data } = response;
      // set balance
      let resultProfit = 0;
      if(cashType === 'xrp'){
        if(data.bet.state == 'loss'){
          resultProfit = profit - betAmount;
          setBalance(balance => balance - betAmount);
        } else {
          resultProfit = profit + ((betAmount * payout) - betAmount);
          setBalance(balance => balance + ((betAmount * payout) - betAmount));
        }
        setProfit(resultProfit);
      }

      // set result
      const result = {
        nonce: data.bet.nonce,
        betAmount,
        result: data.bet.result_value,
        win: data.bet.state == 'loss' ? false : true,
        profit: resultProfit.toFixed(8),
        cashType,
      }
      setResults(results => [...results, result]);
    })
    .catch(function (error) {
      console.log(error);
    });
    
  }, [nonce, results]);

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
        console.log('Max nonce reach')
      }
    }
  }, [results]);

  useEffect(() => {
    if(nonce > 0){
      if(enableBalanceLimit){
        if((balance - betAmount) > 0){
          //vsetTimeout(() => {
            rollADice();
          // }, 100)
        } else {
          console.log('Not enough balance')
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
      const temp = winStreak + 1;
      setWinStreak(temp);
      setLoseStreak(0);
      if(temp > maxWinStreak){
        setMaxWinStreak(temp);
      }
    } else {
      const temp = loseStreak + 1;
      setWinStreak(0);
      setLoseStreak(temp);
      if(temp > maxLoseStreak){
        setMaxLoseStreak(temp);
      }
    }

    myRulesNextRoll(lastResult);
  }

  const myRulesNextRoll = useCallback((lastResult) => {
    // editable below here


    if(condition == 0){
      if(loseStreak == 20){
        setBetAmount(0.00000018);

        const temp = betAmount * 0.15;
        setBetAmount(betAmount => betAmount + temp);

        setCashType('xrp');
        setCondition(2);
      }
    } else if(condition == 2){
      if(!lastResult.win){
        const temp = betAmount * 0.15;
        setBetAmount(betAmount => betAmount + temp);
      }

      if(loseStreak == 30){
        setChance(chance => Number(Number(chance + 0.2).toFixed(2)));
        setCondition(3);
      }

      if(lastResult.win){
        setBetAmount(0.00000001);
        setCondition(0);
        setCashType('doge');

        if(chance >= 12.8){
          setChance(10);
        }
      }
    } else if(condition == 3){
      if(!lastResult.win){
        const temp = betAmount * 0.15;
        setBetAmount(betAmount => betAmount + temp);
      }

      if(loseStreak == 40){
        setChance(chance => Number(Number(chance + 0.2).toFixed(2)));
        setCondition(4);
      }

      if(lastResult.win){
        setBetAmount(0.00000001);
        setCondition(0);
        setCashType('doge');

        if(chance >= 12.8){
          setChance(10);
        }
      }
    } else if(condition == 4){
      if(!lastResult.win){
        const temp = betAmount * 0.15;
        setBetAmount(betAmount => betAmount + temp);
      }

      if(loseStreak == 50){
        setChance(chance => Number(Number(chance + 0.2).toFixed(2)));
        setCondition(4);
      }

      if(lastResult.win){
        setBetAmount(0.00000001);
        setCondition(0);
        setCashType('doge');

        if(chance >= 12.8){
          setChance(10);
        }
      }
    }


    
    // editable above here
    setNonce(nonce => nonce + 1);
  }, [profit, betAmount, setBetAmount, startingBetAmount, setBetHistory, rollADice, winStreak, loseStreak, setPayout,
    resetLineBet
  ]);
  


  return <div>
    <button className="buttonStart" onClick={() => start()}>Start</button>
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
      </tbody>
    </table>

    <div className="flex">
      <table>
        <thead>
          <tr>
            <th>nonce</th>
            <th>result</th>
            <th>betAmount</th>
            <th>profit</th>
          </tr>
        </thead>
        <tbody>
          {
            tableData(results, maxDataToShow).map((result, index) => <tr key={index} className={result.cashType == 'doge' ? 'none' : result.win ? 'win' : 'lose'}>
              <td>{ result.nonce }</td>
              <td>{ result.result }</td>
              <td>{ (result.betAmount).toFixed(8) }</td>
              <td>{ result.profit }</td>
              <td>{ result.cashType }</td>
            </tr>)
          }
        </tbody>
      </table>
      <LineChart data={{
        labels: graphLabels(results),
        datasets: [
          {
            data: graphData(results),
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
const graphLabels = (results) => {
  let newArr = results.filter(r => r.cashType === 'xrp');
  let newArrNext = newArr.slice(-50);
  return newArrNext.map(result => result.nonce);
}
const graphData = (results) => {
  let newArr = results.filter(r => r.cashType === 'xrp');
  let newArrNext = newArr.slice(-50);
  return newArrNext.map(result => result.profit);
}
const tableData = (results, maxDataToShow) => {
  let newArr = results.slice(-maxDataToShow);
  return newArr;
}
const verifyWinLose = (result, roll, rollUnder, rollOver) => {
  if(roll === 'under'){
    return result <= rollUnder ? true : false;
  } else {
    return result >= rollOver ? true : false;
  }
}