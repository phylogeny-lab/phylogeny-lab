FROM ubuntu:22.04
EXPOSE 500
RUN apt-get update && apt-get install -y wget libgomp1 zip unzip automake autoconf pkg-config autoconf-archive git build-essential
# setup miniconda
ENV CONDA_DIR /opt/conda
ENV CONDA_ENV=bioconda_env
RUN wget --quiet https://repo.anaconda.com/miniconda/Miniconda3-py311_24.1.2-0-Linux-x86_64.sh -O ~/miniconda.sh && \
    /bin/bash ~/miniconda.sh -b -p /opt/conda
ENV PATH=$CONDA_DIR/bin:$PATH
COPY ./worker.requirements.txt /code/requirements.txt
RUN conda install -y --file /code/requirements.txt -c bioconda -c conda-forge
# create volume
ENV NCBI_DATABASE_DIR=/volume/ncbi_databases
# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
# install blast+
WORKDIR /tmp
ENV BLAST_VERSION=2.15.0
COPY ncbi_blast.download.sh .
RUN bash ncbi_blast.download.sh $BLAST_VERSION && rm ncbi_blast.download.sh
ENV PATH=/ncbi-blast-$BLAST_VERSION+/bin:$PATH
ENV BLASTDB=blastdb
# install mr Bayes
RUN git clone --depth=1 https://github.com/NBISweden/MrBayes.git && cd MrBayes
WORKDIR /mrbayes
RUN /tmp/MrBayes/configure
RUN make && make install
# copy scripts
COPY ./scripts /scripts
RUN chmod +x /scripts/*.sh
# setup app & run server
WORKDIR /code/app/worker
COPY . /code/app/worker