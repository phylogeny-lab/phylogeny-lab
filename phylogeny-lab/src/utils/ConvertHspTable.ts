export function convertToHspTable(obj: any) {
    let tables: HspTable[] = []
    
    obj?.map((item: any) => {

        const newItem: HspTable = {
            id: item.Hsp_num, 
            score: item.Hsp_score,
            evalue: item.Hsp_evalue,
            gaps: item.Hsp_gaps,
            alignLength: item['Hsp_align-len'],
            qseq: item.Hsp_qseq,
            hseq: item.Hsp_hseq,
            midline: item.Hsp_midline,
            queryFrom: item['Hsp_query-from'],
            queryTo: item['Hsp_query-to'],
            hitsFrom: item['Hsp_hit-from'],
            hitsTo: item['Hsp_hit-to'],
            identity: item.Hsp_identity,
            bitScore: item['Hsp_bit-score']
        } as HspTable; 

        tables.push(
            newItem
        )
    })

    return tables
}