
import os from "os"
import config from "../config/config.json"

/**
 * 
 * 
 * 
 * @author Michael Roberts @therealmoneymikes
 * 
 * @
 * 
 * @description Calcuates the avaiable CPU threads available to provide workers for
 *              Video processing. 
 * 
 * @returns The number of available CPU Threads
 */

export const getAvailableCPUThreads = async (): Promise<number> => {
  const totalCPUs = os.cpus().length; //logical cores + hyperthreading

    //Get the load average (Windows Specific the moment)
    //The load average is a measure of system activity calculated by the operating system and expressed as a fractional number.

    try {
        const loadAvg = os.loadavg()[0];
        const loadRatio = loadAvg / totalCPUs;
        //Load of 1.0 per core means full utilisation 
        //E.g 
    
        if (loadRatio > 0.75) return Math.max(1, Math.floor(totalCPUs * config.HIGH_LOAD_CPU_LIMIT));
        if (loadRatio > 0.5) return Math.floor(totalCPUs * config.MODERATE_LOAD_CPU_LIMIT);
    
        //Minimum 2 for parallism
        return Math.max(2, Math.floor(totalCPUs * config.LOW_LOAD_CPU_LIMIT))
        
    } catch (error) {
            console.warn("pidusage failed, falling back to static CPI limit.")
            return Math.floor(totalCPUs * config.MODERATE_LOAD_CPU_LIMIT)
    }
  
}