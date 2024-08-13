from typing import List
import numpy as np
import seaborn as sns
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
import matplotlib.pyplot as plt
import os
import pandas as pd
import umap
from helper.utils import csv_to_json

def do_reduction(files: List[str], label_names: List[str], batches: int, algorithm = "pca", n_components: int = 2, save = True):

    X = np.array([])
    labels = np.array([])

    for (file, label) in zip(files, label_names):

        data = np.loadtxt(file)
        X = data if X.size == 0 else np.append(X, data, axis=0)
        annot = np.array([label for _ in range(batches)])
        labels = annot if labels.size == 0 else np.append(labels, annot)

    labels = np.array(labels)

    # choose dm algo

    if algorithm.lower() == "pca":
        reducer = PCA(n_components=n_components)
    elif algorithm.lower() == "tsne":
        reducer = TSNE(n_components=n_components)
    elif algorithm.lower() == "umap":
        reducer = umap.UMAP(n_components=n_components)
    else:
        raise Exception("Uknown algorithm")

    data_pca = reducer.fit_transform(X)

    if n_components == 2:
        df = pd.DataFrame({'pca1': data_pca[:,0], 'pca2': data_pca[:,1]})
    elif n_components == 3:
        df = pd.DataFrame({'pca1': data_pca[:,0], 'pca2': data_pca[:,1], 'pca3': data_pca[:,2]})

    df['label'] = labels

    if save:
        csv_filepath = os.path.join(os.path.dirname(files[0]), f'pca_{n_components}.csv')
        json_filepath = os.path.join(os.path.dirname(files[0]), f'pca_{n_components}.json')
        df.to_csv(csv_filepath, index=False, header=True)
        
        fieldnames = ("pca1", "pca2", "label") if n_components == 2 else ("pca1", "pca2", "pca3", "label")
        csv_to_json(csv_filepath=csv_filepath, json_filepath=json_filepath, fieldnames=fieldnames)
    
    return data_pca
