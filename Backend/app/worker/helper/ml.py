from typing import List
import numpy as np
import seaborn as sns
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import os

def do_pca(raw: List[str], labels: List[str], batches: int, n_components: int = 2):

    X = np.array([])
    labels = np.array([])

    for raw_file in raw:

        label = os.path.basename(raw_file)
        
        X = np.loadtxt(fname=str(raw_file)) if len(X) == 0 else np.append(X, np.loadtxt(fname=str(raw_file)))
        labels = np.repeat(label, batches) if len(labels) == 0 else np.append(labels, np.repeat(label, batches))


    pca = PCA(n_components=n_components)
    data_pca = pca.fit_transform(X)

    data_pca.tofile(os.path(os.path.dirname(raw[0]), f'pca_{n_components}'))
    return data_pca
