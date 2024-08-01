import { BASE_URL } from "@/app/consts/consts";
import axios from "axios";


export function convertNcbiToDatabaseTable(obj: any) {
    let tables: DatabaseDisplayTable[] = []
    
    obj?.map((item: NCBIDatabase) => {

        const newItem: DatabaseDisplayTable = {
            accession: item.accession,
            accession_name: item.annotation_info.name,
            provider: item.annotation_info.provider,
            non_coding_genes: item.annotation_info.stats?.gene_counts?.non_coding,
            protein_coding_genes: item.annotation_info.stats?.gene_counts?.protein_coding,
            pseudogenes: item.annotation_info.stats?.gene_counts?.pseudogene,
            other_genes: item.annotation_info.stats?.gene_counts?.other,
            total_genes: item.annotation_info.stats?.gene_counts?.total,
            organism_name: item.organism.organism_name,
            common_name: item.organism.common_name,
            assembly_name: item.assembly_info.assembly_name,
            assembly_level: item.assembly_info.assembly_level,
            assembly_status: item.assembly_info.assembly_status,
            assembly_type: item.assembly_info.assembly_type,
            release_date: new Date(item.annotation_info.release_date),
            bioproject_accession: item.assembly_info.bioproject_accession,
            number_of_contigs: item.assembly_stats.number_of_contigs,
            number_of_organelles: item.assembly_stats.number_of_organelles,
            number_of_scaffolds: item.assembly_stats.number_of_scaffolds,
            total_number_of_chromosomes: item.assembly_stats.total_number_of_chromosomes,
            total_sequence_length: Number(item.assembly_stats.total_sequence_length),
            total_ungapped_length: Number(item.assembly_stats.total_ungapped_length),
            source_database: item.source_database,
            gc_count: Number(item.assembly_stats.gc_count),
            gc_percent: Number(item.assembly_stats.gc_percent),
            tax_id: item.organism.tax_id,
            submitter: item.assembly_info.submitter,
            status: item.status} as DatabaseDisplayTable; 

        tables.push(
            newItem
        )
    })

    return tables
}

export function convertCustomToDatabaseTable(obj: any) {
  let tables: DatabaseDisplayTable[] = []

  obj?.map((item: CustomDatabase) => {

    const newItem: DatabaseDisplayTable = {
      accession: item.id,
      organism_name: item.dbname,
      status: item.status,


    } as DatabaseDisplayTable;

    tables.push(
      newItem
  )

  })

  return tables
}


export function bringToFrontByTaxIDS(taxids: number[], arr: DatabaseDisplayTable[]) {
    var swapIndex = 0
    taxids.map((id) => {
      arr.map((item, i) => {
        if (item.tax_id == id) {
          const temp = arr[swapIndex];
          arr[swapIndex] = arr[i];
          arr[i] = temp;
        }
      })
      swapIndex++
    })
  }


  export async function LoadDatabases() {
    return new Promise<DatabaseDisplayTable[]>(async (resolve, reject) => {

        await axios.all([
          axios.get(BASE_URL + '/blastdb/custom'), 
          axios.get(BASE_URL + '/blastdb/ncbi')
        ])
        .then(axios.spread((custom, ncbi) => {
          const ncbiDatabases = ncbi?.data;
          const customDatabases = custom?.data;
          // objects need to be converted into databasetable model to be rendered
          const ncbiDatabaseTable: DatabaseDisplayTable[] = convertNcbiToDatabaseTable(ncbiDatabases);
          const customDatabaseTable: DatabaseDisplayTable[] = convertCustomToDatabaseTable(customDatabases);
          // human, mouse, zebrafish, chimpanzee, rat
          bringToFrontByTaxIDS([9606, 10090, 7955, 9598, 10117], ncbiDatabaseTable)
    
          resolve(customDatabaseTable.concat(ncbiDatabaseTable))
        }))
        .catch((err: any) => {reject(err)})
      })
  }
