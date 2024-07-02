FROM ubuntu:22.04
EXPOSE 5000
RUN apt-get update && apt-get install -y wget libgomp1 zip unzip
# setup miniconda
ENV CONDA_DIR /opt/conda
ENV CONDA_ENV=bioconda_env
RUN wget --quiet https://repo.anaconda.com/miniconda/Miniconda3-py311_24.1.2-0-Linux-x86_64.sh -O ~/miniconda.sh && \
    /bin/bash ~/miniconda.sh -b -p /opt/conda
ENV PATH=$CONDA_DIR/bin:$PATH
COPY ./requirements.txt /code/requirements.txt
RUN conda install -y --file /code/requirements.txt -c bioconda -c conda-forge
# create volume
ENV NCBI_DATABASE_DIR=/volume/ncbi_databases
# copy scripts
COPY ./app/scripts /scripts
RUN chmod +x /scripts/*.sh
# setup app & run server
WORKDIR /code
COPY ./app /code/app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5000"]