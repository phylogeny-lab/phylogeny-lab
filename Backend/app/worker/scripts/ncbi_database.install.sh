#! /bin/bash

set -e # exit script on error
for var in "$@"
  do
    echo "Connecting to NCBI..."
    datasets download --filename "${var}" genome accession $var --include gff3,rna,cds,protein,genome,seq-report
    echo "Extracting..."
    mkdir "${var}_extracted" && unzip "${var}" -d "${var}_extracted" && rm "${var}"
  done