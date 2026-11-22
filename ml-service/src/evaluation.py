import json
import numpy as np
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    roc_auc_score,
    classification_report
)


def evaluate_classifier(model, X_test, y_test, is_scaled=False, model_name="Model"):
    """
    Computes exact, factual evaluation metrics for a trained classifier.
    No fabricated data.
    """
    y_pred = model.predict(X_test)
    
    # Check if predict_proba is available
    if hasattr(model, "predict_proba"):
        y_prob = model.predict_proba(X_test)[:, 1]
        roc_auc = float(roc_auc_score(y_test, y_prob))
    else:
        y_prob = None
        roc_auc = None

    cm = confusion_matrix(y_test, y_pred)
    tn, fp, fn, tp = cm.ravel()

    metrics = {
        "model_name": model_name,
        "accuracy": round(float(accuracy_score(y_test, y_pred)), 4),
        "precision": round(float(precision_score(y_test, y_pred, zero_division=0)), 4),
        "recall": round(float(recall_score(y_test, y_pred, zero_division=0)), 4),
        "f1_score": round(float(f1_score(y_test, y_pred, zero_division=0)), 4),
        "roc_auc": round(roc_auc, 4) if roc_auc is not None else None,
        "confusion_matrix": {
            "true_negatives": int(tn),
            "false_positives": int(fp),
            "false_negatives": int(fn),
            "true_positives": int(tp),
            "matrix": cm.tolist()
        },
        "classification_report": classification_report(y_test, y_pred, output_dict=True)
    }

    return metrics


def save_metrics(metrics_dict, filepath):
    with open(filepath, "w") as f:
        json.dump(metrics_dict, f, indent=4)
