import os
import sys
import joblib
import pandas as pd
import numpy as np

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from preprocessing import CKDPreprocessor, FEATURE_COLUMNS


class CKDPredictor:
    def __init__(self, models_dir="models"):
        self.models_dir = models_dir
        self.preprocessor = None
        self.lr_model = None
        self.rf_model = None
        self._load_artifacts()

    def _load_artifacts(self):
        prep_path = os.path.join(self.models_dir, "preprocessor.joblib")
        lr_path = os.path.join(self.models_dir, "logistic_regression.joblib")
        rf_path = os.path.join(self.models_dir, "random_forest.joblib")

        try:
            if not (os.path.exists(prep_path) and os.path.exists(lr_path) and os.path.exists(rf_path)):
                raise FileNotFoundError("Models or preprocessor not found.")
            self.preprocessor = CKDPreprocessor.load(prep_path)
            self.lr_model = joblib.load(lr_path)
            self.rf_model = joblib.load(rf_path)
        except Exception as e:
            print(f"Artifact loading exception ({e}). Retraining models from dataset...")
            from train import train_models
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            data_path = os.path.join(base_dir, "data", "kidney_disease.csv")
            train_models(data_path, self.models_dir)
            self.preprocessor = CKDPreprocessor.load(prep_path)
            self.lr_model = joblib.load(lr_path)
            self.rf_model = joblib.load(rf_path)

    def predict(self, input_data):
        """
        Accepts dict or DataFrame of patient features.
        Returns prediction results for both Logistic Regression and Random Forest.
        """
        if isinstance(input_data, dict):
            df = pd.DataFrame([input_data])
        elif isinstance(input_data, list):
            df = pd.DataFrame(input_data)
        elif isinstance(input_data, pd.DataFrame):
            df = input_data.copy()
        else:
            raise ValueError("Invalid input format. Must be dict, list of dicts, or DataFrame.")

        # Transform using preprocessor
        X_df, X_scaled = self.preprocessor.transform(df)

        # Logistic Regression Prediction
        lr_pred = int(self.lr_model.predict(X_scaled)[0])
        lr_prob = float(self.lr_model.predict_proba(X_scaled)[0, 1])

        # Random Forest Prediction
        rf_pred = int(self.rf_model.predict(X_df)[0])
        rf_prob = float(self.rf_model.predict_proba(X_df)[0, 1])

        # Priority Rule:
        # If either model indicates positive CKD risk, priority review is flagged.
        is_priority = (rf_pred == 1) or (lr_pred == 1) or (rf_prob >= 0.5) or (lr_prob >= 0.5)

        # Non-diagnostic human-friendly clinical risk assessment
        if is_priority:
            assessment_label = "Increased Risk"
            summary_message = "Assessment indicates increased risk and requires health worker review."
            priority_level = "High" if (rf_prob >= 0.7 or lr_prob >= 0.7) else "Moderate"
        else:
            assessment_label = "Low Risk"
            summary_message = "Assessment indicates stable readings within monitored community ranges."
            priority_level = "Low"

        return {
            "logistic_regression": {
                "prediction": lr_pred,
                "risk_label": "Increased Risk" if lr_pred == 1 else "Low Risk",
                "probability": round(lr_prob, 4)
            },
            "random_forest": {
                "prediction": rf_pred,
                "risk_label": "Increased Risk" if rf_pred == 1 else "Low Risk",
                "probability": round(rf_prob, 4)
            },
            "consensus_prediction": rf_pred,  # RF primary ensemble
            "assessment_result": assessment_label,
            "risk_probability": round(rf_prob, 4),
            "priority_review": is_priority,
            "priority_level": priority_level,
            "assessment_summary": summary_message
        }
