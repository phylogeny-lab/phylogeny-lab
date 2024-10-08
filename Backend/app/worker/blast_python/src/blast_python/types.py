from enum import Enum

class OutFmt(Enum):
    PAIRWISE = 0
    QUERY_ANCHORED_SHOW_ID = 1
    QUERY_ANCHORED_NO_ID = 2
    FLAT_QUERY_ANCHORED_SHOW_ID = 3
    FLAT_QUERY_ANCHORED_NO_ID = 4
    XML = 5
    TABULAR = 6
    TABULAR_WITH_COMMENTS = 7
    TEXT_ASN1 = 8
    BINARY_ASN1 = 9
    CSV = 10
    BLAST_ARCHIVE_FMT_ASN1 = 11
    JSON_SEQALIGN = 12
    JSON_MULTIPLE_FILE_BLAST = 13
    XML2_MULTIPLE_FILE_BLAST = 14
    JSON_SINGLE_FILE_BLAST = 15
    XML2_SINGLE_FILE_BLAST = 16
    SAM = 17
    ORGANISM_REPORT = 18