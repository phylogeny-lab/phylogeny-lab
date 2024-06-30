interface DatabaseDisplayTable {
    accession: string;
    accession_name: string;
    provider: string;
    non_coding_genes: number;
    protein_coding_genes: number;
    pseudogenes: number;
    other_genes: number;
    total_genes: number;
    organism_name: string;
    common_name?: string;
    status: string;
    release_date: Date;
    assembly_name: string;
    assembly_level: string;
    assembly_status: string;
    assembly_type: string;
    bioproject_accession: string;
    number_of_contigs: number;
    number_of_organelles: number;
    number_of_scaffolds: number;
    total_number_of_chromosomes: number;
    total_sequence_length: number;
    total_ungapped_length: number;
    source_database: string;
    gc_count: number;
    submitter: string;
    gc_percent: number;
    tax_id: number;
}

interface CustomDatabase {
    id: string;
    dbname: string;
    version?: string;
    dbtype?: string;
    description?: string;
    numLetters?: string;
    numSequences?: number;
    numLeters?: number;
    files?: string[];
    lastUpdated?: Date;
    bytesTotal?: number;
    status: string;
}

interface NCBIDatabase {
    accession: string;
    annotation_info: annotation_info;
    assembly_info: assembly_info;
    assembly_stats: assembly_stats;
    current_accession: string;
    organism: organism;
    paired_accession: string;
    source_database: string;
    type_material: type_material;
    status: string;
}

interface annotation_info {
    name: string;
    provider: string;
    release_date: string;
    stats?: stats;
}

interface stats {
    gene_counts?: gene_counts;
}

interface assembly_info {
    assembly_level: string;
    assembly_name: string;
    assembly_status: string;
    assembly_type: string;
    paired_assembly: object;
    refseq_category: string;
    release_date: string;
    bioproject_accession?: string;
    submitter: string;
}

interface assembly_stats {
    contig_l50: number;
    contig_n50 : number;
    gc_count: string;
    gc_percent: number;
    number_of_component_sequences: number;
    number_of_contigs: number;
    number_of_scaffolds: number;
    number_of_organelles?: number;
    scaffold_l50: number;
    scaffold_n50: number;
    total_number_of_chromosomes: number;
    total_sequence_length: string;
    total_ungapped_length: string;
}

interface organism {
    infraspecific_names?: infraspecific_names;
    organism_name: string;
    common_name?: string;
    tax_id: number;
}

interface infraspecific_names {
    strain?: string;
}

interface type_material {
    type_display_text: string;
    type_label: string;
}

interface gene_counts {
    non_coding?: number;
    other?: number;
    protein_coding?: number;
    pseudogene?: number;
    total?: number;
}