FROM debian:bullseye-slim
EXPOSE 500 5555
RUN apt-get update && apt-get install -y wget libgomp1 zip unzip automake autoconf pkg-config autoconf-archive git build-essential dos2unix
# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV BLAST_VERSION=2.15.0
ENV MRBAYES_VERSION=3.2.7
ENV RAxML_VERSION=8.2.13
ENV EXECUTABLES_DIR=/code/app/worker
ENV CONDA_DIR /opt/conda
# setup miniconda & install dependencies
RUN wget --quiet https://repo.anaconda.com/miniconda/Miniconda3-py310_24.5.0-0-Linux-x86_64.sh -O ~/miniconda.sh && \
    /bin/bash ~/miniconda.sh -b -p /opt/conda
ENV PATH=$CONDA_DIR/bin:$PATH
COPY requirements.txt /code/requirements.txt
RUN conda install -y --file /code/requirements.txt -c bioconda -c conda-forge
# install blast+
WORKDIR /tmp
COPY ncbi_blast.download.sh .
# copy scripts
COPY ./scripts /scripts
RUN chmod +x /scripts/*.sh
# Windows uses an extra newline character '\r' which causes an error when copying scripts on a Windows platform. So convert to Unix format here
RUN dos2unix ncbi_blast.download.sh
RUN dos2unix /scripts/ncbi_database.install.sh
# Install blast
RUN bash ncbi_blast.download.sh $BLAST_VERSION && rm ncbi_blast.download.sh
ENV PATH=/ncbi-blast-$BLAST_VERSION+/bin:$PATH
ENV BLASTDB=blastdb
# install mr Bayes
WORKDIR /tmp
RUN wget --quiet https://github.com/NBISweden/MrBayes/archive/refs/tags/v${MRBAYES_VERSION}.tar.gz
RUN tar -xvzf v${MRBAYES_VERSION}.tar.gz
WORKDIR /bin/mrbayes
RUN /tmp/MrBayes-${MRBAYES_VERSION}/configure
RUN make 
RUN make install
# install RAxML
WORKDIR /tmp
RUN wget --quiet https://github.com/stamatak/standard-RAxML/archive/refs/tags/v${RAxML_VERSION}.tar.gz
RUN tar -xvzf v${RAxML_VERSION}.tar.gz
WORKDIR /tmp/standard-RAxML-${RAxML_VERSION}
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
# install Treepuzzle
WORKDIR /tmp
RUN wget --quiet http://www.tree-puzzle.de/tree-puzzle-5.3.rc16.tar.gz
RUN tar -xvzf tree-puzzle-5.3.rc16.tar.gz
WORKDIR /tmp/tree-puzzle-5.3.rc16
RUN ./configure
RUN make
RUN make install
RUN make clean
# setup app & run server
WORKDIR /code/app/worker
COPY . .
# Windows uses an extra newline character '\r' which causes an error when copying scripts on a Windows platform. So convert to Unix format here
RUN dos2unix /code/app/worker/entrypoint.sh
# compile other scripts
RUN g++ /code/app/worker/tools/feature_selection/vectorize/vectorize.cpp -o ${EXECUTABLES_DIR}/vectorize -fopenmp --std=c++17
ENV PATH=${EXECUTABLES_DIR}:$PATH
# chmod start script which won't be in scripts directory
RUN chmod +x entrypoint.sh
# Remove dos2unix tools
RUN apt-get --purge remove -y dos2unix && rm -rf /var/lib/apt/lists/*
ENTRYPOINT ["entrypoint.sh"]