import { getMonth, getYear, getDate } from 'date-fns';

export const convFromSecs = (secs) => {
  let hours = 0;
  let mins = 0;
  
  while(secs >= 3600) {
    hours++;
    secs -= 3600;
  }
  
  while(secs >= 60) {
    mins++; 
    secs -= 60; 
  }

  hours = String(hours).padStart(2,'0');
  mins = String(mins).padStart(2,'0');
  secs = String(secs).padStart(2,'0');
  
  return hours + ":" + mins + ":" + secs; 
}

export const convToSecs = (h, m, s) => (h*3600) + (m*60) + (s*1)

export const addPace = (runs) => {
  runs = Array.from(runs);
  runs = runs.map(run => ({...run, pace: Math.round(run.time/run.distance)}));

  return runs;
}

export const formatNumbers = (runs) => {
  runs = Array.from(runs);
  if(runs !== undefined){
    runs.forEach(run => { 
      run.formTime = convFromSecs(run.time);
      run.formPace = convFromSecs(run.pace);
    });
  }
  return runs;
}

export const dateFilter = (dateDir, aDate, bDate, runs) => {
  if(dateDir === "bet") {
      return runs.filter(run => run.date > aDate && run.date < bDate);   
  }
  
  else {
    return runs;
  }
}
  
export const typeFilter = (runType, runs) => {
  if(runType !== "all") {
    return runs.filter(run => run.runType === runType);
  }
  
  else {
    return runs; 
  }
}
  
export const filterRuns = (filterObj, runs) => { 
  runs = dateFilter(filterObj.dateDir, filterObj.aDate, filterObj.bDate, runs);
  runs = typeFilter(filterObj.runType, runs);
  runs = timeFilter(filterObj.timeDir, filterObj.timeVal, runs);
  runs = distanceFilter(filterObj.disDir, filterObj.disVal, runs);
  runs = paceFilter(filterObj.paceDir, filterObj.paceVal, runs);
    
  return runs; 
}
  
export const toStrDate = (date) => getYear(date) + '-' + String(getMonth(date)+1).padStart(2,'0') +  '-' + String(getDate(date)).padStart(2,'0');

export const timeFilter = (timeDir, timeVal, runs) => {
  if(timeDir === "gt") {
    return runs.filter(run => run.time > timeVal);
  }

  else if(timeDir === "lt") {
    return runs.filter(run => run.time < timeVal);
  }

  else {
    return runs;
  }
}

export const distanceFilter = (disDir, disVal, runs) => {
  if(disDir === "gt") {
    return runs.filter(run => run.distance > disVal);
  }

  else if(disDir === "lt") {
    return runs.filter(run => run.distance < disVal);
  }

  else {
    return runs;
  }
}

export const paceFilter = (paceDir, paceVal, runs) => {
  if(paceDir === "gt") {
    return runs.filter(run => run.pace > paceVal);
  }

  else if(paceDir === "lt") {
    return runs.filter(run => run.pace < paceVal);
  }

  else {
    return runs;
  }
}

export const sortRuns = (sortObj, runs) => { 
  runs = Array.from(runs);
  
  switch(sortObj.val) {
    case "date":
      runs.sort((a,b) => (a.date > b.date) ? 1 : -1);
      break;
    case "time":
      runs.sort((a,b) => (a.time > b.time) ? 1 : -1);
      break;
    case "distance":
      runs.sort((a,b) => (a.distance > b.distance) ? 1 : -1);
      break;
    case "pace":
      runs.sort((a,b) => (a.pace > b.pace) ? 1 : -1);
      break;
    default:
      return runs;  
  }

  if(sortObj.dir === "desc") {
    runs.reverse();
  }

  return runs;
}

export const createAggData = (totalTime, totalDistance, avgTime, avgDistance, avgPace) => { 
  return { totalTime, totalDistance, avgTime, avgDistance, avgPace };
};

export const createRunData = (date, formTime, distance, formPace, runType) => {
  return { date, formTime, distance, formPace, runType };
}