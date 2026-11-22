import os
import sys
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

# Add current dir to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from preprocessing import CKDPreprocessor
from evaluation import evaluate_classifier, save_metrics


def train_models(data_path="data/kidney_disease.csv", models_dir="models"):
    print(f"Loading dataset from: {data_path}")
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Dataset not found at {data_path}. Please place kidney_disease.csv in data directory.")

    df = pd.read_csv(data_path)
    if 'id' in df.columns:
        df.drop('id', axis=1, inplace=True)

    # Clean target
    df['classification'] = df['classification'].astype(str).str.strip().str.lower()
    df = df[df['classification'].isin(['ckd', 'notckd'])].copy()
    y = df['classification'].map({'ckd': 1, 'notckd': 0}).astype(int)
    X_raw = df.drop('classification', axis=1)

    # Train / test split (80/20 stratified)
    X_train_raw, X_test_raw, y_train, y_test = train_test_split(
        X_raw, y, test_size=0.2, random_state=42, stratify=y
    )

    print("Fitting preprocessor...")
    preprocessor = CKDPreprocessor()
    preprocessor.fit(X_train_raw)

    # Transform
    X_train_df, X_train_scaled = preprocessor.transform(X_train_raw)
    X_test_df, X_test_scaled = preprocessor.transform(X_test_raw)

    # Train Model 1: Logistic Regression
    print("Training Model 1: Logistic Regression...")
    lr_model = LogisticRegression(random_state=42, max_iter=1000)
    lr_model.fit(X_train_scaled, y_train)

    # Train Model 2: Random Forest
    print("Training Model 2: Random Forest...")
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train_df, y_train)

    # Evaluate
    print("Evaluating models...")
    lr_metrics = evaluate_classifier(lr_model, X_test_scaled, y_test, is_scaled=True, model_name="Logistic Regression")
    rf_metrics = evaluate_classifier(rf_model, X_test_df, y_test, is_scaled=False, model_name="Random Forest")

    os.makedirs(models_dir, exist_ok=True)

    # Save models & preprocessor
    preprocessor.save(os.path.join(models_dir, "preprocessor.joblib"))
    joblib.dump(lr_model, os.path.join(models_dir, "logistic_regression.joblib"))
    joblib.dump(rf_model, os.path.join(models_dir, "random_forest.joblib"))

    comparison = {
        "dataset_samples": len(df),
        "train_samples": len(X_train_raw),
        "test_samples": len(X_test_raw),
        "target_distribution": {
            "ckd_count": int(y.sum()),
            "not_ckd_count": int((y == 0).sum())
        },
        "logistic_regression": lr_metrics,
        "random_forest": rf_metrics
    }

    metrics_path = os.path.join(models_dir, "model_metrics.json")
    save_metrics(comparison, metrics_path)

    print("\n================== MODEL EVALUATION REPORT ==================")
    print(f"Logistic Regression: Accuracy={lr_metrics['accuracy']}, Precision={lr_metrics['precision']}, Recall={lr_metrics['recall']}, F1={lr_metrics['f1_score']}, ROC-AUC={lr_metrics['roc_auc']}")
    print(f"Random Forest:       Accuracy={rf_metrics['accuracy']}, Precision={rf_metrics['precision']}, Recall={rf_metrics['recall']}, F1={rf_metrics['f1_score']}, ROC-AUC={rf_metrics['roc_auc']}")
    print(f"Saved artifacts to {models_dir}/")
    print("=============================================================\n")

    return comparison


if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_file = os.path.join(base_dir, "data", "kidney_disease.csv")
    models_folder = os.path.join(base_dir, "models")
    train_models(data_file, models_folder)
