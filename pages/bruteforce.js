import React, { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';

const bruteForce = () => {
  const letters = "abcdefghijklmnopqrstuvwxyz1234567890~!@#$%^&*()_-+=";
  const keys = letters.split('');
  const username = "billy";
  const [combinations, setCombinations] = useState([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,0,0,0,0,0]);
  const [nonce, setNounce] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const start = () => {
    if(!isPlaying){
      setIsPlaying(true);
      add(null, combinations);
    } else {
      setIsPlaying(false);
    }
  }
  
  const add = (value = null, combinations) => {
    const copyCombinations = cloneDeep(combinations);
    const combinationsLength = copyCombinations.length;
    let starting = value ? value : combinationsLength - 1;

    const nextValue = copyCombinations[starting] + 1;
    let nextStarting = null;

    if(nextValue >= 52){
      copyCombinations[starting] = 0;
      nextStarting = starting - 1;

      if(nextStarting >= 0){
        setTimeout(() => {
          add(nextStarting, copyCombinations);
        });
      }

    } else {
      copyCombinations[starting] = nextValue;
      Promise.resolve()
      .then(() => { setCombinations(copyCombinations); })
      .then(() => { setNounce(nonce => nonce + 1 ); });
    }
  }

  useEffect(() => {
    if(!isPlaying) return;
    
    if(nonce > 0){
      setTimeout(() => {
        add(null, combinations);
      });
    }
  }, [nonce]);

  const combinationInPassword = () => {
    const copyCombinations = cloneDeep(combinations).reverse();
    const noZeroCombinations = copyCombinations.filter(c => c > -1);
    return noZeroCombinations.map(c => letters[c]);
  }

  return <div>
    <button onClick={() => start()}>Start</button>
    <div>Nonce: { nonce }</div>
    <div className='brute'>{ combinations.map(c => <span>{c > -1 ? c : '*'}</span>) }</div>
    <div className='brute'>{ combinationInPassword().map(c => <span>{c}</span>) }</div>
  </div>

}

export default bruteForce;