import os
import sys
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "src"))
from predict import CKDPredictor
from train import train_models

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
DATA_DIR = os.path.join(BASE_DIR, "data")
DATA_PATH = os.path.join(DATA_DIR, "kidney_disease.csv")
METRICS_PATH = os.path.join(MODELS_DIR, "model_metrics.json")

# Ensure models exist on startup
if not os.path.exists(os.path.join(MODELS_DIR, "random_forest.joblib")):
    print("Pre-trained model artifacts not found. Training models now...")
    train_models(DATA_PATH, MODELS_DIR)

predictor = CKDPredictor(MODELS_DIR)


@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "UP",
        "service": "ArogyaTrack Machine Learning Service",
        "models": ["Logistic Regression", "Random Forest"],
        "dataset": "Kaggle Chronic Kidney Disease (400 records)"
    }), 200


@app.route("/metrics", methods=["GET"])
def get_metrics():
    if os.path.exists(METRICS_PATH):
        with open(METRICS_PATH, "r") as f:
            data = json.load(f)
        return jsonify(data), 200
    else:
        return jsonify({"error": "Metrics not found. Please train models."}), 404


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({"error": "No input JSON data provided"}), 400

        result = predictor.predict(data)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({
            "error": "Failed to process health assessment",
            "details": str(e)
        }), 500


@app.route("/train", methods=["POST"])
def retrain():
    try:
        metrics = train_models(DATA_PATH, MODELS_DIR)
        global predictor
        predictor = CKDPredictor(MODELS_DIR)
        return jsonify({
            "message": "Models successfully trained and updated",
            "metrics": metrics
        }), 200
    except Exception as e:
        return jsonify({
            "error": "Model training failed",
            "details": str(e)
        }), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", os.environ.get("ML_PORT", 5000)))
    app.run(host="0.0.0.0", port=port, debug=False)
