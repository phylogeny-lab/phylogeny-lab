#! /bin/bash

for var in "$@"
  do
    echo "Connecting to NCBI..."
    # Any existing database with the same name will be overwritten
    [ -d "${NCBI_DATABASE_DIR}/${var}" ] && rm -dr "${NCBI_DATABASE_DIR}/${var}"
    mkdir -p "${NCBI_DATABASE_DIR}/${var}" && cd "${NCBI_DATABASE_DIR}/${var}"
    datasets download --filename "${var}" genome accession $var --include gff3,rna,cds,protein,genome,seq-report
    echo "Extracting..."
    mkdir "${var}_extracted" && unzip "${var}" -d "${var}_extracted" && rm "${var}"
  done