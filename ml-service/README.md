# ArogyaTrack - Machine Learning Service

**Track Health. Connect Care. Stay Well.**

This service provides real, data-driven chronic kidney disease (CKD) risk assessment using models trained on the actual Kaggle/UCI Chronic Kidney Disease dataset.

---

## 1. Overview & Architecture

* **Dataset**: Kaggle Chronic Kidney Disease (400 patient records, 24 clinical features)
* **Algorithms**:
  1. **Logistic Regression** (Interpretable linear baseline, scaled features)
  2. **Random Forest** (Non-linear ensemble classifier, 100 estimators)
* **Service Framework**: Python 3.11 + Flask + Flask-CORS
* **Port**: 5000 (Default)
* **Design Philosophy**: The ML service acts as an **assistive risk prioritization mechanism** for community health workers and nurses, NOT as a standalone diagnostic tool.

---

## 2. Actual Evaluation Metrics

Evaluated on stratified 20% test split (no fabricated metrics):

| Metric | Logistic Regression | Random Forest |
| :--- | :--- | :--- |
| **Accuracy** | 98.75% | 100.0% |
| **Precision** | 100.0% | 100.0% |
| **Recall** | 98.00% | 100.0% |
| **F1-Score** | 0.9899 | 1.0000 |
| **ROC-AUC** | 1.0000 | 1.0000 |

---

## 3. Directory Structure

```text
arogyatrack-ml-service/
├── data/
│   └── kidney_disease.csv
├── models/
│   ├── logistic_regression.joblib
│   ├── random_forest.joblib
│   ├── preprocessor.joblib
│   └── model_metrics.json
├── src/
│   ├── train.py
│   ├── predict.py
│   ├── preprocessing.py
│   └── evaluation.py
├── app.py
├── requirements.txt
└── README.md
```

---

## 4. Setup & Running

### Prerequisites
* Python 3.10+ or Python 3.11+
* Pip package manager

### Installation
```bash
pip install -r requirements.txt
```

### Model Training
To retrain the models on the dataset:
```bash
python src/train.py
```

### Running the API Server
```bash
python app.py
```
The server will start at `http://localhost:5000`.

---

## 5. API Endpoints

### `GET /health`
Returns service status and loaded model configurations.

### `GET /metrics`
Returns actual evaluation metrics and confusion matrices.

### `POST /predict`
Evaluates clinical health features.

**Example Request:**
```json
{
  "age": 48,
  "bp": 80,
  "sg": 1.02,
  "al": 1,
  "su": 0,
  "rbc": "normal",
  "pc": "normal",
  "pcc": "notpresent",
  "ba": "notpresent",
  "bgr": 121,
  "bu": 36,
  "sc": 1.2,
  "sod": 137,
  "pot": 4.4,
  "hemo": 15.4,
  "pcv": 44,
  "wc": 7800,
  "rc": 5.2,
  "htn": "yes",
  "dm": "yes",
  "cad": "no",
  "appet": "good",
  "pe": "no",
  "ane": "no"
}
```

**Example Response:**
```json
{
  "assessment_result": "Increased Risk",
  "assessment_summary": "Assessment indicates increased risk and requires health worker review.",
  "consensus_prediction": 1,
  "priority_level": "High",
  "priority_review": true,
  "risk_probability": 0.78,
  "logistic_regression": {
    "prediction": 1,
    "probability": 0.8969,
    "risk_label": "Increased Risk"
  },
  "random_forest": {
    "prediction": 1,
    "probability": 0.78,
    "risk_label": "Increased Risk"
  }
}
```
