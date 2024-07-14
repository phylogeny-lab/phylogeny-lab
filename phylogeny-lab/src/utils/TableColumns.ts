const DatabaseColumns = [
    {name: "ACCESSION", uid: "accession", sortable: true},
    {name: "ORGANISM NAME", uid: "organism_name", sortable: true},
    {name: "STATUS", uid: "status", sortable: true},
    {name: "SEQUENCE LENGTH", uid: "total_sequence_length", sortable: true},
    {name: "RELEASE DATE", uid: "release_date", sortable: true},
    {name: "ASSEMBLY NAME", uid: "assembly_name", sortable: true},
    {name: "ASSEMBLY TYPE", uid: "assembly_type", sortable: true},
    {name: "GC COUNT", uid: "gc_count", sortable: true},
    {name: "GC PERCENT", uid: "gc_percent", sortable: true},
    {name: "CHROMOSOMES", uid: "total_number_of_chromosomes", sortable: true},
    {name: "TAX ID", uid: "tax_id", sortable: true},
    {name: "SOURCE DATABASE", uid: "source_database", sortable: true},
    {name: "ACCESSION NAME", uid: "accession_name", sortable: true},
    {name: "TOTAL GENES", uid: "total_genes", sortable: true},
    {name: "", uid: "more_info", sortable: true},
];

const TaskColumns = [
    {name: "Task UUID", uid: "uuid"},
    {name: "Name", uid: "name"},
    {name: "Status", uid: "status"},
    {name: "Actions", uid: "actions"},
];
  
  const WorkerColumns = [
    {name: "Name", uid: "hostname"},
    {name: "Active", uid: "active"},
    {name: "Processed", uid: "processed"},
    //{name: "Pid", uid: "pid"},
    {name: "Average load", uid: "loadavg"},
    {name: "Actions", uid: "actions"},
];

export { DatabaseColumns, WorkerColumns, TaskColumns }