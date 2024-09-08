FROM debian:bullseye-slim
EXPOSE 5000
RUN apt-get update && apt-get install -y wget libgomp1 zip unzip dos2unix
# setup miniconda
ENV CONDA_DIR /opt/conda
ENV NCBI_METADATA_DIR=/ncbi_tables_metadata
RUN wget --quiet https://repo.anaconda.com/miniconda/Miniconda3-py310_24.5.0-0-Linux-x86_64.sh -O ~/miniconda.sh && \
    /bin/bash ~/miniconda.sh -b -p /opt/conda
ENV PATH=$CONDA_DIR/bin:$PATH
COPY ./requirements.txt /code/requirements.txt
RUN conda install -y --file /code/requirements.txt -c bioconda -c conda-forge
# create volume
ENV NCBI_DATABASE_DIR=/volume/ncbi_databases
# copy scripts
COPY ./app/worker/scripts /scripts
RUN chmod +x /scripts/*.sh
# Download NCBI database metadata for Eumetazoans
RUN mkdir ${NCBI_METADATA_DIR}
RUN dos2unix /scripts/ncbi_datasets_summary.sh
RUN /scripts/ncbi_datasets_summary.sh eumetazoa ${NCBI_METADATA_DIR} --reference --annotated
#RUN /scripts/ncbi_datasets_summary.sh viruses ${NCBI_METADATA_DIR} --reference
WORKDIR /code
# Remove dos2unix tool
RUN apt-get --purge remove -y dos2unix && rm -rf /var/lib/apt/lists/*
# setup app & run server
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5000"]