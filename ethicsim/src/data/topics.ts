import type {Topic} from '../types/ethics';
export const KEY='ethicsim.results.v2';
export const METRICS_KEY='ethicsim.response-metrics.v1';
export type ResponseMetrics={triage:number;investigation:number;containment:number;communication:number;accountability:number};
export const loadResults=():Record<string,number>=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
export const saveResult=(id:string,score:number)=>{const r=loadResults();r[id]=score;localStorage.setItem(KEY,JSON.stringify(r))};
export const loadMetricResults=():Record<string,ResponseMetrics>=>{try{return JSON.parse(localStorage.getItem(METRICS_KEY)||'{}')}catch{return {}}};
export const saveMetricResult=(id:string,metrics:ResponseMetrics)=>{const r=loadMetricResults();r[id]=metrics;localStorage.setItem(METRICS_KEY,JSON.stringify(r))};
export const topics:Topic[]=[{id:'bug-bounty',index:1,title:'Bug, Bounty & Liability',tagline:'Triage the bug, trace the failure, and control the damage.',axis:'Responsibility',short:'Liability',minutes:8,intro:['A connected production-incident campaign.'],scenarios:[]}];
export function archetype(results:Record<string,number>){const score=results['bug-bounty']||0;if(score>=80)return{name:'The Incident Steward',blurb:'You contain harm quickly, investigate the cause, and keep users informed.'};if(score>=55)return{name:'The Practical Responder',blurb:'You restored control, but response order left avoidable damage.'};return{name:'The Reactive Shipper',blurb:'The system recovered, but delayed containment increased user harm and liability.'}}
