#!/bin/bash

BLAST_VERSION=$1

wget -nv ftp.ncbi.nlm.nih.gov/blast/executables/blast+/$BLAST_VERSION/ncbi-blast-$BLAST_VERSION+-x64-linux.tar.gz
wget ftp.ncbi.nlm.nih.gov/blast/executables/blast+/$BLAST_VERSION/ncbi-blast-$BLAST_VERSION+-x64-linux.tar.gz.md5

md5sum -c ncbi-blast-$BLAST_VERSION+-x64-linux.tar.gz.md5

tar -xvzf ncbi-blast-$BLAST_VERSION+-x64-linux.tar.gz

rm *.gz *.md5