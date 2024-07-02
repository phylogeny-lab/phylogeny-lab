import os
import subprocess
from enum import Enum
from typing import Optional
import json
from .types import OutFmt

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


class Blastn:
    """
    Wrapper class for blastn shell command tool.

    Parameters
    ----------
    db: str
        Database to be searched.
    entrez_query: str
        Entrez queries can be single words, short phrases, sentences, database identifiers, gene symbols, or names.
    taxids: str
        Extract taxid of interest (e.g. 9606 for humans).
    subject: str
        Subject you are querying against. If this is provided a database is not needed.
    query: str
        Sequence or data file to search.
    perc_identity: float
        minimum percent identity.
    reward: int
        Reward for matched nucleotides/amino acids.
    penalty: int
        Penalty for mismatched nucleotides/amino acids.
    word_size: int
        Word size (use lower word sizes for more distant homologies).
    evalue: float
        Minimum expected value for returned searches.
    gapopen: int
        Gap open parameter.
    gapextend: int
        Gap extend parameter.
    ungapped: bool
        Use ungapped alignment.
    max_hsps: int
        Maximum number of HSPs (alignments) to keep for any single query-subject pair. The HSPs shown will be the best as judged by expect value. 
        This number should be an integer that is one or greater. If this option is not set, BLAST shows all HSPs meeting the expect value criteria. 
        Setting it to one will show only the best HSP for every query-subject pair.
    num_threads: int
        Number of threads to use (this parameter is ignored when database is not specified).
    remote: bool
        Execute search on NCBI servers.
    out: str
        Output file.
    outfmt: int | OutFmt
        Output file format.
    """

    def __init__(
        self,
        db: str = None,
        entrez_query: str = None,
        taxids: str = None,
        subject: str = None,
        query: str = None,
        perc_identity: float = None,
        reward: int = None,
        penalty: int = None,
        word_size: int = None,
        evalue: float = None,
        gapopen: int = None,
        gapextend: int = None,
        ungapped: bool = None,
        max_hsps: int = None,
        num_threads: int = None,
        remote: bool = None,
        out: str = None,
        outfmt: int = None,
        **kwargs
    ):
        
        self.parameters = dict(
            db=db,
            entrez_query=entrez_query,
            taxids=taxids,
            subject=subject,
            query=query,
            perc_identity=perc_identity,
            reward=reward,
            penalty=penalty,
            word_size=word_size,
            evalue=evalue,
            gapopen=gapopen,
            gapextend=gapextend,
            ungapped=ungapped,
            max_hsps=max_hsps,
            num_threads=num_threads,
            remote=remote,
            out=out,
            outfmt=outfmt
        )

        self.parameters.update(kwargs)

        self._validate_params()


    def run(self, verbose=True):
        """
        Execute blatn search subprocess.

        Returns
        -------
        return_code: int
            Return code for blastn search. See https://blast.ncbi.nlm.nih.gov/doc/elastic-blast/exit-codes.html for reference.
        
        """

        cmd = ['blastn']
        for k, v in self.parameters.items():

            if k == 'ungapped':
                if v or v == 'True': # if ungapped dont append boolean
                    cmd.append(f"-{k}")

            elif v != '' and v != None:
                cmd.append(f"-{k}")
                cmd.append(f"{v}")

        print("RUNNING cmd")
        print(cmd)
        process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        if verbose:
            print("blastn query underway...")

        while True:
            # Do something else
            return_code = process.poll()
            if return_code is not None:
                if return_code == 0:
                    # Process has finished, read rest of the output 
                    message = ""
                    for output in process.stdout.readlines():
                        message += output.strip().decode()
                        if verbose:
                            print(message)
                    if verbose:
                        print("FINISHED")
                    if self.parameters['out'] is not None:
                        print(f"Results saved to {self.parameters['out']}")
                    return (return_code, message)
                else:
                    message = ""
                    for output in process.stderr.readlines():
                        message = output.strip().decode()
                        if verbose:
                            print(message)
                    print(bcolors.FAIL + f"ERROR: {message}" + bcolors.ENDC)
                    return (return_code, message)


    
    def _validate_params(self):
        """Ensure blast parameters are valid. If some blast params conflict, this is dealt with internally by blastn."""

        for k, v in self.parameters.items():
            # Get int value of outfmt if enum is provided
            if type(self.parameters[k]) == OutFmt:
                self.parameters[k] = self.parameters[k].value
            
            # Sanitise strings
            if type(self.parameters[k]) == str:
                self.parameters[k] = self.parameters[k].lstrip()
