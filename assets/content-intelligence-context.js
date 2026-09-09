/* Top Analytica — AI Context Builder v2
   Read-only adapter. Produces a compact, source-aware context for the AI layer.
   Canonical data is never mutated. */
(function(){
  const normParty=p=>{const v=String(p||'').trim().toUpperCase();return v==='AD(S)'?'ADS':v==='AD(K)'?'ADK':v==='JD(L)'?'JDL':v==='JD(U)'?'JDU':v};
  const num=v=>v==null||v===''?null:Number(v);
  function findAc(db, acNo){
    const n=Number(acNo); if(!n) return null;
    const base=(db?.constituencies||[]).find(x=>Number(x.ac_no)===n);
    const master=(db?.assembly2022?.constituencies||[]).find(x=>Number(x.ac_no)===n);
    if(!base && !master) return null;
    return {...(base||{}),...(master||{}),ac_no:n,winner_party:normParty(master?.winner_party||base?.winner_party),runner_up_party:normParty(master?.runner_up_party||base?.runner_up_party)};
  }
  function build(input, opts={}){
    const db=input||window.DB||{};
    const acNo=opts.acNo||db?.ac?.ac_no||new URLSearchParams(location.search).get('ac');
    const ac=findAc(db,acNo);
    if(!ac) return {schema_version:'2.0',status:'no_constituency_selected',rule:'Use verified data only; do not invent missing facts.'};
    const selectedParty=normParty(opts.party||new URLSearchParams(location.search).get('party')||db?.selectedParty||ac.winner_party);
    const hist=(db?.history?.constituencies||[]).find(x=>Number(x.ac_no)===Number(ac.ac_no))?.history||{};
    const ls=db?.recent2024?.constituencies?.[String(ac.ac_no)]||null;
    const f20=db?.form20Booth?.constituencies?.[String(ac.ac_no)]||null;
    const selectedStats=f20?.party_totals_first35?.[selectedParty]??null;
    const cat=f20?.category_counts?.[selectedParty]||null;
    const selectedCandidate=(f20?.candidates||[]).find(c=>normParty(c.party)===selectedParty)?.name||null;
    const top4=(f20?.summary_first35||[]).slice(0,4).map(x=>({rank:x.rank,name:x.name,party:normParty(x.party),votes:num(x.votes)}));
    const booths=Array.isArray(f20?.booths)?f20.booths:[];
    const boothStats=booths.length?(()=>{
      let electors=0,voters=0,partyVotes=0,lead=0;
      const rows=booths.map(b=>{
        const votes=b?.votes||{}; const sv=num(votes[selectedParty])||0;
        const rivals=Object.entries(votes).filter(([p])=>normParty(p)!==selectedParty).sort((x,y)=>(Number(y[1])||0)-(Number(x[1])||0));
        const rivalVotes=Number(rivals[0]?.[1])||0; const margin=sv-rivalVotes;
        const share=b?.candidate_vote_share==null?null:(Number(sv)/(Number(b?.voters_total)||1))*100;
        electors+=Number(b?.electors)||0; voters+=Number(b?.voters_total)||0; partyVotes+=sv; if(margin>0)lead++;
        return {booth_no:b?.booth_no||null,polling_station:b?.polling_station||null,electors:num(b?.electors),voters_total:num(b?.voters_total),selected_party_votes:sv,selected_party_share_pct:share,top_party:normParty(b?.top4?.[0]?.party||''),top_party_votes:num(b?.top4?.[0]?.votes),margin_vs_top_rival:margin};
      });
      const turnout=voters&&electors?(voters/electors)*100:null;
      const strongest=[...rows].sort((a,b)=>(b.selected_party_share_pct??-1)-(a.selected_party_share_pct??-1)).slice(0,5);
      const weakest=[...rows].sort((a,b)=>(a.selected_party_share_pct??101)-(b.selected_party_share_pct??101)).slice(0,5);
      const closest=[...rows].sort((a,b)=>Math.abs(a.margin_vs_top_rival??999)-Math.abs(b.margin_vs_top_rival??999)).slice(0,5);
      return {booths_used:rows.length,electors,voters_total:voters,turnout_pct:turnout,selected_party_votes:partyVotes,selected_party_vote_share_pct:voters?(partyVotes/voters)*100:null,selected_party_lead_booths:lead,selected_party_nonlead_booths:rows.length-lead,strongest_booths:strongest,weakest_booths:weakest,closest_booths:closest};
    })():null;
    return {
      schema_version:'2.0',
      generated_at:new Date().toISOString(),
      source_policy:'Verified local data first; inference must be labelled; unavailable facts must be stated.',
      constituency:{
        ac_no:ac.ac_no,name:ac.constituency||null,district:ac.district||null,
        selected_party:selectedParty||null,selected_candidate:selectedCandidate,
        assembly_2022:{winner:ac.winner||null,winner_party:normParty(ac.winner_party),winner_votes:num(ac.winner_votes),winner_share_pct:num(ac.winner_vote_share),runner_up:ac.runner_up||null,runner_up_party:normParty(ac.runner_up_party),runner_up_votes:num(ac.runner_up_votes),runner_up_share_pct:num(ac.runner_up_vote_share),margin_votes:num(ac.margin_votes),margin_pct:num(ac.margin_pct),turnout_pct:num(ac.turnout_pct),booth_count:num(ac.booth_count)},
        history:{'2012':hist['2012']||null,'2017':hist['2017']||null},
        lok_sabha_2024_assembly_segment:ls,
        booth_preview:f20?{source:'Form20 · first 35 booths',booths_used:num(f20.booth_count_used)||35,selected_party_votes_first35:selectedStats,selected_party_categories:cat,top4_first35:top4,full_booth_stats:boothStats}:null
      },
      data_gaps: [!ls?'2024 Lok Sabha Assembly Segment data unavailable for this AC.':null,!f20?'Form20 first-35 booth layer unavailable for this AC.':null,!hist['2012']||!hist['2017']?'Historical 2012/2017 data incomplete for this AC.':null].filter(Boolean),
      answer_contract:{answer:true,key_points:true,sources:true,freshness:true,confidence:true,data_gaps:true},
      forbidden:['Do not call 2024 Lok Sabha segment a 2024 Assembly election.','Do not invent current candidates, alliances, issues or win probabilities.']
    };
  }
  window.TopAnalyticaContext={build,findAc,normParty};
})();
