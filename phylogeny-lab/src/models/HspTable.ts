interface HspTable {
    id: number;
    score: number;
    bitScore: number;
    evalue: number;
    gaps: number;
    identity: number;
    alignLength: number;
    qseq: string;
    hseq: string;
    midline: string;
    queryFrom: number;
    queryTo: number;
    hitsFrom: number;
    hitsTo: number;
}