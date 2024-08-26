FROM debian:bullseye-slim
EXPOSE 500 5555
RUN apt-get update && apt-get install -y wget libgomp1 zip unzip automake autoconf pkg-config autoconf-archive git build-essential
# setup miniconda
ENV CONDA_DIR /opt/conda
RUN wget --quiet https://repo.anaconda.com/miniconda/Miniconda3-py310_24.5.0-0-Linux-x86_64.sh -O ~/miniconda.sh && \
    /bin/bash ~/miniconda.sh -b -p /opt/conda
ENV PATH=$CONDA_DIR/bin:$PATH
COPY requirements.txt /code/requirements.txt
RUN conda install -y --file /code/requirements.txt -c bioconda -c conda-forge
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
WORKDIR /tmp
RUN git clone --depth=1 https://github.com/NBISweden/MrBayes.git && cd MrBayes
WORKDIR /bin/mrbayes
RUN /tmp/MrBayes/configure
RUN make && make install
# install RAxML
WORKDIR /tmp
RUN git clone https://github.com/stamatak/standard-RAxML.git
WORKDIR /tmp/standard-RAxML
RUN rm -dr WindowsExecutables*
RUN make -f Makefile.gcc
RUN rm *.o
RUN make -f Makefile.SSE3.gcc
RUN rm *.o
RUN make -f Makefile.PTHREADS.gcc
RUN rm *.o
RUN make -f Makefile.SSE3.PTHREADS.gcc
RUN rm *.o
RUN cp raxmlHPC* /bin/
# Executable can be run with raxmlHPC
# copy scripts
COPY ./scripts /scripts
RUN chmod +x /scripts/*.sh
# setup app & run server
WORKDIR /code/app/worker
COPY . .
# chmod start script which won't be in scripts directory
RUN chmod +x start-celery.sh
# compile tools
ENV EXECUTABLES_DIR=/code/app/worker
RUN g++ /code/app/worker/tools/feature_selection/vectorize/vectorize.cpp -o ${EXECUTABLES_DIR}/vectorize -fopenmp --std=c++17
ENV PATH=${EXECUTABLES_DIR}:$PATH