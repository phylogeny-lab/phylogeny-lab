import json
import os
import time

from celery import Celery
import xmltodict

# from ..Blast_server.blast_python.src.blast_python import Blastn
# from ..Blast_server.blast_python.src.blast_python.Blastn import Blastn, OutFmt


celery = Celery(__name__)
celery.conf.broker_url = os.environ.get("CELERY_BROKER_URL", "redis://redis:6379")
celery.conf.result_backend = os.environ.get("CELERY_RESULT_BACKEND", "redis://redis:6379")


@celery.task(name="run_blastn")
def run_blastn():
        #results_file_json, db, subjectSequence, subjectFile, entrezQuery, querySequence, queryFile, reward, penalty, gapextend, gapopen, outFmt, word_size, results_file_xml, ungapped
        #results_file_xml = os.path.join(save_dir, blast_id, "results", "results.xml")
        #results_file_json = os.path.join(save_dir, blast_id, "results", "results.json")
        time.sleep(1000)
        return True
        # (return_code, _) = Blastn(
        #     db=db,
        #     subject=subjectSequence or subjectFile,
        #     entrez_query=entrezQuery,
        #     query=querySequence or queryFile,
        #     reward=reward,
        #     penalty=penalty,
        #     gapextend=gapextend,
        #     gapopen=gapopen,
        #     outfmt=OutFmt.XML.value,
        #     word_size=word_size,
        #     out=results_file_xml,
        #     ungapped=ungapped
        #     ).run(verbose=True)

        # if return_code == 0: # success

        #     # save file in json format

        #     with open(results_file_xml) as fd:
        #         json_parse = xmltodict.parse(fd.read())

        #     with open(results_file_json, "w") as f:
        #         f.write(json.dumps(json_parse, indent=2))

        #     # db.query(schemas.BlastQueries) \
        #     # .filter(schemas.BlastQueries.id == blast_id) \
        #     # .update({'status': BlastQueryStatus.COMPLETED.value})

        # else:
        #     # db.query(schemas.BlastQueries) \
        #     # .filter(schemas.BlastQueries.id == blast_id) \
        #     # .update({'status': BlastQueryStatus.FAILED.value})
        #     print("hi")
