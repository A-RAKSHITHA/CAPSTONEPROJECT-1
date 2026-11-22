import os
import sys
import unittest

sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "src"))
from predict import CKDPredictor
from app import app


class TestMLService(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        models_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")
        cls.predictor = CKDPredictor(models_dir)
        cls.client = app.test_client()

    def test_health_endpoint(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data.get("status"), "UP")
        self.assertIn("Random Forest", data.get("models", []))
        self.assertIn("Logistic Regression", data.get("models", []))

    def test_prediction_pipeline(self):
        sample_member = {
            "age": 48.0,
            "blood_pressure": 80.0,
            "specific_gravity": 1.020,
            "albumin": 1.0,
            "sugar": 0.0,
            "red_blood_cells": "normal",
            "pus_cell": "normal",
            "pus_cell_clumps": "notpresent",
            "bacteria": "notpresent",
            "blood_glucose_random": 121.0,
            "blood_urea": 36.0,
            "serum_creatinine": 1.2,
            "sodium": 137.5,
            "potassium": 4.6,
            "hemoglobin": 15.4,
            "packed_cell_volume": 44.0,
            "white_blood_cell_count": 7800.0,
            "red_blood_cell_count": 5.2,
            "hypertension": "yes",
            "diabetes_mellitus": "yes",
            "coronary_artery_disease": "no",
            "appetite": "good",
            "pedal_edema": "no",
            "anemia": "no"
        }
        result = self.predictor.predict(sample_member)
        self.assertIn("random_forest", result)
        self.assertIn("logistic_regression", result)
        self.assertIn("assessment_result", result)
        self.assertIn("priority_review", result)
        self.assertTrue(result["priority_review"])


if __name__ == "__main__":
    unittest.main()
