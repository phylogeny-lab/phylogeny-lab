FROM ubuntu:22.04
EXPOSE 5555
RUN apt-get update && apt-get install -y wget
# setup miniconda
ENV CONDA_DIR /opt/conda
ENV CONDA_ENV=bioconda_env
RUN wget --quiet https://repo.anaconda.com/miniconda/Miniconda3-py311_24.1.2-0-Linux-x86_64.sh -O ~/miniconda.sh && \
    /bin/bash ~/miniconda.sh -b -p /opt/conda
ENV PATH=$CONDA_DIR/bin:$PATH
COPY ./flower.requirements.txt /code/flower.requirements.txt
RUN conda install -y --file /code/flower.requirements.txt -c bioconda -c conda-forge
# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
# setup app & run server
WORKDIR /code/app/flower
COPY . /code/app/flower
RUN chmod +x start-flower.sh