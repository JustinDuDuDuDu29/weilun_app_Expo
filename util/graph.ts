import * as d3 from "d3";
import { revT } from "../types/revenueT";
export const makeGraph = (data: revT[]) => {
    const max = Math.max(...data.map(val => val.Earn));
    const min = Math.min(...data.map(val => val.Earn));
    const y = d3.scaleLinear().domain([0, max])
  
    const nd = new Date()
    const x = d3.scaleTime()
      .domain([1,2,3])
  
    const curvedLine = d3.line<revT>()
      .x((d, i) => x(i-3+1))
      .y(d => y(d.Earn))
      .curve(d3.curveBasis)(data);
  
    return {
      max,
      min,
      curve: curvedLine!,
    };
  };